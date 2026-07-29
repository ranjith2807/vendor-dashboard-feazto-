const colors = [
  { name: 'Yellow', hex: '#FFC50A', label: 'Primary / CTA' },
  { name: 'Cream', hex: '#FFF8E7', label: 'Background', bordered: true },
  { name: 'Black', hex: '#000000', label: 'Border / Text', dark: true },
  { name: 'Red', hex: '#FF3B30', label: 'Error / Destructive', dark: true },
  { name: 'Green', hex: '#22C55E', label: 'Success / Active' },
  { name: 'White', hex: '#FFFFFF', label: 'Card Surface', bordered: true },
]

export default function ColorSwatches() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#000',
          opacity: 0.4,
          marginBottom: '12px',
        }}
      >
        Color Palette
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {colors.map(c => (
          <div
            key={c.hex}
            style={{
              border: 'none',
              boxShadow: '4px 4px 0px #000',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '56px',
                backgroundColor: c.hex,
                borderBottom: 'none',
              }}
            />
            <div style={{ padding: '8px 10px', backgroundColor: '#fff' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px' }}>{c.name}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', opacity: 0.5 }}>{c.hex}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', opacity: 0.65, marginTop: '1px' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
