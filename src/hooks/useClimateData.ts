import { useCallback, useEffect, useMemo, useState } from 'react'
import { computeClimateSummary } from '../domain/climateIndicators'
import { describeClimateError, loadDailySeries, snapToClimateCell } from '../services/powerService'
import type { ClimateProgress, ClimateSummary, DailySeries } from '../types/climate'
import type { GeoPoint } from '../types/location'

export type ClimateState =
  | { status: 'loading'; progress: ClimateProgress }
  | { status: 'error'; message: string }
  | { status: 'ready'; cell: GeoPoint; series: DailySeries; summary: ClimateSummary }

interface Outcome {
  key: string
  series?: DailySeries
  message?: string
}

interface ProgressEntry {
  key: string
  progress: ClimateProgress
}

const EMPTY_PROGRESS: ClimateProgress = { done: 0, total: 0 }

export const useClimateData = (point: GeoPoint) => {
  const { lat, lon } = snapToClimateCell(point)
  const [attempt, setAttempt] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [progressEntry, setProgressEntry] = useState<ProgressEntry | null>(null)
  const key = `${lat}|${lon}|${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    loadDailySeries(
      { lat, lon },
      {
        signal: controller.signal,
        onProgress: (progress) => setProgressEntry({ key, progress }),
      },
    )
      .then((series) => {
        if (!controller.signal.aborted) setOutcome({ key, series })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setOutcome({ key, message: describeClimateError(error) })
      })
    return () => controller.abort()
  }, [lat, lon, key])

  const series = outcome?.key === key ? outcome.series : undefined
  const message = outcome?.key === key ? outcome.message : undefined
  const summary = useMemo(() => (series ? computeClimateSummary(series, lat) : null), [series, lat])

  const state: ClimateState = useMemo(() => {
    if (message) return { status: 'error', message }
    if (series && summary) {
      if (summary.annual.length === 0) {
        return { status: 'error', message: 'Not enough complete years of data for this location.' }
      }
      return { status: 'ready', cell: { lat, lon }, series, summary }
    }
    return {
      status: 'loading',
      progress: progressEntry?.key === key ? progressEntry.progress : EMPTY_PROGRESS,
    }
  }, [message, series, summary, lat, lon, progressEntry, key])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  return { state, retry }
}