import type { ClimateSummary } from '../types/climate'
import type { CropName } from '../types/rotation'
import { CROP_PROFILES } from './cropDatabase'

export interface CropSuitability {
  crop: CropName
  label: string
  score: number
  suitable: boolean
  reasons: string[]
  optimalMonths: number[]
  riskFactors: string[]
}

const calculateDegreeDays = (summary: ClimateSummary): number => {
  const baseTemp = 10
  return summary.annual.reduce((sum, record) => {
    const avgTemp = record.meanTemp ?? 0
    return sum + Math.max(0, avgTemp - baseTemp) * 30
  }, 0)
}

const assessCropSuitability = (
  cropId: CropName,
  summary: ClimateSummary,
): CropSuitability => {
  const crop = CROP_PROFILES[cropId]
  const avgAnnualRain = summary.annual[0]?.rain ?? 0
  const avgTemp = summary.annual[0]?.meanTemp ?? 0
  const frostDays = summary.annual[0]?.frostDays ?? 0
  const heatDays = summary.annual[0]?.heatDays ?? 0
  const degreeDays = calculateDegreeDays(summary)

  let score = 100
  const reasons: string[] = []
  const riskFactors: string[] = []

  if (avgAnnualRain < crop.waterRequirement * 0.8) {
    score -= 20
    riskFactors.push('Insufficient rainfall for optimal growth.')
  } else if (avgAnnualRain >= crop.waterRequirement * 0.8 && avgAnnualRain <= crop.waterRequirement * 1.2) {
    reasons.push('Water availability matches crop requirements.')
  } else {
    reasons.push('Excellent water availability for this crop.')
  }

  if (degreeDays < crop.fruitDegreeDaysMin) {
    score -= 25
    riskFactors.push(`Insufficient growing degree-days: ${degreeDays} vs ${crop.fruitDegreeDaysMin} required.`)
  } else if (degreeDays >= crop.fruitDegreeDaysMin && degreeDays <= crop.fruitDegreeDaysMax) {
    reasons.push('Growing degree-days are within optimal range.')
  } else {
    riskFactors.push(`Excess growing degree-days: risk of premature maturity.`)
  }

  if (frostDays > 30 && crop.frostTolerance > -5) {
    score -= 20
    riskFactors.push(`High frost risk (${frostDays} days) for this frost-sensitive crop.`)
  } else if (frostDays < 5) {
    reasons.push('Minimal frost risk.')
  }

  if (heatDays > 60 && crop.heatTolerance < 30) {
    score -= 15
    riskFactors.push(`Frequent heat stress (${heatDays} days > 30°C).`)
  } else if (heatDays < 30) {
    reasons.push('Low heat stress risk.')
  }

  if (crop.nitrogenFixing) {
    reasons.push('Nitrogen-fixing crop: reduces fertilizer needs.')
  }

  score = Math.max(0, Math.min(100, score))

  const optimalMonths = crop.sowingMonths.length > 0 ? crop.sowingMonths : [1, 2, 3]

  return {
    crop: cropId,
    label: crop.label,
    score,
    suitable: score >= 60,
    reasons,
    optimalMonths,
    riskFactors,
  }
}

export const assessAllCrops = (summary: ClimateSummary): CropSuitability[] => {
  const cropIds: CropName[] = [
    'soya',
    'maize',
    'wheat',
    'barley',
    'oats',
    'vetch',
    'clover',
    'alfalfa',
    'pasture',
    'rye',
  ]
  return cropIds.map((cropId) => assessCropSuitability(cropId, summary)).sort((a, b) => b.score - a.score)
}

export const getSuitableCrops = (summary: ClimateSummary, threshold = 60): CropSuitability[] => {
  return assessAllCrops(summary).filter((c) => c.score >= threshold)
}

export const getCropsBySuitability = (summary: ClimateSummary): Record<string, CropSuitability[]> => {
  const all = assessAllCrops(summary)
  return {
    excellent: all.filter((c) => c.score >= 80),
    good: all.filter((c) => c.score >= 60 && c.score < 80),
    moderate: all.filter((c) => c.score >= 40 && c.score < 60),
    poor: all.filter((c) => c.score < 40),
  }
}

export const findCropsByMonth = (
  summary: ClimateSummary,
  month: number,
): CropSuitability[] => {
  const all = assessAllCrops(summary)
  return all.filter((c) => CROP_PROFILES[c.crop].sowingMonths.includes(month)).sort((a, b) => b.score - a.score)
}

export const findZonesForCrop = (
  cropId: CropName,
  minScore = 70,
): { suitable: boolean; reason: string } => {
  const crop = CROP_PROFILES[cropId]

  return {
    suitable: true,
    reason: `${crop.label} thrives in regions with ${crop.waterRequirement}mm annual rainfall and sowing in months: ${crop.sowingMonths.join(', ')}.`,
  }
}
