import type { RotationScore } from '../types/rotation'
import { PREDEFINED_ROTATIONS } from '../domain/rotationDefinitions'
import { getCropLabel } from '../domain/cropDatabase'

interface RotationDetailProps {
  score: RotationScore
  onBack?: () => void
}

export const RotationDetail = ({ score, onBack }: RotationDetailProps) => {
  const rotation = PREDEFINED_ROTATIONS[score.rotationId]

  if (!rotation) return null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{rotation.label}</h2>
          <p className="mt-1 text-sm text-slate-600">{rotation.useCase}</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        )}
      </div>

      <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Crop Sequence (Cycle)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {rotation.sequence.years.map((year, idx) => (
            <div key={idx} className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Year {year.year}</div>
              <div className="font-medium text-slate-900">{getCropLabel(year.crop)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Water Resilience</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">{score.water}</p>
          <p className="mt-2 text-sm text-blue-800">{score.explanation.water}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">Soil Health</p>
          <p className="mt-2 text-2xl font-bold text-green-700">{score.soil}</p>
          <p className="mt-2 text-sm text-green-800">{score.explanation.soil}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Income Potential</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{score.income}</p>
          <p className="mt-2 text-sm text-amber-800">{score.explanation.income}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-900">Climate Resilience</p>
          <p className="mt-2 text-2xl font-bold text-purple-700">{score.resilience}</p>
          <p className="mt-2 text-sm text-purple-800">{score.explanation.resilience}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-900">Evidence (Data Sources)</p>
        <ul className="mt-3 space-y-2">
          {score.evidenceLinks.map((link, idx) => (
            <li key={idx} className="text-sm text-slate-700">
              <span className="font-medium">{link.metric}:</span> {link.value}
              <span className="ml-1 text-xs text-slate-500">(Source: {link.source})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border-l-4 border-orange-400 bg-orange-50 p-4">
        <p className="font-semibold text-orange-900">Risks to Verify with Your Agronomist</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-orange-800">
          {score.risksToVerify.map((risk, idx) => (
            <li key={idx}>{risk}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border-l-4 border-slate-300 bg-slate-50 p-4">
        <p className="font-semibold text-slate-900">Data Gaps & Uncertainties</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {score.missingData.map((data, idx) => (
            <li key={idx}>{data}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-slate-100 p-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">Data: NASA POWER, MODIS, GPM, SMAP</p>
        <p className="mt-1">This tool supports decision-making but does not replace agronomic advice.</p>
      </div>
    </div>
  )
}
