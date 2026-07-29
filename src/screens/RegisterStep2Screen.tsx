import { useState } from 'react'
import type { SetScreen } from '../App'

const CUISINE_OPTIONS = ['South Indian', 'North Indian', 'Chinese', 'Continental', 'Bakery', 'Fast Food', 'Desserts', 'Beverages', 'Biryani', 'Snacks']
const VENDOR_TYPES = ['Home Kitchen', 'Cloud Kitchen', 'Restaurant', 'Bakery', 'Food Truck', 'Catering']
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

export default function RegisterStep2Screen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({ kitchenName: '', description: '', vendorType: '', address: '', cuisines: [] as string[], openFrom: '07:00', openTo: '22:00' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const toggleCuisine = (c: string) => setForm(p => ({ ...p, cuisines: p.cuisines.includes(c) ? p.cuisines.filter(x => x !== c) : [...p.cuisines, c] }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.kitchenName.trim()) e.kitchenName = 'Kitchen name required'
    if (!form.vendorType) e.vendorType = 'Select vendor type'
    if (!form.address.trim()) e.address = 'Address required'
    if (form.cuisines.length === 0) e.cuisines = 'Select at least one cuisine'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('register_1')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Register — Step 2 of 4</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Kitchen Information</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4].map(i => <div key={`step2_${i}`} style={{ width: i === 2 ? '22px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: '#000', opacity: i <= 2 ? 1 : 0.2 }} />)}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '5px 5px 0px #000', padding: '18px' }}>
          {/* Kitchen Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>Kitchen Name</label>
            <input type="text" placeholder="Priya's Kitchen" value={form.kitchenName} onChange={e => set('kitchenName', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: errors.kitchenName ? '#FEF3F2' : '#FFF8E7', border: `2.5px solid ${errors.kitchenName ? '#FF3B30' : '#000'}`, borderRadius: '10px', padding: '11px 13px', outline: 'none' }} />
            {errors.kitchenName && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FF3B30', fontWeight: 700, marginTop: '3px' }}>{errors.kitchenName}</div>}
          </div>
          {/* Description */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>Description</label>
            <textarea placeholder="Tell customers about your kitchen…" value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#FFF8E7', border: '2px solid #000', borderRadius: '10px', padding: '11px 13px', outline: 'none', resize: 'none' }} />
          </div>
          {/* Vendor Type */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>Vendor Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {VENDOR_TYPES.map(t => (
                <button key={t} onClick={() => set('vendorType', t)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: form.vendorType === t ? '#000' : '#fff', color: form.vendorType === t ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '6px 12px', cursor: 'pointer', boxShadow: form.vendorType === t ? 'none' : '2px 2px 0px #000' }}>{t}</button>
              ))}
            </div>
            {errors.vendorType && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FF3B30', fontWeight: 700, marginTop: '4px' }}>{errors.vendorType}</div>}
          </div>
          {/* Address */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>Full Address</label>
            <textarea placeholder="14, Kamaraj Street, RS Puram, Coimbatore — 641002" value={form.address} onChange={e => set('address', e.target.value)} rows={2}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: errors.address ? '#FEF3F2' : '#FFF8E7', border: `2.5px solid ${errors.address ? '#FF3B30' : '#000'}`, borderRadius: '10px', padding: '11px 13px', outline: 'none', resize: 'none' }} />
          </div>
          {/* Operating hours */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '8px' }}>Operating Hours</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select value={form.openFrom} onChange={e => set('openFrom', e.target.value)} style={{ flex: 1, fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#FFF8E7', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 12px', outline: 'none' }}>
                {HOURS.map(h => <option key={`from_${h}`} value={h}>{h}</option>)}
              </select>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, opacity: 0.4 }}>to</span>
              <select value={form.openTo} onChange={e => set('openTo', e.target.value)} style={{ flex: 1, fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#FFF8E7', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 12px', outline: 'none' }}>
                {HOURS.map(h => <option key={`to_${h}`} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          {/* Cuisines */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '8px' }}>Cuisine Types</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {CUISINE_OPTIONS.map(c => {
                const a = form.cuisines.includes(c)
                return <button key={c} onClick={() => toggleCuisine(c)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: a ? '#000' : '#fff', color: a ? '#FFC50A' : '#000', border: '2.5px solid #000', borderRadius: '20px', padding: '6px 12px', cursor: 'pointer', boxShadow: a ? 'none' : '2px 2px 0px #000' }}>{c}</button>
              })}
            </div>
            {errors.cuisines && <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#FF3B30', fontWeight: 700, marginTop: '4px' }}>{errors.cuisines}</div>}
          </div>
          <button onClick={() => validate() && setScreen('register_3')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '13px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
            Next: Documents →
          </button>
        </div>
      </div>
    </div>
  )
}
