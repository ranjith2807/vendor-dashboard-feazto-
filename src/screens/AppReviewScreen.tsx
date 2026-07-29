import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

const STEPS = [
  { id: 'as_001', label: 'Application Received',   done: true },
  { id: 'as_002', label: 'Documents Verified',      done: false },
  { id: 'as_003', label: 'Kitchen Inspection',      done: false },
  { id: 'as_004', label: 'Final Approval',          done: false },
]

export default function AppReviewScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', padding: '28px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginBottom: '14px', flexShrink: 0 }}>
          <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
        </div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '6px' }}>Application Under Review</div>
        <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, lineHeight: 1.5 }}>Our team is reviewing your application. You'll receive an SMS once it's approved.</div>
      </div>

      <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Application Status</div>
        {STEPS.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: i < STEPS.length - 1 ? '16px' : 0, marginBottom: i < STEPS.length - 1 ? '0' : '0', position: 'relative' }}>
            {i < STEPS.length - 1 && <div style={{ position: 'absolute', left: '13px', top: '26px', width: '2px', height: 'calc(100% - 10px)', backgroundColor: step.done ? '#22C55E' : 'rgba(0,0,0,0.1)' }} />}
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step.done ? '#22C55E' : i === STEPS.filter(s => s.done).length ? '#FFC50A' : '#fff', border: `2.5px solid ${step.done ? '#22C55E' : '#000'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: step.done ? '#fff' : '#000', flexShrink: 0, zIndex: 1 }}>
              {step.done ? '✓' : i + 1}
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', opacity: step.done ? 1 : 0.45 }}>{step.label}</div>
              {i === STEPS.filter(s => s.done).length && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#F59E0B', fontWeight: 700 }}>In Progress…</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setScreen('app_approved')} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#22C55E', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>✓ Simulate Approved</button>
        <button onClick={() => setScreen('app_rejected')} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#FF3B30', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>✕ Simulate Rejected</button>
      </div>
    </div>
  )
}
