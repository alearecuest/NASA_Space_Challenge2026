import { colors, radius, shadows, spacing } from '../config/theme'

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'alert' | 'success'
  style?: React.CSSProperties
}

export const Card = ({ children, onClick, variant = 'default', style }: CardProps) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: colors.surface.darkTranslucent,
    border: `1px solid ${colors.ui.border}`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
    boxShadow: shadows.md,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    ...style,
  }

  if (variant === 'alert') {
    baseStyle.borderColor = colors.alert.ocre
    baseStyle.backgroundColor = `rgba(217, 164, 65, 0.1)`
  }

  if (variant === 'success') {
    baseStyle.borderColor = colors.accent.limeBright
    baseStyle.backgroundColor = `rgba(166, 227, 107, 0.1)`
  }

  return (
    <div
      style={baseStyle}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = shadows.lg
          ;(e.currentTarget as HTMLDivElement).style.borderColor = colors.accent.limeBright
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = shadows.md
          ;(e.currentTarget as HTMLDivElement).style.borderColor = colors.ui.border
        }
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
