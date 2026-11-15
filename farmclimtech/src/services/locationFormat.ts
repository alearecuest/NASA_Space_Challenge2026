import type { GeoPoint, PlaceResult } from '../types/location'

export const formatCoordinates = (point: GeoPoint): string =>
	`${point.lat.toFixed(3)}°, ${point.lon.toFixed(3)}°`

export const formatPlaceLabel = (place: PlaceResult): string =>
	[place.name, place.admin1, place.country]
		.filter((part, index, all): part is string => Boolean(part) && all.indexOf(part) === index)
		.join(', ')

export const normalizeLongitude = (lon: number): number => ((((lon + 180) % 360) + 360) % 360) - 180

export const roundCoordinate = (value: number): number => Math.round(value * 10_000) / 10_000