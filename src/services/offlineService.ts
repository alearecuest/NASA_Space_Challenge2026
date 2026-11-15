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
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 'not yet'
    const at = new Date(JSON.parse(raw).lastSyncAt)
    const sameDay = at.toDateString() === new Date().toDateString()
    const time = at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return sameDay ? `today ${time}` : `${at.toLocaleDateString()} ${time}`
  } catch {
    return 'not yet'
  }
}
