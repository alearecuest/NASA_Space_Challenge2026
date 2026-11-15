import { colors, spacing } from '../config/theme'

interface OnboardingScreenProps {
  onStart: () => void
}

export const OnboardingScreen = ({ onStart }: OnboardingScreenProps) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary.darkestNight} 0%, ${colors.primary.darkBlue} 50%, ${colors.primary.veryDark} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '320px' }}>
        <svg
          viewBox="0 0 200 200"
          style={{ width: '120px', height: '120px', margin: `0 auto ${spacing.xl}` }}
        >
          <defs>
            <radialGradient id="earthGradient" cx="35%" cy="35%">
              <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1E90FF', stopOpacity: 1 }} />
            </radialGradient>
          </defs>
          <circle cx="100" cy="120" r="50" fill="url(#earthGradient)" />
          <circle cx="100" cy="120" r="50" fill="url(#earthGradient)" />
          <path
            d="M 80 110 Q 100 100 120 110"
            fill="#2E8B57"
            opacity="0.7"
          />
          <path
            d="M 85 130 Q 100 125 115 130"
            fill="#FFD700"
            opacity="0.5"
          />
          <circle cx="100" cy="50" r="35" fill="#1a1a2e" opacity="0.9" />
          <circle cx="100" cy="50" r="33" fill="none" stroke="#D3D3D3" strokeWidth="1" />
        </svg>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: colors.text.warmWhite,
            margin: `${spacing.lg} 0`,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.5px',
          }}
        >
          Farm Clim Tech
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: colors.accent.limeBright,
            margin: `${spacing.md} 0 ${spacing.xxl}`,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          Eyes in the sky, in the farmer's hands
        </p>

        <p
          style={{
            fontSize: '14px',
            color: colors.text.secondary,
            margin: `0 0 ${spacing.xxl}`,
            lineHeight: '1.6',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Convert NASA satellite data into simple farming decisions. Know the climate risk in your field and choose the best crop rotation.
        </p>

        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: `${spacing.lg} ${spacing.xl}`,
            backgroundColor: colors.accent.limeBright,
            color: colors.primary.darkestNight,
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(166, 227, 107, 0.3)',
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLButtonElement
            target.style.transform = 'translateY(-2px)'
            target.style.boxShadow = '0 6px 20px rgba(166, 227, 107, 0.4)'
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLButtonElement
            target.style.transform = 'translateY(0)'
            target.style.boxShadow = '0 4px 16px rgba(166, 227, 107, 0.3)'
          }}
        >
          Pin your field
        </button>

        <p
          style={{
            fontSize: '12px',
            color: colors.text.tertiary,
            margin: `${spacing.xl} 0 0`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Data: NASA SMAP, GPM, MODIS, NASA POWER
        </p>
      </div>
    </div>
  )
}
