export type CropType = 'annual' | 'perennial'

export type CropSeason = 'cool' | 'warm'

export type ValueRange = [absoluteMin: number, optimalMin: number, optimalMax: number, absoluteMax: number]

export type ToleranceRange = [comfortable: number, limit: number]

export type FactorKey = 'temperature' | 'rainfall' | 'frost' | 'heat'

export type SuitabilityLevel = 'high' | 'moderate' | 'marginal' | 'unsuitable'

export interface CropProfile {
  id: string
  name: string
  group: string
  type: CropType
  season?: CropSeason
  cycleMonths: number
  temperature: ValueRange
  rainfall: ValueRange
  frostDays: ToleranceRange
  heatDays: ToleranceRange
}

export interface FactorResult {
  key: FactorKey
  label: string
  unit: string
  observed: number
  score: number
  requirement: string
}

export interface CropSuitability {
  crop: CropProfile
  score: number
  level: SuitabilityLevel
  startMonth: number | null
  months: number[]
  factors: FactorResult[]
  limiting: FactorResult
}