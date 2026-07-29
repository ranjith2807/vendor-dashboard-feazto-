import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

export default function AppApprovedScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <div style={{ backgroundColor: '#22C55E', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', flexShrink: 0 }}>
        <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
      </div>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', marginBottom: '20px' }}>🎉</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '36px', color: '#fff', textAlign: 'center', marginBottom: '10px', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>You're Approved!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '14px', color: '#fff', textAlign: 'center', opacity: 0.85, lineHeight: 1.6, marginBottom: '32px', maxWidth: '280px' }}>Welcome to the FEAZTO Vendor family! Your kitchen is now live. Start adding your menu and accepting orders.</div>
      <button onClick={() => setScreen('dashboard')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '3px solid #000', borderRadius: '14px', padding: '15px', cursor: 'pointer', boxShadow: '5px 5px 0px rgba(0,0,0,0.3)' }}>Go to Dashboard →</button>
    </div>
  )
}
