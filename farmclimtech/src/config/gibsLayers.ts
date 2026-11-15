import type { GibsLayer } from '../types/gibs'

export const GIBS_BASE_URL = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best'

export const GIBS_ATTRIBUTION = 'Imagery: NASA EOSDIS GIBS'

export const BASE_LAYER: GibsLayer = {
	id: 'BlueMarble_ShadedRelief_Bathymetry',
	label: 'Blue Marble',
	description: 'Static global relief and bathymetry',
	matrixSet: 'GoogleMapsCompatible_Level8',
	maxNativeZoom: 8,
	extension: 'jpeg',
	timeMode: 'none',
}

export const LABELS_LAYER: GibsLayer = {
	id: 'Reference_Labels_15m',
	label: 'Place labels',
	description: 'Country and city labels',
	matrixSet: 'GoogleMapsCompatible_Level9',
	maxNativeZoom: 9,
	extension: 'png',
	timeMode: 'none',
}

export const GIBS_LAYERS: GibsLayer[] = [
	{
		id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
		label: 'True color (VIIRS NOAA-20)',
		description: 'Daily satellite imagery, 250 m',
		matrixSet: 'GoogleMapsCompatible_Level9',
		maxNativeZoom: 9,
		extension: 'jpg',
		timeMode: 'daily',
	},
	{
		id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
		label: 'True color (MODIS Terra)',
		description: 'Daily satellite imagery, 250 m',
		matrixSet: 'GoogleMapsCompatible_Level9',
		maxNativeZoom: 9,
		extension: 'jpg',
		timeMode: 'daily',
	},
	{
		id: 'MODIS_Terra_NDVI_8Day',
		label: 'Vegetation index NDVI (MODIS)',
		description: '8-day composite, shows crop and vegetation vigor',
		matrixSet: 'GoogleMapsCompatible_Level9',
		maxNativeZoom: 9,
		extension: 'png',
		timeMode: 'eightDay',
	},
	{
		id: 'MODIS_Terra_Land_Surface_Temp_Day',
		label: 'Land surface temperature (MODIS)',
		description: 'Daily daytime land surface temperature',
		matrixSet: 'GoogleMapsCompatible_Level7',
		maxNativeZoom: 7,
		extension: 'png',
		timeMode: 'daily',
	},
	BASE_LAYER,
]