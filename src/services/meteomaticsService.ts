// 10-day forecast through the Farm ClimeTech server proxy (/api/forecast).
// Meteomatics credentials live only on the server (METEOMATICS_USERNAME / METEOMATICS_PASSWORD).

export interface ForecastDay {
  date: string
  temp: number | null
  rain: number | null
}

export interface ForecastResult {
  demo: boolean
  days: ForecastDay[]
}

export const getForecast = async (latitude: number, longitude: number): Promise<ForecastResult> => {
  try {
    const r = await fetch(`/api/forecast?lat=${latitude.toFixed(3)}&lon=${longitude.toFixed(3)}`)
    return r.ok ? await r.json() : { demo: true, days: [] }
  } catch {
    return { demo: true, days: [] }
  }
}

export const getMeteomaticsWeather = async (latitude: number, longitude: number): Promise<ForecastDay[]> =>
  (await getForecast(latitude, longitude)).days

export const predictPrecipitation = async (latitude: number, longitude: number): Promise<number> =>
  (await getForecast(latitude, longitude)).days.reduce((sum, d) => sum + (d.rain ?? 0), 0)
