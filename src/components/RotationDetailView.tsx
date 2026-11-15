import { colors, spacing, radius } from '../config/theme'

interface RotationDetailViewProps {
  rotationName: string
  score: number
  reasons: string[]
  checklist: string[]
}

export const RotationDetailView = ({
  rotationName,
  score,
  reasons,
  checklist,
}: RotationDetailViewProps) => {
  return (
    <div style={{ padding: spacing.lg }}>
      <div style={{ marginBottom: spacing.xxl }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: colors.text.warmWhite,
            margin: `0 0 ${spacing.lg}`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          See why
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.surface.dark,
            borderRadius: radius.lg,
            border: `2px solid ${colors.accent.limeBright}`,
            marginBottom: spacing.xxl,
          }}
        >
          <div>
            <p
              style={{
                fontSize: '12px',
                color: colors.text.secondary,
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Recommended rotation
            </p>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: colors.accent.limeBright,
                margin: `${spacing.sm} 0 0`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {rotationName}
            </h3>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: colors.accent.limeBright,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {score}
            </div>
            <p
              style={{
                fontSize: '11px',
                color: colors.text.tertiary,
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Resilience
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: spacing.xxl }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: colors.accent.limeBright,
            margin: `0 0 ${spacing.lg}`,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Why this rotation
        </h3>

        <div style={{ display: 'grid', gap: spacing.lg }}>
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: spacing.lg,
                padding: spacing.lg,
                backgroundColor: colors.surface.dark,
                borderRadius: radius.md,
                border: `1px solid ${colors.ui.border}`,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent.limeBright,
                  color: colors.primary.darkestNight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {idx + 1}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: colors.text.secondary,
                  lineHeight: '1.5',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: colors.accent.limeBright,
            margin: `0 0 ${spacing.lg}`,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          What to check in your field
        </h3>

        <div
          style={{
            padding: spacing.lg,
            backgroundColor: colors.surface.dark,
            borderRadius: radius.md,
            border: `1px solid ${colors.ui.border}`,
          }}
        >
          {checklist.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: spacing.md,
                paddingBottom: spacing.lg,
                borderBottom: idx < checklist.length - 1 ? `1px solid ${colors.ui.border}` : 'none',
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: colors.accent.limeBright,
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <label
                style={{
                  fontSize: '13px',
                  color: colors.text.secondary,
                  cursor: 'pointer',
                  lineHeight: '1.5',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

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
        Data: NASA SMAP, GPM, MODIS, NASA POWER
      </div>
    </div>
  )
}
