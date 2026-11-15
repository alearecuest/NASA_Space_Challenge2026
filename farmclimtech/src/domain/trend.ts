import { median, normalCdf } from './statistics'

export interface TrendFit {
  slope: number
  intercept: number
  pValue: number
  samples: number
}

export const analyzeTrend = (xs: number[], ys: number[]): TrendFit | null => {
  const points = xs.map((x, index) => ({ x, y: ys[index] })).filter((point) => Number.isFinite(point.y))
  const n = points.length
  if (n < 3) return null

  let score = 0
  const slopes: number[] = []
  for (let i = 0; i < n - 1; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const delta = points[j].y - points[i].y
      score += Math.sign(delta)
      slopes.push(delta / (points[j].x - points[i].x))
    }
  }

  const ties = new Map<number, number>()
  points.forEach((point) => ties.set(point.y, (ties.get(point.y) ?? 0) + 1))
  let tieTerm = 0
  ties.forEach((count) => {
    tieTerm += count * (count - 1) * (2 * count + 5)
  })

  const variance = (n * (n - 1) * (2 * n + 5) - tieTerm) / 18
  const z = variance <= 0 || score === 0 ? 0 : (score - Math.sign(score)) / Math.sqrt(variance)
  const slope = median(slopes)

  return {
    slope,
    intercept: median(points.map((point) => point.y - slope * point.x)),
    pValue: 2 * (1 - normalCdf(Math.abs(z))),
    samples: n,
  }
}