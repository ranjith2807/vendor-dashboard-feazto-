import { useState } from 'react'
import type { Screen } from '../App'
import { useToast } from '../components/Toast'

const KITCHEN_TYPES = ['Home Kitchen', 'Cloud Kitchen', 'Restaurant', 'Bakery', 'Food Truck', 'Catering']

export default function SettingsKitchenScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    kitchenType: 'Home Kitchen',
    capacity: '30',
    avgPrepTime: '20',
    maxSimultaneous: '5',
    hygieneRating: 'A',
    hasAC: true,
    hasParking: false,
    isVegOnly: false,
    packagingType: 'Eco-friendly',
    gstNumber: '33AAAPF1234A1Z5',
    fssaiNumber: 'FBO-12345678',
  })

  const set = (key: string, val: string | boolean) => setForm(p => ({ ...p, [key]: val }))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', flex: 1 }}>Kitchen Details</div>
        <button
          onClick={() => showToast('Kitchen details updated!')}
          style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '9px', padding: '8px 16px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
        >
          Save
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Kitchen type selector */}
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Kitchen Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {KITCHEN_TYPES.map(t => (
            <button
              key={t}
              onClick={() => set('kitchenType', t)}
              style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: form.kitchenType === t ? '#000' : '#fff', color: form.kitchenType === t ? '#FFC50A' : '#000', border: 'none', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', boxShadow: form.kitchenType === t ? 'none' : '2px 2px 0px #000' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Capacity settings */}
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Capacity & Timing</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <NumberCard label="Daily Capacity" unit="orders" value={form.capacity} onChange={v => set('capacity', v)} />
          <NumberCard label="Avg Prep Time" unit="mins" value={form.avgPrepTime} onChange={v => set('avgPrepTime', v)} />
          <NumberCard label="Max Live Orders" unit="at once" value={form.maxSimultaneous} onChange={v => set('maxSimultaneous', v)} />
        </div>

        {/* Toggles */}
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Facilities & Features</div>
        <div style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { id: 'hasAC', label: 'Air Conditioned', icon: '❄️', key: 'hasAC' as const },
            { id: 'hasParking', label: 'Parking Available', icon: '🅿️', key: 'hasParking' as const },
            { id: 'isVegOnly', label: 'Pure Vegetarian', icon: '🥦', key: 'isVegOnly' as const },
          ].map((item, idx) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', borderBottom: idx < 2 ? '2px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', flex: 1 }}>{item.label}</span>
              <button
                onClick={() => set(item.key, !form[item.key])}
                style={{ width: '46px', height: '26px', borderRadius: '13px', backgroundColor: form[item.key] ? '#22C55E' : '#ddd', border: 'none', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', padding: 0 }}
              >
                <span style={{ position: 'absolute', top: '2px', left: form[item.key] ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Licences */}
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Business Licences</div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>GST Number</label>
          <input value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '11px 13px', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>FSSAI License No.</label>
          <input value={form.fssaiNumber} onChange={e => set('fssaiNumber', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '11px 13px', outline: 'none' }} />
        </div>
      </div>
    </div>
  )
}

function NumberCard({ label, unit, value, onChange }: { label: string; unit: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ flex: 1, backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '10px', textAlign: 'center' }}>
      <input
        type="tel"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', textAlign: 'center', border: '2px solid #000', background: 'none', outline: 'none', color: '#000', padding: '0' }}
      />
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.4 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.35 }}>{unit}</div>
    </div>
  )
}
