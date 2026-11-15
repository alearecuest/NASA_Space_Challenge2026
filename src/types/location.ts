export interface GeoPoint {
	lat: number
	lon: number
}

export type LocationSource = 'initial' | 'search' | 'map'

export interface SelectedLocation extends GeoPoint {
	label: string
	source: LocationSource
}

export interface PlaceResult extends GeoPoint {
	id: string
	name: string
	admin1?: string
	country?: string
}