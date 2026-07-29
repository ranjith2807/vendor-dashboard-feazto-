import { useState } from 'react'
import type { Screen } from '../App'
import { searchCategories, recentSearches, mockMenu } from '../data/mockData'

const TYPE_COLOR: Record<string, string> = {
  menu: '#FFC50A', customer: '#3B82F6', order: '#22C55E', community: '#8B5CF6',
}

export default function SearchScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? mockMenu.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setScreen('dashboard')}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
        >
          ←
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.4 }}>🔍</div>
          <input
            autoFocus
            type="text"
            placeholder="Search orders, menu, customers..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '12px', padding: '11px 12px 11px 36px', outline: 'none', boxSizing: 'border-box', boxShadow: '3px 3px 0px #000' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', opacity: 0.4 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {query.length === 0 ? (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>Recent</div>
                {recentSearches.map(rs => (
                  <button
                    key={rs.id}
                    onClick={() => setQuery(rs.query)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#fff', border: '2px solid #e5e5e5', borderRadius: '10px', marginBottom: '6px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ opacity: 0.35, fontSize: '14px' }}>{rs.icon}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '13px', flex: 1 }}>{rs.query}</span>
                    <span style={{ opacity: 0.25, fontSize: '12px' }}>↗</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick categories */}
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>Browse</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {searchCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setQuery(cat.label)}
                    style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '14px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '22px' }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px' }}>{cat.label}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '10px', color: TYPE_COLOR[cat.type] ?? '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>No results found</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.4 }}>Try a different search term</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map(item => (
              <div
                key={item.id}
                style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => setScreen('menu')}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: item.veg ? '#DCFCE7' : '#FEE2E2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {item.veg ? '🥦' : '🍗'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{item.category} · ₹{item.price}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px' }}>₹{item.price}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '10px', color: item.available ? '#22C55E' : '#FF3B30', fontWeight: 700, textAlign: 'right' }}>
                    {item.available ? 'Available' : 'Off'}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
