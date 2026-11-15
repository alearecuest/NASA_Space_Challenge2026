import { useState } from 'react'

interface UserPreferencesProps {
  onSubmit?: (preferences: {
    water: number
    soil: number
    income: number
    resilience: number
  }) => void
}

export const UserPreferences = ({ onSubmit }: UserPreferencesProps) => {
  const [water, setWater] = useState(25)
  const [soil, setSoil] = useState(25)
  const [income, setIncome] = useState(25)
  const [resilience, setResilience] = useState(25)

  const handleSliderChange = (metric: string, value: number) => {
    if (metric === 'water') setWater(value)
    else if (metric === 'soil') setSoil(value)
    else if (metric === 'income') setIncome(value)
    else if (metric === 'resilience') setResilience(value)
  }

  const total = water + soil + income + resilience

  const handleSubmit = () => {
    onSubmit?.({
      water: water / total,
      soil: soil / total,
      income: income / total,
      resilience: resilience / total,
    })
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm ring-1 ring-line">
      <div>
        <h3 className="text-lg font-semibold text-ink">Your Priorities</h3>
        <p className="mt-1 text-sm text-sky">Adjust the importance of each factor for your farm.</p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink">Water Security</label>
            <span className="rounded-lg bg-navy px-3 py-1 text-sm font-semibold text-sky">
              {water}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={water}
            onChange={(e) => handleSliderChange('water', parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-blue-500"
          />
          <p className="mt-2 text-xs text-sky">Priority: minimize drought risk, ensure consistent moisture.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink">Soil Health</label>
            <span className="rounded-lg bg-field/20 px-3 py-1 text-sm font-semibold text-lime">
              {soil}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={soil}
            onChange={(e) => handleSliderChange('soil', parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-green-500"
          />
          <p className="mt-2 text-xs text-sky">Priority: protect structure, minimize erosion, build organic matter.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink">Income</label>
            <span className="rounded-lg bg-ocre/10 px-3 py-1 text-sm font-semibold text-ocre">
              {income}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={income}
            onChange={(e) => handleSliderChange('income', parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-amber-500"
          />
          <p className="mt-2 text-xs text-sky">Priority: maximize revenue and market access.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink">Climate Resilience</label>
            <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
              {resilience}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={resilience}
            onChange={(e) => handleSliderChange('resilience', parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-purple-500"
          />
          <p className="mt-2 text-xs text-sky">Priority: adapt to climate change and extreme events.</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-night p-4">
        <p className="text-sm font-semibold text-ink">Total Distribution</p>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex-1 rounded-full bg-sky" style={{ height: '8px', width: `${(water / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-lime" style={{ height: '8px', width: `${(soil / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-ocre" style={{ height: '8px', width: `${(income / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-purple-300" style={{ height: '8px', width: `${(resilience / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-sky">
          Total: {total}% {total === 100 ? '✓' : `(adjust to 100%)`}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={total !== 100}
        className="mt-6 w-full rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-card hover:bg-lime/90 disabled:bg-mute"
      >
        Apply Priorities
      </button>
    </div>
  )
}
