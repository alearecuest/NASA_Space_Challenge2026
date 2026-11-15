import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { DEFAULT_ZOOM, MAX_MAP_ZOOM, MIN_MAP_ZOOM, SEARCH_ZOOM } from '../config/constants'
import { BASE_LAYER, GIBS_ATTRIBUTION, LABELS_LAYER } from '../config/gibsLayers'
import { buildGibsTileUrl, resolveGibsDate } from '../services/gibsService'
import type { GibsLayer } from '../types/gibs'
import type { GeoPoint, SelectedLocation } from '../types/location'

interface MapViewProps {
  location: SelectedLocation
  layer: GibsLayer
  date: string
  showLabels: boolean
  onSelect: (point: GeoPoint) => void
  children?: ReactNode
}

const MapController = ({ location }: { location: SelectedLocation }) => {
  const map = useMap()

  useEffect(() => {
    if (location.source === 'search') {
      map.flyTo([location.lat, location.lon], Math.max(map.getZoom(), SEARCH_ZOOM))
    } else if (location.source === 'map') {
      map.panTo([location.lat, location.lon])
    }
  }, [map, location.lat, location.lon, location.source])

  return null
}

const ClickHandler = ({ onSelect }: { onSelect: (point: GeoPoint) => void }) => {
  useMapEvents({
    click: (event) => onSelect({ lat: event.latlng.lat, lon: event.latlng.lng }),
  })
  return null
}

export const MapView = ({ location, layer, date, showLabels, onSelect, children }: MapViewProps) => (
  <div className="h-[460px] overflow-hidden rounded-xl shadow-sm ring-1 ring-line lg:h-[620px]">
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_MAP_ZOOM}
      maxZoom={MAX_MAP_ZOOM}
      className="h-full w-full"
    >
      <TileLayer
        key={BASE_LAYER.id}
        url={buildGibsTileUrl(BASE_LAYER, date)}
        maxNativeZoom={BASE_LAYER.maxNativeZoom}
        maxZoom={MAX_MAP_ZOOM}
        attribution={GIBS_ATTRIBUTION}
        noWrap
      />
      {layer.id !== BASE_LAYER.id && (
        <TileLayer
          key={`${layer.id}-${resolveGibsDate(layer, date)}`}
          url={buildGibsTileUrl(layer, date)}
          maxNativeZoom={layer.maxNativeZoom}
          maxZoom={MAX_MAP_ZOOM}
          noWrap
        />
      )}
      {showLabels && (
        <TileLayer
          key={LABELS_LAYER.id}
          url={buildGibsTileUrl(LABELS_LAYER, date)}
          maxNativeZoom={LABELS_LAYER.maxNativeZoom}
          maxZoom={MAX_MAP_ZOOM}
          noWrap
        />
      )}
      <MapController location={location} />
      <ClickHandler onSelect={onSelect} />
      <CircleMarker
        center={[location.lat, location.lon]}
        radius={9}
        pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#059669', fillOpacity: 1 }}
      />
      {children}
    </MapContainer>
  </div>
)