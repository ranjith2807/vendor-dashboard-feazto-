import { useState } from 'react'
import type { Screen } from '../App'
import { settingsSections } from '../data/mockData'
import fezuImg from '../imports/image.png'

const ITEM_NAV: Record<string, Screen> = {
  set_001: 'settings_profile',
  set_002: 'settings_profile',
  set_003: 'settings_security',
  set_004: 'settings_kitchen',
  set_005: 'settings_hours',
  set_006: 'settings_kitchen',
  set_007: 'settings_kitchen',
  set_008: 'settings_documents',
}

export default function SettingsScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    set_009: true, set_010: false, set_011: true, set_012: true,
  })

  const toggle = (id: string) => setToggles(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Profile header */}
      <div style={{ padding: '12px 20px 16px', backgroundColor: '#FFF8E7' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '14px' }}>Settings</div>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', flexShrink: 0 }}>
            PK
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px' }}>Priya's Kitchen</div>
            <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>+91 98765 43210 · Coimbatore</div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              <div style={{ backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '5px', padding: '1px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px' }}>VERIFIED</div>
              <div style={{ backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '5px', padding: '1px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px' }}>PREMIUM</div>
            </div>
          </div>
          <button style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', background: 'none', border: '2.5px solid #000', borderRadius: '9px', padding: '7px 12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>Edit</button>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ padding: '0 20px', display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {[
          { id: 'ql_analytics', icon: '📊', label: 'Analytics', screen: 'analytics' as Screen },
          { id: 'ql_wallet', icon: '💰', label: 'Wallet', screen: 'wallet' as Screen },
          { id: 'ql_notifs', icon: '🔔', label: 'Alerts', screen: 'notifications' as Screen },
        ].map(ql => (
          <button
            key={ql.id}
            onClick={() => setScreen(ql.screen)}
            style={{ flex: 1, backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ fontSize: '22px' }}>{ql.icon}</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px' }}>{ql.label}</span>
          </button>
        ))}
      </div>

      {/* Feature links */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: '8px' }}>
        <button onClick={() => setScreen('feature_cards')} style={{ flex: 1, backgroundColor: '#FFC50A', border: '2.5px solid #000', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px' }}>Feature Cards</span>
        </button>
        <button onClick={() => setScreen('settings_subscription')} style={{ flex: 1, backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px' }}>Subscription</span>
        </button>
        <button onClick={() => setScreen('reviews')} style={{ flex: 1, backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px' }}>Reviews</span>
        </button>
      </div>

      {/* Settings sections */}
      {settingsSections.map(section => (
        <div key={section.id} style={{ padding: '0 20px 12px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>
            {section.label}
          </div>
          <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', overflow: 'hidden' }}>
            {section.items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => ITEM_NAV[item.id] && setScreen(ITEM_NAV[item.id])}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', borderBottom: idx < section.items.length - 1 ? '2px solid rgba(0,0,0,0.06)' : 'none', cursor: ITEM_NAV[item.id] ? 'pointer' : 'default' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{item.label}</div>
                  {item.sub && <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{item.sub}</div>}
                </div>
                {'toggle' in item ? (
                  <button
                    onClick={() => toggle(item.id)}
                    style={{ width: '46px', height: '26px', borderRadius: '13px', backgroundColor: toggles[item.id] ? '#22C55E' : '#ddd', border: 'none', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0 }}
                  >
                    <span style={{ position: 'absolute', top: '2px', left: toggles[item.id] ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
                  </button>
                ) : (
                  <span style={{ fontFamily: 'Inter', fontSize: '16px', opacity: 0.3 }}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* FEZU mascot logout section */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ backgroundColor: '#FFF8E7', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px' }}>FEAZTO Vendor v2.0</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>Powered by FEZU · Coimbatore 🍽️</div>
          </div>
        </div>
        <button
          style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FF3B30', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000', marginBottom: '24px' }}
          onClick={() => setScreen('auth')}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
