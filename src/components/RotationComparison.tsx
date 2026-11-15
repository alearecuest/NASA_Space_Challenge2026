import type { RotationScore } from '../types/rotation'

interface RotationComparisonProps {
  scores: RotationScore[]
  ranked: RotationScore[]
  onSelectRotation?: (rotationId: string) => void
}

const getColorByScore = (score: number): string => {
  if (score >= 80) return 'border-emerald-500 bg-emerald-50'
  if (score >= 65) return 'border-amber-400 bg-amber-50'
  if (score >= 50) return 'border-orange-400 bg-orange-50'
  return 'border-red-400 bg-red-50'
}

const getScoreLabelColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-700 bg-emerald-100'
  if (score >= 65) return 'text-amber-700 bg-amber-100'
  if (score >= 50) return 'text-orange-700 bg-orange-100'
  return 'text-red-700 bg-red-100'
}

export const RotationComparison = ({
  scores,
  ranked,
  onSelectRotation,
}: RotationComparisonProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Compare Rotation Strategies</h2>
        <p className="mt-1 text-sm text-slate-600">
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
                  <span className="text-2xl font-bold text-slate-900">#{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {score.rotationId === 'R0' && 'Continuous Soya'}
                      {score.rotationId === 'R1' && 'Cover Crop Intensive'}
                      {score.rotationId === 'R2' && 'Soya–Maize–Wheat'}
                      {score.rotationId === 'R3' && 'Agriculture–Pasture'}
                    </h3>
                    <p className="text-xs text-slate-600">
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
              <div className="rounded bg-white/60 p-2 text-center">
                <div className="font-semibold text-slate-900">{score.water}</div>
                <div className="text-slate-500">Water</div>
              </div>
              <div className="rounded bg-white/60 p-2 text-center">
                <div className="font-semibold text-slate-900">{score.soil}</div>
                <div className="text-slate-500">Soil</div>
              </div>
              <div className="rounded bg-white/60 p-2 text-center">
                <div className="font-semibold text-slate-900">{score.income}</div>
                <div className="text-slate-500">Income</div>
              </div>
              <div className="rounded bg-white/60 p-2 text-center">
                <div className="font-semibold text-slate-900">{score.resilience}</div>
                <div className="text-slate-500">Resilience</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold">Illustrative prototype</p>
        <p className="mt-1 text-xs text-slate-600">Scores are estimates based on NASA climate data and crop profiles. Always consult with a local agronomist before making decisions.</p>
      </div>
    </div>
  )
}
