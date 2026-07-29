import { useState } from 'react'
import type { SetScreen } from '../App'

const DOCS = [
  { id: 'rdoc_001', label: 'Government ID', sub: 'Aadhaar / Passport / Voter ID', icon: '🪪', required: true },
  { id: 'rdoc_002', label: 'FSSAI Food Licence', sub: 'Food safety registration certificate', icon: '🏛', required: true },
  { id: 'rdoc_003', label: 'PAN / GST Document', sub: 'Tax identification document', icon: '📄', required: true },
  { id: 'rdoc_004', label: 'Bank Passbook / Cheque', sub: 'For payout setup', icon: '🏦', required: true },
  { id: 'rdoc_005', label: 'Kitchen Photograph', sub: 'Clear photo of your cooking area', icon: '📷', required: false },
]

export default function RegisterStep3Screen({ setScreen }: { setScreen: SetScreen }) {
  const [uploaded, setUploaded] = useState<Record<string, 'idle' | 'uploading' | 'done'>>({})
  const [errors, setErrors] = useState<string[]>([])

  const upload = (id: string) => {
    setUploaded(p => ({ ...p, [id]: 'uploading' }))
    setTimeout(() => setUploaded(p => ({ ...p, [id]: 'done' })), 1200)
  }
  const remove = (id: string) => setUploaded(p => ({ ...p, [id]: 'idle' }))

  const validate = () => {
    const missing = DOCS.filter(d => d.required && uploaded[d.id] !== 'done').map(d => d.id)
    setErrors(missing)
    return missing.length === 0
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('register_2')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Register — Step 3 of 4</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Document Upload</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4].map(i => <div key={`step3_${i}`} style={{ width: i === 3 ? '22px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: '#000', opacity: i <= 3 ? 1 : 0.2 }} />)}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px', marginBottom: '12px' }}>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5, marginBottom: '16px', lineHeight: 1.5 }}>Upload clear scans or photos. Files must be JPG, PNG or PDF under 5 MB each.</div>

          {DOCS.map((doc, idx) => {
            const state = uploaded[doc.id] ?? 'idle'
            const isError = errors.includes(doc.id)
            return (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: idx < DOCS.length - 1 ? '1.5px solid rgba(0,0,0,0.07)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: state === 'done' ? '#DCFCE7' : isError ? '#FEE2E2' : '#FFF8E7', border: `2px solid ${state === 'done' ? '#22C55E' : isError ? '#FF3B30' : '#000'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{doc.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{doc.label} {doc.required && <span style={{ color: '#FF3B30' }}>*</span>}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>{doc.sub}</div>
                  {state === 'uploading' && (
                    <div style={{ marginTop: '6px', height: '4px', backgroundColor: '#e5e5e5', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: '#FFC50A', borderRadius: '2px', animation: 'progressFill 1.2s ease forwards' }} />
                    </div>
                  )}
                </div>
                {state === 'done' ? (
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>✓</div>
                    <button onClick={() => remove(doc.id)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', background: 'none', border: '2px solid #000', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer' }}>Remove</button>
                  </div>
                ) : state === 'uploading' ? (
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5, flexShrink: 0 }}>Uploading…</div>
                ) : (
                  <button onClick={() => upload(doc.id)} style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: isError ? '#FF3B30' : '#FFC50A', color: isError ? '#fff' : '#000', border: '2.5px solid #000', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000', flexShrink: 0 }}>Upload</button>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={() => validate() && setScreen('register_4')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          Next: Review & Submit →
        </button>
        {errors.length > 0 && <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#FF3B30', textAlign: 'center', marginTop: '8px' }}>Upload all required documents to continue</div>}
      </div>
      <style>{`@keyframes progressFill { from { width: 0%; } to { width: 85%; } }`}</style>
    </div>
  )
}
