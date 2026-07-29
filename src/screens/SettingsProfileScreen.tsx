import { useState } from 'react'
import type { Screen } from '../App'
import { useToast } from '../components/Toast'

const CUISINES = ['South Indian', 'North Indian', 'Chinese', 'Continental', 'Bakery', 'Fast Food', 'Desserts', 'Beverages']

export default function SettingsProfileScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    restaurantName: "Priya's Kitchen",
    ownerName: 'Priya Krishnan',
    phone: '9876543210',
    email: 'priya@priyaskitchen.com',
    address: '14, Kamaraj Street, RS Puram',
    city: 'Coimbatore',
    pincode: '641002',
    cuisines: ['South Indian'],
    tagline: 'Authentic homestyle South Indian food',
    minOrder: '100',
    deliveryRadius: '5',
  })

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))
  const toggleCuisine = (c: string) =>
    setForm(p => ({
      ...p,
      cuisines: p.cuisines.includes(c) ? p.cuisines.filter(x => x !== c) : [...p.cuisines, c],
    }))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', flex: 1 }}>Vendor Profile</div>
        <button
          onClick={() => showToast('Profile saved successfully!')}
          style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '9px', padding: '8px 16px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
        >
          Save
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '30px' }}>PK</div>
            <button style={{ position: 'absolute', bottom: -4, right: -4, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#000', border: '2.5px solid #FFC50A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✏️</button>
          </div>
        </div>

        {/* Section: Restaurant Info */}
        <SectionLabel>Restaurant Info</SectionLabel>
        <FormField label="Restaurant Name" value={form.restaurantName} onChange={v => set('restaurantName', v)} />
        <FormField label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} placeholder="Short description…" />
        <FormField label="Owner Name" value={form.ownerName} onChange={v => set('ownerName', v)} />

        {/* Section: Contact */}
        <SectionLabel>Contact Details</SectionLabel>
        <FormField label="Phone Number" value={form.phone} onChange={v => set('phone', v)} type="tel" />
        <FormField label="Email Address" value={form.email} onChange={v => set('email', v)} type="email" />

        {/* Section: Location */}
        <SectionLabel>Location</SectionLabel>
        <FormField label="Street Address" value={form.address} onChange={v => set('address', v)} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}><FormField label="City" value={form.city} onChange={v => set('city', v)} /></div>
          <div style={{ width: '110px' }}><FormField label="Pincode" value={form.pincode} onChange={v => set('pincode', v)} type="tel" /></div>
        </div>

        {/* Section: Settings */}
        <SectionLabel>Business Settings</SectionLabel>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}><FormField label="Min. Order (₹)" value={form.minOrder} onChange={v => set('minOrder', v)} type="tel" /></div>
          <div style={{ flex: 1 }}><FormField label="Delivery Radius (km)" value={form.deliveryRadius} onChange={v => set('deliveryRadius', v)} type="tel" /></div>
        </div>

        {/* Cuisine types */}
        <SectionLabel>Cuisine Types</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {CUISINES.map(c => {
            const active = form.cuisines.includes(c)
            return (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', backgroundColor: active ? '#000' : '#fff', color: active ? '#FFC50A' : '#000', border: 'none', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', boxShadow: active ? 'none' : '2px 2px 0px #000', transition: 'all 0.14s' }}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px', marginTop: '4px' }}>{children}</div>
}

function FormField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '5px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '10px', padding: '11px 13px', outline: 'none' }}
      />
    </div>
  )
}
