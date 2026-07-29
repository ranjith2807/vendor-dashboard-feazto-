import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { mockReviews } from '../data/mockData'

export default function ReviewDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const rev = mockReviews.find(r => r.id === navParams.id) ?? mockReviews[0]
  const [helpful, setHelpful] = useState(rev.helpful)
  const [voted, setVoted] = useState(false)

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('reviews')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Review Detail</div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', boxShadow: '3px 3px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>{rev.avatar}</div>
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '15px' }}>{rev.customerName}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>{rev.date}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>{[1,2,3,4,5].map(i => <span key={`rd_star_${i}`} style={{ color: i <= rev.rating ? '#FFC50A' : '#ddd' }}>★</span>)}</span>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>{rev.rating}.0</div>
          </div>

          <div style={{ backgroundColor: '#FFF8E7', borderRadius: '10px', padding: '14px', marginBottom: '14px', fontFamily: 'Inter', fontSize: '14px', lineHeight: 1.6, opacity: 0.8 }}>"{rev.comment}"</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: '#FFF8E7', border: 'none', borderRadius: '8px', padding: '5px 12px', fontFamily: 'Inter', fontWeight: 700, fontSize: '12px' }}>🍽️ {rev.dish}</div>
            {rev.hasPhoto && <div style={{ backgroundColor: '#DBEAFE', border: 'none', borderRadius: '8px', padding: '5px 12px', fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#3B82F6' }}>📷 Has Photo</div>}
          </div>

          {rev.hasPhoto && (
            <div style={{ backgroundColor: '#e5e5e5', borderRadius: '12px', border: 'none', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', fontSize: '32px' }}>📷</div>
          )}

          <div style={{ borderTop: '2px solid rgba(0,0,0,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Was this review helpful?</div>
            <button onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true) } }} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: voted ? '#22C55E' : '#fff', color: voted ? '#fff' : '#000', border: '2px solid #000', borderRadius: '8px', padding: '6px 12px', cursor: voted ? 'default' : 'pointer', boxShadow: voted ? 'none' : '2px 2px 0px #000' }}>
              👍 {helpful}
            </button>
          </div>
        </div>

        {/* Reply box */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>Reply to Customer</div>
          <textarea placeholder="Thank you for the feedback…" rows={3} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '13px', backgroundColor: '#FFF8E7', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 12px', outline: 'none', resize: 'none', marginBottom: '10px' }} />
          <button style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Send Reply</button>
        </div>
      </div>
    </div>
  )
}
