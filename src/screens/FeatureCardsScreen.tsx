import { useState } from 'react'
import type { SetScreen } from '../App'
import { allFeatureCards, type FeatureCard } from '../data/mockData'

const MAX = 10

export default function FeatureCardsScreen({ setScreen }: { setScreen: SetScreen }) {
  const [cards, setCards] = useState<FeatureCard[]>(allFeatureCards)
  const [searchQ, setSearchQ] = useState('')
  const [tab, setTab] = useState<'active' | 'add'>('active')
  const [toast, setToast] = useState('')

  const active = cards.filter(c => c.active)
  const available = cards.filter(c => !c.active && (searchQ === '' || c.label.toLowerCase().includes(searchQ.toLowerCase())))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const toggle = (id: string, on: boolean) => {
    if (on && active.length >= MAX) { showToast(`Maximum ${MAX} feature cards allowed`); return }
    setCards(p => p.map(c => c.id === id ? { ...c, active: on } : c))
    if (on) showToast('Feature card added!')
    else showToast('Feature card removed')
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Feature Cards</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Highlight what makes your kitchen special</div>
        </div>
        <div style={{ backgroundColor: active.length >= MAX ? '#FF3B30' : '#FFC50A', border: 'none', borderRadius: '20px', padding: '4px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>
          {active.length}/{MAX}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px 20px' }}>
        {(['active', 'add'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: tab === t ? '#000' : '#fff', color: tab === t ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '9px', cursor: 'pointer', boxShadow: tab === t ? 'none' : '2px 2px 0px #000' }}>
            {t === 'active' ? `Active (${active.length})` : 'Add Feature'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {tab === 'active' ? (
          active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🃏</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>No Feature Cards Yet</div>
              <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.45, maxWidth: '240px', margin: '0 auto' }}>Add features to tell customers what makes your kitchen unique.</div>
              <button onClick={() => setTab('add')} style={{ marginTop: '16px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '11px 22px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Add Your First Card →</button>
            </div>
          ) : (
            <>
              {active.length <= 5 && (
                <div style={{ backgroundColor: '#FEF3C7', border: '2.5px solid #F59E0B', borderRadius: '12px', padding: '12px 14px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px' }}>💡</span>
                  <div style={{ fontFamily: 'Inter', fontSize: '12px', lineHeight: 1.5 }}>You have {active.length} feature card{active.length !== 1 ? 's' : ''}. Add {5 - active.length + 1} more to stop monthly reminders and improve visibility!</div>
                </div>
              )}
              {active.map(card => (
                <div key={card.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{card.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{card.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{card.description}</div>
                  </div>
                  <button onClick={() => toggle(card.id, false)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', backgroundColor: '#FEE2E2', color: '#FF3B30', border: '2px solid #FF3B30', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </>
          )
        ) : (
          <>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', opacity: 0.4 }}>🔍</div>
              <input type="text" placeholder="Search features…" value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '12px', padding: '11px 12px 11px 34px', outline: 'none', boxShadow: '3px 3px 0px #000' }} />
            </div>
            {active.length >= MAX && (
              <div style={{ backgroundColor: '#FEE2E2', border: '2.5px solid #FF3B30', borderRadius: '12px', padding: '12px', marginBottom: '12px', fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#FF3B30', textAlign: 'center' }}>Maximum {MAX} cards reached. Remove one to add another.</div>
            )}
            {available.map(card => (
              <div key={card.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{card.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{card.label}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{card.description}</div>
                </div>
                <button onClick={() => toggle(card.id, true)} disabled={active.length >= MAX} style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: active.length >= MAX ? '#ddd' : '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '8px', padding: '7px 12px', cursor: active.length >= MAX ? 'not-allowed' : 'pointer', boxShadow: active.length >= MAX ? 'none' : '2px 2px 0px #000' }}>+ Add</button>
              </div>
            ))}
            {available.length === 0 && searchQ && (
              <div style={{ textAlign: 'center', padding: '32px 0', fontFamily: 'Inter', fontSize: '13px', opacity: 0.4 }}>No features match "{searchQ}"</div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'absolute', bottom: '90px', left: '20px', right: '20px', backgroundColor: '#000', color: '#FFC50A', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', border: '2px solid #FFC50A', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', boxShadow: '3px 3px 0px #FFC50A' }}>{toast}</div>
      )}
    </div>
  )
}
