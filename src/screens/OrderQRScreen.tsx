import { useState, useEffect } from 'react'
import type { SetScreen, NavParams } from '../App'

function QRCode({ value, size = 160 }: { value: string; size?: number }) {
  const cells = 21
  const cell = size / cells
  const hash = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const grid = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if (r < 8 && c < 8) return r === 0 || r === 7 || c === 0 || c === 7 || (r > 1 && r < 6 && c > 1 && c < 6)
      if (r < 8 && c > cells - 9) return r === 0 || r === 7 || c === cells - 1 || c === cells - 8 || (r > 1 && r < 6 && c > cells - 7 && c < cells - 2)
      if (r > cells - 9 && c < 8) return r === cells - 1 || r === cells - 8 || c === 0 || c === 7 || (r > cells - 7 && r < cells - 2 && c > 1 && c < 6)
      return ((r * cells + c + hash) % 3 === 0)
    })
  )

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="white" />
      {grid.flatMap((row, r) => row.map((on, c) => on ? <rect key={`qr_${r}_${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="black" /> : null))}
    </svg>
  )
}

export default function OrderQRScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const orderId = navParams.id ?? 'ord_1001'
  const pickupCode = String((parseInt(orderId.replace(/\D/g, '') || '1001', 10) * 7 + 123456) % 1000000).padStart(6, '0')
  const [seconds, setSeconds] = useState(300)
  const [fullScreen, setFullScreen] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (verified) return
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [verified])

  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')

  if (verified) return (
    <div style={{ backgroundColor: '#22C55E', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '20px' }}>✓</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>Pickup Verified!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#fff', opacity: 0.85, marginBottom: '28px', textAlign: 'center' }}>Rider has scanned the QR. Order is now out for delivery.</div>
      <button onClick={() => setScreen('fezu')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '3px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>Track Live Delivery →</button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('order_detail', { id: orderId })} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Pickup QR</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Order #{orderId.replace('ord_', '')}</div>
        </div>
        <button onClick={() => setFullScreen(true)} style={{ background: 'none', border: '2.5px solid #000', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', boxShadow: '2px 2px 0px #000' }}>⛶ Full</button>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* QR Card */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '6px 6px 0px #000', padding: '20px', textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Show this to the FEZU rider</div>
          <div style={{ display: 'inline-block', padding: '14px', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', marginBottom: '14px' }}>
            <QRCode value={`FEAZTO:${orderId}:${pickupCode}`} size={160} />
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', opacity: 0.45, marginBottom: '6px' }}>PICKUP CODE</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '40px', letterSpacing: '0.22em', color: '#000', marginBottom: '14px' }}>{pickupCode}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seconds > 60 ? '#22C55E' : '#FF3B30', animation: 'pulse 1s infinite' }} />
            <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: seconds > 60 ? '#22C55E' : '#FF3B30' }}>
              {seconds === 0 ? 'QR Expired' : `Expires in ${mins}:${secs}`}
            </div>
          </div>
        </div>

        {/* Rider info */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🚴</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>Muthu Kumar</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>Arriving in ~5 min · TN38 AB 1234</div>
          </div>
          <a href="tel:+919876500000" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#22C55E', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', textDecoration: 'none' }}>📞</a>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setSeconds(300)} style={{ flex: 1, fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>🔄 Refresh QR</button>
          <button onClick={() => setVerified(true)} style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>✓ Confirm Pickup</button>
        </div>
      </div>

      {/* Full screen overlay */}
      {fullScreen && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#fff', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>Screen kept awake · FEAZTO Pickup</div>
          <div style={{ padding: '18px', border: 'none', borderRadius: '16px', boxShadow: '6px 6px 0px #000', marginBottom: '16px' }}>
            <QRCode value={`FEAZTO:${orderId}:${pickupCode}`} size={220} />
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '46px', letterSpacing: '0.22em', marginBottom: '8px' }}>{pickupCode}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.4, marginBottom: '24px' }}>Order #{orderId.replace('ord_', '')} · Expires {mins}:{secs}</div>
          <button onClick={() => setFullScreen(false)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', background: 'none', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 24px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Close Full Screen</button>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
