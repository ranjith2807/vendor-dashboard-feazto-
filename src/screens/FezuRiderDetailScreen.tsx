import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { mockRiders } from '../data/mockData'

export default function FezuRiderDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const rider = mockRiders.find(r => r.id === navParams.id) ?? mockRiders[0]
  const [assigned, setAssigned] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) return (
    <div style={{ backgroundColor: '#22C55E', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}>🚴</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px', color: '#fff', textAlign: 'center', marginBottom: '8px' }}>Rider Assigned!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#fff', opacity: 0.85, textAlign: 'center', marginBottom: '28px' }}>{rider.name} is on the way to your kitchen.</div>
      <button onClick={() => setScreen('fezu_tracking')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '3px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>Track Live →</button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('fezu_riders')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Rider Profile</div>
      </div>

      <div style={{ padding: '0 20px 120px' }}>
        {/* Profile card */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px', marginBottom: '12px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 12px' }}>🧑</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', marginBottom: '4px' }}>{rider.name}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '10px' }}>{rider.vehicleType} · {rider.vehicleNo}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: rider.status === 'available' ? '#DCFCE7' : '#FEE2E2', border: `2px solid ${rider.status === 'available' ? '#22C55E' : '#FF3B30'}`, borderRadius: '20px', padding: '4px 14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rider.status === 'available' ? '#22C55E' : '#FF3B30' }} />
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', color: rider.status === 'available' ? '#22C55E' : '#FF3B30' }}>{rider.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {[
            { id: 'rst_rat', icon: '⭐', val: rider.rating.toFixed(1), lbl: 'Rating' },
            { id: 'rst_del', icon: '📦', val: rider.totalDeliveries, lbl: 'Deliveries' },
            { id: 'rst_dst', icon: '📍', val: `${rider.distanceKm}km`, lbl: 'Away' },
          ].map(s => (
            <div key={s.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.45 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '12px', display: 'flex', gap: '10px' }}>
          <a href={`tel:${rider.phone}`} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#22C55E', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '11px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>📞 Call</a>
          <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#3B82F6', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '11px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>💬 Chat</button>
        </div>

        {/* Recent deliveries */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>Recent Deliveries</div>
          {['Priya Krishnan · 28 min', 'Ravi Shankar · 22 min', 'Deepa Lakshmi · 31 min'].map((d, i) => (
            <div key={`rd_${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1.5px dashed rgba(0,0,0,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'Inter', fontSize: '13px' }}>{d.split('·')[0].trim()}</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#22C55E' }}>⏱ {d.split('·')[1].trim()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign button */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: 'none', padding: '12px 20px' }}>
        {!assigned ? (
          <button onClick={() => setAssigned(true)} disabled={rider.status !== 'available'} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: rider.status === 'available' ? '#FFC50A' : '#ddd', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: rider.status === 'available' ? 'pointer' : 'not-allowed', boxShadow: rider.status === 'available' ? '4px 4px 0px #000' : 'none' }}>
            {rider.status === 'available' ? 'Assign This Rider →' : 'Rider Not Available'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setAssigned(false)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Cancel</button>
            <button onClick={() => setConfirmed(true)} style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#22C55E', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>✓ Confirm Assignment</button>
          </div>
        )}
      </div>
    </div>
  )
}
