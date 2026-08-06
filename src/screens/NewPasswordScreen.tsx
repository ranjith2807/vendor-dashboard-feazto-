import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'

export default function NewPasswordScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const _phone = navParams.phone  // available if needed for a real password-reset API call
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const valid = pw.length >= 8 && pw === confirm

  if (done) return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '20px' }}>✓</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px', marginBottom: '8px', textAlign: 'center' }}>Password Changed!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '28px', textAlign: 'center' }}>Your password has been updated. You can now log in.</div>
      <button onClick={() => setScreen('auth')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Back to Login →</button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', padding: '20px' }}>
      <button onClick={() => setScreen('reset_otp')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', marginBottom: '16px' }}>←</button>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', marginBottom: '6px' }}>New Password</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '28px' }}>Choose a strong password with at least 8 characters.</div>

      <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[{ label: 'New Password', val: pw, set: setPw }, { label: 'Confirm Password', val: confirm, set: setConfirm }].map(f => (
          <div key={f.label}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>{f.label}</label>
            <input type="password" value={f.val} onChange={e => f.set(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '15px', backgroundColor: '#FFF8E7', border: '2.5px solid #000', borderRadius: '10px', padding: '12px 14px', outline: 'none' }} />
          </div>
        ))}
        {confirm && !valid && <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#FF3B30', fontWeight: 700 }}>Passwords don't match or too short</div>}
        <button onClick={() => valid && setDone(true)} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: valid ? '#FFC50A' : '#ddd', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '4px 4px 0px #000' : 'none' }}>Set Password →</button>
      </div>
    </div>
  )
}
