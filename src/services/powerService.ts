import {
  CELL_SIZE_DEGREES,
  CLIMATE_START_YEAR,
  MAX_CACHED_CELLS,
  POWER_CHUNK_YEARS,
  getClimateEndYear,
} from '../config/climate'
import type { ClimateProgress, DailySeries } from '../types/climate'
import type { GeoPoint } from '../types/location'

const POWER_DAILY_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point'
const MISSING_VALUE = -999
const CORE_PARAMETERS = ['T2M_MAX', 'T2M_MIN', 'PRECTOTCORR']
const SOIL_PARAMETER = 'GWETROOT'

type ParameterTable = Record<string, Record<string, number>>

interface PowerResponse {
  properties?: { parameter?: ParameterTable }
}

interface PowerErrorBody {
  messages?: string[]
  message?: string
}

interface YearRange {
  start: number
  end: number
}

interface LoadOptions {
  signal?: AbortSignal
  onProgress?: (progress: ClimateProgress) => void
}

export class PowerApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PowerApiError'
    this.status = status
  }
}

const cache = new Map<string, DailySeries>()

const cellKey = (cell: GeoPoint): string => `${cell.lat}|${cell.lon}`

export const snapToClimateCell = (point: GeoPoint): GeoPoint => {
  const snap = (value: number): number => Math.round(value / CELL_SIZE_DEGREES) * CELL_SIZE_DEGREES
  const lat = Math.max(-90, Math.min(90, snap(point.lat)))
  const lon = snap(point.lon)
  return { lat, lon: lon >= 180 ? lon - 360 : lon }
}

const buildYearRanges = (startYear: number, endYear: number): YearRange[] => {
  const ranges: YearRange[] = []
  for (let start = startYear; start <= endYear; start += POWER_CHUNK_YEARS) {
    ranges.push({ start, end: Math.min(start + POWER_CHUNK_YEARS - 1, endYear) })
  }
  return ranges
}

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as PowerErrorBody
    return body.messages?.join(' ') ?? body.message ?? `NASA POWER returned status ${response.status}`
  } catch {
    return `NASA POWER returned status ${response.status}`
  }
}

const requestChunk = async (
  cell: GeoPoint,
  range: YearRange,
  parameters: string[],
  signal: AbortSignal,
): Promise<ParameterTable> => {
  const query = new URLSearchParams({
    parameters: parameters.join(','),
    community: 'AG',
    longitude: String(cell.lon),
    latitude: String(cell.lat),
    start: `${range.start}0101`,
    end: `${range.end}1231`,
    format: 'JSON',
  })
  const response = await fetch(`${POWER_DAILY_URL}?${query}`, { signal })
  if (!response.ok) throw new PowerApiError(await readErrorMessage(response), response.status)
  const body = (await response.json()) as PowerResponse
  const table = body.properties?.parameter
  if (!table?.T2M_MAX) throw new PowerApiError('Unexpected response from NASA POWER', 502)
  return table
}

const requestChunkWithSoil = async (
  cell: GeoPoint,
  range: YearRange,
  signal: AbortSignal,
): Promise<ParameterTable> => {
  try {
    return await requestChunk(cell, range, [...CORE_PARAMETERS, SOIL_PARAMETER], signal)
  } catch (error) {
    if (error instanceof PowerApiError && error.status === 422) {
      return requestChunk(cell, range, CORE_PARAMETERS, signal)
    }
    throw error
  }
}

const cleanValue = (value: number | undefined): number =>
  value === undefined || !Number.isFinite(value) || value === MISSING_VALUE ? Number.NaN : value

const toSeries = (table: ParameterTable): DailySeries => {
  const dates = Object.keys(table.T2M_MAX).sort()
  const read = (name: string): number[] => dates.map((date) => cleanValue(table[name]?.[date]))
  return {
    dates,
    tmax: read('T2M_MAX'),
    tmin: read('T2M_MIN'),
    rain: read('PRECTOTCORR'),
    soil: read(SOIL_PARAMETER),
  }
}

const mergeSeries = (chunks: DailySeries[]): DailySeries => ({
  dates: chunks.flatMap((chunk) => chunk.dates),
  tmax: chunks.flatMap((chunk) => chunk.tmax),
  tmin: chunks.flatMap((chunk) => chunk.tmin),
  rain: chunks.flatMap((chunk) => chunk.rain),
  soil: chunks.flatMap((chunk) => chunk.soil),
})

const remember = (key: string, series: DailySeries): void => {
  cache.delete(key)
  cache.set(key, series)
  if (cache.size > MAX_CACHED_CELLS) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
}

export const loadDailySeries = async (cell: GeoPoint, options: LoadOptions = {}): Promise<DailySeries> => {
  const key = cellKey(cell)
  const cached = cache.get(key)
  if (cached) {
    remember(key, cached)
    return cached
  }

  const ranges = buildYearRanges(CLIMATE_START_YEAR, getClimateEndYear())
  const controller = new AbortController()
  const forwardAbort = (): void => controller.abort()
  options.signal?.addEventListener('abort', forwardAbort)
  options.onProgress?.({ done: 0, total: ranges.length })

  let completed = 0
  try {
    const chunks = await Promise.all(
      ranges.map(async (range) => {
        const table = await requestChunkWithSoil(cell, range, controller.signal)
        completed += 1
        options.onProgress?.({ done: completed, total: ranges.length })
        return toSeries(table)
      }),
    )
    const series = mergeSeries(chunks)
    if (!series.tmax.some(Number.isFinite)) {
      throw new PowerApiError('NASA POWER has no data for this location. It may be over the ocean.', 404)
    }
    remember(key, series)
    return series
  } catch (error) {
    controller.abort()
    throw error
  } finally {
    options.signal?.removeEventListener('abort', forwardAbort)
  }
}

export const describeClimateError = (error: unknown): string => {
  if (error instanceof PowerApiError) {
    if (error.status === 429) return 'NASA POWER is limiting requests right now. Wait a minute and try again.'
    return error.message
  }
  return 'Could not reach NASA POWER. Check your connection and try again.'
}