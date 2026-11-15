export type RotationId = 'R0' | 'R1' | 'R2' | 'R3' | 'custom'

export type CropName =
  | 'soya'
  | 'maize'
  | 'wheat'
  | 'barley'
  | 'oats'
  | 'vetch'
  | 'clover'
  | 'alfalfa'
  | 'pasture'
  | 'rye'

export interface CropStage {
  name: string
  months: number[]
  waterNeed: 'low' | 'medium' | 'high'
  vulnerableToFrost: boolean
  vulnerableToHeat: boolean
}

export interface CropProfile {
  id: CropName
  label: string
  sowingMonths: number[]
  harvestMonths: number[]
  cycleLength: number
  waterRequirement: number
  fruitDegreeDaysMin: number
  fruitDegreeDaysMax: number
  frostTolerance: number
  heatTolerance: number
  soilCoverageScore: number
  nitrogenFixing: boolean
  targetMarket: 'commodity' | 'local' | 'both'
  estimatedYield: number
}

export interface RotationYear {
  year: number
  crop: CropName
}

export interface RotationSequence {
  years: RotationYear[]
  description: string
}

export interface RotationScenario {
  id: RotationId
  label: string
  sequence: RotationSequence
  description: string
  isCustom: boolean
  useCase: string
}

export interface SoilCoverageByMonth {
  month: number
  coverage: number
  risk: 'bare' | 'low' | 'moderate' | 'good'
}

export interface RotationScore {
  rotationId: RotationId
  overall: number
  water: number
  soil: number
  income: number
  resilience: number
  explanation: {
    water: string
    soil: string
    income: string
    resilience: string
  }
  evidenceLinks: {
    metric: string
    value: string
    source: string
  }[]
  risksToVerify: string[]
  missingData: string[]
  soilCoverage: SoilCoverageByMonth[]
  barelySoilMonths: number[]
}

export interface RotationComparison {
  location: string
  latitude: number
  longitude: number
  rotations: RotationScore[]
  rankedByOverall: RotationScore[]
  userPriorities: {
    water: number
    soil: number
    income: number
    resilience: number
  }
}

export interface RotationInput {
  rotationId?: RotationId
  label?: string
  sequence: CropName[]
  userPriorities: {
    water: number
    soil: number
    income: number
    resilience: number
  }
}
