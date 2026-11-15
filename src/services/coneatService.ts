export interface CONEATZone {
  id: string
  name: string
  groups: number[]
  departments: string[]
  characteristics: {
    climate: string
    dominant_soil_type: string
    drainage: string
    slope: string
    frost_risk: 'low' | 'medium' | 'high'
    drought_risk: 'low' | 'medium' | 'high'
  }
  suitable_crops: string[]
}

export const CONEAT_ZONES: Record<string, CONEATZone> = {
  norte_oriental: {
    id: 'norte_oriental',
    name: 'North Eastern - Tacuarembó, Rivera, Cerro Largo',
    groups: [1, 2],
    departments: ['Tacuarembó', 'Rivera', 'Cerro Largo'],
    characteristics: {
      climate: 'Temperate with adequate rainfall (1200-1400mm)',
      dominant_soil_type: 'Basaltic soils, red clay loams',
      drainage: 'Well-drained',
      slope: 'Moderately undulating',
      frost_risk: 'high',
      drought_risk: 'low',
    },
    suitable_crops: ['wheat', 'barley', 'oats', 'clover', 'alfalfa'],
  },
  este: {
    id: 'este',
    name: 'East - Maldonado, Lavalleja',
    groups: [2, 3],
    departments: ['Maldonado', 'Lavalleja'],
    characteristics: {
      climate: 'Temperate-subtropical (1200-1500mm rainfall)',
      dominant_soil_type: 'Granite-derived, sandy loams',
      drainage: 'Moderate to well-drained',
      slope: 'Hilly terrain',
      frost_risk: 'medium',
      drought_risk: 'low',
    },
    suitable_crops: ['soya', 'maize', 'pasture', 'clover'],
  },
  litoral_norte: {
    id: 'litoral_norte',
    name: 'North Coast - Paysandú, Río Negro',
    groups: [3, 4],
    departments: ['Paysandú', 'Río Negro'],
    characteristics: {
      climate: 'Temperate (1000-1200mm rainfall)',
      dominant_soil_type: 'Volcanic origin, well-structured',
      drainage: 'Well-drained',
      slope: 'Gently rolling',
      frost_risk: 'medium',
      drought_risk: 'medium',
    },
    suitable_crops: ['soya', 'maize', 'wheat', 'alfalfa', 'pasture'],
  },
  litoral_oeste: {
    id: 'litoral_oeste',
    name: 'West Coast & Soriano - Soriano, Colonia',
    groups: [4, 5],
    departments: ['Soriano', 'Colonia'],
    characteristics: {
      climate: 'Temperate with seasonal variability (900-1100mm)',
      dominant_soil_type: 'Fine-textured alluvial soils',
      drainage: 'Moderate',
      slope: 'Flat to gently rolling',
      frost_risk: 'medium',
      drought_risk: 'medium',
    },
    suitable_crops: ['soya', 'wheat', 'maize', 'pasture', 'rye'],
  },
  sur_central: {
    id: 'sur_central',
    name: 'South Central - Florida, San José, Flores',
    groups: [5, 6],
    departments: ['Florida', 'San José', 'Flores'],
    characteristics: {
      climate: 'Temperate, drier than others (800-1000mm)',
      dominant_soil_type: 'Fine-textured, prairie soils',
      drainage: 'Moderate to poor',
      slope: 'Flat',
      frost_risk: 'low',
      drought_risk: 'high',
    },
    suitable_crops: ['wheat', 'pasture', 'oats', 'vetch'],
  },
  sur_este: {
    id: 'sur_este',
    name: 'South East - Canelones, Montevideo, Soriano',
    groups: [6, 7],
    departments: ['Canelones', 'Montevideo'],
    characteristics: {
      climate: 'Temperate-humid (1000-1100mm rainfall)',
      dominant_soil_type: 'Prairie soils, fine texture',
      drainage: 'Moderate',
      slope: 'Flat',
      frost_risk: 'low',
      drought_risk: 'medium',
    },
    suitable_crops: ['wheat', 'pasture', 'alfalfa', 'clover'],
  },
}

export const getCONEATZoneByDepartment = (departmentName: string): CONEATZone | null => {
  for (const zone of Object.values(CONEAT_ZONES)) {
    if (zone.departments.map((d) => d.toLowerCase()).includes(departmentName.toLowerCase())) {
      return zone
    }
  }
  return null
}

export const getCONEATZoneByCoordinates = (_lat: number, _lon: number): CONEATZone | null => {
  // TODO: Implement proper geospatial lookup when GeoJSON is available
  // For now, return general zone for testing
  return CONEAT_ZONES.litoral_oeste
}
