import { useEffect } from 'react'
import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

export default function SplashScreen({ setScreen }: { setScreen: SetScreen }) {
  useEffect(() => {
    const t = setTimeout(() => setScreen('onboarding'), 2200)
    return () => clearTimeout(t)
  }, [setScreen])

  return (
    <div style={{ backgroundColor: '#FFC50A', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.6s ease forwards' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', flexShrink: 0 }}>
          <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
        </div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '52px', letterSpacing: '0.06em', lineHeight: 1, color: '#000', marginBottom: '4px' }}>FEAZTO</div>
        <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#000', opacity: 0.55, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Vendor Partner</div>
      </div>

      <div style={{ position: 'absolute', bottom: '60px', display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={`dot_${i}`} style={{ width: i === 0 ? '22px' : '7px', height: '7px', borderRadius: '4px', backgroundColor: '#000', opacity: i === 0 ? 1 : 0.25, transition: 'all 0.3s' }} />
        ))}
      </div>

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
