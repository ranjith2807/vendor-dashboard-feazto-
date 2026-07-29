const groups = [
  {
    label: 'Brand',
    tokens: [
      { name: 'Primary', hex: '#FFC50A', sub: 'CTA / Buttons' },
      { name: 'Secondary', hex: '#000000', sub: 'Border / Text', dark: true },
      { name: 'Accent', hex: '#FF6B35', sub: 'Highlights', dark: true },
    ],
  },
  {
    label: 'Background',
    tokens: [
      { name: 'BG Base', hex: '#FFF8E7', sub: 'App background', bordered: true },
      { name: 'Surface', hex: '#FFFFFF', sub: 'Cards', bordered: true },
      { name: 'Elevated', hex: '#F5F0E0', sub: 'Elevated cards', bordered: true },
    ],
  },
  {
    label: 'Semantic',
    tokens: [
      { name: 'Success', hex: '#22C55E', sub: 'Active / Done' },
      { name: 'Warning', hex: '#F59E0B', sub: 'Warning / Prep' },
      { name: 'Danger', hex: '#FF3B30', sub: 'Error / Cancel', dark: true },
      { name: 'Info', hex: '#3B82F6', sub: 'Info / Track', dark: true },
    ],
  },
  {
    label: 'Modules',
    tokens: [
      { name: 'FEZU', hex: '#FFC50A', sub: 'Delivery partner' },
      { name: 'Community', hex: '#8B5CF6', sub: 'Social feed', dark: true },
      { name: 'AI', hex: '#06B6D4', sub: 'AI insights', dark: true },
      { name: 'Wallet', hex: '#10B981', sub: 'Transactions' },
      { name: 'Analytics', hex: '#F97316', sub: 'Charts', dark: true },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { name: 'Text Primary', hex: '#0A0A0A', sub: 'Headings', dark: true },
      { name: 'Text Secondary', hex: '#555555', sub: 'Body', dark: true },
      { name: 'Disabled', hex: '#BBBBBB', sub: 'Inactive', bordered: true },
      { name: 'Placeholder', hex: '#999999', sub: 'Input hints', bordered: true },
    ],
  },
]

function Swatch({ name, hex, sub, bordered }: { name: string; hex: string; sub: string; dark?: boolean; bordered?: boolean }) {
  return (
    <div style={{ border: 'none', borderRadius: '9px', overflow: 'hidden', boxShadow: '3px 3px 0px #000' }}>
      <div style={{ height: '44px', backgroundColor: hex, borderBottom: 'none', outline: bordered ? '1.5px dashed #ccc' : 'none', outlineOffset: '-3px' }} />
      <div style={{ padding: '6px 8px', backgroundColor: '#fff' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.45, marginTop: '1px' }}>{hex}</div>
        <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.6 }}>{sub}</div>
      </div>
    </div>
  )
}

export default function ColorsSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Color System
      </div>
      {groups.map(g => (
        <div key={g.label} style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>
            {g.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
            {g.tokens.map(t => <Swatch key={t.name} {...t} />)}
          </div>
        </div>
      ))}

      {/* Gradient library strip */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px', marginTop: '4px' }}>
        Gradients
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[
          { name: 'Hero Warm', from: '#FFF8E7', to: '#FFD740' },
          { name: 'FEZU Gold', from: '#FFC50A', to: '#FF8C00' },
          { name: 'Community', from: '#8B5CF6', to: '#3B82F6' },
          { name: 'AI Cyan', from: '#06B6D4', to: '#8B5CF6' },
          { name: 'Success', from: '#22C55E', to: '#10B981' },
        ].map(g => (
          <div key={g.name} style={{ height: '34px', borderRadius: '8px', border: 'none', background: `linear-gradient(90deg, ${g.from}, ${g.to})`, display: 'flex', alignItems: 'center', padding: '0 10px', boxShadow: '2px 2px 0px #000' }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', color: '#000', textShadow: '0 0 6px rgba(255,255,255,0.8)' }}>{g.name}</span>
            <span style={{ fontFamily: 'Inter', fontSize: '9px', marginLeft: 'auto', opacity: 0.6 }}>{g.from} → {g.to}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
