import type { ClimateSummary } from '../types/climate'
import type { RotationScore, RotationId, CropName } from '../types/rotation'
import { CROP_PROFILES } from './cropDatabase'
import { PREDEFINED_ROTATIONS } from './rotationDefinitions'

interface ScoringWeights {
  water: number
  soil: number
  income: number
  resilience: number
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  water: 0.25,
  soil: 0.25,
  income: 0.25,
  resilience: 0.25,
}

const BARE_SOIL_MONTHS_THRESHOLD = [9, 10]

const calculateWaterScore = (
  crops: CropName[],
  summary: ClimateSummary,
): { score: number; explanation: string } => {
  const annualWaterBalance = summary.annual[0]?.waterBalance ?? 0
  const extremeRainDays = summary.annual[0]?.extremeRainDays ?? 0

  let rotationWaterDemand = 0
  crops.forEach((crop) => {
    rotationWaterDemand += CROP_PROFILES[crop].waterRequirement / crops.length
  })

  const waterAvailability = annualWaterBalance + 300

  let baseScore = Math.min(100, Math.max(0, (waterAvailability / rotationWaterDemand) * 80))

  if (extremeRainDays > 20) {
    baseScore -= Math.min(20, extremeRainDays - 20)
  }

  const explanation =
    baseScore > 75
      ? 'Excellent water balance for this rotation; low drought risk.'
      : baseScore > 50
        ? 'Adequate water availability; monitor in dry years.'
        : 'Water deficit likely; consider drought-tolerant crops or irrigation.'

  return { score: Math.max(0, Math.min(100, baseScore)), explanation }
}

const calculateSoilScore = (
  crops: CropName[],
  summary: ClimateSummary,
): { score: number; explanation: string; barelySoilMonths: number[] } => {
  const avgCoverageScore = crops.reduce((sum, crop) => sum + CROP_PROFILES[crop].soilCoverageScore, 0) / crops.length

  const averageRain = summary.annual[0]?.rain ?? 0
  const frostDays = summary.annual[0]?.frostDays ?? 0

  let erosionRisk = 0
  if (averageRain > 900) erosionRisk = 20
  else if (averageRain > 700) erosionRisk = 10
  else erosionRisk = 5

  const nitrogenFixers = crops.filter((c) => CROP_PROFILES[c].nitrogenFixing).length
  const nitrogenScore = (nitrogenFixers / crops.length) * 20

  let baseScore = Math.min(100, avgCoverageScore * 60 + nitrogenScore - erosionRisk)

  if (frostDays > 30) {
    const vulnerableCrops = crops.filter((c) => CROP_PROFILES[c].frostTolerance > -5)
    if (vulnerableCrops.length > crops.length / 2) {
      baseScore -= 15
    }
  }

  const barelySoilMonths = BARE_SOIL_MONTHS_THRESHOLD

  const explanation =
    baseScore > 75
      ? 'Excellent soil protection; good organic matter recovery.'
      : baseScore > 50
        ? 'Moderate soil health; manageable erosion risk.'
        : 'High erosion risk; consider cover crops or pasture integration.'

  return {
    score: Math.max(0, Math.min(100, baseScore)),
    explanation,
    barelySoilMonths,
  }
}

const calculateIncomeScore = (
  crops: CropName[],
  _summary: ClimateSummary,
): { score: number; explanation: string } => {
  const avgPrice: Record<CropName, number> = {
    soya: 380,
    maize: 220,
    wheat: 250,
    barley: 200,
    oats: 180,
    vetch: 100,
    clover: 120,
    alfalfa: 150,
    pasture: 200,
    rye: 180,
  }

  let totalIncome = 0
  crops.forEach((crop) => {
    totalIncome += (CROP_PROFILES[crop].estimatedYield * avgPrice[crop]) / crops.length
  })

  let incomeScore = Math.min(100, (totalIncome / 900) * 80)

  const commodityCrops = crops.filter((c) => CROP_PROFILES[c].targetMarket === 'commodity')
  if (commodityCrops.length === 0) {
    incomeScore -= 20
  }

  const explanation =
    incomeScore > 75
      ? 'Strong income potential from commodity crops.'
      : incomeScore > 50
        ? 'Moderate income; diversified markets.'
        : 'Low income potential; consider market demand.'

  return { score: Math.max(0, Math.min(100, incomeScore)), explanation }
}

const calculateResilienceScore = (
  crops: CropName[],
  summary: ClimateSummary,
): { score: number; explanation: string } => {
  const trends = summary.trends

  let trendScore = 50
  if (trends.rain?.slopePerDecade !== undefined) {
    if (trends.rain.slopePerDecade < -20) {
      trendScore -= 15
    } else if (trends.rain.slopePerDecade > 20) {
      trendScore -= 10
    }
  }

  if (trends.meanTemp?.slopePerDecade !== undefined && trends.meanTemp.slopePerDecade > 0.02) {
    trendScore -= 10
  }

  let cropDiversityScore = 0
  if (crops.length === 1) {
    cropDiversityScore = 20
  } else if (crops.length === 2) {
    cropDiversityScore = 50
  } else if (crops.length >= 3) {
    cropDiversityScore = 80
  }

  const nitrogenFixers = crops.filter((c) => CROP_PROFILES[c].nitrogenFixing).length
  const nitrogenScore = (nitrogenFixers / crops.length) * 15

  let resilienceScore = Math.min(100, (trendScore + cropDiversityScore + nitrogenScore) / 3)

  const explanation =
    resilienceScore > 70
      ? 'High resilience to climate variability.'
      : resilienceScore > 50
        ? 'Moderate resilience; monitor climate trends.'
        : 'Low resilience; vulnerable to climate shocks.'

  return { score: Math.max(0, Math.min(100, resilienceScore)), explanation }
}

const calculateMonthlyBareSoil = (crops: CropName[]): number[] => {
  const months = Array(12).fill(0)

  crops.forEach((crop) => {
    const profile = CROP_PROFILES[crop]
    profile.sowingMonths.forEach((m) => {
      months[m - 1] = Math.max(months[m - 1], 0.5)
    })
    profile.harvestMonths.forEach((m) => {
      months[m - 1] = Math.max(months[m - 1], 1.0)
    })
  })

  const cycleMonths = crops.reduce((sum, c) => sum + CROP_PROFILES[c].cycleLength, 0) / crops.length
  const monthsWithoutCrop = 12 - cycleMonths

  const activeMonths = months.filter((m) => m > 0).length
  const bare = Math.max(0, monthsWithoutCrop - activeMonths)

  const result: number[] = []
  let soilBare = bare
  for (let i = 0; i < 12; i++) {
    if (months[i] === 0 && soilBare > 0) {
      result.push(0.2)
      soilBare -= 1
    } else {
      result.push(months[i])
    }
  }

  return result
}

export const scoreRotation = (
  rotationId: RotationId,
  summary: ClimateSummary,
  weights: Partial<ScoringWeights> = {},
): RotationScore => {
  const rotation = PREDEFINED_ROTATIONS[rotationId]
  if (!rotation) {
    throw new Error(`Rotation ${rotationId} not found`)
  }

  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights }
  const crops = rotation.sequence.years.map((y) => y.crop)

  const waterResult = calculateWaterScore(crops, summary)
  const soilResult = calculateSoilScore(crops, summary)
  const incomeResult = calculateIncomeScore(crops, summary)
  const resilienceResult = calculateResilienceScore(crops, summary)

  const overallScore =
    waterResult.score * finalWeights.water +
    soilResult.score * finalWeights.soil +
    incomeResult.score * finalWeights.income +
    resilienceResult.score * finalWeights.resilience

  const monthlyBare = calculateMonthlyBareSoil(crops)
  const barelySoilMonths = monthlyBare.reduce<number[]>((acc, val, idx) => {
    if (val < 0.3) acc.push(idx + 1)
    return acc
  }, [])

  return {
    rotationId,
    overall: Math.round(overallScore * 10) / 10,
    water: Math.round(waterResult.score * 10) / 10,
    soil: Math.round(soilResult.score * 10) / 10,
    income: Math.round(incomeResult.score * 10) / 10,
    resilience: Math.round(resilienceResult.score * 10) / 10,
    explanation: {
      water: waterResult.explanation,
      soil: soilResult.explanation,
      income: incomeResult.explanation,
      resilience: resilienceResult.explanation,
    },
    evidenceLinks: [
      { metric: 'Annual rainfall', value: `${summary.annual[0]?.rain ?? 0} mm`, source: 'NASA POWER' },
      {
        metric: 'Water balance',
        value: `${summary.annual[0]?.waterBalance ?? 0} mm`,
        source: 'NASA POWER',
      },
      { metric: 'Frost days', value: `${summary.annual[0]?.frostDays ?? 0} days/year`, source: 'NASA POWER' },
      { metric: 'Heat stress days', value: `${summary.annual[0]?.heatDays ?? 0} days/year`, source: 'NASA POWER' },
      { metric: 'Extreme rain days', value: `${summary.annual[0]?.extremeRainDays ?? 0} days/year`, source: 'GPM' },
    ],
    risksToVerify: [
      'Verify soil infiltration capacity with local agronomist.',
      'Check market access for selected crops.',
      'Confirm equipment availability for machinery-intensive crops.',
      'Assess water availability for irrigation if needed.',
      'Review frost history for frost-sensitive crops.',
    ],
    missingData: [
      'Local soil type and structure (use SoilGrids approximation).',
      'Current farm machinery and capacity.',
      'Local market prices and contracts.',
      'Water source availability and regulations.',
      'Pest and disease pressure history.',
    ],
    soilCoverage: monthlyBare.map((coverage, idx) => ({
      month: idx + 1,
      coverage: Math.round(coverage * 100),
      risk: coverage > 0.7 ? 'good' : coverage > 0.4 ? 'moderate' : coverage > 0.1 ? 'low' : 'bare',
    })),
    barelySoilMonths,
  }
}

export const scoreAllRotations = (
  summary: ClimateSummary,
  weights: Partial<ScoringWeights> = {},
): RotationScore[] => {
  const rotationIds: RotationId[] = ['R0', 'R1', 'R2', 'R3']
  return rotationIds.map((id) => scoreRotation(id, summary, weights))
}

export const rankRotations = (scores: RotationScore[]): RotationScore[] => {
  return [...scores].sort((a, b) => b.overall - a.overall)
}
