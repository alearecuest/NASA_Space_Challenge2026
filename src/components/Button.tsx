import { colors, radius, shadows, spacing } from '../config/theme'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { padding: `${spacing.sm} ${spacing.md}`, fontSize: '0.875em' },
  md: { padding: `${spacing.md} ${spacing.lg}`, fontSize: '1em' },
  lg: { padding: `${spacing.lg} ${spacing.xl}`, fontSize: '1.1em' },
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'md',
}: ButtonProps) => {
  const sizeStyle = sizeMap[size]

  let bgColor = colors.accent.limeBright
  let textColor = colors.primary.darkestNight
  let hoverBg = '#8ed544'

  if (variant === 'secondary') {
    bgColor = 'transparent'
    textColor = colors.accent.limeBright
    hoverBg = `rgba(166, 227, 107, 0.1)`
  } else if (variant === 'danger') {
    bgColor = colors.alert.terracotta
    textColor = colors.text.warmWhite
    hoverBg = '#b03d1f'
  } else if (variant === 'ghost') {
    bgColor = 'transparent'
    textColor = colors.text.secondary
    hoverBg = `rgba(255, 255, 255, 0.1)`
  }

  const style: React.CSSProperties = {
    ...sizeStyle,
    backgroundColor: bgColor,
    color: textColor,
    border: variant === 'secondary' ? `2px solid ${colors.accent.limeBright}` : '1px solid transparent',
    borderRadius: radius.md,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.sm,
  }

  return (
    <button
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = hoverBg
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = shadows.md
          if (variant === 'secondary') {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#8ed544'
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = bgColor
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = shadows.sm
          if (variant === 'secondary') {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = colors.accent.limeBright
          }
        }
      }}
    >
      {children}
    </button>
  )
}
