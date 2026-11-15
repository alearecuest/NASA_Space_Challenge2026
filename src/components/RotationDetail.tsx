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
          <h2 className="text-2xl font-bold text-ink">{rotation.label}</h2>
          <p className="mt-1 text-sm text-sky">{rotation.useCase}</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink hover:bg-night"
          >
            Back
          </button>
        )}
      </div>

      <div className="rounded-lg bg-gradient-to-r from-lime/10 to-teal-50 p-4">
        <p className="text-sm font-semibold text-ink">Crop Sequence (Cycle)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {rotation.sequence.years.map((year, idx) => (
            <div key={idx} className="rounded-lg bg-card px-3 py-2 text-center shadow-sm">
              <div className="text-xs font-semibold text-sky">Year {year.year}</div>
              <div className="font-medium text-ink">{getCropLabel(year.crop)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-night p-4">
          <p className="text-sm font-semibold text-sky">Water Resilience</p>
          <p className="mt-2 text-2xl font-bold text-sky">{score.water}</p>
          <p className="mt-2 text-sm text-sky">{score.explanation.water}</p>
        </div>
        <div className="rounded-lg bg-field/20 p-4">
          <p className="text-sm font-semibold text-lime">Soil Health</p>
          <p className="mt-2 text-2xl font-bold text-lime">{score.soil}</p>
          <p className="mt-2 text-sm text-lime">{score.explanation.soil}</p>
        </div>
        <div className="rounded-lg bg-ocre/10 p-4">
          <p className="text-sm font-semibold text-ocre">Income Potential</p>
          <p className="mt-2 text-2xl font-bold text-ocre">{score.income}</p>
          <p className="mt-2 text-sm text-ocre">{score.explanation.income}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-900">Climate Resilience</p>
          <p className="mt-2 text-2xl font-bold text-purple-700">{score.resilience}</p>
          <p className="mt-2 text-sm text-purple-800">{score.explanation.resilience}</p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-card p-4">
        <p className="font-semibold text-ink">Evidence (Data Sources)</p>
        <ul className="mt-3 space-y-2">
          {score.evidenceLinks.map((link, idx) => (
            <li key={idx} className="text-sm text-ink">
              <span className="font-medium">{link.metric}:</span> {link.value}
              <span className="ml-1 text-xs text-sky">(Source: {link.source})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border-l-4 border-ocre bg-ocre/10 p-4">
        <p className="font-semibold text-ocre">Risks to Verify with Your Agronomist</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ocre">
          {score.risksToVerify.map((risk, idx) => (
            <li key={idx}>{risk}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border-l-4 border-line bg-night p-4">
        <p className="font-semibold text-ink">Data Gaps & Uncertainties</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink">
          {score.missingData.map((data, idx) => (
            <li key={idx}>{data}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-night p-4 text-center text-xs text-sky">
        <p className="font-semibold text-ink">Data: NASA POWER, MODIS, GPM, SMAP</p>
        <p className="mt-1">This tool supports decision-making but does not replace agronomic advice.</p>
      </div>
    </div>
  )
}
