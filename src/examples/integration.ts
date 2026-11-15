import type { FieldData } from '../types/field'
import type { RotationScore } from '../types/rotation'
import { analyzeFieldConditions, generateAlerts } from '../services/aiAnalysisService'
import { customRotationManager } from '../services/customRotationStorage'
import { getCONEATZoneByDepartment } from '../services/coneatService'
import { getMeteomaticsWeather, predictPrecipitation } from '../services/meteomaticsService'
import { downloadReportAsJSON, downloadReportAsCSV, generateFarmReport } from '../services/reportService'
import { useOfflineMode, getOfflineData, getLastSyncTime } from '../services/offlineService'

export const exampleIntegration = async () => {
  console.log('=== Farm Climetech Integration Examples ===')

  const userId = 'user_123'
  const fieldCoordinates = { lat: -33.5, lon: -55.5 }

  const fieldData: FieldData = {
    latitude: fieldCoordinates.lat,
    longitude: fieldCoordinates.lon,
    soilMoisture: 45,
    rainfall: 850,
    rainfallAvg: 1100,
    ndvi: 0.65,
    soilType: 'Clay loam',
    tempAvg: 18,
    location: 'Soriano, Uruguay',
  }

  console.log('\n1️⃣ AI ANALYSIS')
  console.log('Getting Gemini AI insights...')
  try {
    const analysis = await analyzeFieldConditions(fieldData)
    console.log('Analysis:', analysis)

    const alerts = await generateAlerts(fieldData)
    console.log('AI-Generated Alerts:', alerts)
  } catch (error) {
    console.log('AI service offline (demo mode)')
  }

  console.log('\n2️⃣ CUSTOM ROTATIONS')
  console.log('Adding custom rotation...')
  const customRotation = customRotationManager.addCustomRotation(
    userId,
    'My Soy-Wheat-Cover Crop',
    ['soya', 'wheat', 'clover'],
    'Tried and tested on my farm'
  )
  console.log('Created:', customRotation.name, 'Score:', customRotation.overall)

  const allRotations = customRotationManager.getAllRotations(userId)
  console.log('Total rotations available:', allRotations.length)

  console.log('\n3️⃣ CONEAT INTEGRATION')
  console.log('Getting local agronomy data...')
  const coneatZone = getCONEATZoneByDepartment('Soriano')
  if (coneatZone) {
    console.log('Zone:', coneatZone.name)
    console.log('Climate:', coneatZone.characteristics.climate)
    console.log('Drought Risk:', coneatZone.characteristics.drought_risk)
    console.log('Suitable crops:', coneatZone.suitable_crops.join(', '))
  }

  console.log('\n4️⃣ WEATHER FORECAST')
  console.log('Getting next 10 days weather...')
  try {
    const weather = await getMeteomaticsWeather(
      fieldData.latitude,
      fieldData.longitude,
      new Date(),
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    )
    console.log('Weather data points:', weather.length)

    const rainfall10 = await predictPrecipitation(fieldData.latitude, fieldData.longitude, 10)
    console.log('Predicted rainfall (10 days):', rainfall10 + 'mm')
  } catch (error) {
    console.log('Meteomatics service offline (demo mode)')
  }

  console.log('\n5️⃣ OFFLINE MODE')
  console.log('Saving to browser cache...')
  useOfflineMode(fieldData, [] as RotationScore[])
  console.log('Last sync:', getLastSyncTime())
  const offlineData = getOfflineData()
  console.log('Cached field location:', offlineData.fieldData?.location)

  console.log('\n✅ Integration complete!')
}
