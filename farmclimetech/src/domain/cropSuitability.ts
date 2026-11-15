import { SUITABILITY_THRESHOLDS } from '../config/crops'
import type { MonthlyClimatology } from '../types/climate'
import type {
  CropProfile,
  CropSuitability,
  FactorResult,
  SuitabilityLevel,
  ToleranceRange,
  ValueRange,
} from '../types/crops'
import { mean, sum } from './statistics'

const MONTHS_IN_YEAR = 12
const TIE_MARGIN = 0.02

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

const rangeScore = (value: number, [absoluteMin, optimalMin, optimalMax, absoluteMax]: ValueRange): number => {
  if (!Number.isFinite(value)) return 0
  if (value <= absoluteMin || value >= absoluteMax) return 0
  if (value < optimalMin) return (value - absoluteMin) / (optimalMin - absoluteMin)
  if (value > optimalMax) return (absoluteMax - value) / (absoluteMax - optimalMax)
  return 1
}

const toleranceScore = (value: number, [comfortable, limit]: ToleranceRange): number => {
  if (!Number.isFinite(value)) return 0
  if (value <= comfortable) return 1
  if (value >= limit) return 0
  return clamp01((limit - value) / (limit - comfortable))
}

const classify = (score: number): SuitabilityLevel => {
  if (score >= SUITABILITY_THRESHOLDS.high) return 'high'
  if (score >= SUITABILITY_THRESHOLDS.moderate) return 'moderate'
  if (score >= SUITABILITY_THRESHOLDS.marginal) return 'marginal'
  return 'unsuitable'
}

const windowMonths = (startIndex: number, length: number): number[] =>
  Array.from({ length }, (_, offset) => (startIndex + offset) % MONTHS_IN_YEAR)

const buildFactors = (crop: CropProfile, rows: MonthlyClimatology[]): FactorResult[] => {
  const temperature = mean(rows.map((row) => (row.tmax + row.tmin) / 2))
  const rainfall = sum(rows.map((row) => row.rain))
  const frost = sum(rows.map((row) => row.frostDays))
  const heat = sum(rows.map((row) => row.heatDays))

  return [
    {
      key: 'temperature',
      label: 'Temperature',
      unit: '°C',
      observed: temperature,
      score: rangeScore(temperature, crop.temperature),
      requirement: `Optimal ${crop.temperature[1]}–${crop.temperature[2]} °C`,
    },
    {
      key: 'rainfall',
      label: 'Rainfall',
      unit: 'mm',
      observed: rainfall,
      score: rangeScore(rainfall, crop.rainfall),
      requirement: `Optimal ${crop.rainfall[1]}–${crop.rainfall[2]} mm without irrigation`,
    },
    {
      key: 'frost',
      label: 'Frost days',
      unit: 'days',
      observed: frost,
      score: toleranceScore(frost, crop.frostDays),
      requirement: `Comfortable up to ${crop.frostDays[0]} days, not viable above ${crop.frostDays[1]}`,
    },
    {
      key: 'heat',
      label: 'Heat-stress days',
      unit: 'days',
      observed: heat,
      score: toleranceScore(heat, crop.heatDays),
      requirement: `Comfortable up to ${crop.heatDays[0]} days, not viable above ${crop.heatDays[1]}`,
    },
  ]
}

const evaluateWindow = (
  crop: CropProfile,
  climatology: MonthlyClimatology[],
  startIndex: number,
): CropSuitability => {
  const months = windowMonths(startIndex, crop.cycleMonths)
  const factors = buildFactors(
    crop,
    months.map((index) => climatology[index]),
  )
  const limiting = factors.reduce((lowest, factor) => (factor.score < lowest.score ? factor : lowest))
  return {
    crop,
    score: limiting.score,
    level: classify(limiting.score),
    startMonth: crop.type === 'annual' ? startIndex + 1 : null,
    months: months.map((index) => index + 1),
    factors,
    limiting,
  }
}

const circularDistance = (a: number, b: number): number => {
  const gap = Math.abs(a - b) % MONTHS_IN_YEAR
  return Math.min(gap, MONTHS_IN_YEAR - gap)
}

const referenceMonthIndex = (crop: CropProfile, climatology: MonthlyClimatology[]): number => {
  const temperatures = climatology.map((row) => (row.tmax + row.tmin) / 2)
  const target = crop.season === 'cool' ? Math.min(...temperatures) : Math.max(...temperatures)
  return Math.max(0, temperatures.indexOf(target))
}

export const evaluateCrop = (crop: CropProfile, climatology: MonthlyClimatology[]): CropSuitability => {
  if (crop.type === 'perennial') return evaluateWindow(crop, climatology, 0)

  const reference = referenceMonthIndex(crop, climatology)
  const candidates = Array.from({ length: MONTHS_IN_YEAR }, (_, startIndex) => ({
    result: evaluateWindow(crop, climatology, startIndex),
    distance: circularDistance(startIndex + (crop.cycleMonths - 1) / 2, reference),
  }))
  const bestScore = Math.max(...candidates.map((candidate) => candidate.result.score))
  return candidates
    .filter((candidate) => candidate.result.score >= bestScore - TIE_MARGIN)
    .reduce((best, candidate) => (candidate.distance < best.distance ? candidate : best)).result
}

export const rankCrops = (crops: CropProfile[], climatology: MonthlyClimatology[]): CropSuitability[] =>
  crops.map((crop) => evaluateCrop(crop, climatology)).sort((a, b) => b.score - a.score)