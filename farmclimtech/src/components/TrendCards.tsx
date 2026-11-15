import { ANNUAL_METRICS, METRICS } from '../config/climate'
import type { ClimateSummary, TrendResult } from '../types/climate'

interface TrendCardsProps {
  summary: ClimateSummary
}

const ARROWS = { up: '↑', down: '↓', none: '→' } as const

const formatSigned = (value: number, decimals: number): string =>
  `${value > 0 ? '+' : ''}${value.toFixed(decimals)}`

const formatP = (value: number): string => (value < 0.001 ? 'p < 0.001' : `p = ${value.toFixed(3)}`)

const describe = (trend: TrendResult): string =>
  trend.significant
    ? `Statistically significant (${formatP(trend.pValue)})`
    : `No clear trend (${formatP(trend.pValue)})`

export const TrendCards = ({ summary }: TrendCardsProps) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {ANNUAL_METRICS.map((metric) => {
      const trend = summary.trends[metric]
      if (!trend) return null
      const meta = METRICS[metric]
      const tone = trend.significant ? 'bg-indigo-50 ring-indigo-200' : 'bg-slate-50 ring-slate-200'
      return (
        <div key={metric} className={`rounded-lg p-3 ring-1 ${tone}`}>
          <p className="text-xs text-slate-500">{meta.label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            <span className="mr-1">{ARROWS[trend.direction]}</span>
            {formatSigned(trend.slopePerDecade, Math.max(meta.decimals, 1))}
            <span className="ml-1 text-xs font-normal text-slate-500">{meta.unit} / decade</span>
          </p>
          <p className="mt-1 text-xs text-slate-600">{describe(trend)}</p>
        </div>
      )
    })}
  </div>
)