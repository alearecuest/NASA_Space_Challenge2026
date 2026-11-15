// AI analysis through the Farm ClimeTech server proxy (/api/analyze).
// No API key lives in the browser: the server holds GEMINI_API_KEY and AI_MODEL.
// Without a key the server answers a clearly labelled demo analysis.
import type { FieldData } from '../types/field'
import type { RotationScore } from '../types/rotation'

export interface AnalysisResult {
  demo: boolean
  model?: string
  summary: string
  risks: string[]
  recommendations: string[]
  alerts: string[]
  bestRotation: string
  confidence: number
}

const UNAVAILABLE: AnalysisResult = {
  demo: true,
  summary: 'AI analysis is not available right now. The climate data and scores above still apply.',
  risks: [],
  recommendations: ['Check field conditions with your agronomist'],
  alerts: [],
  bestRotation: '',
  confidence: 0,
}

// One request per field state; the three helpers below share it.
let last: { key: string; result: Promise<AnalysisResult> } | null = null

const request = (fieldData: FieldData): Promise<AnalysisResult> => {
  // Only numbers are sent (no names or free text): OWASP LLM01/LLM02
  const field = {
    latitude: Number(fieldData.latitude.toFixed(2)),
    longitude: Number(fieldData.longitude.toFixed(2)),
    soilMoisture: fieldData.soilMoisture,
    rainfall: fieldData.rainfall,
    rainfallAvg: fieldData.rainfallAvg,
    tempAvg: fieldData.tempAvg,
    ndvi: fieldData.ndvi,
  }
  const key = JSON.stringify(field)
  if (last?.key === key) return last.result
  const result = fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field }),
  })
    .then((r) => (r.ok ? r.json() : UNAVAILABLE))
    .catch(() => UNAVAILABLE)
  last = { key, result }
  return result
}

export const analyzeFieldConditions = (fieldData: FieldData): Promise<AnalysisResult> => request(fieldData)

export const generateAlerts = async (fieldData: FieldData): Promise<string[]> => (await request(fieldData)).alerts

// Rotation scores stay deterministic (computed from NASA data in useRotationScoring);
// the AI only explains them, it does not change the numbers.
export const predictCropSuitability = async (rotations: RotationScore[], _fieldData: FieldData): Promise<RotationScore[]> =>
  rotations
