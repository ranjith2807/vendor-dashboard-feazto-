import { useState } from 'react'

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'disabled'

function Btn({ label, variant }: { label: string; variant: BtnVariant }) {
  const [pressed, setPressed] = useState(false)

  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary: { backgroundColor: '#FFC50A', color: '#000', border: 'none', boxShadow: pressed ? 'none' : '5px 5px 0px #000' },
    secondary: { backgroundColor: '#fff', color: '#000', border: 'none', boxShadow: pressed ? 'none' : '5px 5px 0px #000' },
    ghost: { backgroundColor: 'transparent', color: '#000', border: '3px dashed #000', boxShadow: 'none', opacity: pressed ? 0.5 : 1 },
    danger: { backgroundColor: '#FF3B30', color: '#fff', border: 'none', boxShadow: pressed ? 'none' : '5px 5px 0px #000' },
    disabled: { backgroundColor: '#e5e5e5', color: '#999', border: '3px solid #bbb', boxShadow: 'none', cursor: 'not-allowed' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <button
        disabled={variant === 'disabled'}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '19px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          borderRadius: '12px',
          padding: '13px 0',
          width: '100%',
          cursor: variant === 'disabled' ? 'not-allowed' : 'pointer',
          transform: pressed && variant !== 'disabled' ? 'translate(4px, 4px)' : 'none',
          transition: 'transform 0.08s, box-shadow 0.08s',
          ...styles[variant],
        }}
      >
        {label}
      </button>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.45, textAlign: 'center' }}>
        {variant}
      </div>
    </div>
  )
}

export default function ButtonSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Buttons
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Btn label="Place Order" variant="primary" />
        <Btn label="View Menu" variant="secondary" />
        <Btn label="Skip for Now" variant="ghost" />
        <Btn label="Cancel Order" variant="danger" />
        <Btn label="Unavailable" variant="disabled" />
      </div>

      {/* Small / inline row */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginTop: '14px', marginBottom: '8px' }}>
        Small Inline
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['Confirm', 'Retry', 'Track'].map(l => (
          <button
            key={l}
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: '#FFC50A',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              boxShadow: '3px 3px 0px #000',
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}
