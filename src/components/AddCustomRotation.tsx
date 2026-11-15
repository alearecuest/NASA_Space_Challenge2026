import { useState } from 'react'
import { CROP_PROFILES } from '../domain/cropDatabase'
import type { CropName } from '../types/rotation'

interface AddCustomRotationProps {
  onAdd: (name: string, crops: CropName[]) => void
  onCancel: () => void
}

export const AddCustomRotation = ({ onAdd, onCancel }: AddCustomRotationProps) => {
  const [name, setName] = useState('')
  const [year1, setYear1] = useState<CropName>('soya')
  const [year2, setYear2] = useState<CropName>('maize')
  const [year3, setYear3] = useState<CropName>('wheat')

  const cropOptions = Object.entries(CROP_PROFILES).map(([key, val]) => ({
    value: key as CropName,
    label: val.label,
  }))

  const handleAdd = () => {
    if (!name.trim()) {
      alert('Please enter a rotation name')
      return
    }
    onAdd(name.trim(), [year1, year2, year3])
    setName('')
  }

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'rgba(15, 42, 68, 0.75)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ color: '#A6E36B', marginTop: 0 }}>Add Custom Rotation</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: '#BFD3E6', marginBottom: '5px', fontSize: '0.9em' }}>
          Rotation Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My rotation"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0B1C2E',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            color: '#F4F6F1',
            fontSize: '1em',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        {['Year 1', 'Year 2', 'Year 3'].map((label, idx) => {
          const currentValue = [year1, year2, year3][idx] as CropName
          const setter = [setYear1, setYear2, setYear3][idx] as (v: CropName) => void

          return (
            <div key={label}>
              <label style={{ display: 'block', color: '#BFD3E6', marginBottom: '5px', fontSize: '0.85em' }}>
                {label}
              </label>
              <select
                value={currentValue}
                onChange={(e) => setter(e.target.value as CropName)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#0B1C2E',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#F4F6F1',
                  fontSize: '0.9em',
                }}
              >
                {cropOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleAdd}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#A6E36B',
            border: 'none',
            borderRadius: '8px',
            color: '#0F2A44',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Save Rotation
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            color: '#BFD3E6',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
