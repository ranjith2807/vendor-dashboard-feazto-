import { useState } from 'react'
import type { Screen } from '../App'
import { transactions } from '../data/mockData'
import fezuImg from '../imports/image.png'

export default function WalletScreen({ setScreen: _setScreen }: { setScreen: (s: Screen) => void }) {
  const [activeFilter, setActiveFilter] = useState('wf_all')

  const filters = [
    { id: 'wf_all', label: 'All' },
    { id: 'wf_credit', label: 'Credits' },
    { id: 'wf_debit', label: 'Debits' },
    { id: 'wf_pending', label: 'Pending' },
  ]

  const filtered = transactions.filter(t => {
    if (activeFilter === 'wf_all') return true
    if (activeFilter === 'wf_credit') return t.type === 'credit'
    if (activeFilter === 'wf_debit') return t.type === 'debit'
    if (activeFilter === 'wf_pending') return t.status === 'pending'
    return true
  })

  const totalBalance = 8420
  const pendingSettlement = 3280
  const availableBalance = totalBalance - 0

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Wallet hero card */}
      <div style={{ margin: '12px 20px', backgroundColor: '#000', border: 'none', borderRadius: '16px', boxShadow: '6px 6px 0px #FFC50A', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        {/* Mascot watermark */}
        <div style={{ position: 'absolute', right: '-15px', bottom: '-20px', opacity: 0.1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src={fezuImg} alt="" aria-hidden style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.1)', transformOrigin: 'center top' }} />
          </div>
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FFF8E7', opacity: 0.55, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
          FEAZTO Wallet · Priya's Kitchen
        </div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '42px', lineHeight: 1, color: '#FFC50A', marginBottom: '4px' }}>
          ₹ {availableBalance.toLocaleString()}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#FFF8E7', opacity: 0.5, marginBottom: '16px' }}>Available balance</div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#FFF8E7', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Pending</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', color: '#F59E0B' }}>₹ {pendingSettlement.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#FFF8E7', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Today's Earn</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', color: '#22C55E' }}>₹ {(475).toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2px solid #FFF8E7', borderRadius: '10px', padding: '11px', cursor: 'pointer', boxShadow: '3px 3px 0px rgba(255,255,255,0.3)' }}>
            💳 Withdraw
          </button>
          <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: 'transparent', color: '#FFF8E7', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '10px', padding: '11px', cursor: 'pointer' }}>
            📄 Invoice
          </button>
        </div>
      </div>

      {/* Bank details strip */}
      <div style={{ margin: '0 20px 14px', backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#3B82F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🏦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>HDFC Bank Savings</div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>AC ×××× ×××× ×××× 4321 · IFSC HDFC0001234</div>
        </div>
        <button style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: '#000', background: 'none', border: '2px solid #000', borderRadius: '6px', padding: '3px 9px', cursor: 'pointer' }}>Edit</button>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: '7px' }}>
        {filters.map(f => {
          const isA = activeFilter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '9px', padding: '7px 0', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000' }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Transactions */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>Transactions</div>
        {filtered.map(txn => (
          <div key={txn.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: txn.type === 'credit' ? '#DCFCE7' : '#FEE2E2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              {txn.type === 'credit' ? '↓' : '↑'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.description}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{txn.date}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: txn.type === 'credit' ? '#22C55E' : '#FF3B30' }}>
                {txn.type === 'credit' ? '+' : '−'} ₹ {txn.amount.toLocaleString()}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', color: txn.status === 'pending' ? '#F59E0B' : txn.status === 'success' ? '#22C55E' : '#FF3B30', fontWeight: 700, letterSpacing: '0.06em' }}>
                {txn.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
