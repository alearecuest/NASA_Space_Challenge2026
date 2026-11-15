export type GibsTimeMode = 'none' | 'daily' | 'eightDay'

export interface GibsLayer {
	id: string
	label: string
	description: string
	matrixSet: string
	maxNativeZoom: number
	extension: 'jpg' | 'jpeg' | 'png'
	timeMode: GibsTimeMode
}