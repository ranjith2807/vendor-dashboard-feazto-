import { useState } from 'react'
import type { Screen } from '../App'
import { mockMenu, menuCategories } from '../data/mockData'

export default function MenuScreen({ setScreen: _setScreen }: { setScreen: (s: Screen) => void }) {
  const [activeCategory, setActiveCategory] = useState('cat_all')
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>(
    Object.fromEntries(mockMenu.map(m => [m.id, m.available]))
  )

  const filtered = activeCategory === 'cat_all'
    ? mockMenu
    : mockMenu.filter(m => m.category === activeCategory)

  const toggle = (id: string) => setAvailabilityMap(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px' }}>Menu</div>
        <button style={{ backgroundColor: '#FFC50A', border: '2.5px solid #000', borderRadius: '10px', padding: '8px 14px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>+</span> Add Item
        </button>
      </div>

      {/* Category tabs */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: '7px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {menuCategories.map(cat => {
          const isA = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '9px', padding: '8px 14px', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000' }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Menu items */}
      <div style={{ padding: '0 20px 20px' }}>
        {filtered.map(item => {
          const avail = availabilityMap[item.id]
          return (
            <div
              key={item.id}
              style={{ backgroundColor: '#fff', border: 'none', borderRadius: '13px', boxShadow: '4px 4px 0px #000', padding: '12px 14px', marginBottom: '10px', opacity: avail ? 1 : 0.55 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                  {item.veg ? '🥗' : '🍗'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{item.name}</div>
                    {item.popular && (
                      <div style={{ backgroundColor: '#FFC50A', border: '1.5px solid #000', borderRadius: '4px', padding: '0 5px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '9px' }}>HOT</div>
                    )}
                    <div style={{ width: '10px', height: '10px', border: `2px solid ${item.veg ? '#22C55E' : '#FF3B30'}`, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: item.veg ? '#22C55E' : '#FF3B30' }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5, marginBottom: '4px' }}>{item.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>₹ {item.price}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>★ {item.rating} ({item.reviews})</div>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggle(item.id)}
                  style={{ width: '48px', height: '26px', borderRadius: '13px', backgroundColor: avail ? '#22C55E' : '#ddd', border: 'none', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', flexShrink: 0, padding: 0 }}
                >
                  <span style={{ position: 'absolute', top: '2px', left: avail ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
