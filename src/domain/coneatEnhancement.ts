import { CROP_PROFILES } from './cropDatabase'
import { getCONEATZoneByDepartment } from '../services/coneatService'
import type { RotationScore, CropName } from '../types/rotation'

export const enhanceRotationWithCONEAT = (
  rotation: RotationScore,
  departmentName: string,
): RotationScore & { coneatAlignment: number; coneatNotes: string[] } => {
  const zone = getCONEATZoneByDepartment(departmentName)

  if (!zone) {
    return {
      ...rotation,
      coneatAlignment: 0,
      coneatNotes: ['CONEAT data not available for this location'],
    }
  }

  const crops = rotation.evidenceLinks
    .filter((link) => link.metric === 'Crop 1' || link.metric === 'Crop 2' || link.metric === 'Crop 3')
    .map((link) => link.value) as CropName[]

  let alignmentScore = 0
  const notes: string[] = []

  zone.suitable_crops.forEach((suitableCrop) => {
    const rotationCropProfiles = crops
      .map((cropName) => CROP_PROFILES[cropName as CropName])
      .filter((profile) => profile && profile.label.toLowerCase().includes(suitableCrop.toLowerCase()))

    if (rotationCropProfiles.length > 0) {
      alignmentScore += 20
      notes.push(`✓ "${suitableCrop}" is traditionally suitable for ${zone.name}`)
    }
  })

  alignmentScore = Math.min(100, alignmentScore)

  if (zone.characteristics.frost_risk === 'high') {
    notes.push(`⚠️ High frost risk in ${zone.name} - verify frost tolerance of crops`)
  }
  if (zone.characteristics.drought_risk === 'high') {
    notes.push(`⚠️ Drought risk in ${zone.name} - ensure adequate water management`)
  }

  notes.push(`Data source: CONEAT Classification (MGAP Uruguay)`)

  return {
    ...rotation,
    coneatAlignment: alignmentScore,
    coneatNotes: notes,
  }
}
