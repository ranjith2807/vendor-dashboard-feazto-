import { useState } from 'react'
import type { Screen } from '../App'
import { useToast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'

export default function SettingsSecurityScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { showToast } = useToast()
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [otpEnabled, setOtpEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)

  const strength = newPwd.length === 0 ? 0 : newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) ? 4 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#FF3B30', '#F59E0B', '#3B82F6', '#22C55E']

  const handleSave = () => {
    if (!currentPwd) return showToast('Enter current password', 'error')
    if (newPwd.length < 8) return showToast('Password must be at least 8 characters', 'error')
    if (newPwd !== confirmPwd) return showToast('Passwords do not match', 'error')
    showToast('Password changed successfully!')
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Security</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Change password */}
        <SLabel>Change Password</SLabel>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '16px', marginBottom: '16px' }}>
          <PwdField label="Current Password" value={currentPwd} onChange={setCurrentPwd} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
          <PwdField label="New Password" value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew(v => !v)} />
          {newPwd.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= strength ? strengthColor[strength] : '#ddd' }} />
                ))}
              </div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: strengthColor[strength] }}>{strengthLabel[strength]}</div>
            </div>
          )}
          <PwdField label="Confirm New Password" value={confirmPwd} onChange={setConfirmPwd} show={showNew} onToggle={() => setShowNew(v => !v)} />
          <button
            onClick={handleSave}
            style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
          >
            Update Password
          </button>
        </div>

        {/* Authentication settings */}
        <SLabel>Login & Authentication</SLabel>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { id: 'otp_toggle', icon: '📱', label: 'OTP Login', sub: 'Receive OTP to +91 98765 43210', val: otpEnabled, set: () => setOtpEnabled(v => !v) },
            { id: 'bio_toggle', icon: '🔐', label: 'Biometric Login', sub: 'Use fingerprint or face ID', val: biometricEnabled, set: () => setBiometricEnabled(v => !v) },
            { id: 'twofa_toggle', icon: '🔑', label: 'Two-Factor Auth', sub: 'Adds extra login verification', val: twoFaEnabled, set: () => setTwoFaEnabled(v => !v) },
          ].map((item, idx) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', borderBottom: idx < 2 ? '2px solid rgba(0,0,0,0.06)' : 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{item.label}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>{item.sub}</div>
              </div>
              <button onClick={item.set} style={{ width: '46px', height: '26px', borderRadius: '13px', backgroundColor: item.val ? '#22C55E' : '#ddd', border: '2.5px solid #000', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0 }}>
                <span style={{ position: 'absolute', top: '2px', left: item.val ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <SLabel>Danger Zone</SLabel>
        <div style={{ backgroundColor: '#FEE2E2', border: '2.5px solid #FF3B30', borderRadius: '14px', boxShadow: '4px 4px 0px #FF3B30', padding: '14px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>Deactivate Account</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>Permanently deactivates your vendor account and removes all data.</div>
          <button
            onClick={() => setConfirmDeactivate(true)}
            style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#FF3B30', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
          >
            Deactivate Account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeactivate}
        title="Deactivate Account?"
        body="This action cannot be undone. All your data, orders, and settings will be permanently deleted."
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        danger
        onConfirm={() => { setConfirmDeactivate(false); showToast('Account deactivated', 'error') }}
        onCancel={() => setConfirmDeactivate(false)}
      />
    </div>
  )
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px', marginTop: '4px' }}>{children}</div>
}

function PwdField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '15px', backgroundColor: '#FFF8E7', border: '2px solid #bbb', borderRadius: '10px', padding: '11px 42px 11px 13px', outline: 'none' }}
        />
        <button onClick={onToggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.5 }}>
          {show ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  )
}
