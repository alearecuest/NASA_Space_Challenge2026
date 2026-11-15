import type { AnnualMetric, MetricMeta } from '../types/climate'

export const CLIMATE_START_YEAR = 1991
export const POWER_CHUNK_YEARS = 10
export const CELL_SIZE_DEGREES = 0.5
export const MAX_CACHED_CELLS = 12

export const FROST_THRESHOLD_C = 2
export const HEAT_THRESHOLD_C = 32
export const EXTREME_RAIN_MM = 50

export const MIN_VALID_MONTH_SHARE = 0.9
export const MIN_TREND_YEARS = 8
export const SIGNIFICANCE_LEVEL = 0.05

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const getClimateEndYear = (): number => new Date().getUTCFullYear() - 1

export const ANNUAL_METRICS: AnnualMetric[] = [
  'meanTemp',
  'rain',
  'et0',
  'waterBalance',
  'frostDays',
  'heatDays',
  'extremeRainDays',
  'soil',
]

export const METRICS: Record<AnnualMetric, MetricMeta> = {
  meanTemp: { label: 'Average temperature', unit: '°C', decimals: 1 },
  rain: { label: 'Annual rainfall', unit: 'mm', decimals: 0 },
  et0: { label: 'Reference evapotranspiration', unit: 'mm', decimals: 0 },
  waterBalance: { label: 'Water balance (rain − ET)', unit: 'mm', decimals: 0 },
  frostDays: { label: 'Frost days per year', unit: 'days', decimals: 0 },
  heatDays: { label: 'Heat-stress days per year', unit: 'days', decimals: 0 },
  extremeRainDays: { label: 'Extreme rain days per year', unit: 'days', decimals: 1 },
  soil: { label: 'Root-zone soil wetness', unit: 'index 0–1', decimals: 2 },
}