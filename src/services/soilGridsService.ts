import type { GeoPoint } from '../types/location'

export interface SoilProperties {
  latitude: number
  longitude: number
  depth_0_5cm: {
    clay: number
    sand: number
    silt: number
    organic_carbon: number
    phWater: number
  }
  depth_5_15cm: {
    clay: number
    sand: number
    silt: number
    organic_carbon: number
    phWater: number
  }
  texture: string
  classification: string
}

const SOILGRIDS_API = 'https://rest.isric.org/soilgrids/v2.0/properties/query'

export class SoilGridsError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'SoilGridsError'
    this.status = status
  }
}

const classifyTexture = (clay: number, sand: number): string => {
  if (clay > 40) return 'Clay'
  if (sand > 70 && clay < 15) return 'Sand'
  if (sand > 50 && clay < 30) return 'Loamy Sand'
  if (sand > 50 && clay > 15 && clay < 30) return 'Sandy Loam'
  if (clay > 25 && sand > 25) return 'Clay Loam'
  if (clay < 30 && sand < 30) return 'Loam'
  if (sand > 25 && sand < 50 && clay < 20) return 'Silt Loam'
  if (sand > 25 && sand < 50 && clay > 20) return 'Silty Clay Loam'
  return 'Loam'
}

export const fetchSoilData = async (location: GeoPoint): Promise<SoilProperties> => {
  const query = new URLSearchParams({
    lon: String(location.lon),
    lat: String(location.lat),
    depth: '0-5cm,5-15cm',
    properties: 'clay,sand,silt,organic_carbon,phH2o',
    value: 'mean',
  })

  try {
    const response = await fetch(`${SOILGRIDS_API}?${query}`)
    if (!response.ok) {
      throw new SoilGridsError(`SoilGrids API error: ${response.statusText}`, response.status)
    }

    const data = (await response.json()) as {
      properties: {
        layers: Array<{
          depth_class: string
          values: {
            clay: Array<{ mean: number }>
            sand: Array<{ mean: number }>
            silt: Array<{ mean: number }>
            organic_carbon: Array<{ mean: number }>
            phH2o: Array<{ mean: number }>
          }
        }>
      }
    }

    const layers = data.properties?.layers || []
    const layer0 = layers[0]
    const layer1 = layers[1]

    const depth0 = {
      clay: layer0?.values?.clay?.[0]?.mean ?? 20,
      sand: layer0?.values?.sand?.[0]?.mean ?? 40,
      silt: layer0?.values?.silt?.[0]?.mean ?? 40,
      organic_carbon: layer0?.values?.organic_carbon?.[0]?.mean ?? 1.5,
      phWater: layer0?.values?.phH2o?.[0]?.mean ?? 6.5,
    }

    const depth1 = {
      clay: layer1?.values?.clay?.[0]?.mean ?? 22,
      sand: layer1?.values?.sand?.[0]?.mean ?? 38,
      silt: layer1?.values?.silt?.[0]?.mean ?? 40,
      organic_carbon: layer1?.values?.organic_carbon?.[0]?.mean ?? 1.2,
      phWater: layer1?.values?.phH2o?.[0]?.mean ?? 6.6,
    }

    const texture = classifyTexture(depth0.clay, depth0.sand)

    return {
      latitude: location.lat,
      longitude: location.lon,
      depth_0_5cm: depth0,
      depth_5_15cm: depth1,
      texture,
      classification: 'FAO Soil Classification not available from this API',
    }
  } catch (error) {
    if (error instanceof SoilGridsError) throw error
    throw new SoilGridsError(`Failed to fetch soil data: ${error instanceof Error ? error.message : String(error)}`, 0)
  }
}

export const assessSoilSuitability = (soilData: SoilProperties): { score: number; recommendations: string[] } => {
  const { depth_0_5cm, depth_5_15cm, texture } = soilData
  const avgClay = (depth_0_5cm.clay + depth_5_15cm.clay) / 2
  const avgOC = (depth_0_5cm.organic_carbon + depth_5_15cm.organic_carbon) / 2
  const avgPh = (depth_0_5cm.phWater + depth_5_15cm.phWater) / 2

  let score = 70

  if (avgOC > 2.5) score += 15
  else if (avgOC < 1.0) score -= 10

  if (avgPh >= 6.0 && avgPh <= 7.5) score += 10
  else if (avgPh < 5.5 || avgPh > 8.0) score -= 15

  if (texture === 'Loam' || texture === 'Clay Loam' || texture === 'Silt Loam') score += 10
  else if (texture === 'Sand' || texture === 'Loamy Sand') score -= 15

  score = Math.max(0, Math.min(100, score))

  const recommendations: string[] = []

  if (avgOC < 2.0) recommendations.push('Low organic matter: consider cover crops or compost.')
  if (avgClay > 50) recommendations.push('High clay content: focus on drainage and avoid compaction.')
  if (avgClay < 15 && depth_0_5cm.sand > 70) recommendations.push('Sandy soil: implement water retention strategies.')
  if (avgPh < 6.0) recommendations.push('Acidic soil: consider lime application if needed.')
  if (avgPh > 7.5) recommendations.push('Alkaline soil: check micronutrient availability.')

  return { score, recommendations }
}

export const cachedSoilData = new Map<string, SoilProperties>()

export const getCachedOrFetchSoil = async (location: GeoPoint): Promise<SoilProperties> => {
  const key = `${location.lat.toFixed(2)}|${location.lon.toFixed(2)}`
  if (cachedSoilData.has(key)) {
    return cachedSoilData.get(key)!
  }

  const data = await fetchSoilData(location)
  cachedSoilData.set(key, data)
  return data
}
