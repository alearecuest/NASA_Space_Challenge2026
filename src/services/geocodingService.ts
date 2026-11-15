import type { GeoPoint, PlaceResult } from '../types/location'

const OPEN_METEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search'
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

interface OpenMeteoPlace {
	id: number
	name: string
	latitude: number
	longitude: number
	admin1?: string
	country?: string
}

interface OpenMeteoResponse {
	results?: OpenMeteoPlace[]
}

interface NominatimPlace {
	place_id: number
	lat: string
	lon: string
	name?: string
	display_name: string
}

interface NominatimReverse {
	display_name?: string
	address?: Record<string, string>
}

const searchOpenMeteo = async (query: string, signal?: AbortSignal): Promise<PlaceResult[]> => {
	const params = new URLSearchParams({ name: query, count: '6', language: 'en', format: 'json' })
	const response = await fetch(`${OPEN_METEO_URL}?${params}`, { signal })
	if (!response.ok) throw new Error(`Geocoding failed (${response.status})`)
	const data = (await response.json()) as OpenMeteoResponse
	return (data.results ?? []).map((place) => ({
		id: `om-${place.id}`,
		name: place.name,
		admin1: place.admin1,
		country: place.country,
		lat: place.latitude,
		lon: place.longitude,
	}))
}

const searchNominatim = async (query: string, signal?: AbortSignal): Promise<PlaceResult[]> => {
	const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: '6' })
	const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params}`, { signal })
	if (!response.ok) throw new Error(`Geocoding failed (${response.status})`)
	const data = (await response.json()) as NominatimPlace[]
	return data.map((place) => {
		const parts = place.display_name.split(',').map((part) => part.trim())
		return {
			id: `nm-${place.place_id}`,
			name: place.name || parts[0],
			admin1: parts.length > 2 ? parts[parts.length - 2] : undefined,
			country: parts[parts.length - 1],
			lat: Number(place.lat),
			lon: Number(place.lon),
		}
	})
}

export const searchPlaces = async (query: string, signal?: AbortSignal): Promise<PlaceResult[]> => {
	const trimmed = query.trim()
	if (trimmed.length < 2) return []
	const primary = await searchOpenMeteo(trimmed, signal)
	if (primary.length > 0) return primary
	return searchNominatim(trimmed, signal)
}

export const reverseGeocode = async (point: GeoPoint, signal?: AbortSignal): Promise<string | null> => {
	try {
		const params = new URLSearchParams({
			lat: String(point.lat),
			lon: String(point.lon),
			format: 'jsonv2',
			zoom: '10',
		})
		const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, { signal })
		if (!response.ok) return null
		const data = (await response.json()) as NominatimReverse
		const address = data.address ?? {}
		const locality = address.city ?? address.town ?? address.village ?? address.county ?? address.state
		const parts = [locality, address.state, address.country].filter(
			(part, index, all): part is string => Boolean(part) && all.indexOf(part) === index,
		)
		return parts.length > 0 ? parts.join(', ') : (data.display_name ?? null)
	} catch {
		return null
	}
}