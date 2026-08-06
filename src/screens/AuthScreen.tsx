import { useState } from 'react'
import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

export default function AuthScreen({ setScreen }: { setScreen: SetScreen }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [error, setError] = useState('')

  const handleGetOtp = () => {
    if (phone.length !== 10) return
    setStep('otp')
    setError('')
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    setError('')
    if (val && idx < 5) document.getElementById(`otp_${idx + 1}`)?.focus()
    if (val && idx === 5 && next.every(d => d)) {
      setTimeout(() => setScreen('dashboard'), 300)
    }
  }

  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp_${idx - 1}`)?.focus()
    }
  }

  const handleVerify = () => {
    if (otp.join('').length !== 6) return
    setScreen('dashboard')
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp(['', '', '', '', '', ''])
    setError('')
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px' }}>
      {/* FEZU mascot */}
      <div style={{ marginBottom: '16px', marginTop: '10px' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
        </div>
      </div>

      {/* Brand */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '38px', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '2px', textAlign: 'center' }}>FEAZTO</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.45, marginBottom: '28px', textAlign: 'center' }}>Vendor Partner App</div>

      <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '6px 6px 0px #000', padding: '20px' }}>
        {step === 'phone' ? (
          <>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '4px' }}>Welcome back!</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '18px' }}>Enter your registered mobile number</div>
            <label style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>MOBILE NUMBER</label>
            <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', gap: '8px', marginBottom: '16px', alignItems: 'stretch' }}>
              <div style={{ flexShrink: 0, backgroundColor: '#FFF8E7', borderRadius: '10px', padding: '0 12px', display: 'flex', alignItems: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap' }}>+91</div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                onKeyDown={e => e.key === 'Enter' && phone.length === 10 && handleGetOtp()}
                style={{ flex: 1, minWidth: 0, boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '15px', backgroundColor: '#FFF8E7', border: '2px solid #000', borderRadius: '10px', padding: '12px 14px', outline: 'none' }}
              />
            </div>
            {error && <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#e53e3e', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
            <button
              onClick={handleGetOtp}
              disabled={phone.length !== 10}
              style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: phone.length === 10 ? '#FFC50A' : '#ddd', color: '#000', border: 'none', borderRadius: '12px', padding: '13px', cursor: phone.length === 10 ? 'pointer' : 'not-allowed', boxShadow: phone.length === 10 ? '4px 4px 0px #000' : 'none', transition: 'all 0.15s' }}
            >
              Get OTP →
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '4px' }}>Verify OTP</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '20px' }}>Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {otp.map((val, idx) => (
                <input
                  key={`otp_box_${idx}`}
                  id={`otp_${idx}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKey(idx, e)}
                  style={{ width: '42px', height: '50px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', textAlign: 'center', backgroundColor: val ? '#FFC50A' : '#FFF8E7', border: `2.5px solid ${val ? '#000' : '#bbb'}`, borderRadius: '10px', boxShadow: val ? '3px 3px 0px #000' : 'none', outline: 'none', transition: 'all 0.12s' }}
                />
              ))}
            </div>
            {error && <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#e53e3e', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
            <button
              onClick={handleVerify}
              disabled={otp.join('').length !== 6}
              style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: otp.join('').length === 6 ? '#FFC50A' : '#ddd', color: '#000', border: 'none', borderRadius: '12px', padding: '13px', cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed', boxShadow: otp.join('').length === 6 ? '4px 4px 0px #000' : 'none', marginBottom: '10px', transition: 'all 0.15s' }}
            >
              Verify &amp; Login →
            </button>
            <button
              onClick={handleBackToPhone}
              style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', background: 'none', border: 'none', opacity: 0.4, cursor: 'pointer', padding: '8px' }}
            >
              ← Change number
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('forgot_password')} style={{ background: 'none', border: 'none', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#000', cursor: 'pointer', opacity: 0.6, textDecoration: 'underline' }}>Forgot Password?</button>
        <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>
          New vendor?{' '}
          <button onClick={() => setScreen('register_1')} style={{ background: 'none', border: 'none', fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#000', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Register here →</button>
        </div>
      </div>

      <div style={{ marginTop: 'auto', fontFamily: 'Inter', fontSize: '11px', opacity: 0.3, textAlign: 'center', paddingTop: '16px' }}>
        By continuing you agree to FEAZTO's Terms &amp; Privacy Policy
      </div>
    </div>
  )
}
