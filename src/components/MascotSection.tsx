import FeaztoMascot from './FeaztoMascot'
import fezuPhoto from '../imports/image.png'

export default function MascotSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Mascot — FEZU
      </div>

      {/* Reference photo + SVG side by side */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {/* Reference photo */}
        <div style={{ flex: 1, border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: '4px 4px 0px #000', position: 'relative' }}>
          <img src={fezuPhoto} alt="FEZU mascot reference photo" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 8px' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFF8E7' }}>Reference</span>
          </div>
        </div>
        {/* SVG recreation */}
        <div style={{ flex: 1, border: 'none', borderRadius: '12px', backgroundColor: '#FFFBF0', boxShadow: '4px 4px 0px #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px 4px', position: 'relative' }}>
          <FeaztoMascot size={138} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 8px', borderRadius: '0 0 10px 10px' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFC50A' }}>SVG Version</span>
          </div>
        </div>
      </div>

      {/* Colorway swatches */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {[['#FFF8E7', '#000'], ['#FFC50A', '#000'], ['#000', '#FFF8E7']].map(([bg, text], i) => (
          <div key={i} style={{ flex: 1, border: 'none', borderRadius: '10px', backgroundColor: bg, boxShadow: '3px 3px 0px #000', padding: '10px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <FeaztoMascot size={66} />
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', color: text }}>FEZU</div>
          </div>
        ))}
      </div>

      {/* Usage rules */}
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px 14px 10px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>Usage Rules</div>
        {[
          'Always show at full opacity — never faded or ghosted',
          'Never recolor — use artwork exactly as provided',
          'Min display size: 64 × 74 px',
          'Approved BGs: cream, white, yellow, black only',
          'Chef hat + apron must always be fully visible',
          'Never rotate, distort, crop, or apply effects',
        ].map((rule, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', marginTop: '1px' }}>
              {i + 1}
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: '11px', lineHeight: 1.5, color: '#000' }}>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
