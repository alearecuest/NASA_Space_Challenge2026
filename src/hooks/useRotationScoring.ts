import { useMemo } from 'react'
import type { ClimateSummary } from '../types/climate'
import type { RotationScore, RotationId } from '../types/rotation'
import { scoreAllRotations, rankRotations, scoreRotation } from '../domain/rotationScoring'
import { assessAllCrops } from '../domain/cropSuitability'

interface RotationScoringState {
  scores: RotationScore[]
  ranked: RotationScore[]
  isLoading: boolean
}

interface CropSuitabilityState {
  crops: ReturnType<typeof assessAllCrops>
  isLoading: boolean
}

export const useRotationScoring = (summary: ClimateSummary | null): RotationScoringState => {
  return useMemo(() => {
    if (!summary) {
      return { scores: [], ranked: [], isLoading: true }
    }

    const scores = scoreAllRotations(summary)
    const ranked = rankRotations(scores)

    return { scores, ranked, isLoading: false }
  }, [summary])
}

export const useRotationScore = (
  summary: ClimateSummary | null,
  rotationId: RotationId,
): RotationScore | null => {
  return useMemo(() => {
    if (!summary) return null
    try {
      return scoreRotation(rotationId, summary)
    } catch {
      return null
    }
  }, [summary, rotationId])
}

export const useCropSuitability = (summary: ClimateSummary | null): CropSuitabilityState => {
  return useMemo(() => {
    if (!summary) {
      return { crops: [], isLoading: true }
    }

    const crops = assessAllCrops(summary)

    return { crops, isLoading: false }
  }, [summary])
}
