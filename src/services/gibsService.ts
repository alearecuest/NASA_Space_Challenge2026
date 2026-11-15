import { GIBS_BASE_URL } from '../config/gibsLayers'
import type { GibsLayer, GibsTimeMode } from '../types/gibs'

const DAY_MS = 86_400_000

const LAG_DAYS: Record<GibsTimeMode, number> = {
	none: 0,
	daily: 0,
	eightDay: 16,
}

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10)

const parseIsoDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00Z`)

const snapToEightDayPeriod = (date: Date): Date => {
	const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1)
	const dayIndex = Math.floor((date.getTime() - yearStart) / DAY_MS)
	return new Date(yearStart + Math.floor(dayIndex / 8) * 8 * DAY_MS)
}

export const defaultGibsDate = (): string => toIsoDate(new Date(Date.now() - 2 * DAY_MS))

export const resolveGibsDate = (layer: GibsLayer, isoDate: string): string => {
	const shifted = new Date(parseIsoDate(isoDate).getTime() - LAG_DAYS[layer.timeMode] * DAY_MS)
	return layer.timeMode === 'eightDay' ? toIsoDate(snapToEightDayPeriod(shifted)) : toIsoDate(shifted)
}

export const buildGibsTileUrl = (layer: GibsLayer, isoDate: string): string => {
	const timeSegment = layer.timeMode === 'none' ? '' : `/${resolveGibsDate(layer, isoDate)}`
	return `${GIBS_BASE_URL}/${layer.id}/default${timeSegment}/${layer.matrixSet}/{z}/{y}/{x}.${layer.extension}`
}