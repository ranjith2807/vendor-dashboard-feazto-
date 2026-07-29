const statuses = [
  { label: 'NEW', bg: '#FFC50A', text: '#000', dot: '#000' },
  { label: 'ACCEPTED', bg: '#000', text: '#FFF8E7', dot: '#FFC50A' },
  { label: 'PREPARING', bg: '#fff', text: '#000', dot: '#FFC50A' },
  { label: 'READY', bg: '#22C55E', text: '#fff', dot: '#fff' },
  { label: 'CANCELLED', bg: '#FF3B30', text: '#fff', dot: '#fff' },
  { label: 'DELIVERED', bg: '#FFF8E7', text: '#000', dot: '#22C55E' },
]

export default function BadgeSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Status Badges
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '18px 16px' }}>
        {/* Block badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {statuses.map(s => (
            <div
              key={s.label}
              style={{
                backgroundColor: s.bg,
                color: s.text,
                border: 'none',
                borderRadius: '9px',
                boxShadow: '3px 3px 0px #000',
                padding: '7px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.06em',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0, border: '1px solid rgba(0,0,0,0.2)' }} />
              {s.label}
            </div>
          ))}
        </div>
        {/* Pill row */}
        <div style={{ fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Pill Variant</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {statuses.slice(0, 4).map(s => (
            <div key={s.label} style={{ backgroundColor: s.bg, color: s.text, border: 'none', borderRadius: '999px', padding: '4px 12px', fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
