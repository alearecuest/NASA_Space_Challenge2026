import { colors, radius, spacing } from '../config/theme'
import { Badge } from './Badge'
import type { CONEATZone } from '../services/coneatService'

interface CONEATInfoProps {
  zone: CONEATZone
  location: string
}

export const CONEATInfo = ({ zone, location }: CONEATInfoProps) => {
  return (
    <div
      style={{
        backgroundColor: colors.surface.darkTranslucent,
        border: `2px solid ${colors.accent.limeBright}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ marginBottom: spacing.lg }}>
        <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.sm }}>CONEAT CLASSIFICATION</p>
        <h3 style={{ color: colors.accent.limeBright, fontSize: '1.2em', marginTop: 0, marginBottom: spacing.md }}>
          {zone.name}
        </h3>
        <p style={{ color: colors.text.secondary, fontSize: '0.9em', marginTop: 0 }}>
          Location: <strong>{location}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.xs }}>CLIMATE</p>
          <p style={{ color: colors.text.warmWhite, margin: 0, fontSize: '0.95em' }}>{zone.characteristics.climate}</p>
        </div>

        <div>
          <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.xs }}>SOIL TYPE</p>
          <p style={{ color: colors.text.warmWhite, margin: 0, fontSize: '0.95em' }}>{zone.characteristics.dominant_soil_type}</p>
        </div>

        <div>
          <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.xs }}>DRAINAGE & SLOPE</p>
          <p style={{ color: colors.text.warmWhite, margin: 0, fontSize: '0.95em' }}>
            {zone.characteristics.drainage} · {zone.characteristics.slope}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          <div>
            <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.sm }}>FROST RISK</p>
            <Badge
              variant={
                zone.characteristics.frost_risk === 'low'
                  ? 'success'
                  : zone.characteristics.frost_risk === 'medium'
                    ? 'warning'
                    : 'danger'
              }
              size="sm"
            >
              {zone.characteristics.frost_risk.toUpperCase()}
            </Badge>
          </div>

          <div>
            <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.sm }}>DROUGHT RISK</p>
            <Badge
              variant={
                zone.characteristics.drought_risk === 'low'
                  ? 'success'
                  : zone.characteristics.drought_risk === 'medium'
                    ? 'warning'
                    : 'danger'
              }
              size="sm"
            >
              {zone.characteristics.drought_risk.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <p style={{ color: colors.text.tertiary, fontSize: '0.85em', marginBottom: spacing.sm }}>TRADITIONALLY SUITABLE CROPS</p>
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          {zone.suitable_crops.map((crop) => (
            <Badge key={crop} variant="info" size="sm">
              {crop}
            </Badge>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: spacing.lg,
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.ui.border}`,
          fontSize: '0.8em',
          color: colors.text.tertiary,
        }}
      >
        <p style={{ margin: 0 }}>Data source: CONEAT Classification (MGAP - Ministerio de Ganadería, Agricultura y Pesca)</p>
        <p style={{ margin: 0, marginTop: spacing.xs }}>Complemented with NASA POWER climate data for current conditions</p>
      </div>
    </div>
  )
}
