import { MONTH_LABELS } from '../config/climate'
import type { RiskLevel, RiskRow } from '../types/climate'

interface RiskCalendarProps {
  rows: RiskRow[]
}

const LEVEL_CLASSES: Record<RiskLevel, string> = {
  none: 'bg-slate-100 text-slate-400',
  low: 'bg-emerald-100 text-emerald-800',
  moderate: 'bg-amber-200 text-amber-900',
  high: 'bg-red-300 text-red-900',
}

const LEGEND: { level: RiskLevel; label: string }[] = [
  { level: 'none', label: 'None' },
  { level: 'low', label: 'Low' },
  { level: 'moderate', label: 'Moderate' },
  { level: 'high', label: 'High' },
]

export const RiskCalendar = ({ rows }: RiskCalendarProps) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-1 text-center text-xs">
        <thead>
          <tr>
            <th className="w-32 text-left font-medium text-slate-500">Risk</th>
            {MONTH_LABELS.map((month) => (
              <th key={month} className="font-medium text-slate-500">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" title={row.description} className="text-left text-sm font-medium text-slate-700">
                {row.label}
                <span className="block text-[10px] font-normal text-slate-400">{row.unit}</span>
              </th>
              {row.values.map((value, index) => (
                <td
                  key={MONTH_LABELS[index]}
                  title={`${row.label}, ${MONTH_LABELS[index]}: ${value.toFixed(row.decimals)} ${row.unit}`}
                  className={`rounded-md px-1 py-2 font-medium ${LEVEL_CLASSES[row.levels[index]]}`}
                >
                  {Number.isFinite(value) ? value.toFixed(row.decimals) : '–'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
      {LEGEND.map((item) => (
        <span key={item.level} className="flex items-center gap-1">
          <span className={`inline-block h-3 w-3 rounded ${LEVEL_CLASSES[item.level].split(' ')[0]}`} />
          {item.label}
        </span>
      ))}
      <span className="text-slate-500">Thresholds are indicative; confirm with a local agronomist.</span>
    </div>
  </div>
)