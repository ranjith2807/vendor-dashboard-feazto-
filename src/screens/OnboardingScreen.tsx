import { useState } from 'react'
import type { SetScreen } from '../App'
import fezuImg from '../imports/image.png'

const SLIDES = [
  { id: 'ob_1', icon: '🍽️', title: 'Grow Your Kitchen Business', body: 'List your dishes, manage orders and reach thousands of hungry customers in your area.', bg: '#FFF8E7' },
  { id: 'ob_2', icon: '🚴', title: 'FEZU Delivery Network', body: 'Assign orders to trusted FEZU riders instantly. Track every delivery in real time.', bg: '#FFF8E7' },
  { id: 'ob_3', icon: '📊', title: 'Smart Analytics & Earnings', body: 'Track your revenue, peak hours and top dishes. Get paid on time, every time.', bg: '#FFF8E7' },
  { id: 'ob_4', icon: '🤝', title: 'Chef Community', body: 'Connect with 10,000+ home chefs. Share recipes, tips and grow together.', bg: '#FFF8E7' },
]

export default function OnboardingScreen({ setScreen }: { setScreen: SetScreen }) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const isLast = idx === SLIDES.length - 1

  return (
    <div style={{ backgroundColor: slide.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px 0' }}>
        <button onClick={() => setScreen('auth')} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', background: 'none', border: 'none', opacity: 0.35, cursor: 'pointer' }}>Skip</button>
      </div>

      {/* Illustration area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', boxShadow: idx === 0 ? 'none' : '6px 6px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
          {idx === 0 ? (
            <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
            </div>
          ) : (
            <span style={{ fontSize: '72px' }}>{slide.icon}</span>
          )}
        </div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px', textAlign: 'center', lineHeight: 1.15, marginBottom: '12px', maxWidth: '280px' }}>{slide.title}</div>
        <div style={{ fontFamily: 'Inter', fontSize: '14px', textAlign: 'center', opacity: 0.55, lineHeight: 1.6, maxWidth: '280px' }}>{slide.body}</div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        {SLIDES.map((s, i) => (
          <div key={s.id} style={{ width: i === idx ? '22px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: '#000', opacity: i === idx ? 1 : 0.2, transition: 'all 0.3s', cursor: 'pointer' }} onClick={() => setIdx(i)} />
        ))}
      </div>

      {/* Actions */}
      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => isLast ? setScreen('auth') : setIdx(i => i + 1)}
          style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}
        >
          {isLast ? 'Get Started →' : 'Next →'}
        </button>
        {isLast && (
          <button
            onClick={() => setScreen('register_1')}
            style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
          >
            New vendor? Register here →
          </button>
        )}
      </div>
    </div>
  )
}
