import { useState } from 'react'
import type { SetScreen, NavParams } from '../App'
import { mockMenu } from '../data/mockData'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']

export default function MenuEditDishScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const dish = mockMenu.find(d => d.id === navParams.id) ?? mockMenu[0]
  const [form, setForm] = useState({ name: dish.name, category: dish.category, price: String(dish.price), desc: dish.description, calories: String(dish.calories), prepTime: '20', veg: dish.veg, available: dish.available })
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  if (saved) return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}>✓</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '6px', textAlign: 'center' }}>Dish Updated!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '24px', textAlign: 'center' }}>"{form.name}" has been saved.</div>
      <button onClick={() => setScreen('menu')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Back to Menu →</button>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px', flex: 1 }}>Edit Dish</div>
        <button onClick={() => setShowDelete(true)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#FF3B30', background: 'none', border: '2px solid #FF3B30', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>Delete</button>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '18px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Dish Name</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {CATEGORIES.map(c => <button key={c} onClick={() => set('category', c)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: form.category === c ? '#000' : '#fff', color: form.category === c ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer' }}>{c}</button>)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price (₹)</label>
              <input type="tel" value={form.price} onChange={e => set('price', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Calories</label>
              <input type="tel" value={form.calories} onChange={e => set('calories', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{`Prep Time: ${form.prepTime} min`}</label>
            <input type="range" min="5" max="90" step="5" value={form.prepTime} onChange={e => set('prepTime', e.target.value)} style={{ width: '100%', accentColor: '#FFC50A' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {[{ id: 'ev_veg', l: '🟢 Veg', v: true }, { id: 'ev_nveg', l: '🔴 Non-Veg', v: false }].map(o => (
              <button key={o.id} onClick={() => set('veg', o.v)} style={{ flex: 1, fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', backgroundColor: form.veg === o.v ? '#000' : '#fff', color: form.veg === o.v ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>{o.l}</button>
            ))}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Available</label>
            <button onClick={() => set('available', !form.available)} style={{ width: '46px', height: '26px', borderRadius: '13px', backgroundColor: form.available ? '#22C55E' : '#ddd', border: '2.5px solid #000', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', padding: 0 }}>
              <span style={{ position: 'absolute', top: '2px', left: form.available ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
            </button>
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' } as React.CSSProperties} />
          </div>
          <button onClick={() => setSaved(true)} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Save Changes →</button>
        </div>
      </div>

      {showDelete && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', backgroundColor: '#FFF8E7', border: 'none', borderRadius: '20px 20px 0 0', padding: '20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '8px' }}>Delete "{dish.name}"?</div>
            <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '18px' }}>This will permanently remove the dish from your menu.</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDelete(false)} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Cancel</button>
              <button onClick={() => setScreen('menu')} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FF3B30', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#FFF8E7', border: 'none', borderRadius: '10px', padding: '11px 13px', outline: 'none' }
