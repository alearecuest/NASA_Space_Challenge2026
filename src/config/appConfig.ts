// Environment configuration for Farm ClimeTech

export const config = {
  powerApi: {
    baseUrl: 'https://power.larc.nasa.gov/api/temporal/daily/point',
    community: 'AG',
  },

  gibs: {
    baseUrl: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default//EPSG3857_250m',
  },

  geocoding: {
    baseUrl: 'https://api.opencagedata.com/geocode/v1/json',
    key: '',
  },

  soilgrids: {
    baseUrl: 'https://rest.isric.org/soilgrids/v2.0/properties/query',
  },

  app: {
    title: 'Farm ClimeTech',
    version: '0.1.0',
    defaultLocation: {
      name: 'Soriano, Uruguay',
      lat: -33.74,
      lon: -56.51,
    },
    mapCenter: [-32.5, -56.0],
    mapZoom: 7,
  },

  features: {
    enableOfflineMode: false,
    enableSoilGridsCache: true,
    enableReportExport: true,
  },
}

export default config
