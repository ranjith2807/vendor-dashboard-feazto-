import { useState } from 'react'
import type { SetScreen } from '../App'

export default function ForgotPasswordScreen({ setScreen }: { setScreen: SetScreen }) {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', padding: '20px' }}>
      <button onClick={() => setScreen('auth')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', marginBottom: '16px' }}>←</button>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', marginBottom: '6px' }}>Forgot Password?</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '28px' }}>Enter your registered mobile number and we'll send a reset OTP.</div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '20px' }}>
        {!sent ? (
          <>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>Mobile Number</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#FFF8E7', borderRadius: '10px', padding: '0 12px', display: 'flex', alignItems: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: '15px' }}>+91</div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => e.key === 'Enter' && phone.length === 10 && setSent(true)}
                style={{ flex: 1, fontFamily: 'Inter', fontSize: '15px', backgroundColor: '#FFF8E7', border: '2.5px solid #000', borderRadius: '10px', padding: '12px 14px', outline: 'none' }}
              />
            </div>
            <button
              onClick={() => phone.length === 10 && setSent(true)}
              disabled={phone.length !== 10}
              style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: phone.length === 10 ? '#FFC50A' : '#ddd', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: phone.length === 10 ? 'pointer' : 'not-allowed', boxShadow: phone.length === 10 ? '4px 4px 0px #000' : 'none' }}
            >
              Send OTP →
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📲</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>OTP Sent!</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '20px' }}>Check SMS on +91 {phone.slice(0, 5)} {phone.slice(5)}</div>
            <button
              onClick={() => setScreen('reset_otp', { phone })}
              style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}
            >
              Enter OTP →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
