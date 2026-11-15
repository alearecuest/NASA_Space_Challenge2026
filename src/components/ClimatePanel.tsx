import { AnnualTrendChart } from './AnnualTrendChart'
import { ClimateOverview } from './ClimateOverview'
import { MonthlyClimateChart } from './MonthlyClimateChart'
import { RiskCalendar } from './RiskCalendar'
import { TrendCards } from './TrendCards'
import { useClimateData } from '../hooks/useClimateData'
import type { ClimateSummary } from '../types/climate'
import type { SelectedLocation } from '../types/location'

interface ClimatePanelProps {
  location: SelectedLocation
}

const SectionTitle = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="mb-3">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {hint && <p className="text-sm text-slate-500">{hint}</p>}
  </div>
)

const DataNotes = ({ summary }: { summary: ClimateSummary }) => (
  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
    <li>
      Source: NASA POWER daily data (MERRA-2 reanalysis and satellite-based rainfall) on a 0.5° grid, roughly 55 km
      per cell. It is not a weather station measurement.
    </li>
    <li>
      Years analysed: {summary.firstYear}–{summary.lastYear} ({summary.annual.length} complete years,{' '}
      {(summary.coverage * 100).toFixed(1)}% of days with valid data).
    </li>
    <li>Reference evapotranspiration is estimated with the Hargreaves–Samani method; it is not measured.</li>
    {summary.hasSoil && (
      <li>Root-zone soil wetness is a modelled product, not a direct SMAP retrieval of your field.</li>
    )}
    <li>
      Trends use the Mann–Kendall test and the Theil–Sen slope. A trend is significant when p &lt; 0.05.
    </li>
    <li>Conditions on a single farm can differ from the cell average. Confirm decisions with a local agronomist.</li>
  </ul>
)

export const ClimatePanel = ({ location }: ClimatePanelProps) => {
  const { state, retry } = useClimateData(location)

  return (
    <section className="space-y-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Climate of {location.label}</h2>
        <p className="text-sm text-slate-500">
          Long-term climate and trends from NASA POWER for the selected location.
        </p>
      </header>

      {state.status === 'loading' && (
        <div role="status" className="space-y-3">
          <p className="text-sm text-slate-600">
            Loading NASA POWER data
            {state.progress.total > 0 && ` (${state.progress.done} of ${state.progress.total} requests)`}. The first
            load of a location can take up to 30 seconds.
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-emerald-600 transition-all"
              style={{
                width: `${state.progress.total > 0 ? (state.progress.done / state.progress.total) * 100 : 5}%`,
              }}
            />
          </div>
          <div className="grid animate-pulse gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-16 rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <p>{state.message}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <p className="text-xs text-slate-500">
            Data cell centred at {state.cell.lat.toFixed(2)}°, {state.cell.lon.toFixed(2)}°
          </p>
          <div>
            <SectionTitle title="Yearly averages" hint="Mean of all complete years in the record." />
            <ClimateOverview summary={state.summary} />
          </div>
          <div>
            <SectionTitle title="Typical year" hint="Monthly averages of rainfall, evapotranspiration and temperature." />
            <MonthlyClimateChart climatology={state.summary.climatology} />
          </div>
          <div>
            <SectionTitle title="Risk calendar" hint="Months when each climate risk is most likely." />
            <RiskCalendar rows={state.summary.risk} />
          </div>
          <div>
            <SectionTitle title="How the climate is changing" hint="Change per decade over the record." />
            <TrendCards summary={state.summary} />
          </div>
          <div>
            <SectionTitle title="Year by year" />
            <AnnualTrendChart summary={state.summary} />
          </div>
          <DataNotes summary={state.summary} />
        </>
      )}
    </section>
  )
}