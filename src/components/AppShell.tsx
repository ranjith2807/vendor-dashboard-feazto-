import type { ReactNode } from 'react'
import type { Screen, SetScreen } from '../App'

interface AppShellProps {
  screen: Screen
  setScreen: SetScreen
  showNav: boolean
  children: ReactNode
}

const NAV_TABS = [
  { id: 'nav_dashboard' as const, screen: 'dashboard' as Screen, icon: HomeIcon,      label: 'Home' },
  { id: 'nav_orders'    as const, screen: 'orders'    as Screen, icon: OrdersIcon,    label: 'Orders' },
  { id: 'nav_community' as const, screen: 'community' as Screen, icon: CommunityIcon, label: 'Community' },
  { id: 'nav_fezu'      as const, screen: 'fezu'      as Screen, icon: FezuIcon,      label: 'FEZU' },
  { id: 'nav_more'      as const, screen: 'settings'  as Screen, icon: MoreIcon,      label: 'More' },
] as const

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 10L12 3L20 10V20H15V14H9V20H4V10Z" stroke={active ? '#FFC50A' : '#888'} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}
function OrdersIcon({ active }: { active: boolean }) {
  const c = active ? '#FFC50A' : '#888'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="2.2" />
      <line x1="7" y1="8"  x2="17" y2="8"  stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="16" x2="12" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function CommunityIcon({ active }: { active: boolean }) {
  const c = active ? '#FFC50A' : '#888'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9"  cy="8" r="3"   stroke={c} strokeWidth="2.2" />
      <circle cx="17" cy="7" r="2.5" stroke={c} strokeWidth="2" />
      <path d="M3 20C3 17.2 5.7 15 9 15S15 17.2 15 20"   stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 13.5C19.2 14.2 21 16.3 21 20"         stroke={c} strokeWidth="2"   strokeLinecap="round" />
    </svg>
  )
}
function FezuIcon({ active }: { active: boolean }) {
  const c = active ? '#FFC50A' : '#888'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2.2" />
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
      <line x1="12" y1="3"  x2="12" y2="7"  stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="3"  y1="12" x2="7"  y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="12" x2="21" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function MoreIcon({ active }: { active: boolean }) {
  const c = active ? '#FFC50A' : '#888'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="5"  cy="12" r="1.8" fill={c} />
      <circle cx="12" cy="12" r="1.8" fill={c} />
      <circle cx="19" cy="12" r="1.8" fill={c} />
    </svg>
  )
}

const ACTIVE_SCREENS: Record<string, string> = {
  dashboard: 'nav_dashboard',
  orders: 'nav_orders', order_detail: 'nav_orders', order_qr: 'nav_orders',
  menu: 'nav_orders', menu_add_dish: 'nav_orders', menu_edit_dish: 'nav_orders',
  community: 'nav_community', community_post: 'nav_community', community_create: 'nav_community',
  fezu: 'nav_fezu', fezu_tracking: 'nav_fezu', fezu_riders: 'nav_fezu', fezu_rider_detail: 'nav_fezu',
  wallet: 'nav_more', analytics: 'nav_more', settings: 'nav_more', notifications: 'nav_more',
  search: 'nav_dashboard',
  settings_profile: 'nav_more', settings_kitchen: 'nav_more', settings_hours: 'nav_more',
  settings_security: 'nav_more', settings_documents: 'nav_more', settings_subscription: 'nav_more',
  reviews: 'nav_more', review_detail: 'nav_more',
  customer_subscriptions: 'nav_orders', customer_subscription_detail: 'nav_orders',
  feature_cards: 'nav_more',
}

export default function AppShell({ screen, setScreen, showNav, children }: AppShellProps) {
  const activeNav = ACTIVE_SCREENS[screen] ?? 'nav_dashboard'

  return (
    <div style={{ width: '375px', height: '812px', position: 'relative', backgroundColor: '#FFF8E7', borderRadius: '44px', border: 'none', boxShadow: '10px 10px 0px #000', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Status bar */}
      <div style={{ height: '44px', backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 50 }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>9:41</span>
        <div style={{ width: '120px', height: '32px', backgroundColor: '#000', borderRadius: '20px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '6px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="16" height="11" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#000"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#000"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#000"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#000"/></svg>
          <svg width="15" height="11" viewBox="0 0 16 12" fill="none"><path d="M8 10 L8 10" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/><path d="M5.5 7.5 Q8 5.5 10.5 7.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M3 5 Q8 1.5 13 5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
          <svg width="24" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#000" strokeWidth="1.2" fill="none"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="#000"/><path d="M22.5 4 L22.5 8" stroke="#000" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        {children}
      </div>

      {/* Bottom nav */}
      {showNav && (
        <div style={{ height: '78px', backgroundColor: '#fff', borderTop: 'none', display: 'flex', alignItems: 'flex-start', padding: '10px 8px 0', flexShrink: 0, zIndex: 50 }}>
          {NAV_TABS.map(tab => {
            const isActive = activeNav === tab.id
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setScreen(tab.screen)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: isActive ? '#FFF8E7' : 'transparent', border: isActive ? '2px solid #000' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '2px 2px 0px #000' : 'none', transition: 'all 0.15s' }}>
                  <Icon active={isActive} />
                </div>
                <span style={{ fontFamily: 'Inter', fontWeight: isActive ? 700 : 400, fontSize: '10px', color: isActive ? '#000' : '#888', letterSpacing: '0.02em' }}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Home indicator */}
      <div style={{ height: '28px', backgroundColor: showNav ? '#fff' : '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: '120px', height: '4px', backgroundColor: '#000', borderRadius: '2px', opacity: 0.25 }} />
      </div>
    </div>
  )
}
