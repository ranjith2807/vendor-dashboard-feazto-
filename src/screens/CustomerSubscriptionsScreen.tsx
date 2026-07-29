import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { customerSubscriptions, type CustomerSubscription } from '../data/mockData'

const STATUS_META: Record<CustomerSubscription['status'], { label: string; color: string; bg: string }> = {
  active:        { label: 'ACTIVE',    color: '#22C55E', bg: '#DCFCE7' },
  paused:        { label: 'PAUSED',    color: '#F59E0B', bg: '#FEF3C7' },
  expired:       { label: 'EXPIRED',   color: '#888',    bg: '#F3F4F6' },
  expiring_soon: { label: 'EXPIRING',  color: '#FF3B30', bg: '#FEE2E2' },
}

const FREQ_TABS = [
  { id: 'freq_all',     label: 'All' },
  { id: 'freq_daily',   label: 'Daily' },
  { id: 'freq_weekly',  label: 'Weekly' },
  { id: 'freq_monthly', label: 'Monthly' },
]

export default function CustomerSubscriptionsScreen({ setScreen, navParams: _navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [freq, setFreq] = useState('freq_all')
  const [subs] = useState(customerSubscriptions)

  const filtered = subs.filter(s => freq === 'freq_all' || s.frequency === freq.replace('freq_', ''))
  const active = subs.filter(s => s.status === 'active').length

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('orders')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Subscriptions</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>{active} active plan{active !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Freq tabs */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: '7px', overflowX: 'auto' }}>
        {FREQ_TABS.map(t => {
          const a = freq === t.id
          return <button key={t.id} onClick={() => setFreq(t.id)} style={{ flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: a ? '#000' : '#fff', color: a ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', boxShadow: a ? 'none' : '2px 2px 0px #000' }}>{t.label}</button>
        })}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>📋</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', marginBottom: '6px' }}>No Subscribers Yet</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.4, maxWidth: '240px', margin: '0 auto' }}>Create meal plans to attract loyal customers.</div>
          </div>
        ) : filtered.map(sub => {
          const m = STATUS_META[sub.status]
          const pct = sub.mealsDelivered / (sub.mealsDelivered + sub.mealsRemaining) * 100
          return (
            <div key={sub.id} onClick={() => setScreen('customer_subscription_detail', { id: sub.id })} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{sub.customerName}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>{sub.plan} · {sub.deliveryTime}</div>
                </div>
                <div style={{ backgroundColor: m.bg, color: m.color, border: `2px solid ${m.color}`, borderRadius: '7px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>{m.label}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                {[{ id: 'sm_del', lbl: 'Delivered', val: sub.mealsDelivered }, { id: 'sm_rem', lbl: 'Remaining', val: sub.mealsRemaining }].map(s => (
                  <div key={s.id} style={{ flex: 1, textAlign: 'center', padding: '8px', backgroundColor: '#FFF8E7', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>{s.val}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.45 }}>{s.lbl}</div>
                  </div>
                ))}
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', backgroundColor: '#FFF8E7', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', color: '#22C55E' }}>₹{sub.amountPaid.toLocaleString()}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.45 }}>Paid</div>
                </div>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: m.color, width: `${pct}%`, borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.35, marginTop: '4px' }}>{sub.startDate} → {sub.endDate}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
