import type { FieldData } from '../types/field'
import type { RotationScore } from '../types/rotation'

export interface OfflineData {
  fieldData: FieldData | null
  rotations: RotationScore[]
  lastSyncAt: string
  syncStatus: 'synced' | 'pending' | 'error'
}

const STORAGE_KEY = 'farmclimtech_offline_data'

export const getOfflineData = (): OfflineData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : {
          fieldData: null,
          rotations: [],
          lastSyncAt: new Date().toISOString(),
          syncStatus: 'synced',
        }
  } catch {
    return {
      fieldData: null,
      rotations: [],
      lastSyncAt: new Date().toISOString(),
      syncStatus: 'error',
    }
  }
}

export const saveOfflineData = (data: OfflineData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save offline data:', error)
  }
}

export const isOnline = (): boolean => {
  return navigator.onLine
}

export const useOfflineMode = (fieldData: FieldData | null, rotations: RotationScore[]): void => {
  const offlineData: OfflineData = {
    fieldData,
    rotations,
    lastSyncAt: new Date().toISOString(),
    syncStatus: 'synced',
  }
  saveOfflineData(offlineData)
}

export const getLastSyncTime = (): string => {
  const data = getOfflineData()
  return data.lastSyncAt ? new Date(data.lastSyncAt).toLocaleTimeString() : 'Never'
}
