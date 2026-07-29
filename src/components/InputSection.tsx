import { useState } from 'react'

function Field({
  label, placeholder, defaultValue = '', error, hint, type = 'text',
}: {
  label: string; placeholder: string; defaultValue?: string; error?: string; hint?: string; type?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#000' }}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#000',
          backgroundColor: '#FFF8E7',
          border: `2.5px solid ${error ? '#FF3B30' : focused ? '#FFC50A' : '#000'}`,
          borderRadius: '10px',
          padding: '12px 14px',
          outline: 'none',
          boxShadow: error ? '4px 4px 0px #FF3B30' : focused ? '4px 4px 0px #FFC50A' : '4px 4px 0px #000',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          width: '100%',
        }}
      />
      {error && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#FF3B30', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>●</span> {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#000', opacity: 0.45 }}>{hint}</div>
      )}
    </div>
  )
}

export default function InputSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Input Fields
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="Phone Number" placeholder="+91 98765 43210" hint="We'll send your OTP here" type="tel" />
        <Field label="Delivery Address" placeholder="14, Kamaraj Street, Coimbatore" />
        <Field label="Email Address" placeholder="you@example.com" defaultValue="invalid-email" error="Please enter a valid email address" type="email" />
      </div>

      {/* State legend */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Default', color: '#000' },
          { label: 'Focused', color: '#FFC50A' },
          { label: 'Error', color: '#FF3B30' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#FFF8E7', border: `2.5px solid ${s.color}`, borderRadius: '6px', boxShadow: `2px 2px 0px ${s.color}` }} />
            <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
