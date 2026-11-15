import { useEffect, useMemo, useState } from 'react'
import { AIInsights } from './components/AIInsights'
import { ConnectionStatus } from './components/ConnectionStatus'
import type { FieldData } from './types/field'
import { AddCustomRotation } from './components/AddCustomRotation'
import { AlertsList } from './components/AlertsList'
import { ClimatePanel } from './components/ClimatePanel'
import { CONEATInfo } from './components/CONEATInfo'
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
import { Navigation } from './components/Navigation'
import { DEFAULT_LOCATION } from './config/constants'
import { GIBS_LAYERS } from './config/gibsLayers'
import { colors, spacing } from './config/theme'
import { useSelectedLocation } from './hooks/useSelectedLocation'
import { useClimateData } from './hooks/useClimateData'
import { useRotationScoring, useCropSuitability } from './hooks/useRotationScoring'
import { useCustomRotations } from './hooks/useCustomRotations'
import { defaultGibsDate } from './services/gibsService'
import { getCachedOrFetchSoil } from './services/soilGridsService'
import { getCONEATZoneByDepartment } from './services/coneatService'
import type { SoilProperties } from './services/soilGridsService'
import type { RotationId, RotationScore } from './types/rotation'

type TabId = 'map' | 'rotations' | 'crops' | 'alerts' | 'soil' | 'report'

const App = () => {
  const { location, selectFromSearch, selectFromMap } = useSelectedLocation(DEFAULT_LOCATION)
  const { state, retry: _retry } = useClimateData(location)
  const summary = state.status === 'ready' ? state.summary : null
  const isClimateLoading = state.status === 'loading'
  const { scores, ranked, scoreCustom } = useRotationScoring(summary)
  const { crops } = useCropSuitability(summary)
  const { rotations: customRotations, add: addCustomRotation, remove: removeCustomRotation } = useCustomRotations()

  const [layerId, setLayerId] = useState(GIBS_LAYERS[0].id)
  const [date, setDate] = useState(defaultGibsDate)
  const coneatZone = getCONEATZoneByDepartment(location.label.split(',')[0] || '')
  const [showLabels, setShowLabels] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('map')
  const [selectedRotation, setSelectedRotation] = useState<RotationId | null>(null)
  const [soilData, setSoilData] = useState<SoilProperties | null>(null)
  const [showAddRotation, setShowAddRotation] = useState(false)
  const [customScores, setCustomScores] = useState<RotationScore[]>([])

  useEffect(() => {
    getCachedOrFetchSoil(location)
      .then((data) => setSoilData(data))
      .catch(() => setSoilData(null))
  }, [location])

  useEffect(() => {
    if (summary) {
      const scored = customRotations
        .map((rot) => scoreCustom(rot.id, rot.crops))
        .filter((s) => s !== null) as RotationScore[]
      setCustomScores(scored)
    }
  }, [customRotations, summary, scoreCustom])

  // Field indicators for the AI layer, built only from NASA POWER numbers
  const fieldData = useMemo<FieldData | null>(() => {
    const lastMonth = summary?.monthly.at(-1)
    if (!summary || !lastMonth) return null
    const normal = summary.climatology.find((c) => c.month === lastMonth.month)
    return {
      latitude: location.lat,
      longitude: location.lon,
      soilMoisture: summary.hasSoil ? Math.round(lastMonth.soil * 100) : Number.NaN,
      rainfall: Math.round(lastMonth.rain),
      rainfallAvg: normal ? Math.round(normal.rain) : Number.NaN,
      tempAvg: Math.round(((lastMonth.tmax + lastMonth.tmin) / 2) * 10) / 10,
      ndvi: Number.NaN,
      soilType: 'unknown',
    }
  }, [summary, location.lat, location.lon])

  const layer = GIBS_LAYERS.find((option) => option.id === layerId) ?? GIBS_LAYERS[0]

  const suitableCrops = crops.filter((c) => c.score >= 60)
  const currentRotation = scores.find((s) => s.rotationId === 'R0') || null

  const allRotations = [...ranked, ...customScores].sort((a, b) => b.overall - a.overall)

  const navTabs = [
    { id: 'map', label: 'Field' },
    { id: 'rotations', label: 'Rotations' },
    { id: 'crops', label: 'Crops' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'soil', label: 'Soil' },
    { id: 'report', label: 'Report' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary.darkestNight} 0%, ${colors.primary.darkBlue} 50%, ${colors.primary.veryDark} 100%)` }}>
      <Header />
      <main className="mx-auto flex max-w-[1400px] flex-col gap-5 p-4 pb-28 md:p-5 md:pb-5">
        <ConnectionStatus />
        <Navigation
          tabs={navTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId as TabId)
            setSelectedRotation(null)
          }}
        />

        {activeTab === 'map' && (
          <div className="grid gap-5 md:grid-cols-[340px_minmax(0,1fr)]">
            <div className="flex flex-col gap-4">
              <LocationSearch onSelect={selectFromSearch} />
              <section className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-line">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-sky">
                  Selected location
                </h2>
                <p className="mt-1 font-medium">{location.label}</p>
                <p className="text-xs text-sky">
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
          <div className="bg-card rounded-lg p-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-ink">Crop Rotations</h2>
              <button
                onClick={() => setShowAddRotation(!showAddRotation)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#A6E36B',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0F2A44',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1em',
                }}
              >
                {showAddRotation ? 'Cancel' : '+ Add Rotation'}
              </button>
            </div>

            {showAddRotation && (
              <AddCustomRotation
                onAdd={(name, crops) => {
                  addCustomRotation(name, crops)
                  setShowAddRotation(false)
                }}
                onCancel={() => setShowAddRotation(false)}
              />
            )}

            {selectedRotation && allRotations.length > 0 ? (
              <RotationDetail
                score={allRotations.find((s) => s.rotationId === selectedRotation)!}
                onBack={() => setSelectedRotation(null)}
              />
            ) : (
              <>
                {isClimateLoading ? (
                  <p className="text-sky">Loading climate data...</p>
                ) : allRotations.length > 0 ? (
                  <>
                    <RotationComparison
                      ranked={allRotations}
                      onSelectRotation={(id) => setSelectedRotation(id as RotationId)}
                    />
                    {customScores.length > 0 && (
                      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #A6E36B' }}>
                        <p style={{ color: '#0F2A44', fontWeight: 'bold', marginBottom: '10px' }}>
                          {customScores.length} custom rotation{customScores.length !== 1 ? 's' : ''} added
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {customRotations.map((rot) => (
                            <button
                              key={rot.id}
                              onClick={() => removeCustomRotation(rot.id)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                color: '#991b1b',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                              }}
                              title="Click to delete this custom rotation"
                            >
                              ✕ {rot.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sky">No rotation data available. Check your location.</p>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="bg-card rounded-lg p-6">
            {isClimateLoading ? (
              <p className="text-sky">Loading crop suitability data...</p>
            ) : suitableCrops.length > 0 ? (
              <>
                <CropSuitabilityGrid
                  crops={suitableCrops}
                  title="Recommended Crops for Your Location"
                  showRiskFactors={true}
                />
              </>
            ) : (
              <p className="text-sky">No suitable crops found for your location.</p>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="flex flex-col gap-5">
          <AIInsights fieldData={fieldData} />
          <div className="bg-card rounded-lg p-6">
            <AlertsList location={location.label} latitude={location.lat} longitude={location.lon} />
          </div>
          </div>
        )}

        {activeTab === 'soil' && (
          <div style={{ display: 'grid', gap: spacing.xl, gridTemplateColumns: 'auto 1fr' }}>
            {coneatZone && (
              <div style={{ maxWidth: '400px' }}>
                <CONEATInfo zone={coneatZone} location={location.label} />
              </div>
            )}
            <div>
              {soilData ? (
                <SoilAnalysis location={location} />
              ) : (
                <p style={{ color: colors.text.secondary }}>Loading soil data...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-card rounded-lg p-6">
            {isClimateLoading ? (
              <p className="text-sky">Generating comprehensive farm report...</p>
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

      <footer className="mt-12 bg-night py-6">
        <div className="mx-auto max-w-7xl px-4">
          <TechnicalNotice />
        </div>
      </footer>
    </div>
  )
}

export default App