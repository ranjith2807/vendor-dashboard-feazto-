import { useState } from 'react'

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1.5px dashed rgba(0,0,0,0.1)' }}
    >
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#000' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: on ? '#22C55E' : '#aaa' }}>
          {on ? 'ON' : 'OFF'}
        </span>
        <button
          role="switch"
          aria-checked={on}
          onClick={() => setOn(v => !v)}
          style={{
            width: '52px',
            height: '28px',
            borderRadius: '14px',
            backgroundColor: on ? '#22C55E' : '#ddd',
            border: 'none',
            boxShadow: '2px 2px 0px #000',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.18s',
            flexShrink: 0,
            padding: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: on ? '22px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: 'none',
              transition: 'left 0.18s',
              display: 'block',
            }}
          />
        </button>
      </div>
    </div>
  )
}

export default function ToggleSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Toggle Switch
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '4px 16px 0' }}>
        <Toggle label="Accept New Orders" defaultOn={true} />
        <Toggle label="Push Notifications" defaultOn={false} />
        <Toggle label="Live Tracking" defaultOn={true} />
        <Toggle label="Promo Banners" defaultOn={false} />
        <div style={{ paddingBottom: '4px' }} />
      </div>
    </div>
  )
}
