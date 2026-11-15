import { colors, radius, spacing } from '../config/theme'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export const Badge = ({ children, variant = 'info', size = 'md' }: BadgeProps) => {
  const variantMap = {
    success: { bg: colors.accent.limeBright, text: colors.primary.darkestNight },
    warning: { bg: colors.alert.ocre, text: colors.primary.darkestNight },
    danger: { bg: colors.alert.terracotta, text: colors.text.warmWhite },
    info: { bg: colors.accent.fieldGreen, text: colors.text.warmWhite },
  }

  const sizeMap = {
    sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: '0.75em', fontWeight: 600 },
    md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: '0.875em', fontWeight: 600 },
  }

  const { bg, text } = variantMap[variant]
  const sizeStyle = sizeMap[size]

  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        borderRadius: radius.sm,
        display: 'inline-block',
        ...sizeStyle,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  )
}
