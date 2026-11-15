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

  if (isLoading) return <div className="text-sky">Loading soil data...</div>
  if (error)
    return (
      <div className="rounded-lg bg-terra/15 p-4 text-sm text-terra-text">
        <p className="font-semibold">Could not load soil data</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  if (!soilData) return null

  const { score, recommendations } = assessSoilSuitability(soilData)

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-card p-4 ring-1 ring-line">
        <h3 className="font-semibold text-ink">Soil Properties (0–15 cm)</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-night p-3">
            <p className="text-xs font-semibold text-sky">Soil Texture</p>
            <p className="mt-1 text-lg font-semibold text-ink">{soilData.texture}</p>
            <p className="mt-2 text-xs text-sky">
              Clay: {((soilData.depth_0_5cm.clay + soilData.depth_5_15cm.clay) / 2).toFixed(1)}% | Sand:{' '}
              {((soilData.depth_0_5cm.sand + soilData.depth_5_15cm.sand) / 2).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-lg bg-night p-3">
            <p className="text-xs font-semibold text-sky">Organic Matter</p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {((soilData.depth_0_5cm.organic_carbon + soilData.depth_5_15cm.organic_carbon) / 2).toFixed(2)}%
            </p>
            <p className="mt-2 text-xs text-sky">Carbon content (0–15 cm avg)</p>
          </div>

          <div className="rounded-lg bg-night p-3">
            <p className="text-xs font-semibold text-sky">Soil pH</p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {((soilData.depth_0_5cm.phWater + soilData.depth_5_15cm.phWater) / 2).toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-sky">Slightly acidic to neutral</p>
          </div>

          <div className="rounded-lg bg-night p-3">
            <p className="text-xs font-semibold text-sky">Soil Suitability</p>
            <p className="mt-1 text-lg font-semibold text-lime">{score}/100</p>
            <p className="mt-2 text-xs text-sky">Overall health assessment</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="rounded-lg border-l-4 border-ocre bg-ocre/10 p-4">
          <p className="font-semibold text-ocre">Soil Management Recommendations</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ocre">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-night p-3 text-center text-xs text-sky">
        <p className="font-semibold text-ink">Soil data source: SoilGrids (ISRIC)</p>
        <p className="mt-1">Global 250m soil property maps. Local soil surveys are recommended for precise planning.</p>
      </div>
    </div>
  )
}
