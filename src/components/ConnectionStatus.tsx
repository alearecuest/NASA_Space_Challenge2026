import { useEffect, useState } from 'react'
import { getLastSyncTime } from '../services/offlineService'

// Offline-first status, as in the app design: "Offline · showing data saved today 06:40"
export const ConnectionStatus = () => {
  const [online, setOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(getLastSyncTime())

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine)
      setLastSync(getLastSyncTime())
    }
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    const t = window.setInterval(update, 30_000)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      window.clearInterval(t)
    }
  }, [])

  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
        online ? 'border-line bg-deep/60 text-sky' : 'border-ocre bg-ocre/10 text-ocre'
      }`}
    >
      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${online ? 'bg-lime' : 'bg-ocre'}`} />
      {online ? `Online · data saved ${lastSync}` : `Offline · showing data saved ${lastSync}`}
    </div>
  )
}
