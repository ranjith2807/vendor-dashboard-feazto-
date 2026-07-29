import type { Screen } from '../App'
import { notificationItems } from '../data/mockData'

const TYPE_ICON: Record<string, string> = {
  order: '🛒', fezu: '🚴', payment: '💰', review: '⭐', community: '💬',
}

export default function NotificationsScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('dashboard')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Notifications</div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        {notificationItems.map(n => (
          <div
            key={n.id}
            style={{ backgroundColor: n.read ? '#fff' : '#FFF8E7', border: `2.5px solid ${n.read ? '#ddd' : '#000'}`, borderRadius: '12px', boxShadow: n.read ? 'none' : '4px 4px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF8E7', border: `2px solid ${n.read ? '#ddd' : '#000'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>
              {TYPE_ICON[n.type]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: n.read ? '#666' : '#000' }}>{n.title}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.55 }}>{n.body}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.35, marginTop: '2px' }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', flexShrink: 0, marginTop: '3px' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
