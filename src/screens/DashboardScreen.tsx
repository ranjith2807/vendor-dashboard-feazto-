import type { Screen } from '../App'
import { mockOrders, analyticsStats } from '../data/mockData'
import fezuImg from '../imports/image.png'

const STATUS_COLOR: Record<string, string> = {
  new: '#FFC50A', accepted: '#3B82F6', preparing: '#F59E0B', ready: '#22C55E',
  picked_up: '#8B5CF6', delivered: '#10B981', cancelled: '#FF3B30',
}
const STATUS_LABEL: Record<string, string> = {
  new: 'NEW', accepted: 'ACCEPTED', preparing: 'PREPARING', ready: 'READY',
  picked_up: 'PICKED UP', delivered: 'DELIVERED', cancelled: 'CANCELLED',
}

export default function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const liveOrders = mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 16px', backgroundColor: '#FFF8E7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>Good morning 👋</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', lineHeight: 1.1 }}>Priya's Kitchen</div>
          </div>
          <button
            onClick={() => setScreen('notifications')}
            style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '3px 3px 0px #000', position: 'relative', background: 'none' }}
          >
            🔔
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FF3B30', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '8px', color: '#fff' }}>2</span>
            </div>
          </button>
        </div>

        {/* Search bar */}
        <button onClick={() => setScreen('search')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginTop: '12px', backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '12px', padding: '10px 14px', boxShadow: '3px 3px 0px #000', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: '16px', opacity: 0.4 }}>🔍</span>
          <span style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.4 }}>Search menu, orders…</span>
        </button>

        {/* Open/Closed toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', backgroundColor: '#fff', border: 'none', borderRadius: '12px', padding: '10px 14px', boxShadow: '4px 4px 0px #000' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>Kitchen is OPEN</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>Accepting orders · Closes at 2:00 PM</div>
          </div>
          <div style={{ backgroundColor: '#22C55E', border: 'none', borderRadius: '8px', padding: '4px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', color: '#fff', boxShadow: '2px 2px 0px #000' }}>OPEN</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {analyticsStats.slice(0, 4).map(stat => (
          <div key={stat.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px' }}>
            <div style={{ fontSize: '20px', marginBottom: '2px' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>{stat.label}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', color: stat.positive ? '#22C55E' : '#FF3B30', marginTop: '2px' }}>{stat.delta} this week</div>
          </div>
        ))}
      </div>

      {/* Live orders */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px' }}>Live Orders</div>
          <button onClick={() => setScreen('orders')} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#000', background: 'none', border: '2px solid #000', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>See All</button>
        </div>
        {liveOrders.map(order => (
          <button
            key={order.id}
            onClick={() => setScreen('order_detail')}
            style={{ width: '100%', textAlign: 'left', backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px 14px', marginBottom: '8px', cursor: 'pointer', display: 'block' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px' }}>#{order.id}</div>
              <div style={{ backgroundColor: STATUS_COLOR[order.status], color: order.status === 'new' ? '#000' : '#fff', border: 'none', borderRadius: '6px', padding: '2px 9px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>
                {STATUS_LABEL[order.status]}
              </div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.7 }}>{order.customerName} · ₹ {order.total}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4, marginTop: '2px' }}>{order.items.length} items · {order.placedAt}</div>
          </button>
        ))}
      </div>

      {/* FEZU promo banner */}
      <div style={{ margin: '0 20px 20px', border: 'none', borderRadius: '14px', backgroundColor: '#FFC50A', boxShadow: '5px 5px 0px #000', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', position: 'relative' }}>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px' }}>FEZU Riders Ready</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.7, marginBottom: '8px', lineHeight: 1.4 }}>3 riders available nearby. Assign instantly!</div>
          <button onClick={() => setScreen('fezu')} style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#000', color: '#FFC50A', border: '2px solid #000', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', boxShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>Open FEZU</button>
        </div>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, marginLeft: 'auto' }}>
          <img src={fezuImg} alt="FEZU mascot" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
        </div>
      </div>
    </div>
  )
}
