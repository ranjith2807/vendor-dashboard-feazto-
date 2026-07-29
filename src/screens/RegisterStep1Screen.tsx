import { useState } from 'react'
import type { SetScreen } from '../App'

export default function RegisterStep1Screen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (form.phone.length !== 10) e.phone = 'Enter valid 10-digit number'
    if (!form.email.includes('@')) e.email = 'Enter valid email'
    if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Priya Krishnan' },
    { key: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '98765 43210' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
  ]

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('onboarding')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Register — Step 1 of 4</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Personal Information</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4].map(i => <div key={`step_${i}`} style={{ width: i === 1 ? '22px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: '#000', opacity: i === 1 ? 1 : 0.2 }} />)}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px' }}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: errors[f.key] ? '#FEF3F2' : '#FFF8E7', border: `2.5px solid ${errors[f.key] ? '#FF3B30' : '#000'}`, borderRadius: '10px', padding: '11px 13px', outline: 'none' }} />
              {errors[f.key] && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FF3B30', fontWeight: 700, marginTop: '3px' }}>{errors[f.key]}</div>}
            </div>
          ))}
          <button onClick={() => validate() && setScreen('register_2')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
            Next: Kitchen Info →
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5 }}>Already registered? </span>
          <button onClick={() => setScreen('auth')} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Login</button>
        </div>
      </div>
    </div>
  )
}
