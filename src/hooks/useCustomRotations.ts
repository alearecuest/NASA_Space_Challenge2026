import { useEffect, useState } from 'react'
import type { CustomRotation } from '../services/customRotationStorage'
import {
  deleteCustomRotation,
  getCustomRotations,
  saveCustomRotation,
  updateCustomRotation,
} from '../services/customRotationStorage'
import type { CropName } from '../types/rotation'

export const useCustomRotations = () => {
  const [rotations, setRotations] = useState<CustomRotation[]>([])

  useEffect(() => {
    setRotations(getCustomRotations())
  }, [])

  const add = (name: string, crops: CropName[]): CustomRotation => {
    const newRotation = saveCustomRotation(name, crops)
    setRotations((prev) => [...prev, newRotation])
    return newRotation
  }

  const update = (id: string, name: string, crops: CropName[]): void => {
    updateCustomRotation(id, name, crops)
    setRotations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name, crops } : r))
    )
  }

  const remove = (id: string): void => {
    deleteCustomRotation(id)
    setRotations((prev) => prev.filter((r) => r.id !== id))
  }

  return { rotations, add, update, remove }
}
