import type { Screen } from '../App'
import { subscriptionInfo } from '../data/mockData'

export default function SettingsSubscriptionScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { plan, price, billingCycle, renewsOn, features, invoices } = subscriptionInfo

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Subscription</div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* Plan card */}
        <div style={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', boxShadow: '6px 6px 0px #FFC50A', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,197,10,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FFC50A', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Current Plan</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', color: '#fff', lineHeight: 1 }}>{plan}</div>
            </div>
            <div style={{ backgroundColor: '#FFC50A', border: '2px solid #fff', borderRadius: '8px', padding: '4px 10px' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', color: '#000' }}>ACTIVE</div>
            </div>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', color: '#FFC50A', marginBottom: '4px' }}>
            ₹{price.toLocaleString()}<span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.7, fontFamily: 'Inter' }}>/{billingCycle.toLowerCase()}</span>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#FFF8E7', opacity: 0.55 }}>Renews on {renewsOn}</div>
        </div>

        {/* Features */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Plan Features</div>
          {features.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: f.included ? '#DCFCE7' : '#F3F4F6', border: `2px solid ${f.included ? '#22C55E' : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: f.included ? '#22C55E' : '#aaa', flexShrink: 0 }}>
                {f.included ? '✓' : '✕'}
              </div>
              <div style={{ fontFamily: 'Inter', fontWeight: f.included ? 600 : 400, fontSize: '13px', opacity: f.included ? 1 : 0.4 }}>{f.label}</div>
            </div>
          ))}
          <button style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', marginTop: '4px' }}>
            Upgrade to Business →
          </button>
        </div>

        {/* Billing history */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Billing History</div>
          {invoices.map((inv, i) => (
            <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: i < invoices.length - 1 ? '10px' : 0, marginBottom: i < invoices.length - 1 ? '10px' : 0, borderBottom: i < invoices.length - 1 ? '1.5px solid rgba(0,0,0,0.06)' : 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#DCFCE7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>Invoice — {inv.date}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{plan} Plan · {billingCycle}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px' }}>₹{inv.amount}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#22C55E', fontWeight: 700 }}>{inv.status.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cancel */}
        <button style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', background: 'none', border: '2px solid rgba(0,0,0,0.15)', borderRadius: '10px', padding: '12px', cursor: 'pointer', color: '#FF3B30' }}>
          Cancel Subscription
        </button>
      </div>
    </div>
  )
}
