import { useState } from 'react'
import type { SetScreen } from '../App'
import { mockOrders, type Order, type OrderStatus } from '../data/mockData'

const STATUS_COLOR: Record<OrderStatus, string> = {
  new: '#FFC50A', accepted: '#3B82F6', preparing: '#F59E0B', ready: '#22C55E',
  picked_up: '#8B5CF6', delivered: '#10B981', cancelled: '#FF3B30',
}
const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'NEW', accepted: 'ACCEPTED', preparing: 'PREPARING', ready: 'READY',
  picked_up: 'PICKED UP', delivered: 'DELIVERED', cancelled: 'CANCELLED',
}

const filterTabs = [
  { id: 'filter_all', label: 'All', statuses: null },
  { id: 'filter_live', label: 'Live', statuses: ['new', 'accepted', 'preparing', 'ready'] },
  { id: 'filter_done', label: 'Done', statuses: ['delivered'] },
  { id: 'filter_cancelled', label: 'Cancelled', statuses: ['cancelled'] },
]

function OrderCard({ order, onTap }: { order: Order; onTap: () => void }) {
  const bg = STATUS_COLOR[order.status]
  const isNew = order.status === 'new'
  return (
    <button
      onClick={onTap}
      style={{ width: '100%', textAlign: 'left', backgroundColor: '#fff', border: `2.5px solid #000`, borderRadius: '13px', boxShadow: `5px 5px 0px ${isNew ? '#FFC50A' : '#000'}`, marginBottom: '10px', overflow: 'hidden', cursor: 'pointer', display: 'block' }}
    >
      <div style={{ backgroundColor: isNew ? '#FFC50A' : '#FFF8E7', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>{order.id}</div>
        <div style={{ backgroundColor: bg, color: isNew ? '#000' : '#fff', border: 'none', borderRadius: '6px', padding: '2px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isNew ? '#000' : '#fff', display: 'inline-block' }} />
          {STATUS_LABEL[order.status]}
        </div>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{order.customerName}</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>₹ {order.total}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
          {order.items.map(item => (
            <span key={item.id} style={{ fontFamily: 'Inter', fontSize: '11px', backgroundColor: '#FFF8E7', border: '1.5px solid #000', borderRadius: '5px', padding: '1px 7px' }}>
              ×{item.qty} {item.name}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>Placed {order.placedAt} · {order.address.split(',')[0]}</div>
      </div>
    </button>
  )
}

export default function OrdersScreen({ setScreen }: { setScreen: SetScreen }) {
  const [activeFilter, setActiveFilter] = useState('filter_all')

  const current = filterTabs.find(t => t.id === activeFilter)!
  const filtered = current.statuses
    ? mockOrders.filter(o => current.statuses!.includes(o.status))
    : mockOrders

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px' }}>Orders</div>
        <div style={{ backgroundColor: '#FFC50A', border: 'none', borderRadius: '8px', padding: '4px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', boxShadow: '3px 3px 0px #000' }}>
          {mockOrders.filter(o => o.status === 'new').length} NEW
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: '7px' }}>
        {filterTabs.map(tab => {
          const isA = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em', textTransform: 'uppercase', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '9px', padding: '8px 0', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000', transition: 'all 0.12s' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Order list */}
      <div style={{ padding: '0 20px 20px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'Inter', fontSize: '14px', opacity: 0.4 }}>No orders in this category</div>
        )}
        {filtered.map(order => (
          <OrderCard key={order.id} order={order} onTap={() => setScreen('order_detail', { id: order.id })} />
        ))}
      </div>
    </div>
  )
}
