import { EXTREME_RAIN_MM, FROST_THRESHOLD_C, HEAT_THRESHOLD_C } from '../config/climate'
import type { MonthlyClimatology, RiskLevel, RiskRow } from '../types/climate'

interface RiskDefinition {
  key: string
  label: string
  description: string
  unit: string
  decimals: number
  direction: 'higher' | 'lower'
  moderate: number
  high: number
  requiresSoil: boolean
  pick: (month: MonthlyClimatology) => number
}

const RISK_DEFINITIONS: RiskDefinition[] = [
  {
    key: 'frost',
    label: 'Frost',
    description: `Average days per month with minimum temperature below ${FROST_THRESHOLD_C} °C`,
    unit: 'days',
    decimals: 1,
    direction: 'higher',
    moderate: 1,
    high: 4,
    requiresSoil: false,
    pick: (month) => month.frostDays,
  },
  {
    key: 'heat',
    label: 'Heat stress',
    description: `Average days per month with maximum temperature above ${HEAT_THRESHOLD_C} °C`,
    unit: 'days',
    decimals: 1,
    direction: 'higher',
    moderate: 2,
    high: 8,
    requiresSoil: false,
    pick: (month) => month.heatDays,
  },
  {
    key: 'deficit',
    label: 'Water deficit',
    description: 'Average monthly shortfall when reference evapotranspiration exceeds rainfall',
    unit: 'mm',
    decimals: 0,
    direction: 'higher',
    moderate: 25,
    high: 75,
    requiresSoil: false,
    pick: (month) => Math.max(0, -month.waterBalance),
  },
  {
    key: 'extremeRain',
    label: 'Extreme rain',
    description: `Average days per month with more than ${EXTREME_RAIN_MM} mm of rain (erosion risk)`,
    unit: 'days',
    decimals: 2,
    direction: 'higher',
    moderate: 0.1,
    high: 0.4,
    requiresSoil: false,
    pick: (month) => month.extremeRainDays,
  },
  {
    key: 'drySoil',
    label: 'Dry root zone',
    description: 'Average root-zone soil wetness (0 = dry, 1 = saturated); lower means higher risk',
    unit: 'index',
    decimals: 2,
    direction: 'lower',
    moderate: 0.55,
    high: 0.4,
    requiresSoil: true,
    pick: (month) => month.soil,
  },
]

const classify = (value: number, definition: RiskDefinition): RiskLevel => {
  if (!Number.isFinite(value)) return 'none'
  if (definition.direction === 'higher') {
    if (value >= definition.high) return 'high'
    if (value >= definition.moderate) return 'moderate'
    return value > 0 ? 'low' : 'none'
  }
  if (value <= definition.high) return 'high'
  if (value <= definition.moderate) return 'moderate'
  return 'low'
}

export const buildRiskRows = (climatology: MonthlyClimatology[], hasSoil: boolean): RiskRow[] =>
  RISK_DEFINITIONS.filter((definition) => hasSoil || !definition.requiresSoil).map((definition) => {
    const values = climatology.map(definition.pick)
    return {
      key: definition.key,
      label: definition.label,
      description: definition.description,
      unit: definition.unit,
      decimals: definition.decimals,
      values,
      levels: values.map((value) => classify(value, definition)),
    }
  })