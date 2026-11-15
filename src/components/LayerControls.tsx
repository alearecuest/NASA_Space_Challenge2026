import { GIBS_LAYERS } from '../config/gibsLayers'
import { defaultGibsDate } from '../services/gibsService'
import type { GibsLayer } from '../types/gibs'

interface LayerControlsProps {
  layer: GibsLayer
  date: string
  showLabels: boolean
  onLayerChange: (layerId: string) => void
  onDateChange: (date: string) => void
  onLabelsChange: (show: boolean) => void
}

export const LayerControls = ({
  layer,
  date,
  showLabels,
  onLayerChange,
  onDateChange,
  onLabelsChange,
}: LayerControlsProps) => (
  <section className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-line">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-sky">NASA map layers</h2>
    <div className="mt-2 space-y-2">
      {GIBS_LAYERS.map((option) => (
        <label key={option.id} className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="gibs-layer"
            checked={option.id === layer.id}
            onChange={() => onLayerChange(option.id)}
            className="mt-1 accent-lime"
          />
          <span>
            <span className="font-medium">{option.label}</span>
            <span className="block text-xs text-sky">{option.description}</span>
          </span>
        </label>
      ))}
    </div>
    {layer.timeMode !== 'none' && (
      <label className="mt-3 block text-sm">
        <span className="text-xs font-medium text-sky">Imagery date</span>
        <input
          type="date"
          value={date}
          max={defaultGibsDate()}
          onChange={(event) => event.target.value && onDateChange(event.target.value)}
          className="mt-1 block w-full rounded-lg border border-line px-3 py-1.5 text-sm"
        />
      </label>
    )}
    <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={showLabels}
        onChange={(event) => onLabelsChange(event.target.checked)}
        className="accent-lime"
      />
      Show place labels
    </label>
  </section>
)