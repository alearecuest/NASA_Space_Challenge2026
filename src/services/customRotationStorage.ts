import type { CropName } from '../types/rotation'

export interface CustomRotation {
  id: string
  name: string
  crops: CropName[]
  createdAt: string
}

const STORAGE_KEY = 'farmclimtech_custom_rotations'

export const getCustomRotations = (): CustomRotation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveCustomRotation = (name: string, crops: CropName[]): CustomRotation => {
  const rotations = getCustomRotations()
  const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newRotation: CustomRotation = {
    id,
    name,
    crops,
    createdAt: new Date().toISOString(),
  }
  rotations.push(newRotation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rotations))
  return newRotation
}

export const deleteCustomRotation = (id: string): void => {
  const rotations = getCustomRotations()
  const filtered = rotations.filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export const updateCustomRotation = (id: string, name: string, crops: CropName[]): void => {
  const rotations = getCustomRotations()
  const rotation = rotations.find((r) => r.id === id)
  if (rotation) {
    rotation.name = name
    rotation.crops = crops
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rotations))
  }
}
