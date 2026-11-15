import {
  ANNUAL_METRICS,
  EXTREME_RAIN_MM,
  FROST_THRESHOLD_C,
  HEAT_THRESHOLD_C,
  MIN_TREND_YEARS,
  MIN_VALID_MONTH_SHARE,
  SIGNIFICANCE_LEVEL,
} from '../config/climate'
import type {
  AnnualMetric,
  AnnualRecord,
  ClimateSummary,
  DailySeries,
  MonthlyClimatology,
  MonthlyRecord,
  TrendResult,
} from '../types/climate'
import { extraterrestrialRadiation, hargreavesEt0 } from './evapotranspiration'
import { buildRiskRows } from './riskCalendar'
import { mean, sum } from './statistics'
import { analyzeTrend } from './trend'

const DAY_MS = 86_400_000

interface MonthAccumulator {
  year: number
  month: number
  validDays: number
  tmax: number
  tmin: number
  rain: number
  et0: number
  frostDays: number
  heatDays: number
  extremeRainDays: number
  soilSum: number
  soilCount: number
}

const dayOfYear = (year: number, month: number, day: number): number =>
  Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / DAY_MS)

const daysInMonth = (year: number, month: number): number => new Date(Date.UTC(year, month, 0)).getUTCDate()

export const buildMonthlyRecords = (series: DailySeries, latitude: number): MonthlyRecord[] => {
  const accumulators = new Map<number, MonthAccumulator>()

  series.dates.forEach((date, index) => {
    const tmax = series.tmax[index]
    const tmin = series.tmin[index]
    const rain = series.rain[index]
    if (!Number.isFinite(tmax) || !Number.isFinite(tmin) || !Number.isFinite(rain)) return

    const year = Number(date.slice(0, 4))
    const month = Number(date.slice(4, 6))
    const day = Number(date.slice(6, 8))
    const key = year * 12 + month

    let entry = accumulators.get(key)
    if (!entry) {
      entry = {
        year,
        month,
        validDays: 0,
        tmax: 0,
        tmin: 0,
        rain: 0,
        et0: 0,
        frostDays: 0,
        heatDays: 0,
        extremeRainDays: 0,
        soilSum: 0,
        soilCount: 0,
      }
      accumulators.set(key, entry)
    }

    const radiation = extraterrestrialRadiation(latitude, dayOfYear(year, month, day))
    entry.validDays += 1
    entry.tmax += tmax
    entry.tmin += tmin
    entry.rain += rain
    entry.et0 += hargreavesEt0(tmax, tmin, radiation)
    if (tmin < FROST_THRESHOLD_C) entry.frostDays += 1
    if (tmax > HEAT_THRESHOLD_C) entry.heatDays += 1
    if (rain > EXTREME_RAIN_MM) entry.extremeRainDays += 1

    const soil = series.soil[index]
    if (Number.isFinite(soil)) {
      entry.soilSum += soil
      entry.soilCount += 1
    }
  })

  return [...accumulators.values()]
    .filter((entry) => entry.validDays / daysInMonth(entry.year, entry.month) >= MIN_VALID_MONTH_SHARE)
    .map((entry) => {
      const scale = daysInMonth(entry.year, entry.month) / entry.validDays
      return {
        year: entry.year,
        month: entry.month,
        tmax: entry.tmax / entry.validDays,
        tmin: entry.tmin / entry.validDays,
        rain: entry.rain * scale,
        et0: entry.et0 * scale,
        frostDays: entry.frostDays * scale,
        heatDays: entry.heatDays * scale,
        extremeRainDays: entry.extremeRainDays * scale,
        soil: entry.soilCount > 0 ? entry.soilSum / entry.soilCount : Number.NaN,
      }
    })
    .sort((a, b) => a.year - b.year || a.month - b.month)
}

export const buildAnnualRecords = (monthly: MonthlyRecord[]): AnnualRecord[] => {
  const byYear = new Map<number, MonthlyRecord[]>()
  monthly.forEach((record) => byYear.set(record.year, [...(byYear.get(record.year) ?? []), record]))

  return [...byYear.entries()]
    .filter(([, months]) => months.length === 12)
    .sort(([a], [b]) => a - b)
    .map(([year, months]) => {
      const rain = sum(months.map((month) => month.rain))
      const et0 = sum(months.map((month) => month.et0))
      return {
        year,
        meanTemp: mean(months.map((month) => (month.tmax + month.tmin) / 2)),
        rain,
        et0,
        waterBalance: rain - et0,
        frostDays: sum(months.map((month) => month.frostDays)),
        heatDays: sum(months.map((month) => month.heatDays)),
        extremeRainDays: sum(months.map((month) => month.extremeRainDays)),
        soil: mean(months.map((month) => month.soil)),
      }
    })
}

export const buildClimatology = (monthly: MonthlyRecord[], annual: AnnualRecord[]): MonthlyClimatology[] => {
  const years = new Set(annual.map((record) => record.year))
  const usable = monthly.filter((record) => years.has(record.year))

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    const rows = usable.filter((record) => record.month === month)
    const rain = mean(rows.map((row) => row.rain))
    const et0 = mean(rows.map((row) => row.et0))
    return {
      month,
      tmax: mean(rows.map((row) => row.tmax)),
      tmin: mean(rows.map((row) => row.tmin)),
      rain,
      et0,
      waterBalance: rain - et0,
      frostDays: mean(rows.map((row) => row.frostDays)),
      heatDays: mean(rows.map((row) => row.heatDays)),
      extremeRainDays: mean(rows.map((row) => row.extremeRainDays)),
      soil: mean(rows.map((row) => row.soil)),
    }
  })
}

const toTrend = (years: number[], values: number[]): TrendResult | null => {
  if (values.filter(Number.isFinite).length < MIN_TREND_YEARS) return null
  const fit = analyzeTrend(years, values)
  if (!fit) return null
  const significant = fit.pValue < SIGNIFICANCE_LEVEL && fit.slope !== 0
  return {
    slopePerDecade: fit.slope * 10,
    intercept: fit.intercept,
    pValue: fit.pValue,
    direction: !significant ? 'none' : fit.slope > 0 ? 'up' : 'down',
    significant,
    samples: fit.samples,
  }
}

export const computeTrends = (annual: AnnualRecord[]): Record<AnnualMetric, TrendResult | null> => {
  const years = annual.map((record) => record.year)
  return Object.fromEntries(
    ANNUAL_METRICS.map((metric) => [metric, toTrend(years, annual.map((record) => record[metric]))]),
  ) as Record<AnnualMetric, TrendResult | null>
}

const computeCoverage = (series: DailySeries): number => {
  if (series.dates.length === 0) return 0
  const valid = series.dates.filter(
    (_, index) =>
      Number.isFinite(series.tmax[index]) &&
      Number.isFinite(series.tmin[index]) &&
      Number.isFinite(series.rain[index]),
  ).length
  return valid / series.dates.length
}

export const averageOf = (annual: AnnualRecord[], metric: AnnualMetric): number =>
  mean(annual.map((record) => record[metric]))

export const computeClimateSummary = (series: DailySeries, latitude: number): ClimateSummary => {
  const monthly = buildMonthlyRecords(series, latitude)
  const annual = buildAnnualRecords(monthly)
  const climatology = buildClimatology(monthly, annual)
  const hasSoil = annual.some((record) => Number.isFinite(record.soil))

  return {
    firstYear: annual.length > 0 ? annual[0].year : Number.NaN,
    lastYear: annual.length > 0 ? annual[annual.length - 1].year : Number.NaN,
    coverage: computeCoverage(series),
    hasSoil,
    monthly,
    annual,
    climatology,
    trends: computeTrends(annual),
    risk: buildRiskRows(climatology, hasSoil),
  }
}