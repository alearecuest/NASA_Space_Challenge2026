import { useCallback, useRef, useState } from 'react'
import { reverseGeocode } from '../services/geocodingService'
import {
	formatCoordinates,
	formatPlaceLabel,
	normalizeLongitude,
	roundCoordinate,
} from '../services/locationFormat'
import type { GeoPoint, PlaceResult, SelectedLocation } from '../types/location'

export const useSelectedLocation = (initial: SelectedLocation) => {
	const [location, setLocation] = useState<SelectedLocation>(initial)
	const reverseController = useRef<AbortController | null>(null)

	const selectFromSearch = useCallback((place: PlaceResult) => {
		reverseController.current?.abort()
		setLocation({
			lat: roundCoordinate(place.lat),
			lon: roundCoordinate(normalizeLongitude(place.lon)),
			label: formatPlaceLabel(place),
			source: 'search',
		})
	}, [])

	const selectFromMap = useCallback(async (point: GeoPoint) => {
		const lat = roundCoordinate(point.lat)
		const lon = roundCoordinate(normalizeLongitude(point.lon))
		reverseController.current?.abort()
		const controller = new AbortController()
		reverseController.current = controller
		setLocation({ lat, lon, label: formatCoordinates({ lat, lon }), source: 'map' })
		const name = await reverseGeocode({ lat, lon }, controller.signal)
		if (name && !controller.signal.aborted) {
			setLocation((current) =>
				current.lat === lat && current.lon === lon ? { ...current, label: name } : current,
			)
		}
	}, [])

	return { location, selectFromSearch, selectFromMap }
}