import type { ClimateSummary } from '../types/climate'
import type { RotationScore } from '../types/rotation'
import type { GeoPoint } from '../types/location'
import type { SoilProperties } from '../services/soilGridsService'
import { generateFarmReport, downloadReportAsJSON, downloadReportAsCSV } from '../services/reportService'

interface FarmReportViewProps {
  location: GeoPoint
  locationName: string
  climate: ClimateSummary | null
  soil: SoilProperties | null
  currentRotation: RotationScore | null
  topRotations: RotationScore[]
}

export const FarmReportView = ({
  location,
  locationName,
  climate,
  soil,
  currentRotation,
  topRotations,
}: FarmReportViewProps) => {
  const report = generateFarmReport(locationName, location.lat, location.lon, climate, soil, currentRotation, topRotations)

  if (!report) {
    return (
      <div className="rounded-lg bg-night p-6 text-center">
        <p className="text-sky">Unable to generate report. Please ensure location and climate data are available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">Farm Management Report</h2>
          <p className="mt-1 text-sm text-sky">
            Generated {new Date(report.timestamp).toLocaleDateString()} for {report.location.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadReportAsJSON(report)}
            className="rounded-lg border border-lime px-4 py-2 text-sm font-semibold text-lime hover:bg-lime/10"
          >
            Export JSON
          </button>
          <button
            onClick={() => downloadReportAsCSV(report)}
            className="rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-card hover:bg-lime/90"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-night to-navy p-4">
          <p className="text-xs font-semibold text-sky">Annual Rainfall</p>
          <p className="mt-2 text-2xl font-bold text-sky">{report.climate.annualRain} mm</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-ocre/10 to-ocre/10 p-4">
          <p className="text-xs font-semibold text-ocre">Mean Temperature</p>
          <p className="mt-2 text-2xl font-bold text-ocre">{report.climate.meanTemp.toFixed(1)}°C</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
          <p className="text-xs font-semibold text-purple-900">Frost Days/Year</p>
          <p className="mt-2 text-2xl font-bold text-purple-700">{report.climate.frostDaysYear}</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-terra/15 to-terra/10 p-4">
          <p className="text-xs font-semibold text-terra-text">Heat Stress Days</p>
          <p className="mt-2 text-2xl font-bold text-terra-text">{report.climate.heatDaysYear}</p>
        </div>
      </div>

      {report.soil && (
        <div className="rounded-lg border border-line bg-card p-6">
          <h3 className="font-semibold text-ink">Soil Profile</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-sky">Texture</p>
              <p className="mt-1 font-semibold text-ink">{report.soil.texture}</p>
            </div>
            <div>
              <p className="text-sm text-sky">Organic Matter</p>
              <p className="mt-1 font-semibold text-ink">{report.soil.organicMatter.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-sky">pH</p>
              <p className="mt-1 font-semibold text-ink">{report.soil.pH.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {report.keyRisks.length > 0 && (
        <div className="rounded-lg border-l-4 border-terra bg-terra/15 p-6">
          <h3 className="font-semibold text-terra-text">Key Climate Risks</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-terra-text">
            {report.keyRisks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border-l-4 border-lime bg-lime/10 p-6">
        <h3 className="font-semibold text-lime">Recommended Actions</h3>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-lime">
          {report.nextActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg bg-night p-6">
        <h3 className="font-semibold text-ink">Data Quality & Uncertainties</h3>
        <div className="mt-4 space-y-2 text-sm text-ink">
          <p>
            <span className="font-medium">Climate Data:</span> {report.dataQuality.climateDataYears} years of NASA POWER records
          </p>
          <p className="font-medium">Satellite Sources:</p>
          <ul className="ml-4 list-inside list-disc text-xs text-sky">
            {report.dataQuality.sourcesSatellite.map((source, idx) => (
              <li key={idx}>{source}</li>
            ))}
          </ul>
          <p className="mt-2 font-medium">Known Limitations:</p>
          <ul className="ml-4 list-inside list-disc text-xs text-sky">
            {report.dataQuality.uncertainties.map((unc, idx) => (
              <li key={idx}>{unc}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg bg-night p-4 text-center text-xs text-sky">
        <p className="font-semibold text-ink">This report is for decision support only</p>
        <p className="mt-1">
          Verify all recommendations with your agronomist and consider local knowledge and constraints.
        </p>
      </div>
    </div>
  )
}
