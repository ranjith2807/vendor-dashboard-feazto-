import { useState } from 'react'
import type { Screen } from '../App'
import { mockRiders, deliveryHistory, mockOrders, type Rider } from '../data/mockData'
import fezuImg from '../imports/image.png'
import fezuImg2 from '../imports/image-1.png'

const RIDER_STATUS_COLOR = { available: '#22C55E', busy: '#F59E0B', offline: '#999' }
const RIDER_STATUS_LABEL = { available: 'AVAILABLE', busy: 'BUSY', offline: 'OFFLINE' }

function RiderCard({ rider, onAssign, assigned }: { rider: Rider; onAssign: () => void; assigned: boolean }) {
  const [calling, setCalling] = useState(false)
  return (
    <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '13px', boxShadow: assigned ? '5px 5px 0px #FFC50A' : '4px 4px 0px #000', padding: '12px 14px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: RIDER_STATUS_COLOR[rider.status], border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff', flexShrink: 0 }}>
          {rider.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{rider.name}</div>
            <div style={{ backgroundColor: RIDER_STATUS_COLOR[rider.status], color: '#fff', border: '1.5px solid #000', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.06em' }}>
              {RIDER_STATUS_LABEL[rider.status]}
            </div>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>★ {rider.rating} · {rider.totalDeliveries.toLocaleString()} deliveries · {rider.distanceKm} km away</div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>{rider.vehicleType} · {rider.vehicleNo}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button
          onClick={() => setCalling(c => !c)}
          style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: calling ? '#22C55E' : '#fff', color: calling ? '#fff' : '#000', border: 'none', borderRadius: '9px', padding: '8px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}
        >
          {calling ? '📞 Calling…' : '📞 Call'}
        </button>
        <button
          onClick={onAssign}
          disabled={rider.status === 'offline'}
          style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: assigned ? '#22C55E' : rider.status === 'offline' ? '#ddd' : '#FFC50A', color: assigned ? '#fff' : '#000', border: 'none', borderRadius: '9px', padding: '8px', cursor: rider.status === 'offline' ? 'not-allowed' : 'pointer', boxShadow: rider.status === 'offline' ? 'none' : '3px 3px 0px #000', opacity: rider.status === 'offline' ? 0.5 : 1 }}
        >
          {assigned ? '✓ Assigned' : 'Assign Rider'}
        </button>
      </div>
    </div>
  )
}

function LiveTrackingView({ rider, onClose }: { rider: Rider; onClose: () => void }) {
  const steps = [
    { id: 'step_001', label: 'Order Ready', done: true, time: '9:42 AM' },
    { id: 'step_002', label: `${rider.name} Assigned`, done: true, time: '9:43 AM' },
    { id: 'step_003', label: 'Rider En Route to Kitchen', done: true, time: '9:45 AM' },
    { id: 'step_004', label: 'Order Picked Up', done: false, time: 'ETA 9:52 AM' },
    { id: 'step_005', label: 'Delivering to Customer', done: false, time: '—' },
    { id: 'step_006', label: 'Delivered', done: false, time: '—' },
  ]

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Live Tracking</div>
        <div style={{ backgroundColor: '#FF3B30', color: '#fff', border: 'none', borderRadius: '6px', padding: '2px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
          LIVE
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ margin: '0 20px 14px', height: '180px', backgroundColor: '#E8F5E9', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', overflow: 'hidden', position: 'relative' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          {Array.from({ length: 10 }, (_, i) => <line key={`mh${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="#2A6A2A" strokeWidth="0.8" />)}
          {Array.from({ length: 18 }, (_, i) => <line key={`mv${i}`} x1={i * 20} y1="0" x2={i * 20} y2="100%" stroke="#2A6A2A" strokeWidth="0.8" />)}
          <path d="M0 90 Q80 80 160 100 Q240 120 335 90" stroke="#2A6A2A" strokeWidth="5" strokeOpacity="0.6" fill="none" />
          <path d="M120 0 Q115 60 120 120 Q125 160 120 180" stroke="#2A6A2A" strokeWidth="4" strokeOpacity="0.5" fill="none" />
          <path d="M240 0 Q235 60 240 120 Q245 160 240 180" stroke="#2A6A2A" strokeWidth="4" strokeOpacity="0.5" fill="none" />
        </svg>
        {/* Dotted route line */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <path d="M80 130 Q140 100 200 80" stroke="#FFC50A" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        </svg>
        {/* Kitchen pin */}
        <div style={{ position: 'absolute', left: '60px', top: '110px', transform: 'translate(-50%,-100%)' }}>
          <div style={{ backgroundColor: '#FFC50A', border: 'none', borderRadius: '7px', padding: '2px 7px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', whiteSpace: 'nowrap', boxShadow: '2px 2px 0px #000' }}>🏪 Kitchen</div>
          <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #000', margin: '0 auto' }} />
        </div>
        {/* Rider pin */}
        <div style={{ position: 'absolute', left: '200px', top: '80px', transform: 'translate(-50%,-50%)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '3px 3px 0px #000' }}>🚴</div>
        </div>
        {/* Customer pin */}
        <div style={{ position: 'absolute', right: '30px', top: '40px', transform: 'translate(0,-100%)' }}>
          <div style={{ backgroundColor: '#3B82F6', border: 'none', borderRadius: '7px', padding: '2px 7px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', color: '#fff', whiteSpace: 'nowrap', boxShadow: '2px 2px 0px #000' }}>📍 Customer</div>
          <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #000', margin: '0 auto' }} />
        </div>
        {/* ETA chip */}
        <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', color: '#FFC50A', border: '2px solid #FFC50A', borderRadius: '8px', padding: '4px 14px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
          ETA: 8 min · 2.1 km
        </div>
      </div>

      {/* Rider info strip */}
      <div style={{ margin: '0 20px 14px', backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff' }}>
          {rider.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{rider.name}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>★ {rider.rating} · {rider.vehicleType} {rider.vehicleNo}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFC50A', border: '2.5px solid #000', fontSize: '16px', cursor: 'pointer', boxShadow: '2px 2px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</button>
          <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3B82F6', border: '2.5px solid #000', fontSize: '16px', cursor: 'pointer', boxShadow: '2px 2px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ margin: '0 20px 14px', backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>Delivery Timeline</div>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: i < steps.length - 1 ? '14px' : 0, position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', left: '9px', top: '22px', width: '2px', height: '20px', backgroundColor: step.done ? '#FFC50A' : '#ddd' }} />
            )}
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: step.done ? '#FFC50A' : '#fff', border: `2.5px solid ${step.done ? '#000' : '#ccc'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              {step.done && <span style={{ fontSize: '9px', fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: step.done ? 700 : 400, fontSize: '13px', color: step.done ? '#000' : '#aaa' }}>{step.label}</div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: step.done ? 0.5 : 0.3 }}>{step.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FEZU_TABS = [
  { id: 'ftab_dashboard', label: 'Dashboard' },
  { id: 'ftab_riders', label: 'Assign Rider' },
  { id: 'ftab_history', label: 'History' },
]

export default function FezuScreen({ setScreen: _setScreen }: { setScreen: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState('ftab_dashboard')
  const [assignedRider, setAssignedRider] = useState<string | null>(null)
  const [showTracking, setShowTracking] = useState(false)
  const readyOrders = mockOrders.filter(o => o.status === 'ready')

  if (showTracking && assignedRider) {
    const rider = mockRiders.find(r => r.id === assignedRider)!
    return <LiveTrackingView rider={rider} onClose={() => setShowTracking(false)} />
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFC50A', borderBottom: 'none', padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}><img src={fezuImg2} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} /></div>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: 1 }}>FEZU</div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.7 }}>Delivery Partner Module</div>
        </div>
        <div style={{ marginLeft: 'auto', backgroundColor: '#000', color: '#FFC50A', border: 'none', borderRadius: '8px', padding: '4px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px' }}>
          3 Available
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '12px 20px 10px', display: 'flex', gap: '7px' }}>
        {FEZU_TABS.map(tab => {
          const isA = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.03em', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '9px', padding: '8px 0', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* Dashboard tab */}
        {activeTab === 'ftab_dashboard' && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              {[
                { id: 'fstat_001', label: 'Success Rate', value: '96.4%', color: '#22C55E', icon: '✓' },
                { id: 'fstat_002', label: 'Avg Delivery', value: '28 min', color: '#FFC50A', icon: '🕐' },
                { id: 'fstat_003', label: 'Today Deliveries', value: '14', color: '#3B82F6', icon: '🚴' },
                { id: 'fstat_004', label: 'Late Deliveries', value: '1', color: '#FF3B30', icon: '⚠' },
              ].map(stat => (
                <div key={stat.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px' }}>
                  <div style={{ fontSize: '20px', marginBottom: '2px' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Ready orders to dispatch */}
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>Ready for Pickup</div>
            {readyOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000' }}>
                <div style={{ fontSize: '32px', marginBottom: '6px' }}>✅</div>
                <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5 }}>All orders dispatched!</div>
              </div>
            )}
            {readyOrders.map(order => (
              <div key={order.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #FFC50A', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px' }}>{order.id}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>{order.customerName} · ₹ {order.total}</div>
                  </div>
                  <div style={{ backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '6px', padding: '2px 9px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>READY</div>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45, marginBottom: '10px' }}>📍 {order.address}</div>
                <button
                  onClick={() => { setActiveTab('ftab_riders') }}
                  style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '9px', padding: '10px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
                >
                  Assign FEZU Rider →
                </button>
              </div>
            ))}

            {/* FEZU mascot promo */}
            <div style={{ backgroundColor: '#000', border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #FFC50A', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}><img src={fezuImg} alt="FEZU" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} /></div>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: '#FFC50A' }}>FEZU is Always Ready!</div>
                <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#FFF8E7', opacity: 0.7, lineHeight: 1.4 }}>Fast, reliable delivery partners available 24/7 near your kitchen.</div>
              </div>
            </div>
          </>
        )}

        {/* Assign Rider tab */}
        {activeTab === 'ftab_riders' && (
          <>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>Nearby Riders</div>
            {mockRiders.map(rider => (
              <RiderCard
                key={rider.id}
                rider={rider}
                assigned={assignedRider === rider.id}
                onAssign={() => {
                  setAssignedRider(rider.id)
                  setTimeout(() => setShowTracking(true), 600)
                }}
              />
            ))}
          </>
        )}

        {/* History tab */}
        {activeTab === 'ftab_history' && (
          <>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>Delivery History</div>
            {deliveryHistory.map(del => (
              <div key={del.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px' }}>{del.orderId}</div>
                  <div style={{ backgroundColor: del.status === 'delivered' ? '#22C55E' : '#FF3B30', color: '#fff', border: 'none', borderRadius: '5px', padding: '1px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>
                    {del.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.65 }}>Customer: {del.customerName} · ₹ {del.amount}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>Rider: {del.riderName} · {del.time} · {del.duration}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
