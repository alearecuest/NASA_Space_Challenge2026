import type { ClimateSummary } from '../types/climate'
import type { RotationScore } from '../types/rotation'
import type { SoilProperties } from './soilGridsService'

export interface FarmReport {
  timestamp: string
  location: {
    name: string
    latitude: number
    longitude: number
  }
  climate: {
    annualRain: number
    meanTemp: number
    frostDaysYear: number
    heatDaysYear: number
  }
  soil: {
    texture: string
    organicMatter: number
    pH: number
    suitabilityScore: number
  }
  currentRotation: {
    crops: string[]
    score: RotationScore
  }
  topRecommendations: RotationScore[]
  keyRisks: string[]
  nextActions: string[]
  dataQuality: {
    climateDataYears: number
    sourcesSatellite: string[]
    sourcesGround: string[]
    uncertainties: string[]
  }
}

export const generateFarmReport = (
  locationName: string,
  latitude: number,
  longitude: number,
  climateSummary: ClimateSummary | null,
  soilData: SoilProperties | null,
  currentRotationScore: RotationScore | null,
  topRotations: RotationScore[],
): FarmReport | null => {
  if (!climateSummary || !currentRotationScore) return null

  const climateData = climateSummary.annual[0]

  const keyRisks: string[] = []
  if ((climateData?.frostDays ?? 0) > 30) keyRisks.push('Frost risk: >30 days/year in sensitive periods')
  if ((climateData?.heatDays ?? 0) > 60) keyRisks.push('Heat stress: frequent days above 32°C')
  if ((climateData?.rain ?? 0) < 500) keyRisks.push('Low rainfall: <500mm/year')
  if ((climateData?.extremeRainDays ?? 0) > 15) keyRisks.push('Erosion risk: frequent intense rainfall events')

  const nextActions: string[] = [
    'Verify current rotation efficiency with local agronomist.',
    'Assess water availability for irrigation.',
    'Plan soil conservation measures if erosion risk detected.',
    'Monitor long-term climate trends.',
  ]

  if (topRotations.length > 0 && topRotations[0].overall > currentRotationScore.overall + 5) {
    nextActions.unshift('Consider transitioning to recommended rotation strategy.')
  }

  return {
    timestamp: new Date().toISOString(),
    location: {
      name: locationName,
      latitude,
      longitude,
    },
    climate: {
      annualRain: climateData?.rain ?? 0,
      meanTemp: climateData?.meanTemp ?? 0,
      frostDaysYear: climateData?.frostDays ?? 0,
      heatDaysYear: climateData?.heatDays ?? 0,
    },
    soil: {
      texture: soilData?.texture ?? 'Unknown',
      organicMatter: soilData
        ? (soilData.depth_0_5cm.organic_carbon + soilData.depth_5_15cm.organic_carbon) / 2
        : 0,
      pH: soilData ? (soilData.depth_0_5cm.phWater + soilData.depth_5_15cm.phWater) / 2 : 0,
      suitabilityScore: 0,
    },
    currentRotation: {
      crops: currentRotationScore.rotationId === 'R0' ? ['Soya', 'Soya', 'Soya'] : [],
      score: currentRotationScore,
    },
    topRecommendations: topRotations.slice(0, 3),
    keyRisks,
    nextActions,
    dataQuality: {
      climateDataYears: climateSummary.annual.length,
      sourcesSatellite: ['NASA POWER', 'MODIS NDVI', 'GPM IMERG', 'SMAP'],
      sourcesGround: ['Local agronomist validation', 'Farm records'],
      uncertainties: [
        'Local soil maps not available; SoilGrids approximation used',
        'Climate model resolution ~50km; local microclimates may vary',
        'Crop prices and market access vary by region',
      ],
    },
  }
}

export const downloadReportAsJSON = (report: FarmReport): void => {
  const dataStr = JSON.stringify(report, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `farm-report-${report.location.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export const downloadReportAsCSV = (report: FarmReport): void => {
  const rows: string[] = [
    ['FarmClimTech Report'],
    ['Generated', report.timestamp],
    ['Location', report.location.name, `${report.location.latitude.toFixed(4)}°, ${report.location.longitude.toFixed(4)}°`],
    [],
    ['Climate Metrics'],
    ['Annual Rainfall (mm)', String(report.climate.annualRain)],
    ['Mean Temperature (°C)', String(report.climate.meanTemp.toFixed(1))],
    ['Frost Days/Year', String(report.climate.frostDaysYear)],
    ['Heat Stress Days/Year', String(report.climate.heatDaysYear)],
    [],
    ['Soil Properties'],
    ['Texture', report.soil.texture],
    ['Organic Matter (%)', String(report.soil.organicMatter.toFixed(2))],
    ['Soil pH', String(report.soil.pH.toFixed(2))],
    [],
    ['Top Recommended Rotations'],
    ...report.topRecommendations.map((rot, idx) => [
      `#${idx + 1}`,
      rot.rotationId,
      String(rot.overall),
      String(rot.water),
      String(rot.soil),
      String(rot.income),
      String(rot.resilience),
    ]),
    [],
    ['Key Risks'],
    ...report.keyRisks.map((risk) => [risk]),
    [],
    ['Recommended Actions'],
    ...report.nextActions.map((action) => [action]),
  ]

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `farm-report-${report.location.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
