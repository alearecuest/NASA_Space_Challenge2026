import { useState } from 'react'
import type { FormEvent } from 'react'
import { searchPlaces } from '../services/geocodingService'
import { formatPlaceLabel } from '../services/locationFormat'
import type { PlaceResult } from '../types/location'

interface LocationSearchProps {
  onSelect: (place: PlaceResult) => void
}

export const LocationSearch = ({ onSelect }: LocationSearchProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (query.trim().length < 2) return
    setLoading(true)
    setMessage(null)
    try {
      const places = await searchPlaces(query)
      setResults(places)
      if (places.length === 0) setMessage('No places found. Try another name.')
    } catch {
      setResults([])
      setMessage('Search failed. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (place: PlaceResult) => {
    onSelect(place)
    setResults([])
    setQuery('')
    setMessage(null)
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Search a place</h2>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kansas City, Luxembourg, Soriano..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
          {results.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50"
              >
                <span className="font-medium">{place.name}</span>
                <span className="block text-xs text-slate-500">{formatPlaceLabel(place)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-slate-500">Or click anywhere on the satellite map to pick a point.</p>
    </section>
  )
}