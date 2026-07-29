import { useState } from 'react'

function Label({ text }: { text: string }) {
  return (
    <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '5px', marginTop: '12px' }}>
      {text}
    </div>
  )
}

function TextInput({ placeholder, label, type = 'text', icon, error }: { placeholder: string; label: string; type?: string; icon?: string; error?: string }) {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState('')
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', opacity: 0.5 }}>{icon}</div>
        )}
        <input
          type={type}
          value={val}
          placeholder={placeholder}
          onChange={e => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            fontFamily: 'Inter', fontSize: '13px',
            color: '#000',
            backgroundColor: '#FFF8E7',
            border: `2.5px solid ${error ? '#FF3B30' : focused ? '#FFC50A' : '#000'}`,
            borderRadius: '10px',
            padding: `11px ${icon ? '12px 11px 34px' : '12px'}`,
            outline: 'none',
            boxShadow: error ? '3px 3px 0px #FF3B30' : focused ? '3px 3px 0px #FFC50A' : '3px 3px 0px #000',
            transition: 'border-color 0.12s, box-shadow 0.12s',
          }}
        />
      </div>
      {error && <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#FF3B30', fontWeight: 700, marginTop: '3px' }}>● {error}</div>}
    </div>
  )
}

function SearchInput() {
  const [val, setVal] = useState('')
  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px' }}>🔍</span>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Search dishes, vendors…"
        style={{ width: '100%', fontFamily: 'Inter', fontSize: '13px', color: '#000', backgroundColor: '#fff', border: 'none', borderRadius: '999px', padding: '10px 16px 10px 36px', outline: 'none', boxShadow: '3px 3px 0px #000' }}
      />
    </div>
  )
}

function Dropdown() {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('Tamil Nadu')
  const opts = ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh']
  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Inter', fontSize: '13px', color: '#000', backgroundColor: '#FFF8E7', border: 'none', borderRadius: '10px', padding: '11px 12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', textAlign: 'left' }}
      >
        {val}
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '12px' }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: 'none', borderRadius: '10px', boxShadow: '4px 4px 0px #000', zIndex: 10, marginTop: '4px', overflow: 'hidden' }}>
          {opts.map(o => (
            <div key={o} onClick={() => { setVal(o); setOpen(false) }} style={{ padding: '10px 12px', fontFamily: 'Inter', fontSize: '13px', cursor: 'pointer', backgroundColor: o === val ? '#FFF8E7' : '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              {o === val && <span style={{ marginRight: '6px', fontSize: '10px' }}>✓</span>}{o}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Checkbox({ label, checked: initChecked = false }: { label: string; checked?: boolean }) {
  const [checked, setChecked] = useState(initChecked)
  return (
    <div onClick={() => setChecked(c => !c)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
      <div style={{ width: '20px', height: '20px', border: 'none', borderRadius: '5px', backgroundColor: checked ? '#FFC50A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: checked ? '2px 2px 0px #000' : 'none', transition: 'background 0.15s' }}>
        {checked && <span style={{ fontSize: '12px', fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontFamily: 'Inter', fontSize: '13px' }}>{label}</span>
    </div>
  )
}

function Radio({ label, checked: initC = false }: { label: string; checked?: boolean }) {
  const [c, setC] = useState(initC)
  return (
    <div onClick={() => setC(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
      <div style={{ width: '20px', height: '20px', border: 'none', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 0px #000' }}>
        {c && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFC50A', border: '1.5px solid #000' }} />}
      </div>
      <span style={{ fontFamily: 'Inter', fontSize: '13px' }}>{label}</span>
    </div>
  )
}

function Segment() {
  const [sel, setSel] = useState(0)
  const tabs = ['All', 'Veg', 'Non-Veg', 'Drinks']
  return (
    <div style={{ display: 'flex', border: 'none', borderRadius: '10px', overflow: 'hidden', boxShadow: '3px 3px 0px #000', marginBottom: '10px' }}>
      {tabs.map((t, i) => (
        <button key={t} onClick={() => setSel(i)} style={{ flex: 1, padding: '9px 0', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em', textTransform: 'uppercase', backgroundColor: sel === i ? '#FFC50A' : '#fff', color: '#000', border: 'none', borderRight: i < tabs.length - 1 ? '2px solid #000' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}>
          {t}
        </button>
      ))}
    </div>
  )
}

function FilterChips() {
  const [sel, setSel] = useState<Set<string>>(new Set(['Fast Delivery']))
  const chips = ['Fast Delivery', 'Top Rated', '< ₹200', 'Pure Veg', 'New Arrivals']
  const toggle = (c: string) => setSel(s => { const n = new Set(s); n.has(c) ? n.delete(c) : n.add(c); return n })
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
      {chips.map(c => (
        <button key={c} onClick={() => toggle(c)} style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', backgroundColor: sel.has(c) ? '#FFC50A' : '#fff', color: '#000', border: '2px solid #000', borderRadius: '999px', padding: '5px 12px', cursor: 'pointer', boxShadow: sel.has(c) ? '2px 2px 0px #000' : 'none', transition: 'background 0.15s, box-shadow 0.15s' }}>
          {sel.has(c) && '✓ '}{c}
        </button>
      ))}
    </div>
  )
}

export default function InputsFullSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Form Controls
      </div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px 14px 4px' }}>
        <Label text="Search" />
        <SearchInput />
        <Label text="Text Input" />
        <TextInput label="Restaurant Name" placeholder="e.g. Priya's Kitchen" icon="🏪" />
        <Label text="Phone" />
        <TextInput label="Mobile Number" placeholder="+91 98765 43210" type="tel" icon="📞" />
        <Label text="Error State" />
        <TextInput label="Email" placeholder="you@example.com" type="email" error="Invalid email address" />
        <Label text="Dropdown" />
        <Dropdown />
        <Label text="Segment Control" />
        <Segment />
        <Label text="Filter Chips" />
        <FilterChips />
        <Label text="Checkboxes" />
        <Checkbox label="Accept Cash on Delivery" checked={true} />
        <Checkbox label="Enable online payments" />
        <Checkbox label="GSTIN registered" checked={true} />
        <Label text="Radio Buttons" />
        <Radio label="Dine-in available" checked={true} />
        <Radio label="Takeaway only" />
        <div style={{ height: '8px' }} />
      </div>
    </div>
  )
}
