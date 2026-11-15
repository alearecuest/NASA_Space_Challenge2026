export interface FieldData {
  latitude: number
  longitude: number
  soilMoisture: number
  rainfall: number
  rainfallAvg: number
  ndvi: number
  soilType: string
  tempAvg: number
  location?: string
}

export interface FieldCoordinates {
  lat: number
  lng: number
  name?: string
}
