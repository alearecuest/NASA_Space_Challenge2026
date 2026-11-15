import { MONTH_LABELS } from '../config/climate'
import type { RiskLevel, RiskRow } from '../types/climate'

interface RiskCalendarProps {
  rows: RiskRow[]
}

const LEVEL_CLASSES: Record<RiskLevel, string> = {
  none: 'bg-night text-mute',
  low: 'bg-lime/10 text-lime',
  moderate: 'bg-ocre text-card',
  high: 'bg-terra text-ink',
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
            <th className="w-32 text-left font-medium text-sky">Risk</th>
            {MONTH_LABELS.map((month) => (
              <th key={month} className="font-medium text-sky">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" title={row.description} className="text-left text-sm font-medium text-ink">
                {row.label}
                <span className="block text-[10px] font-normal text-mute">{row.unit}</span>
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
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-sky">
      {LEGEND.map((item) => (
        <span key={item.level} className="flex items-center gap-1">
          <span className={`inline-block h-3 w-3 rounded ${LEVEL_CLASSES[item.level].split(' ')[0]}`} />
          {item.label}
        </span>
      ))}
      <span className="text-sky">Thresholds are indicative; confirm with a local agronomist.</span>
    </div>
  </div>
)