import type { CropSuitability } from '../domain/cropSuitability'

interface CropSuitabilityGridProps {
  crops: CropSuitability[]
  title?: string
  showRiskFactors?: boolean
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-50 border-emerald-300'
  if (score >= 60) return 'bg-amber-50 border-amber-300'
  if (score >= 40) return 'bg-orange-50 border-orange-300'
  return 'bg-red-50 border-red-300'
}

const getScoreBadgeColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700'
  if (score >= 60) return 'bg-amber-100 text-amber-700'
  if (score >= 40) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

export const CropSuitabilityGrid = ({
  crops,
  title = 'Crop Suitability Analysis',
  showRiskFactors = false,
}: CropSuitabilityGridProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">Based on local climate data and crop requirements.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {crops.map((crop) => (
          <div
            key={crop.crop}
            className={`rounded-lg border-2 p-4 transition-shadow hover:shadow-md ${getScoreColor(crop.score)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{crop.label}</h3>
                <p className={`mt-1 inline-block rounded px-2 py-1 text-xs font-semibold ${getScoreBadgeColor(crop.score)}`}>
                  {crop.score}
                </p>
              </div>
              <div className="text-right">
                {crop.suitable ? (
                  <div className="text-lg font-bold text-emerald-600">✓ Suitable</div>
                ) : (
                  <div className="text-lg font-bold text-red-600">✗ High Risk</div>
                )}
              </div>
            </div>

            {crop.reasons.length > 0 && (
              <div className="mt-3 space-y-1 text-xs text-slate-700">
                {crop.reasons.map((reason, idx) => (
                  <p key={idx} className="flex gap-2">
                    <span className="text-emerald-600">•</span>
                    <span>{reason}</span>
                  </p>
                ))}
              </div>
            )}

            {showRiskFactors && crop.riskFactors.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-slate-300 pt-2 text-xs text-orange-700">
                {crop.riskFactors.map((risk, idx) => (
                  <p key={idx} className="flex gap-2">
                    <span>⚠</span>
                    <span>{risk}</span>
                  </p>
                ))}
              </div>
            )}

            {crop.optimalMonths.length > 0 && (
              <div className="mt-2 border-t border-slate-300 pt-2 text-xs text-slate-600">
                <p className="font-semibold">Optimal sowing: Month(s) {crop.optimalMonths.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">Illustrative Assessment</p>
        <p className="mt-1">Crop suitability scores are based on climate data. Local agronomist consultation recommended.</p>
      </div>
    </div>
  )
}
