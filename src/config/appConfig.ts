// Environment configuration for FarmClimTech
// Copy to .env.local and fill in your API keys

export const config = {
  // NASA POWER API (no key required, but can be registered at https://power.larc.nasa.gov)
  powerApi: {
    baseUrl: 'https://power.larc.nasa.gov/api/temporal/daily/point',
    community: 'AG',
  },

  // NASA GIBS (Worldview) - Public, no key required
  gibs: {
    baseUrl: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default//EPSG3857_250m',
  },

  // OpenCage Geocoding API (free tier available)
  geocoding: {
    baseUrl: 'https://api.opencagedata.com/geocode/v1/json',
    key: process.env.REACT_APP_OPENCAGE_API_KEY || '',
  },

  // SoilGrids API (public, no key required)
  soilgrids: {
    baseUrl: 'https://rest.isric.org/soilgrids/v2.0/properties/query',
  },

  // Application settings
  app: {
    title: 'FarmClimTech',
    version: '0.1.0',
    defaultLocation: {
      name: 'Soriano, Uruguay',
      lat: -33.74,
      lon: -56.51,
    },
    mapCenter: [-32.5, -56.0],
    mapZoom: 7,
  },

  // Feature flags
  features: {
    enableOfflineMode: false,
    enableSoilGridsCache: true,
    enableReportExport: true,
  },
}

export default config
