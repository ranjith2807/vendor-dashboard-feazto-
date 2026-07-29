import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { customerSubscriptions } from '../data/mockData'

export default function CustomerSubscriptionDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const sub = customerSubscriptions.find(s => s.id === navParams.id) ?? customerSubscriptions[0]
  const [paused, setPaused] = useState(sub.status === 'paused')

  const pct = sub.mealsDelivered / (sub.mealsDelivered + sub.mealsRemaining) * 100

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('customer_subscriptions')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', flex: 1 }}>Subscription</div>
        <a href={`tel:${sub.customerPhone}`} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#22C55E', border: '2.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', textDecoration: 'none' }}>📞</a>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* Customer */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px' }}>{sub.customerName}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45, marginBottom: '8px' }}>{sub.customerPhone}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span>📍</span><span style={{ opacity: 0.6 }}>{sub.address}</span>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', display: 'flex', gap: '6px', marginTop: '4px' }}>
            <span>⏰</span><span style={{ opacity: 0.6 }}>Delivery at {sub.deliveryTime}</span>
          </div>
        </div>

        {/* Plan */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{sub.plan}</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {sub.meals.map((m, i) => <div key={`meal_${i}`} style={{ backgroundColor: '#FFF8E7', border: 'none', borderRadius: '8px', padding: '4px 10px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700 }}>{m}</div>)}
          </div>
          <div style={{ height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ height: '100%', backgroundColor: '#22C55E', width: `${pct}%`, borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>
            <span>{sub.mealsDelivered} delivered</span>
            <span>{sub.mealsRemaining} remaining</span>
          </div>
        </div>

        {/* Payment */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>Payment</div>
          {[{ id: 'pm_paid', k: 'Amount Paid', v: `₹${sub.amountPaid.toLocaleString()}`, color: '#22C55E' }, { id: 'pm_total', k: 'Total Amount', v: `₹${sub.amountTotal.toLocaleString()}`, color: '#000' }, { id: 'pm_start', k: 'Start Date', v: sub.startDate, color: '#000' }, { id: 'pm_end', k: 'End Date', v: sub.endDate, color: '#000' }].map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5 }}>{r.k}</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: r.color }}>{r.v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setPaused(!paused)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: paused ? '#22C55E' : '#F59E0B', color: paused ? '#fff' : '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>📞 Contact</button>
        </div>
      </div>
    </div>
  )
}
