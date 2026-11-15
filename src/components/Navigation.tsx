import { colors, radius, spacing } from '../config/theme'

export interface NavTab {
  id: string
  label: string
  icon?: string
}

interface NavigationProps {
  tabs: NavTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const Navigation = ({ tabs, activeTab, onTabChange }: NavigationProps) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.md,
        backgroundColor: colors.surface.darkTranslucent,
        padding: spacing.lg,
        borderRadius: radius.lg,
        border: `1px solid ${colors.ui.border}`,
        overflowX: 'auto',
        backdropFilter: 'blur(10px)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: activeTab === tab.id ? colors.accent.limeBright : 'transparent',
            color: activeTab === tab.id ? colors.primary.darkestNight : colors.text.secondary,
            border: activeTab === tab.id ? 'none' : `1px solid ${colors.ui.border}`,
            borderRadius: radius.md,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = `rgba(166, 227, 107, 0.1)`
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = colors.accent.limeBright
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = colors.ui.border
            }
          }}
        >
          {tab.icon && <span style={{ marginRight: spacing.sm }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
