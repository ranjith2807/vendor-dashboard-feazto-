import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

export default function RegisterSuccessScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', flexShrink: 0 }}>
        <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
      </div>
      <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '20px' }}>✓</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Application Submitted!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '14px', opacity: 0.55, textAlign: 'center', lineHeight: 1.6, marginBottom: '28px', maxWidth: '280px' }}>Your vendor application has been received. Our team will review it within 24–48 hours.</div>
      <button onClick={() => setScreen('app_review')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Track Application →</button>
    </div>
  )
}
