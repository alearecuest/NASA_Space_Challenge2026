export interface DailySeries {
  dates: string[]
  tmax: number[]
  tmin: number[]
  rain: number[]
  soil: number[]
}

export interface ClimateProgress {
  done: number
  total: number
}

export interface MonthlyRecord {
  year: number
  month: number
  tmax: number
  tmin: number
  rain: number
  et0: number
  frostDays: number
  heatDays: number
  extremeRainDays: number
  soil: number
}

export interface AnnualRecord {
  year: number
  meanTemp: number
  rain: number
  et0: number
  waterBalance: number
  frostDays: number
  heatDays: number
  extremeRainDays: number
  soil: number
}

export type AnnualMetric = Exclude<keyof AnnualRecord, 'year'>

export interface MetricMeta {
  label: string
  unit: string
  decimals: number
}

export interface MonthlyClimatology {
  month: number
  tmax: number
  tmin: number
  rain: number
  et0: number
  waterBalance: number
  frostDays: number
  heatDays: number
  extremeRainDays: number
  soil: number
}

export type TrendDirection = 'up' | 'down' | 'none'

export interface TrendResult {
  slopePerDecade: number
  intercept: number
  pValue: number
  direction: TrendDirection
  significant: boolean
  samples: number
}

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high'

export interface RiskRow {
  key: string
  label: string
  description: string
  unit: string
  decimals: number
  values: number[]
  levels: RiskLevel[]
}

export interface ClimateSummary {
  firstYear: number
  lastYear: number
  coverage: number
  hasSoil: boolean
  monthly: MonthlyRecord[]
  annual: AnnualRecord[]
  climatology: MonthlyClimatology[]
  trends: Record<AnnualMetric, TrendResult | null>
  risk: RiskRow[]
}