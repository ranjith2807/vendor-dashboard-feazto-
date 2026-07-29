import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { mockReviews } from '../data/mockData'

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => <span key={`star_${i}`} style={{ color: i <= rating ? '#FFC50A' : '#ddd' }}>★</span>)}
    </span>
  )
}

const DIST = [
  { id: 'dist_5', stars: 5, count: 3 },
  { id: 'dist_4', stars: 4, count: 2 },
  { id: 'dist_3', stars: 3, count: 1 },
  { id: 'dist_2', stars: 2, count: 0 },
  { id: 'dist_1', stars: 1, count: 0 },
]
const total = DIST.reduce((a, d) => a + d.count, 0)
const avg = (DIST.reduce((a, d) => a + d.stars * d.count, 0) / total).toFixed(1)

export default function ReviewsScreen({ setScreen, navParams: _navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [filter, setFilter] = useState(0)
  const [reviews, setReviews] = useState(mockReviews)

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  const bookmark = (id: string) => setReviews(p => p.map(r => r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('dashboard')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Reviews & Ratings</div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* Summary */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', padding: '16px', marginBottom: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '52px', lineHeight: 1 }}>{avg}</div>
            <Stars rating={Math.round(parseFloat(avg))} size={16} />
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45, marginTop: '3px' }}>{total} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {DIST.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 700, width: '14px', textAlign: 'right' }}>{d.stars}</div>
                <span style={{ fontSize: '10px', color: '#FFC50A' }}>★</span>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#FFC50A', width: total ? `${(d.count / total) * 100}%` : '0%', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', width: '14px', opacity: 0.45 }}>{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '7px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[{ id: 'rf_all', label: 'All', val: 0 }, ...[5,4,3,2,1].map(n => ({ id: `rf_${n}`, label: `${n} ★`, val: n }))].map(f => {
            const a = filter === f.val
            return <button key={f.id} onClick={() => setFilter(f.val)} style={{ flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', backgroundColor: a ? '#000' : '#fff', color: a ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', boxShadow: a ? 'none' : '2px 2px 0px #000', whiteSpace: 'nowrap' }}>{f.label}</button>
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>No {filter}★ Reviews Yet</div>
          </div>
        ) : filtered.map(rev => (
          <div key={rev.id} onClick={() => setScreen('review_detail', { id: rev.id })} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '3px 3px 0px #000', padding: '14px', marginBottom: '10px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{rev.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{rev.customerName}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{rev.date} · {rev.dish}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); bookmark(rev.id) }} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', opacity: rev.bookmarked ? 1 : 0.3 }}>🔖</button>
            </div>
            <Stars rating={rev.rating} />
            <div style={{ fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.5, marginTop: '6px', opacity: 0.7, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{rev.comment}</div>
            {rev.hasPhoto && <div style={{ marginTop: '8px', fontFamily: 'Inter', fontSize: '11px', color: '#3B82F6', fontWeight: 700 }}>📷 Photo attached</div>}
            <div style={{ marginTop: '8px', fontFamily: 'Inter', fontSize: '11px', opacity: 0.35 }}>👍 {rev.helpful} found helpful</div>
          </div>
        ))}
      </div>
    </div>
  )
}
