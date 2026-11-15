import type { SelectedLocation } from '../types/location'

export const APP_NAME = 'Farm ClimeTech'

export const DEFAULT_LOCATION: SelectedLocation = {
	lat: -33.2524,
	lon: -58.0305,
	label: 'Mercedes, Soriano, Uruguay',
	source: 'initial',
}

export const DEFAULT_ZOOM = 7
export const SEARCH_ZOOM = 9
export const MIN_MAP_ZOOM = 2
export const MAX_MAP_ZOOM = 12