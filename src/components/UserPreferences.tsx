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
    const remaining = 100 - value
    const otherMetrics = ['water', 'soil', 'income', 'resilience'].filter((m) => m !== metric)

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
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Your Priorities</h3>
        <p className="mt-1 text-sm text-slate-600">Adjust the importance of each factor for your farm.</p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Water Security</label>
            <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
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
          <p className="mt-2 text-xs text-slate-600">Priority: minimize drought risk, ensure consistent moisture.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Soil Health</label>
            <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
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
          <p className="mt-2 text-xs text-slate-600">Priority: protect structure, minimize erosion, build organic matter.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Income</label>
            <span className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
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
          <p className="mt-2 text-xs text-slate-600">Priority: maximize revenue and market access.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Climate Resilience</label>
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
          <p className="mt-2 text-xs text-slate-600">Priority: adapt to climate change and extreme events.</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Total Distribution</p>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex-1 rounded-full bg-blue-300" style={{ height: '8px', width: `${(water / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-green-300" style={{ height: '8px', width: `${(soil / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-amber-300" style={{ height: '8px', width: `${(income / total) * 100}%` }} />
          <div className="flex-1 rounded-full bg-purple-300" style={{ height: '8px', width: `${(resilience / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Total: {total}% {total === 100 ? '✓' : `(adjust to 100%)`}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={total !== 100}
        className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300"
      >
        Apply Priorities
      </button>
    </div>
  )
}
