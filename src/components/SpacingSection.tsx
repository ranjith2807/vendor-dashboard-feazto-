import FeaztoMascot from './FeaztoMascot'

const spacings = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
const radii = [
  { val: 8, label: 'sm' },
  { val: 12, label: 'md' },
  { val: 16, label: 'lg' },
  { val: 20, label: 'xl' },
  { val: 24, label: '2xl' },
  { val: 32, label: '3xl' },
  { val: 48, label: '4xl' },
  { val: 999, label: 'full' },
]
const elevations = [
  { label: 'Level 1', shadow: '0 1px 3px rgba(0,0,0,0.12)', comic: '2px 2px 0px #000' },
  { label: 'Level 2', shadow: '0 4px 10px rgba(0,0,0,0.16)', comic: '3px 3px 0px #000' },
  { label: 'Level 3', shadow: '0 8px 20px rgba(0,0,0,0.18)', comic: '5px 5px 0px #000' },
  { label: 'Level 4', shadow: '0 16px 40px rgba(0,0,0,0.2)', comic: '7px 7px 0px #000' },
  { label: 'Floating', shadow: '0 24px 48px rgba(0,0,0,0.22)', comic: '8px 8px 0px #FFC50A' },
]

export default function SpacingSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      {/* Spacing scale */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '10px' }}>
        Spacing Scale
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '14px' }}>
        {spacings.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
            <div style={{ width: '28px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', color: '#000', flexShrink: 0 }}>{s}</div>
            <div style={{ width: `${Math.min(s * 2.2, 240)}px`, height: '14px', backgroundColor: '#FFC50A', border: 'none', borderRadius: '3px', flexShrink: 0 }} />
            <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4 }}>{s}px</div>
          </div>
        ))}
      </div>

      {/* Border radius */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '10px' }}>
        Border Radius
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {radii.map(r => (
          <div key={r.val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#FFF8E7', border: 'none', borderRadius: `${r.val}px`, boxShadow: '3px 3px 0px #000' }} />
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px' }}>{r.val === 999 ? '∞' : r.val}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.45 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Elevation */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '10px' }}>
        Elevation (Comic Hard Shadow)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {elevations.map(e => (
          <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '52px', height: '32px', backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: e.comic, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>{e.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4 }}>{e.comic}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FEZU cameo */}
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#FFC50A', boxShadow: '4px 4px 0px #000', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FeaztoMascot size={72} />
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>Consistent Spacing</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.7, lineHeight: 1.4 }}>Every component uses multiples of 4px for pixel-perfect alignment.</div>
        </div>
      </div>
    </div>
  )
}
