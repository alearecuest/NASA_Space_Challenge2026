import { colors, spacing, radius, shadows } from '../config/theme'

interface AlertCardProps {
  title: string
  message: string
  severity: 'warning' | 'critical' | 'info'
  timestamp: string
}

const getSeverityColor = (severity: 'warning' | 'critical' | 'info'): { bg: string; border: string; text: string } => {
  switch (severity) {
    case 'critical':
      return { bg: `${colors.alert.terracotta}15`, border: colors.alert.terracotta, text: colors.alert.terracotta }
    case 'warning':
      return { bg: `${colors.alert.ocre}15`, border: colors.alert.ocre, text: colors.alert.ocre }
    default:
      return { bg: `${colors.accent.limeBright}15`, border: colors.accent.limeBright, text: colors.accent.limeBright }
  }
}

export const AlertCard = ({ title, message, severity, timestamp }: AlertCardProps) => {
  const severityStyle = getSeverityColor(severity)

  return (
    <div
      style={{
        backgroundColor: severityStyle.bg,
        border: `1.5px solid ${severityStyle.border}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        boxShadow: shadows.md,
      }}
    >
      <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'flex-start' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: severityStyle.text,
            marginTop: '6px',
            animation: severity === 'critical' ? 'pulse 2s infinite' : 'none',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.warmWhite,
              margin: `0 0 ${spacing.sm}`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: colors.text.secondary,
              margin: `0 0 ${spacing.md}`,
              lineHeight: '1.5',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {message}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: colors.text.tertiary,
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {timestamp}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

interface AlertsScreenProps {
  alerts?: AlertCardProps[]
}

const DEFAULT_ALERTS: AlertCardProps[] = [
  {
    title: 'Dry spell likely in the next 10 days',
    message: 'Check soil moisture in the north plot — irrigation may be needed. Based on 7-day precipitation forecast.',
    severity: 'warning',
    timestamp: 'Today at 14:32',
  },
  {
    title: 'High temperature risk next month',
    message: 'Heat stress risk in January. Consider shade crops or irrigation timing. Relevant for soy and corn.',
    severity: 'warning',
    timestamp: '2 days ago',
  },
  {
    title: 'Soil moisture recovering',
    message: 'Recent rains have improved topsoil moisture. Good conditions for early planting.',
    severity: 'info',
    timestamp: '3 days ago',
  },
]

export const AlertsScreen = ({ alerts = DEFAULT_ALERTS }: AlertsScreenProps) => {
  return (
    <div style={{ padding: spacing.lg }}>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 800,
          color: colors.text.warmWhite,
          margin: `0 0 ${spacing.lg}`,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Alerts
      </h2>

      <p
        style={{
          fontSize: '13px',
          color: colors.text.secondary,
          margin: `0 0 ${spacing.xl}`,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Real-time notifications based on NASA data and 7-day forecasts.
      </p>

      {alerts.length > 0 ? (
        alerts.map((alert, idx) => <AlertCard key={idx} {...alert} />)
      ) : (
        <div
          style={{
            padding: spacing.xxl,
            textAlign: 'center',
            backgroundColor: colors.surface.dark,
            borderRadius: radius.lg,
            border: `1px solid ${colors.ui.border}`,
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: colors.text.tertiary,
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            No active alerts. Your field is in good condition.
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: spacing.xxl,
          padding: spacing.md,
          backgroundColor: 'rgba(166,227,107,0.05)',
          border: `1px solid ${colors.accent.limeBright}33`,
          borderRadius: radius.md,
          fontSize: '11px',
          color: colors.text.tertiary,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Alerts refresh every 6 hours. Enable push notifications in Settings to stay updated.
      </div>
    </div>
  )
}
