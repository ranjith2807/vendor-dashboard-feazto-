import React from 'react'
import FeaztoMascot from './FeaztoMascot'

// Rounded icon set — SVG paths drawn to match a single consistent style
const icons: Array<{ name: string; path: React.ReactNode }> = [
  { name: 'Home', path: <><path d="M4 10L12 3L20 10V20H15V14H9V20H4V10Z" stroke="#000" strokeWidth="2" strokeLinejoin="round" fill="none" /><rect x="9" y="14" width="6" height="6" rx="1" stroke="#000" strokeWidth="2" fill="none" /></> },
  { name: 'Orders', path: <><rect x="3" y="3" width="18" height="18" rx="3" stroke="#000" strokeWidth="2" fill="none" /><line x1="7" y1="8" x2="17" y2="8" stroke="#000" strokeWidth="2" strokeLinecap="round" /><line x1="7" y1="12" x2="17" y2="12" stroke="#000" strokeWidth="2" strokeLinecap="round" /><line x1="7" y1="16" x2="13" y2="16" stroke="#000" strokeWidth="2" strokeLinecap="round" /></> },
  { name: 'Menu', path: <><circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="2" fill="none" /><path d="M8 12Q10 9 12 12Q14 15 16 12" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /><line x1="12" y1="3" x2="12" y2="6" stroke="#000" strokeWidth="2" strokeLinecap="round" /></> },
  { name: 'Search', path: <><circle cx="11" cy="11" r="7" stroke="#000" strokeWidth="2" fill="none" /><line x1="16" y1="16" x2="20" y2="20" stroke="#000" strokeWidth="2.5" strokeLinecap="round" /></> },
  { name: 'Bell', path: <><path d="M12 3C8.7 3 6 5.7 6 9V16H18V9C18 5.7 15.3 3 12 3Z" stroke="#000" strokeWidth="2" fill="none" /><line x1="6" y1="16" x2="18" y2="16" stroke="#000" strokeWidth="2" strokeLinecap="round" /><path d="M10 19Q12 21 14 19" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /></> },
  { name: 'Wallet', path: <><rect x="2" y="6" width="20" height="14" rx="3" stroke="#000" strokeWidth="2" fill="none" /><circle cx="17" cy="13" r="2" stroke="#000" strokeWidth="1.5" fill="none" /><line x1="2" y1="10" x2="22" y2="10" stroke="#000" strokeWidth="2" /></> },
  { name: 'Star', path: <><path d="M12 2L14.9 9H22L16.4 13.5L18.5 21L12 17L5.5 21L7.6 13.5L2 9H9.1L12 2Z" stroke="#000" strokeWidth="2" fill="none" strokeLinejoin="round" /></> },
  { name: 'Location', path: <><path d="M12 2C8.1 2 5 5.1 5 9C5 14.2 12 22 12 22S19 14.2 19 9C19 5.1 15.9 2 12 2Z" stroke="#000" strokeWidth="2" fill="none" /><circle cx="12" cy="9" r="2.5" stroke="#000" strokeWidth="1.5" fill="none" /></> },
  { name: 'Chart', path: <><rect x="3" y="12" width="4" height="9" rx="1" stroke="#000" strokeWidth="2" fill="none" /><rect x="10" y="7" width="4" height="14" rx="1" stroke="#000" strokeWidth="2" fill="none" /><rect x="17" y="3" width="4" height="18" rx="1" stroke="#000" strokeWidth="2" fill="none" /></> },
  { name: 'Community', path: <><circle cx="9" cy="8" r="3" stroke="#000" strokeWidth="2" fill="none" /><circle cx="17" cy="7" r="2.5" stroke="#000" strokeWidth="2" fill="none" /><path d="M3 20C3 17.2 5.7 15 9 15S15 17.2 15 20" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M17 13.5C19.2 14.2 21 16.3 21 20" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /></> },
  { name: 'FEZU', path: <><circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="2" fill="#FFC50A" /><path d="M8 10L10 8H16V14L12 18L8 14V10Z" stroke="#000" strokeWidth="1.5" fill="none" /></> },
  { name: 'AI', path: <><circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="2" fill="none" /><path d="M8 12Q10 8 12 12Q14 16 16 12" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /><circle cx="12" cy="12" r="1.5" fill="#000" /></> },
  { name: 'Settings', path: <><circle cx="12" cy="12" r="3" stroke="#000" strokeWidth="2" fill="none" /><path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.2 4.2L6.3 6.3M17.7 17.7L19.8 19.8M19.8 4.2L17.7 6.3M6.3 17.7L4.2 19.8" stroke="#000" strokeWidth="2" strokeLinecap="round" /></> },
  { name: 'Profile', path: <><circle cx="12" cy="8" r="4" stroke="#000" strokeWidth="2" fill="none" /><path d="M4 20C4 16.7 7.6 14 12 14S20 16.7 20 20" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /></> },
  { name: 'Cart', path: <><path d="M2 3H4.5L7 16H18L20 7H5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><circle cx="9" cy="20" r="1.5" stroke="#000" strokeWidth="2" fill="none" /><circle cx="17" cy="20" r="1.5" stroke="#000" strokeWidth="2" fill="none" /></> },
  { name: 'Help', path: <><circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="2" fill="none" /><path d="M9.5 9C9.5 7.6 10.6 6.5 12 6.5S14.5 7.6 14.5 9C14.5 10.5 12 12 12 13.5" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" /><circle cx="12" cy="16.5" r="1" fill="#000" /></> },
]

export default function IconsSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Icon System
      </div>

      {/* Style specs */}
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '12px 14px', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Style Spec</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[{ k: 'Stroke', v: '2px' }, { k: 'Linecap', v: 'Round' }, { k: 'Linejoin', v: 'Round' }, { k: 'Grid', v: '24×24' }, { k: 'Min size', v: '20px' }].map(s => (
            <div key={s.k} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.k}</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Icon grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {icons.map(icon => (
          <div key={icon.name} style={{ border: 'none', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '3px 3px 0px #000', padding: '10px 6px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {icon.path}
            </svg>
            <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.5, textAlign: 'center' }}>{icon.name}</div>
          </div>
        ))}
      </div>

      {/* Icon size variants */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Size Variants</div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
        {[16, 20, 24, 32, 40].map(s => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#000" strokeWidth="2" />
              <line x1="16" y1="16" x2="20" y2="20" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.45 }}>{s}px</div>
          </div>
        ))}
      </div>

      {/* FEZU brand cameo */}
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#FFF8E7', boxShadow: '4px 4px 0px #FFC50A', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
        <FeaztoMascot size={56} />
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px' }}>Rounded Icons Only</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.65, lineHeight: 1.4 }}>All icons use consistent 2px stroke, round caps, 24px grid.</div>
        </div>
      </div>
    </div>
  )
}
