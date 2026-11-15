import { ANNUAL_METRICS, METRICS } from '../config/climate'
import { averageOf } from '../domain/climateIndicators'
import type { ClimateSummary } from '../types/climate'

interface ClimateOverviewProps {
  summary: ClimateSummary
}

export const ClimateOverview = ({ summary }: ClimateOverviewProps) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {ANNUAL_METRICS.filter((metric) => metric !== 'soil' || summary.hasSoil).map((metric) => {
      const meta = METRICS[metric]
      return (
        <div key={metric} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">{meta.label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {averageOf(summary.annual, metric).toFixed(meta.decimals)}
            <span className="ml-1 text-xs font-normal text-slate-500">{meta.unit}</span>
          </p>
        </div>
      )
    })}
  </div>
)