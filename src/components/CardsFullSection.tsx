import FeaztoMascot from './FeaztoMascot'

function DashboardCard({ icon, label, value, delta, color }: { icon: string; label: string; value: string; delta: string; color: string }) {
  const pos = delta.startsWith('+')
  return (
    <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px', flex: 1, minWidth: '44%' }}>
      <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', color }}>{value}</div>
      <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: pos ? '#22C55E' : '#FF3B30', marginTop: '4px' }}>{delta} today</div>
    </div>
  )
}

function DishCard() {
  const [fav, setFav] = useState(false)
  return (
    <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', overflow: 'hidden', marginBottom: '10px' }}>
      <div style={{ height: '110px', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFD740 100%)', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: '52px' }}>🥘</span>
        <button onClick={() => setFav(f => !f)} style={{ position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: '2px 2px 0px #000' }}>
          {fav ? '❤️' : '🤍'}
        </button>
        <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '6px', padding: '2px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>VEG</div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>Masala Dosa</div>
            <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>South Indian · 280 cal</div>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px' }}>₹ 80</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>★ 4.7</span>
          <span style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>(218)</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>🕐 20 min</span>
        </div>
      </div>
    </div>
  )
}

function ReviewCard() {
  return (
    <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>RK</div>
        <div>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>Ravi Kumar</div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>2 hours ago</div>
        </div>
        <div style={{ marginLeft: 'auto', backgroundColor: '#FFC50A', border: 'none', borderRadius: '7px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>★ 4.5</div>
      </div>
      <p style={{ fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.5, color: '#000', margin: 0, opacity: 0.8 }}>
        "Absolutely loved the Masala Dosa! Crispy, perfectly seasoned, and the chutney was divine. Will order again!"
      </p>
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', backgroundColor: '#FFF8E7', border: '2px solid #000', borderRadius: '999px', padding: '4px 12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>👍 Helpful</button>
        <button style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '999px', padding: '4px 12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>Reply</button>
      </div>
    </div>
  )
}

function WalletCard() {
  return (
    <div style={{ border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', background: 'linear-gradient(135deg, #000 0%, #2A2A2A 100%)', padding: '18px', marginBottom: '10px', color: '#FFF8E7', position: 'relative', overflow: 'hidden' }}>
      {/* BG pattern */}
      <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08 }}>
        <FeaztoMascot size={110} />
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>FEAZTO Wallet</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '38px', lineHeight: 1 }}>₹ 8,420</div>
      <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5, marginBottom: '16px' }}>Available balance</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #FFF8E7', borderRadius: '9px', padding: '9px', cursor: 'pointer', boxShadow: '3px 3px 0px #FFF8E7' }}>Withdraw</button>
        <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: 'transparent', color: '#FFF8E7', border: '2.5px solid #FFF8E7', borderRadius: '9px', padding: '9px', cursor: 'pointer' }}>History</button>
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function CardsFullSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Card Library
      </div>

      {/* Dashboard stats */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Dashboard Stats</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <DashboardCard icon="🛒" label="Orders Today" value="48" delta="+12%" color="#FFC50A" />
        <DashboardCard icon="₹" label="Revenue" value="₹ 6,840" delta="+8%" color="#22C55E" />
        <DashboardCard icon="⭐" label="Avg Rating" value="4.7" delta="+0.2" color="#F59E0B" />
        <DashboardCard icon="🚴" label="FEZU Rides" value="32" delta="+5" color="#3B82F6" />
      </div>

      {/* Dish card */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Dish Card</div>
      <DishCard />

      {/* Review card */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Review Card</div>
      <ReviewCard />

      {/* Wallet card */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Wallet Card</div>
      <WalletCard />
    </div>
  )
}
