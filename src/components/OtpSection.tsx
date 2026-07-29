import { useState, useRef } from 'react'

export default function OtpSection() {
  const [digits, setDigits] = useState(['3', '7', '', '', '', ''])
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (idx: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = d
    setDigits(next)
    if (d && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const filled = digits.filter(Boolean).length

  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        OTP Input
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '18px 16px' }}>
        <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45, marginBottom: '14px' }}>
          Enter OTP sent to +91 98765 43210
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: '46px',
                height: '54px',
                textAlign: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '26px',
                color: '#000',
                backgroundColor: d ? '#FFF8E7' : '#fff',
                border: `2.5px solid ${d ? '#FFC50A' : '#000'}`,
                borderRadius: '10px',
                boxShadow: d ? '3px 3px 0px #FFC50A' : '3px 3px 0px #000',
                outline: 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
          {digits.map((d, i) => (
            <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: d ? '#FFC50A' : '#e5e5e5', border: '1.5px solid #000', transition: 'background-color 0.15s' }} />
          ))}
          <span style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4, marginLeft: '4px' }}>{filled}/6</span>
        </div>
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <button style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#000' }}>
            Resend OTP in 00:28
          </button>
        </div>
      </div>
    </div>
  )
}
