import type { ReactNode } from 'react'

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

// Line icons (24 grid, 2 px stroke) matching the FarmClimTech design system
const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
)

const ICONS: Record<string, ReactNode> = {
  map: icon(<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 10h18M3 15h18" /></>),
  rotations: icon(<><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v5h-5" /></>),
  crops: icon(<><path d="M12 21V10" /><path d="M12 13c-4 0-6-3-6-6 4 0 6 3 6 6Z" /><path d="M12 11c0-4 3-6 6-6 0 4-3 6-6 6Z" /></>),
  alerts: icon(<><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z" /><path d="M10 21h4" /></>),
  soil: icon(<><path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10Z" /></>),
  report: icon(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>),
}

export const Navigation = ({ tabs, activeTab, onTabChange }: NavigationProps) => (
  <>
    {/* Desktop / tablet: top bar */}
    <nav aria-label="Main" className="hidden gap-3 overflow-x-auto rounded-2xl border border-line bg-night/75 p-3 backdrop-blur md:flex">
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-12 items-center gap-2 whitespace-nowrap rounded-xl px-4 font-semibold transition ${
              active ? 'bg-lime text-night' : 'border border-line text-sky hover:border-lime hover:bg-lime/10'
            }`}
          >
            {ICONS[tab.id]}
            {tab.label}
          </button>
        )
      })}
    </nav>

    {/* Phone: bottom bar, as in the app design */}
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-[1100] flex justify-around border-t border-line bg-deep/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur md:hidden">
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-14 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold ${
              active ? 'text-lime' : 'text-sky'
            }`}
          >
            <span className={`rounded-full px-3 py-1 ${active ? 'bg-lime/15' : ''}`}>{ICONS[tab.id]}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  </>
)
