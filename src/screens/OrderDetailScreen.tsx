import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { mockOrders, type OrderStatus } from '../data/mockData'

const STATUS_SEQ: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered']
const STATUS_LABEL: Record<OrderStatus, string> = { new: 'NEW', accepted: 'ACCEPTED', preparing: 'PREPARING', ready: 'READY FOR PICKUP', picked_up: 'PICKED UP', delivered: 'DELIVERED', cancelled: 'CANCELLED' }
const STATUS_COLOR: Record<OrderStatus, string> = { new: '#FFC50A', accepted: '#3B82F6', preparing: '#F59E0B', ready: '#22C55E', picked_up: '#8B5CF6', delivered: '#10B981', cancelled: '#FF3B30' }
const NEXT_ACTION: Partial<Record<OrderStatus, string>> = { new: 'Accept Order', accepted: 'Start Preparing', preparing: 'Mark Ready', ready: 'Show Pickup QR' }

const REJECT_REASONS = [
  { id: 'rr_001', label: 'Kitchen too busy right now' },
  { id: 'rr_002', label: 'Ingredients not available' },
  { id: 'rr_003', label: 'Kitchen closed' },
  { id: 'rr_004', label: 'Order too large' },
]

export default function OrderDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [orders, setOrders] = useState(mockOrders)
  const [showReject, setShowReject] = useState(false)
  const [rejReason, setRejReason] = useState('')

  const orderId = navParams.id ?? mockOrders[0]?.id
  const order = orders.find(o => o.id === orderId) ?? orders[0]

  if (!order) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>Order not found</div>

  const seqIdx = STATUS_SEQ.indexOf(order.status as OrderStatus)
  const nextStatus = STATUS_SEQ[seqIdx + 1]

  const advance = () => {
    if (order.status === 'ready') { setScreen('order_qr', { id: order.id }); return }
    if (!nextStatus) return
    setOrders(p => p.map(o => o.id === order.id ? { ...o, status: nextStatus } : o))
  }

  const reject = () => {
    setOrders(p => p.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o))
    setShowReject(false)
  }

  const statusColor = STATUS_COLOR[order.status as OrderStatus] ?? '#888'

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('orders')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>Order #{order.id.replace('ord_', '')}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>{order.placedAt} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ backgroundColor: statusColor, color: ['new','ready'].includes(order.status) ? '#000' : '#fff', border: 'none', borderRadius: '8px', padding: '5px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>
          {STATUS_LABEL[order.status as OrderStatus]}
        </div>
      </div>

      <div style={{ padding: '0 20px 100px' }}>
        {/* Customer */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>Customer</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
              {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{order.customerName}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>{order.customerPhone}</div>
            </div>
            <a href={`tel:${order.customerPhone}`} style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#22C55E', border: '2.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, textDecoration: 'none' }}>📞</a>
          </div>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#FFF8E7', borderRadius: '8px', fontFamily: 'Inter', fontSize: '12px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ flexShrink: 0 }}>📍</span><span style={{ opacity: 0.65 }}>{order.address}</span>
          </div>
        </div>

        {/* Items */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>Order Items</div>
          {order.items.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1.5px dashed rgba(0,0,0,0.1)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{item.qty}×</div>
                <div style={{ fontFamily: 'Inter', fontSize: '13px' }}>{item.name}</div>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px' }}>₹{(item.qty * item.price).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop: '1.5px dashed rgba(0,0,0,0.1)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>Total</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>₹{order.total.toLocaleString()}</div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '12px' }}>Order Timeline</div>
          {STATUS_SEQ.slice(0, Math.max(seqIdx + 2, 2)).map((s, i) => {
            const done = i <= seqIdx
            const current = i === seqIdx
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: i < Math.min(seqIdx + 1, STATUS_SEQ.length - 1) ? '14px' : 0, position: 'relative' }}>
                {i < Math.min(seqIdx + 1, STATUS_SEQ.length - 1) && <div style={{ position: 'absolute', left: '11px', top: '22px', width: '2px', height: 'calc(100% - 8px)', backgroundColor: done ? STATUS_COLOR[s] : 'rgba(0,0,0,0.1)' }} />}
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: done ? STATUS_COLOR[s] : '#fff', border: `2.5px solid ${done ? STATUS_COLOR[s] : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0, zIndex: 1 }}>
                  {done ? '✓' : ''}
                </div>
                <div style={{ paddingTop: '2px' }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: current ? 700 : 400, fontSize: '12px', opacity: done ? 1 : 0.35 }}>{STATUS_LABEL[s]}</div>
                  {current && <div style={{ fontFamily: 'Inter', fontSize: '10px', color: statusColor, fontWeight: 700 }}>● Now</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action bar */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: 'none', padding: '12px 20px', display: 'flex', gap: '10px' }}>
          {order.status === 'new' && (
            <button onClick={() => setShowReject(true)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FF3B30', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Reject</button>
          )}
          {NEXT_ACTION[order.status as OrderStatus] && (
            <button onClick={advance} style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>
              {NEXT_ACTION[order.status as OrderStatus]} →
            </button>
          )}
        </div>
      )}

      {/* Reject sheet */}
      {showReject && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', backgroundColor: '#FFF8E7', border: 'none', borderRadius: '20px 20px 0 0', boxShadow: '0 -4px 0px #000', padding: '20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '14px' }}>Rejection Reason</div>
            {REJECT_REASONS.map(r => (
              <button key={r.id} onClick={() => setRejReason(r.id)} style={{ width: '100%', textAlign: 'left', fontFamily: 'Inter', fontSize: '13px', fontWeight: rejReason === r.id ? 700 : 400, backgroundColor: rejReason === r.id ? '#FFC50A' : '#fff', border: `2.5px solid ${rejReason === r.id ? '#000' : '#ddd'}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', cursor: 'pointer', boxShadow: rejReason === r.id ? '3px 3px 0px #000' : 'none' }}>{r.label}</button>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setShowReject(false)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Cancel</button>
              <button onClick={reject} disabled={!rejReason} style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: rejReason ? '#FF3B30' : '#ddd', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: rejReason ? 'pointer' : 'not-allowed', boxShadow: rejReason ? '3px 3px 0px #000' : 'none' }}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
