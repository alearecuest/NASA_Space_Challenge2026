import { useEffect, useState } from 'react'
import type { GeoPoint } from '../types/location'
import type { SoilProperties } from '../services/soilGridsService'
import { getCachedOrFetchSoil, assessSoilSuitability } from '../services/soilGridsService'

interface SoilAnalysisProps {
  location: GeoPoint
}

export const SoilAnalysis = ({ location }: SoilAnalysisProps) => {
  const [soilData, setSoilData] = useState<SoilProperties | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSoilData = async () => {
      try {
        setIsLoading(true)
        const data = await getCachedOrFetchSoil(location)
        setSoilData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load soil data')
        setSoilData(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadSoilData()
  }, [location])

  if (isLoading) return <div className="text-slate-600">Loading soil data...</div>
  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        <p className="font-semibold">Could not load soil data</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  if (!soilData) return null

  const { score, recommendations } = assessSoilSuitability(soilData)

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
        <h3 className="font-semibold text-slate-900">Soil Properties (0–15 cm)</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">Soil Texture</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{soilData.texture}</p>
            <p className="mt-2 text-xs text-slate-600">
              Clay: {((soilData.depth_0_5cm.clay + soilData.depth_5_15cm.clay) / 2).toFixed(1)}% | Sand:{' '}
              {((soilData.depth_0_5cm.sand + soilData.depth_5_15cm.sand) / 2).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">Organic Matter</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {((soilData.depth_0_5cm.organic_carbon + soilData.depth_5_15cm.organic_carbon) / 2).toFixed(2)}%
            </p>
            <p className="mt-2 text-xs text-slate-600">Carbon content (0–15 cm avg)</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">Soil pH</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {((soilData.depth_0_5cm.phWater + soilData.depth_5_15cm.phWater) / 2).toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-slate-600">Slightly acidic to neutral</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">Soil Suitability</p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">{score}/100</p>
            <p className="mt-2 text-xs text-slate-600">Overall health assessment</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">Soil Management Recommendations</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">Soil data source: SoilGrids (ISRIC)</p>
        <p className="mt-1">Global 250m soil property maps. Local soil surveys are recommended for precise planning.</p>
      </div>
    </div>
  )
}
