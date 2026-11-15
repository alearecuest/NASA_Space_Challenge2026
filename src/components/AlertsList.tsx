interface Alert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  actionMonths: number[]
  dataSource: string
}

interface AlertsListProps {
  location: string
  latitude: number
  longitude: number
}

const generateAlerts = (): Alert[] => [
  {
    id: 'frost-risk-sep',
    severity: 'warning',
    title: 'Frost Risk in September',
    description:
      'Historical data shows increased frost risk in late August and early September. Verify sensitive crops or adjust planting calendar.',
    actionMonths: [8, 9],
    dataSource: 'NASA POWER',
  },
  {
    id: 'dry-spell-jan',
    severity: 'warning',
    title: 'Potential Dry Spell',
    description:
      'January shows reduced rainfall on average. Monitor soil moisture and consider supplementary irrigation if available.',
    actionMonths: [1],
    dataSource: 'GPM, SMAP',
  },
  {
    id: 'heat-stress-dec',
    severity: 'info',
    title: 'High Heat Days in December',
    description:
      'December typically experiences several days above 32°C. Select heat-tolerant varieties or adjust sowing dates.',
    actionMonths: [12],
    dataSource: 'NASA POWER',
  },
  {
    id: 'bare-soil-mar',
    severity: 'info',
    title: 'Bare Soil Period (March–April)',
    description:
      'March and April show potential bare soil exposure between seasons. Consider cover crops to minimize erosion.',
    actionMonths: [3, 4],
    dataSource: 'MODIS NDVI',
  },
]

const getSeverityColor = (severity: string): { bg: string; border: string; icon: string } => {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-terra/15', border: 'border-terra', icon: '🚨' }
    case 'warning':
      return { bg: 'bg-ocre/10', border: 'border-ocre', icon: '⚠️' }
    default:
      return { bg: 'bg-night', border: 'border-sky', icon: 'ℹ️' }
  }
}

export const AlertsList = ({ location, latitude, longitude }: AlertsListProps) => {
  const alerts = generateAlerts()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Alerts for Your Location</h2>
        <p className="mt-1 text-sm text-sky">
          {location} ({latitude.toFixed(2)}°, {longitude.toFixed(2)}°)
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const colors = getSeverityColor(alert.severity)
          return (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-4 ${colors.bg} ${colors.border}`}
            >
              <div className="flex gap-3">
                <span className="text-xl">{colors.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{alert.title}</h3>
                  <p className="mt-1 text-sm text-ink">{alert.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-sky">
                    <span>
                      Critical months: <span className="font-medium">{alert.actionMonths.join(', ')}</span>
                    </span>
                    <span>·</span>
                    <span>{alert.dataSource}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg bg-night p-4 text-center text-xs text-sky">
        <p className="font-semibold text-ink">Illustrative Alerts</p>
        <p className="mt-1">These are example alerts based on typical patterns. Verify with real-time data and local forecasts.</p>
      </div>
    </div>
  )
}
