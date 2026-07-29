import type { SetScreen } from '../App'

const REASONS = [
  { id: 'rej_001', label: 'FSSAI licence invalid or expired' },
  { id: 'rej_002', label: 'Kitchen photograph does not meet standards' },
  { id: 'rej_003', label: 'Government ID could not be verified' },
]

export default function AppRejectedScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FF3B30', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>✕</div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px', marginBottom: '8px' }}>Application Rejected</div>
        <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, lineHeight: 1.5 }}>We could not approve your application. Please review the issues below and resubmit.</div>
      </div>

      <div style={{ backgroundColor: '#FEE2E2', border: '2.5px solid #FF3B30', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#FF3B30', marginBottom: '10px' }}>Rejection Reasons</div>
        {REASONS.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#FF3B30', fontWeight: 700, marginTop: '1px' }}>•</span>
            <div style={{ fontFamily: 'Inter', fontSize: '13px' }}>{r.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setScreen('register_3')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Resubmit Documents →</button>
        <button onClick={() => setScreen('auth')} style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Back to Login</button>
      </div>
    </div>
  )
}
