import { useState } from 'react'
import type { SetScreen, NavParams } from '../types'

export default function ResetOtpScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const phone = navParams.phone ?? ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) document.getElementById(`rotp_${idx + 1}`)?.focus()
    if (next.every(d => d) && idx === 5) setTimeout(() => setScreen('new_password', { phone }), 400)
  }

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`rotp_${idx - 1}`)?.focus()
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', padding: '20px' }}>
      <button onClick={() => setScreen('forgot_password')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', marginBottom: '16px' }}>←</button>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', marginBottom: '6px' }}>Enter OTP</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '28px' }}>6-digit code sent to your mobile number</div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '24px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '22px' }}>
          {otp.map((val, idx) => (
            <input
              key={`rotp_box_${idx}`}
              id={`rotp_${idx}`}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKey(idx, e)}
              style={{ width: '42px', height: '50px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', textAlign: 'center', backgroundColor: val ? '#FFC50A' : '#FFF8E7', border: `2.5px solid ${val ? '#000' : '#bbb'}`, borderRadius: '10px', boxShadow: val ? '3px 3px 0px #000' : 'none', outline: 'none' }}
            />
          ))}
        </div>
        <button
          onClick={() => otp.every(d => d) && setScreen('new_password', { phone })}
          style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: otp.every(d => d) ? '#FFC50A' : '#ddd', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: otp.every(d => d) ? 'pointer' : 'not-allowed', boxShadow: otp.every(d => d) ? '4px 4px 0px #000' : 'none' }}
        >
          Verify →
        </button>
      </div>
    </div>
  )
}
