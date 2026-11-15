import { useState } from 'react'
import { ClimatePanel } from './components/ClimatePanel'
import { Header } from './components/Header'
import { LayerControls } from './components/LayerControls'
import { LocationSearch } from './components/LocationSearch'
import { MapView } from './components/MapView'
import { TechnicalNotice } from './components/TechnicalNotice'
import { DEFAULT_LOCATION } from './config/constants'
import { GIBS_LAYERS } from './config/gibsLayers'
import { useSelectedLocation } from './hooks/useSelectedLocation'
import { defaultGibsDate } from './services/gibsService'

const App = () => {
  const { location, selectFromSearch, selectFromMap } = useSelectedLocation(DEFAULT_LOCATION)
  const [layerId, setLayerId] = useState(GIBS_LAYERS[0].id)
  const [date, setDate] = useState(defaultGibsDate)
  const [showLabels, setShowLabels] = useState(true)

  const layer = GIBS_LAYERS.find((option) => option.id === layerId) ?? GIBS_LAYERS[0]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
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
        <ClimatePanel location={location} />
        <TechnicalNotice />
      </main>
    </div>
  )
}

export default App