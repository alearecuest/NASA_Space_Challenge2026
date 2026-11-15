// Farm ClimeTech server: serves the built app and a small /api proxy.
// API keys live ONLY here, read from environment variables (never VITE_*),
// so they never reach the browser bundle.
//
// Env vars (set them in the Render dashboard, not in the repo):
//   GEMINI_API_KEY         Google Gemini API key (optional: without it the API answers in demo mode)
//   AI_MODEL               Gemini model id (default: gemini-flash-latest)
//   METEOMATICS_USERNAME   Meteomatics user (optional)
//   METEOMATICS_PASSWORD   Meteomatics password (optional)
//   PORT                   Set by Render

import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../dist/', import.meta.url))
const PORT = Number(process.env.PORT) || 8787
const AI_MODEL = process.env.AI_MODEL || 'gemini-flash-latest'
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
const METEO_USER = process.env.METEOMATICS_USERNAME || ''
const METEO_PASS = process.env.METEOMATICS_PASSWORD || ''

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

// Security headers (OWASP): only the hosts the app really uses are allowed.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://gibs.earthdata.nasa.gov https://map1.vis.earthdata.nasa.gov https://*.tile.openstreetmap.org https://unpkg.com",
  "connect-src 'self' https://power.larc.nasa.gov https://rest.isric.org https://geocoding-api.open-meteo.com https://nominatim.openstreetmap.org https://api.opencagedata.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// ---------- tiny in-memory rate limit (per IP): OWASP LLM10 unbounded consumption ----------
const hits = new Map()
const LIMIT = 20 // requests per minute per IP
const rateLimited = (ip) => {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > LIMIT
}

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers })
  res.end(body)
}
const json = (res, status, obj) =>
  send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > 10_000) {
        reject(new Error('too large'))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

// ---------- input validation: only numbers reach the model (OWASP LLM01 / LLM02) ----------
const num = (v, min, max) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null
}
const cleanField = (f = {}) => ({
  lat: num(f.latitude, -90, 90),
  lon: num(f.longitude, -180, 180),
  soilMoisture: num(f.soilMoisture, 0, 100),
  rainfall: num(f.rainfall, 0, 2000),
  rainfallAvg: num(f.rainfallAvg, 0, 2000),
  tempAvg: num(f.tempAvg, -20, 50),
  ndvi: num(f.ndvi, -1, 1),
})

// ---------- output validation: plain short strings only (OWASP LLM05) ----------
const cleanText = (s, max = 300) =>
  String(s ?? '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001f]/g, ' ')
    .trim()
    .slice(0, max)
const cleanList = (a, n = 4) => (Array.isArray(a) ? a.slice(0, n).map((x) => cleanText(x)).filter(Boolean) : [])

const DEMO = {
  demo: true,
  summary:
    'Demo analysis: soil is drier than usual for this month and rainfall is below the historical average. Watch for a dry spell before sowing.',
  risks: ['Below-average rainfall in the last 30 days', 'Soil moisture under the usual level for this month'],
  recommendations: ['Check soil moisture in the field before sowing', 'Prefer rotations that keep the soil covered in summer'],
  alerts: ['Dry spell likely in the next days: check soil moisture in the driest plot'],
  bestRotation: 'R1 Cover crop',
  confidence: 0,
}

const buildPrompt = (f) => `You are an agronomy assistant for farmers in Uruguay. Use ONLY the numbers below.
Do not invent numbers. If a value is null, say it is not available. Answer in plain English, short sentences.

Field indicators (from NASA POWER and satellite data):
- Location: lat ${f.lat}, lon ${f.lon}
- Soil moisture: ${f.soilMoisture}%
- Rainfall last month: ${f.rainfall} mm (historical average for this month: ${f.rainfallAvg} mm)
- Mean temperature last month: ${f.tempAvg} °C
- NDVI: ${f.ndvi}

Return JSON with exactly these keys:
{"summary": string, "risks": string[], "recommendations": string[], "alerts": string[], "bestRotation": "R0 Current" | "R1 Cover crop" | "R2 Soy-maize-wheat" | "R3 Crop + pasture", "confidence": number 0-100}`

async function analyze(field) {
  if (!GEMINI_KEY) return DEMO
  const f = cleanField(field)
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(AI_MODEL)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: buildPrompt(f) }] }],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 700, temperature: 0.3 },
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!r.ok) throw new Error(`AI provider ${r.status}`)
  const data = await r.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  const out = JSON.parse(text)
  return {
    demo: false,
    model: AI_MODEL,
    summary: cleanText(out.summary, 500),
    risks: cleanList(out.risks),
    recommendations: cleanList(out.recommendations),
    alerts: cleanList(out.alerts, 3),
    bestRotation: cleanText(out.bestRotation, 40),
    confidence: num(out.confidence, 0, 100) ?? 0,
  }
}

async function forecast(lat, lon) {
  if (!METEO_USER || !METEO_PASS) return { demo: true, days: [] }
  const start = new Date().toISOString().split('.')[0] + 'Z'
  const end = new Date(Date.now() + 10 * 864e5).toISOString().split('.')[0] + 'Z'
  const url = `https://api.meteomatics.com/${start}--${end}:PT24H/t_2m:C,precip_24h:mm/${lat},${lon}/json`
  const r = await fetch(url, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${METEO_USER}:${METEO_PASS}`).toString('base64') },
    signal: AbortSignal.timeout(15_000),
  })
  if (!r.ok) throw new Error(`Forecast provider ${r.status}`)
  const data = await r.json()
  const series = (name) => data?.data?.find((d) => d.parameter === name)?.coordinates?.[0]?.dates || []
  const t = series('t_2m:C')
  const p = series('precip_24h:mm')
  return {
    demo: false,
    days: t.map((d, i) => ({ date: d.date, temp: num(d.value, -50, 60), rain: num(p[i]?.value, 0, 1000) })),
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, 'http://x')
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, path)
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden')
  try {
    const s = await stat(file)
    if (s.isDirectory()) file = join(file, 'index.html')
  } catch {
    file = join(ROOT, 'index.html') // SPA fallback
  }
  try {
    const body = await readFile(file)
    const ext = extname(file)
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    send(res, 200, body, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache })
  } catch {
    send(res, 404, 'Not found')
  }
}

http
  .createServer(async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim()
    try {
      if (req.url.startsWith('/api/')) {
        if (rateLimited(ip)) return json(res, 429, { error: 'Too many requests, try again in a minute.' })
        if (req.method === 'POST' && req.url === '/api/analyze') {
          const body = JSON.parse((await readBody(req)) || '{}')
          return json(res, 200, await analyze(body.field))
        }
        if (req.method === 'GET' && req.url.startsWith('/api/forecast')) {
          const q = new URL(req.url, 'http://x').searchParams
          const lat = num(q.get('lat'), -90, 90)
          const lon = num(q.get('lon'), -180, 180)
          if (lat === null || lon === null) return json(res, 400, { error: 'lat and lon are required' })
          return json(res, 200, await forecast(lat.toFixed(3), lon.toFixed(3)))
        }
        if (req.url === '/api/health') return json(res, 200, { ok: true, ai: GEMINI_KEY ? 'live' : 'demo', model: AI_MODEL })
        return json(res, 404, { error: 'Not found' })
      }
      return serveStatic(req, res)
    } catch (err) {
      console.error(err)
      // Never leak provider errors or keys to the client
      return json(res, 502, { error: 'Service temporarily unavailable', demo: true })
    }
  })
  .listen(PORT, () => console.log(`Farm ClimeTech running on :${PORT} (AI ${GEMINI_KEY ? 'live' : 'demo'}, model ${AI_MODEL})`))
