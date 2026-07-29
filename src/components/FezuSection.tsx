import { useState } from 'react'
import FeaztoMascot from './FeaztoMascot'

const riders = [
  { name: 'Muthu Kumar', rating: 4.9, dist: '0.4 km', status: 'available', orders: 142 },
  { name: 'Selvam R.', rating: 4.7, dist: '1.1 km', status: 'busy', orders: 98 },
  { name: 'Karthik P.', rating: 4.8, dist: '0.8 km', status: 'available', orders: 211 },
]

const deliveryStats = [
  { label: 'Success %', value: '96.4%', color: '#22C55E', icon: '✓' },
  { label: 'Avg Time', value: '28 min', color: '#FFC50A', icon: '🕐' },
  { label: 'Late %', value: '3.6%', color: '#FF3B30', icon: '⚠' },
  { label: 'Deliveries', value: '1,248', color: '#3B82F6', icon: '🚴' },
]

function RiderCard({ rider }: { rider: typeof riders[0] }) {
  const [assigned, setAssigned] = useState(false)
  return (
    <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '3px 3px 0px #000', padding: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Avatar */}
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: rider.status === 'available' ? '#22C55E' : '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>
        {rider.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rider.name}</div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px' }}>★ {rider.rating}</span>
          <span style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{rider.dist} away</span>
          <div style={{ backgroundColor: rider.status === 'available' ? '#22C55E' : '#F59E0B', color: '#fff', border: '1.5px solid #000', borderRadius: '4px', padding: '0 5px', fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {rider.status}
          </div>
        </div>
      </div>
      <button
        onClick={() => setAssigned(a => !a)}
        disabled={rider.status === 'busy' && !assigned}
        style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: assigned ? '#22C55E' : '#FFC50A', color: '#000', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: rider.status === 'busy' ? 'not-allowed' : 'pointer', boxShadow: '2px 2px 0px #000', flexShrink: 0, opacity: rider.status === 'busy' && !assigned ? 0.45 : 1 }}
      >
        {assigned ? '✓ Assigned' : 'Assign'}
      </button>
    </div>
  )
}

function LiveMap() {
  return (
    <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#E8F5E9', boxShadow: '4px 4px 0px #000', overflow: 'hidden', marginBottom: '10px', position: 'relative', height: '140px' }}>
      {/* Fake map grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="#2A6A2A" strokeWidth="0.8" />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="100%" stroke="#2A6A2A" strokeWidth="0.8" />
        ))}
        {/* Road-like lines */}
        <path d="M0 60 Q80 55 160 70 Q240 85 335 60" stroke="#2A6A2A" strokeWidth="4" strokeOpacity="0.5" fill="none" />
        <path d="M100 0 Q110 40 100 80 Q90 120 100 140" stroke="#2A6A2A" strokeWidth="4" strokeOpacity="0.5" fill="none" />
        <path d="M230 0 Q220 40 230 80 Q240 120 230 140" stroke="#2A6A2A" strokeWidth="4" strokeOpacity="0.5" fill="none" />
      </svg>
      {/* Vendor pin */}
      <div style={{ position: 'absolute', left: '80px', top: '50px', transform: 'translate(-50%, -100%)' }}>
        <div style={{ backgroundColor: '#FFC50A', border: 'none', borderRadius: '8px', padding: '3px 7px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', boxShadow: '2px 2px 0px #000', whiteSpace: 'nowrap' }}>🏪 Your Kitchen</div>
        <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #000', margin: '0 auto' }} />
      </div>
      {/* Rider dots */}
      {[{ x: 140, y: 55, name: 'M' }, { x: 195, y: 80, name: 'S' }, { x: 220, y: 40, name: 'K' }].map(r => (
        <div key={r.name} style={{ position: 'absolute', left: `${r.x}px`, top: `${r.y}px`, transform: 'translate(-50%,-50%)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', boxShadow: '2px 2px 0px #000', color: '#fff' }}>
            {r.name}
          </div>
        </div>
      ))}
      {/* Live badge */}
      <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#FF3B30', color: '#fff', border: 'none', borderRadius: '6px', padding: '2px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 1s infinite' }} />
        LIVE
      </div>
    </div>
  )
}

export default function FezuSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      {/* FEZU module header */}
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#FFC50A', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FeaztoMascot size={64} />
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', lineHeight: 1 }}>FEZU</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.7, lineHeight: 1.4 }}>Delivery Partner Module — integrated inside Vendor App</div>
        </div>
      </div>

      {/* Delivery stats */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Delivery Performance</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
        {deliveryStats.map(s => (
          <div key={s.label} style={{ flex: '1 1 44%', border: 'none', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '3px 3px 0px #000', padding: '10px 12px' }}>
            <div style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live map */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Nearby Riders — Live Map</div>
      <LiveMap />

      {/* Rider list */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Assign Rider</div>
      {riders.map(r => <RiderCard key={r.name} rider={r} />)}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        {['📞 Call', '💬 Chat', '🆘 Support'].map(label => (
          <button key={label} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
