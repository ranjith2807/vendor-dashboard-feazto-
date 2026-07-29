import type { SetScreen } from '../App'

const REVIEW_ITEMS = [
  { id: 'rv_001', section: 'Personal', items: ['Priya Krishnan', '+91 98765 43210', 'priya@email.com'] },
  { id: 'rv_002', section: 'Kitchen', items: ["Priya's Kitchen", 'South Indian, Sweets', '14, Kamaraj St, Coimbatore'] },
  { id: 'rv_003', section: 'Hours', items: ['Mon–Sat: 7:00 AM – 10:00 PM', 'Sun: Closed'] },
  { id: 'rv_004', section: 'Documents', items: ['Govt ID ✓', 'FSSAI Licence ✓', 'PAN/GST ✓', 'Bank Doc ✓'] },
]

export default function RegisterStep4Screen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setScreen('register_3')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '24px' }}>Register — Step 4 of 4</div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.45 }}>Review & Submit</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4].map(i => <div key={`step4_${i}`} style={{ width: '22px', height: '8px', borderRadius: '4px', backgroundColor: '#000', opacity: 1 }} />)}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {REVIEW_ITEMS.map(r => (
          <div key={r.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '8px' }}>{r.section}</div>
            {r.items.map((item, i) => (
              <div key={`${r.id}_item_${i}`} style={{ fontFamily: 'Inter', fontSize: '13px', padding: '3px 0', borderBottom: i < r.items.length - 1 ? '1px dashed rgba(0,0,0,0.08)' : 'none' }}>{item}</div>
            ))}
          </div>
        ))}

        <div style={{ backgroundColor: '#FFF8E7', border: '2px dashed rgba(0,0,0,0.2)', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontFamily: 'Inter', fontSize: '12px', opacity: 0.6, lineHeight: 1.5 }}>
          By submitting, you agree to FEAZTO's Vendor Terms, Privacy Policy, and Food Safety Compliance requirements.
        </div>

        <button onClick={() => setScreen('register_success')} style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '12px', padding: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          Submit Application →
        </button>
      </div>
    </div>
  )
}
