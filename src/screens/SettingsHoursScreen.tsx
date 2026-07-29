import { useState } from 'react'
import type { Screen } from '../App'
import { operatingHours, type DayHours } from '../data/mockData'
import { useToast } from '../components/Toast'

export default function SettingsHoursScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { showToast } = useToast()
  const [hours, setHours] = useState<DayHours[]>(operatingHours)

  const toggle = (id: string) =>
    setHours(prev => prev.map(d => d.id === id ? { ...d, open: !d.open } : d))

  const setTime = (id: string, field: 'from' | 'to', val: string) =>
    setHours(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px', flex: 1 }}>Operating Hours</div>
        <button
          onClick={() => showToast('Hours saved!')}
          style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '9px', padding: '8px 16px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
        >
          Save
        </button>
      </div>

      {/* Quick presets */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>Quick Presets</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {[
            { id: 'pr_all', label: 'Open All Days', action: () => setHours(h => h.map(d => ({ ...d, open: true }))) },
            { id: 'pr_weekdays', label: 'Weekdays Only', action: () => setHours(h => h.map(d => ({ ...d, open: ['oh_mon','oh_tue','oh_wed','oh_thu','oh_fri'].includes(d.id) }))) },
            { id: 'pr_except_sun', label: 'Except Sunday', action: () => setHours(h => h.map(d => ({ ...d, open: d.id !== 'oh_sun' }))) },
          ].map(p => (
            <button
              key={p.id}
              onClick={p.action}
              style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', backgroundColor: '#fff', border: 'none', borderRadius: '20px', padding: '6px 12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000', whiteSpace: 'nowrap' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {hours.map(day => (
          <div
            key={day.id}
            style={{ backgroundColor: day.open ? '#fff' : '#f8f4ec', border: `2.5px solid ${day.open ? '#000' : '#ccc'}`, borderRadius: '14px', boxShadow: day.open ? '4px 4px 0px #000' : 'none', padding: '13px 14px', marginBottom: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: day.open ? '10px' : 0 }}>
              <div style={{ width: '46px', height: '28px', borderRadius: '6px', backgroundColor: day.open ? '#FFC50A' : '#ddd', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px' }}>
                {day.short}
              </div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px', flex: 1, color: day.open ? '#000' : '#999' }}>{day.day}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45, marginRight: '8px' }}>{day.open ? `${day.from} – ${day.to}` : 'Closed'}</div>
              <button
                onClick={() => toggle(day.id)}
                style={{ width: '46px', height: '26px', borderRadius: '13px', backgroundColor: day.open ? '#22C55E' : '#ddd', border: 'none', boxShadow: '2px 2px 0px #000', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0 }}
              >
                <span style={{ position: 'absolute', top: '2px', left: day.open ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', transition: 'left 0.18s', display: 'block' }} />
              </button>
            </div>
            {day.open && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Opens at</div>
                  <input
                    type="time"
                    value={day.from}
                    onChange={e => setTime(day.id, 'from', e.target.value)}
                    style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', backgroundColor: '#FFF8E7', border: '2px solid #bbb', borderRadius: '8px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '16px', opacity: 0.3, paddingTop: '16px' }}>→</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Closes at</div>
                  <input
                    type="time"
                    value={day.to}
                    onChange={e => setTime(day.id, 'to', e.target.value)}
                    style={{ width: '100%', fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', backgroundColor: '#FFF8E7', border: '2px solid #bbb', borderRadius: '8px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
