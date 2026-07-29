import { useState } from 'react'
import type { SetScreen } from '../App'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']

export default function MenuAddDishScreen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({ name: '', category: '', price: '', desc: '', calories: '', prepTime: '15', veg: true, available: true })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const set = (k: string, v: string | boolean) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Dish name required'
    if (!form.category) e.category = 'Select category'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Enter valid price'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (saved) return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#22C55E', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}>✓</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '6px', textAlign: 'center' }}>Dish Added!</div>
      <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5, marginBottom: '24px', textAlign: 'center' }}>"{form.name}" has been added to your menu.</div>
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <button onClick={() => setSaved(false)} style={{ flex: 1, fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>Add Another</button>
        <button onClick={() => setScreen('menu')} style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>View Menu →</button>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Add Dish</div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* Photo upload */}
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#FFF8E7', border: '2.5px dashed rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>📷</span>
            <span style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4, marginTop: '3px' }}>Add Photo</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>Dish Photo</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45, lineHeight: 1.5 }}>Upload a clear photo of your dish. Good photos increase orders by 40%.</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '18px' }}>
          {/* Name */}
          <FieldBlock label="Dish Name" error={errors.name}>
            <input type="text" placeholder="e.g. Masala Dosa" value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle(!!errors.name)} />
          </FieldBlock>

          {/* Category */}
          <FieldBlock label="Category" error={errors.category}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {CATEGORIES.map(c => <button key={c} onClick={() => set('category', c)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: form.category === c ? '#000' : '#fff', color: form.category === c ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer' }}>{c}</button>)}
            </div>
          </FieldBlock>

          {/* Price & Calories */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <FieldBlock label="Price (₹)" error={errors.price}>
                <input type="tel" placeholder="80" value={form.price} onChange={e => set('price', e.target.value)} style={inputStyle(!!errors.price)} />
              </FieldBlock>
            </div>
            <div style={{ flex: 1 }}>
              <FieldBlock label="Calories (kcal)" error={''}>
                <input type="tel" placeholder="250" value={form.calories} onChange={e => set('calories', e.target.value)} style={inputStyle(false)} />
              </FieldBlock>
            </div>
          </div>

          {/* Prep time */}
          <FieldBlock label={`Prep Time: ${form.prepTime} min`} error={''}>
            <input type="range" min="5" max="90" step="5" value={form.prepTime} onChange={e => set('prepTime', e.target.value)} style={{ width: '100%', accentColor: '#FFC50A' }} />
          </FieldBlock>

          {/* Veg toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            {[{ id: 'add_veg', label: '🟢 Pure Veg', val: true }, { id: 'add_nveg', label: '🔴 Non-Veg', val: false }].map(opt => (
              <button key={opt.id} onClick={() => set('veg', opt.val)} style={{ flex: 1, marginRight: opt.val ? '6px' : '0', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', backgroundColor: form.veg === opt.val ? '#000' : '#fff', color: form.veg === opt.val ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '10px', padding: '10px', cursor: 'pointer', boxShadow: form.veg === opt.val ? 'none' : '2px 2px 0px #000' }}>{opt.label}</button>
            ))}
          </div>

          {/* Description */}
          <FieldBlock label="Description" error={''}>
            <textarea placeholder="Short description of the dish…" value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} style={{ ...inputStyle(false), resize: 'none' } as React.CSSProperties} />
          </FieldBlock>

          <button onClick={() => validate() && setSaved(true)} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Add to Menu →</button>
        </div>
      </div>
    </div>
  )
}

function inputStyle(err: boolean): React.CSSProperties {
  return { width: '100%', boxSizing: 'border-box' as const, fontFamily: 'Inter', fontSize: '14px', backgroundColor: err ? '#FEF3F2' : '#FFF8E7', border: `2.5px solid ${err ? '#FF3B30' : '#000'}`, borderRadius: '10px', padding: '11px 13px', outline: 'none' }
}

function FieldBlock({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>{label}</label>
      {children}
      {error && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FF3B30', fontWeight: 700, marginTop: '3px' }}>{error}</div>}
    </div>
  )
}
