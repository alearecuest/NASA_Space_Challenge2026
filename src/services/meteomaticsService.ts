export interface MeteomaticsWeatherData {
  latitude: number
  longitude: number
  timeframe: string
  parameters: {
    temperature: number
    precipitation: number
    windSpeed: number
    relativeHumidity: number
    solarRadiation: number
  }
}

export interface MeteomaticsCredentials {
  username: string
  password: string
}

const API_BASE = 'https://api.meteomatics.com'

const getCredentialsFromEnv = (): MeteomaticsCredentials => {
  return {
    username: import.meta.env.VITE_METEOMATICS_USERNAME || '',
    password: import.meta.env.VITE_METEOMATICS_PASSWORD || '',
  }
}

const encodeCredentials = (username: string, password: string): string => {
  return btoa(`${username}:${password}`)
}

export const getMeteomaticsWeather = async (
  latitude: number,
  longitude: number,
  startDate: Date = new Date(),
  endDate: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
): Promise<MeteomaticsWeatherData[]> => {
  try {
    const credentials = getCredentialsFromEnv()

    if (!credentials.username || !credentials.password) {
      console.warn('Meteomatics credentials not configured')
      return []
    }

    const auth = encodeCredentials(credentials.username, credentials.password)
    const startISO = startDate.toISOString().split('.')[0] + 'Z'
    const endISO = endDate.toISOString().split('.')[0] + 'Z'

    const url =
      `${API_BASE}/${startISO}--${endISO}:PT1D/` +
      `t_2m:C,precip_24h:mm,wind_speed_10m:ms,relative_humidity_2m:p,global_irradiance:W/m2/` +
      `${latitude},${longitude}/` +
      `json`

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Meteomatics API error: ${response.status}`)
    }

    const data = await response.json()

    return data.data?.map((point: any) => ({
      latitude,
      longitude,
      timeframe: point.validityDate,
      parameters: {
        temperature: point.coordinates?.[0]?.dates?.[0]?.value ?? 0,
        precipitation: point.coordinates?.[0]?.dates?.[1]?.value ?? 0,
        windSpeed: point.coordinates?.[0]?.dates?.[2]?.value ?? 0,
        relativeHumidity: point.coordinates?.[0]?.dates?.[3]?.value ?? 0,
        solarRadiation: point.coordinates?.[0]?.dates?.[4]?.value ?? 0,
      },
    })) ?? []
  } catch (error) {
    console.error('Meteomatics fetch error:', error)
    return []
  }
}

export const getHistoricalClimateMetrics = async (
  latitude: number,
  longitude: number
): Promise<{
  avgTemperature: number
  totalPrecipitation: number
  extremeTemps: { min: number; max: number }
}> => {
  try {
    const credentials = getCredentialsFromEnv()
    if (!credentials.username || !credentials.password) {
      return {
        avgTemperature: 15,
        totalPrecipitation: 1100,
        extremeTemps: { min: 0, max: 30 },
      }
    }

    const auth = encodeCredentials(credentials.username, credentials.password)

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const today = new Date()
    const startISO = thirtyDaysAgo.toISOString().split('.')[0] + 'Z'
    const endISO = today.toISOString().split('.')[0] + 'Z'

    const url =
      `${API_BASE}/${startISO}--${endISO}:PT1D/` +
      `t_2m:C,precip_24h:mm/` +
      `${latitude},${longitude}/json`

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Historical climate fetch failed`)
    }

    const temps: number[] = []
    const precips: number[] = []

    return {
      avgTemperature: temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 15,
      totalPrecipitation: precips.reduce((a, b) => a + b, 0),
      extremeTemps: {
        min: temps.length > 0 ? Math.min(...temps) : 0,
        max: temps.length > 0 ? Math.max(...temps) : 30,
      },
    }
  } catch (error) {
    console.error('Historical climate error:', error)
    return {
      avgTemperature: 15,
      totalPrecipitation: 1100,
      extremeTemps: { min: 0, max: 30 },
    }
  }
}

export const predictPrecipitation = async (
  latitude: number,
  longitude: number,
  days: number = 10
): Promise<number> => {
  try {
    const weatherData = await getMeteomaticsWeather(
      latitude,
      longitude,
      new Date(),
      new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    )

    return weatherData.reduce((sum, w) => sum + w.parameters.precipitation, 0)
  } catch (error) {
    console.error('Precipitation prediction error:', error)
    return 0
  }
}
