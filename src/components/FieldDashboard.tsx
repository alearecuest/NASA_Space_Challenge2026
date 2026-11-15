import { colors, spacing, radius, shadows } from '../config/theme'

interface FieldDashboardProps {
  location: string
  soilMoisture?: number
  rainfall30d?: number
  rainfallAvg?: number
  vegetationHealth?: number
  lastUpdate?: string
}

const getSemaphoreColor = (value: number, thresholds: [number, number]): string => {
  if (value >= thresholds[1]) return colors.accent.fieldGreen
  if (value >= thresholds[0]) return colors.alert.ocre
  return colors.alert.terracotta
}

const getSemaphoreLabel = (value: number, thresholds: [number, number]): string => {
  if (value >= thresholds[1]) return 'Healthy'
  if (value >= thresholds[0]) return 'Caution'
  return 'Critical'
}

export const FieldDashboard = ({
  location,
  soilMoisture = 0.65,
  rainfall30d = 45,
  rainfallAvg = 38,
  vegetationHealth = 0.72,
  lastUpdate = new Date().toLocaleString(),
}: FieldDashboardProps) => {
  const soilMoistureThresholds: [number, number] = [0.45, 0.65]
  const rainfallThresholds: [number, number] = [25, 50]
  const vegetationThresholds: [number, number] = [0.5, 0.7]

  return (
    <div style={{ padding: spacing.lg }}>
      <div style={{ marginBottom: spacing.xxl }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: colors.text.warmWhite,
            margin: `0 0 ${spacing.md}`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          My field
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: colors.text.secondary,
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {location}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.lg, marginBottom: spacing.xxl }}>
        <div
          style={{
            backgroundColor: colors.surface.dark,
            border: `1px solid ${colors.ui.border}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: getSemaphoreColor(soilMoisture, soilMoistureThresholds),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: colors.primary.darkestNight,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {(soilMoisture * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.warmWhite,
                  margin: `0 0 ${spacing.sm}`,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Soil Moisture
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: colors.text.secondary,
                  margin: 0,
                  lineHeight: '1.4',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {getSemaphoreLabel(soilMoisture, soilMoistureThresholds)} — Current moisture level in topsoil (0–30 cm).
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.surface.dark,
            border: `1px solid ${colors.ui.border}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: getSemaphoreColor(rainfall30d, rainfallThresholds),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.primary.darkestNight,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {rainfall30d.toFixed(0)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: colors.primary.darkestNight,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                mm
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.warmWhite,
                  margin: `0 0 ${spacing.sm}`,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Rainfall (30 days)
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: colors.text.secondary,
                  margin: 0,
                  lineHeight: '1.4',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {rainfall30d > rainfallAvg
                  ? `Above average (${rainfallAvg.toFixed(0)}mm). Good water supply.`
                  : `Below average (${rainfallAvg.toFixed(0)}mm). Monitor irrigation.`}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.surface.dark,
            border: `1px solid ${colors.ui.border}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: getSemaphoreColor(vegetationHealth, vegetationThresholds),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: colors.primary.darkestNight,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {(vegetationHealth * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.warmWhite,
                  margin: `0 0 ${spacing.sm}`,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Vegetation Health (NDVI)
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: colors.text.secondary,
                  margin: 0,
                  lineHeight: '1.4',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {getSemaphoreLabel(vegetationHealth, vegetationThresholds)} — Biomass and photosynthetic activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: spacing.md,
          backgroundColor: 'rgba(166,227,107,0.05)',
          border: `1px solid ${colors.accent.limeBright}33`,
          borderRadius: radius.md,
          fontSize: '12px',
          color: colors.text.secondary,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontWeight: 600, color: colors.accent.limeBright }}>Last update:</span> {lastUpdate}
        <br />
        <span style={{ fontSize: '11px' }}>Illustrative prototype — values for demonstration only</span>
      </div>
    </div>
  )
}
