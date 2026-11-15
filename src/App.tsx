import { useEffect, useState } from 'react'
import { AlertsList } from './components/AlertsList'
import { ClimatePanel } from './components/ClimatePanel'
import { CropSuitabilityGrid } from './components/CropSuitabilityGrid'
import { FarmReportView } from './components/FarmReportView'
import { Header } from './components/Header'
import { LayerControls } from './components/LayerControls'
import { LocationSearch } from './components/LocationSearch'
import { MapView } from './components/MapView'
import { RotationComparison } from './components/RotationComparison'
import { RotationDetail } from './components/RotationDetail'
import { SoilAnalysis } from './components/SoilAnalysis'
import { TechnicalNotice } from './components/TechnicalNotice'
import { UserPreferences } from './components/UserPreferences'
import { DEFAULT_LOCATION } from './config/constants'
import { GIBS_LAYERS } from './config/gibsLayers'
import { useSelectedLocation } from './hooks/useSelectedLocation'
import { useClimateData } from './hooks/useClimateData'
import { useRotationScoring, useCropSuitability } from './hooks/useRotationScoring'
import { defaultGibsDate } from './services/gibsService'
import { getCachedOrFetchSoil } from './services/soilGridsService'
import type { SoilProperties } from './services/soilGridsService'
import type { RotationId } from './types/rotation'

type TabId = 'map' | 'rotations' | 'crops' | 'alerts' | 'soil' | 'report'

const App = () => {
  const { location, selectFromSearch, selectFromMap } = useSelectedLocation(DEFAULT_LOCATION)
  const { summary, isLoading: isClimateLoading } = useClimateData(location)
  const { scores, ranked } = useRotationScoring(summary)
  const { crops } = useCropSuitability(summary)

  const [layerId, setLayerId] = useState(GIBS_LAYERS[0].id)
  const [date, setDate] = useState(defaultGibsDate)
  const [showLabels, setShowLabels] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('map')
  const [selectedRotation, setSelectedRotation] = useState<RotationId | null>(null)
  const [soilData, setSoilData] = useState<SoilProperties | null>(null)

  useEffect(() => {
    getCachedOrFetchSoil(location)
      .then((data) => setSoilData(data))
      .catch(() => setSoilData(null))
  }, [location])

  const layer = GIBS_LAYERS.find((option) => option.id === layerId) ?? GIBS_LAYERS[0]

  const suitableCrops = crops.filter((c) => c.score >= 60)
  const currentRotation = scores.find((s) => s.rotationId === 'R0') || null

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="flex gap-2 border-b border-slate-200 bg-white p-4 rounded-lg overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('map')
              setSelectedRotation(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'map' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Map & Climate
          </button>
          <button
            onClick={() => {
              setActiveTab('rotations')
              setSelectedRotation(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'rotations' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Rotations
          </button>
          <button
            onClick={() => {
              setActiveTab('crops')
              setSelectedRotation(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'crops' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Crops
          </button>
          <button
            onClick={() => {
              setActiveTab('soil')
              setSelectedRotation(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'soil' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Soil
          </button>
          <button
            onClick={() => {
              setActiveTab('report')
              setSelectedRotation(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'report' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Report
          </button>
        </div>

        {activeTab === 'map' && (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="space-y-4">
              <LocationSearch onSelect={selectFromSearch} />
              <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Selected location
                </h2>
                <p className="mt-1 font-medium">{location.label}</p>
                <p className="text-xs text-slate-500">
                  {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
                </p>
              </section>
              <LayerControls
                layer={layer}
                date={date}
                showLabels={showLabels}
                onLayerChange={setLayerId}
                onDateChange={setDate}
                onLabelsChange={setShowLabels}
              />
            </div>
            <MapView
              location={location}
              layer={layer}
              date={date}
              showLabels={showLabels}
              onSelect={selectFromMap}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <ClimatePanel location={location} />
        )}

        {activeTab === 'rotations' && (
          <div className="bg-white rounded-lg p-6">
            {selectedRotation && ranked.length > 0 ? (
              <RotationDetail
                score={ranked.find((s) => s.rotationId === selectedRotation)!}
                onBack={() => setSelectedRotation(null)}
              />
            ) : (
              <>
                {isClimateLoading ? (
                  <p className="text-slate-600">Loading climate data...</p>
                ) : ranked.length > 0 ? (
                  <RotationComparison
                    scores={scores}
                    ranked={ranked}
                    onSelectRotation={(id) => setSelectedRotation(id as RotationId)}
                  />
                ) : (
                  <p className="text-slate-600">No rotation data available. Check your location.</p>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="bg-white rounded-lg p-6">
            {isClimateLoading ? (
              <p className="text-slate-600">Loading crop suitability data...</p>
            ) : suitableCrops.length > 0 ? (
              <>
                <CropSuitabilityGrid
                  crops={suitableCrops}
                  title="Recommended Crops for Your Location"
                  showRiskFactors={true}
                />
              </>
            ) : (
              <p className="text-slate-600">No suitable crops found for your location.</p>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white rounded-lg p-6">
            <AlertsList location={location.label} latitude={location.lat} longitude={location.lon} />
          </div>
        )}

        {activeTab === 'soil' && (
          <div className="bg-white rounded-lg p-6">
            {soilData ? (
              <SoilAnalysis location={location} />
            ) : (
              <p className="text-slate-600">Loading soil data...</p>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white rounded-lg p-6">
            {isClimateLoading ? (
              <p className="text-slate-600">Generating comprehensive farm report...</p>
            ) : (
              <FarmReportView
                location={location}
                locationName={location.label}
                climate={summary}
                soil={soilData}
                currentRotation={currentRotation}
                topRotations={ranked}
              />
            )}
          </div>
        )}
      </main>

      <footer className="mt-12 bg-slate-100 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <TechnicalNotice />
        </div>
      </footer>
    </div>
  )
}

export default App