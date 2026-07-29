export default function TypographySection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', opacity: 0.4, marginBottom: '12px' }}>
        Typography
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Display */}
        <div style={{ paddingBottom: '14px', borderBottom: '2px dashed rgba(0,0,0,0.12)' }}>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '6px' }}>Barlow Condensed Bold</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '48px', lineHeight: 1, color: '#000' }}>Order Ready!</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px', lineHeight: 1.1, color: '#000', marginTop: '4px' }}>Track your meal</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', lineHeight: 1.2, color: '#000', marginTop: '4px' }}>Section / Card Title</div>
        </div>
        {/* Body */}
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '6px' }}>Inter — Body & UI</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#000', marginBottom: '4px' }}>Inter Bold 15px — Labels, buttons</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#000', marginBottom: '4px' }}>Inter Regular 14px — Body copy and descriptions for users.</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: '#000', opacity: 0.5, marginBottom: '4px' }}>Inter 12px — Captions, helper text, timestamps</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', marginTop: '6px' }}>INTER 10PX CAPS — STATUS LABELS</div>
        </div>
      </div>
    </div>
  )
}
