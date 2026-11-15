import { useState, useEffect, useCallback } from 'react'
import { analyzeFieldConditions, predictCropSuitability, generateAlerts } from '../services/aiAnalysisService'
import { getOfflineData, useOfflineMode, isOnline, getLastSyncTime } from '../services/offlineService'
import { generateFarmReport } from '../services/reportService'
import type { FieldData } from '../types/field'
import type { RotationScore } from '../types/rotation'

interface UseAIAnalysisResult {
  analysis: any | null
  alerts: string[]
  suggestedRotations: RotationScore[]
  isLoading: boolean
  error: string | null
  isOnline: boolean
  lastSync: string
  generateReport: () => void
}

export const useAIAnalysis = (
  fieldData: FieldData | null,
  currentRotations: RotationScore[]
): UseAIAnalysisResult => {
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [alerts, setAlerts] = useState<string[]>([])
  const [suggestedRotations, setSuggestedRotations] = useState<RotationScore[]>(currentRotations)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNetworkOnline, setIsNetworkOnline] = useState(isOnline())
  const [lastSyncTime, setLastSyncTime] = useState(getLastSyncTime())

  const performAnalysis = useCallback(async () => {
    if (!fieldData) return

    setIsLoading(true)
    setError(null)

    try {
      const analysisResult = await analyzeFieldConditions(fieldData)
      setAnalysis(analysisResult)

      const alertsList = await generateAlerts(fieldData)
      setAlerts(alertsList)

      const optimizedRotations = await predictCropSuitability(currentRotations, fieldData)
      setSuggestedRotations(optimizedRotations)

      useOfflineMode(fieldData, optimizedRotations)
      setLastSyncTime(getLastSyncTime())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
      setError(errorMessage)

      const offlineData = getOfflineData()
      if (offlineData.fieldData) {
        setAnalysis({ summary: 'Using cached data (offline)' })
        setAlerts(['Offline mode: using last saved data'])
      }
    } finally {
      setIsLoading(false)
    }
  }, [fieldData, currentRotations])

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsNetworkOnline(isOnline())
    }

    window.addEventListener('online', handleOnlineStatusChange)
    window.addEventListener('offline', handleOnlineStatusChange)

    if (fieldData && isNetworkOnline) {
      performAnalysis()
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange)
      window.removeEventListener('offline', handleOnlineStatusChange)
    }
  }, [fieldData, isNetworkOnline, performAnalysis])

  const generateReport = useCallback(() => {
    if (!fieldData || !analysis) {
      setError('Insufficient data for report generation')
      return
    }

    const report = generateFarmReport(
      'Farm Location',
      fieldData.latitude,
      fieldData.longitude,
      null,
      null,
      suggestedRotations[0] || null,
      suggestedRotations.slice(1, 4)
    )

    if (report) {
      return report
    }
  }, [fieldData, analysis, suggestedRotations])

  return {
    analysis,
    alerts,
    suggestedRotations,
    isLoading,
    error,
    isOnline: isNetworkOnline,
    lastSync: lastSyncTime,
    generateReport,
  }
}
