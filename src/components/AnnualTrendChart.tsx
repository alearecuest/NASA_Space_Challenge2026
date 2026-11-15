import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import '../config/chartSetup'
import { ANNUAL_METRICS, METRICS } from '../config/climate'
import type { AnnualMetric, ClimateSummary } from '../types/climate'

interface AnnualTrendChartProps {
  summary: ClimateSummary
}

const options = (yAxisLabel: string): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
  scales: {
    y: {
      title: {
        display: true,
        text: yAxisLabel,
      },
    },
  },
})

export const AnnualTrendChart = ({ summary }: AnnualTrendChartProps) => {
  const available = ANNUAL_METRICS.filter((metric) => summary.trends[metric] !== null)
  const [selected, setSelected] = useState<AnnualMetric>('meanTemp')
  const metric = available.includes(selected) ? selected : available[0]

  if (!metric) return null

  const meta = METRICS[metric]
  const trend = summary.trends[metric]
  const years = summary.annual.map((record) => record.year)

  const data: ChartData<'line', number[], number> = {
    labels: years,
    datasets: [
      {
        label: `${meta.label} (${meta.unit})`,
        data: summary.annual.map((record) => record[metric]),
        borderColor: '#047857',
        backgroundColor: '#047857',
        pointRadius: 3,
        tension: 0.2,
      },
      ...(trend
        ? [
          {
            label: 'Trend (Theil–Sen)',
            data: years.map((year) => trend.intercept + (trend.slopePerDecade / 10) * year),
            borderColor: '#f59e0b',
            borderDash: [6, 4],
            pointRadius: 0,
          },
        ]
        : []),
    ],
  }

  const yAxisLabel = `${meta.label} (${meta.unit})`

  return (
    <div>
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">Indicator</span>
        <select
          value={metric}
          onChange={(event) => setSelected(event.target.value as AnnualMetric)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          {available.map((option) => (
            <option key={option} value={option}>
              {METRICS[option].label}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 h-72">
        <Line data={data} options={options(yAxisLabel)} />
      </div>
    </div>
  )
}