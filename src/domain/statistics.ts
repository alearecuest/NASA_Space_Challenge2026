export const mean = (values: number[]): number => {
  const finite = values.filter(Number.isFinite)
  if (finite.length === 0) return Number.NaN
  return finite.reduce((total, value) => total + value, 0) / finite.length
}

export const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)

export const median = (values: number[]): number => {
  if (values.length === 0) return Number.NaN
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

const erf = (x: number): number => {
  const sign = x < 0 ? -1 : 1
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const polynomial =
    (((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592
  return sign * (1 - polynomial * t * Math.exp(-x * x))
}

export const normalCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2))