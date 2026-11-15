import type { RotationScore } from '../types/rotation'

interface RotationComparisonProps {
  ranked: RotationScore[]
  onSelectRotation?: (rotationId: string) => void
}

const getColorByScore = (score: number): string => {
  if (score >= 80) return 'border-lime bg-lime/10'
  if (score >= 65) return 'border-ocre bg-ocre/10'
  if (score >= 50) return 'border-ocre bg-ocre/10'
  return 'border-terra bg-terra/15'
}

const getScoreLabelColor = (score: number): string => {
  if (score >= 80) return 'text-lime bg-lime/10'
  if (score >= 65) return 'text-ocre bg-ocre/10'
  if (score >= 50) return 'text-ocre bg-ocre/10'
  return 'text-terra-text bg-terra/15'
}

export const RotationComparison = ({
  ranked,
  onSelectRotation,
}: RotationComparisonProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Compare Rotation Strategies</h2>
        <p className="mt-1 text-sm text-sky">
          Ranked by overall resilience score across water, soil, income, and climate adaptation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map((score, index) => (
          <button
            key={score.rotationId}
            onClick={() => onSelectRotation?.(score.rotationId)}
            className={`rounded-lg border-2 p-4 text-left transition-shadow hover:shadow-md ${getColorByScore(score.overall)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-ink">#{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-ink">
                      {score.rotationId === 'R0' && 'Continuous Soya'}
                      {score.rotationId === 'R1' && 'Cover Crop Intensive'}
                      {score.rotationId === 'R2' && 'Soya–Maize–Wheat'}
                      {score.rotationId === 'R3' && 'Agriculture–Pasture'}
                    </h3>
                    <p className="text-xs text-sky">
                      {score.rotationId === 'R0' && 'Current baseline'}
                      {score.rotationId === 'R1' && 'Minimize bare soil'}
                      {score.rotationId === 'R2' && 'Diversified crops'}
                      {score.rotationId === 'R3' && 'Highest resilience'}
                    </p>
                  </div>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${getScoreLabelColor(score.overall)}`}>
                {score.overall}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              <div className="rounded bg-card/60 p-2 text-center">
                <div className="font-semibold text-ink">{score.water}</div>
                <div className="text-sky">Water</div>
              </div>
              <div className="rounded bg-card/60 p-2 text-center">
                <div className="font-semibold text-ink">{score.soil}</div>
                <div className="text-sky">Soil</div>
              </div>
              <div className="rounded bg-card/60 p-2 text-center">
                <div className="font-semibold text-ink">{score.income}</div>
                <div className="text-sky">Income</div>
              </div>
              <div className="rounded bg-card/60 p-2 text-center">
                <div className="font-semibold text-ink">{score.resilience}</div>
                <div className="text-sky">Resilience</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-night p-4 text-sm text-ink">
        <p className="font-semibold">Illustrative prototype</p>
        <p className="mt-1 text-xs text-sky">Scores are estimates based on NASA climate data and crop profiles. Always consult with a local agronomist before making decisions.</p>
      </div>
    </div>
  )
}
