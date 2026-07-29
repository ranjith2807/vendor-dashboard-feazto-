import FeaztoMascot from './FeaztoMascot'

const orderStatuses = [
  { label: 'NEW', bg: '#FFC50A', text: '#000', dot: '#000' },
  { label: 'ACCEPTED', bg: '#000', text: '#FFF8E7', dot: '#FFC50A' },
  { label: 'PREPARING', bg: '#F59E0B', text: '#000', dot: '#000' },
  { label: 'READY', bg: '#22C55E', text: '#fff', dot: '#fff' },
  { label: 'PICKED UP', bg: '#3B82F6', text: '#fff', dot: '#fff' },
  { label: 'DELIVERED', bg: '#10B981', text: '#fff', dot: '#fff' },
  { label: 'CANCELLED', bg: '#FF3B30', text: '#fff', dot: '#fff' },
  { label: 'PENDING', bg: '#FFF8E7', text: '#000', dot: '#F59E0B', bordered: true },
]

const vendorStatuses = [
  { label: 'OPEN', bg: '#22C55E', text: '#fff' },
  { label: 'CLOSED', bg: '#FF3B30', text: '#fff' },
  { label: 'BUSY', bg: '#F59E0B', text: '#000' },
  { label: 'VERIFIED ✓', bg: '#3B82F6', text: '#fff' },
]

const metaBadges = [
  { label: 'NEW', bg: '#FF6B35', text: '#fff' },
  { label: 'FEATURED ★', bg: '#FFC50A', text: '#000' },
  { label: 'TRENDING 🔥', bg: '#FF3B30', text: '#fff' },
  { label: 'PREMIUM', bg: '#000', text: '#FFC50A' },
  { label: 'LIVE ●', bg: '#22C55E', text: '#fff' },
  { label: 'COMMUNITY', bg: '#8B5CF6', text: '#fff' },
]

function Badge({ label, bg, text, dot, bordered }: { label: string; bg: string; text: string; dot?: string; bordered?: boolean }) {
  return (
    <div style={{ backgroundColor: bg, color: text, border: bordered ? '2.5px dashed #000' : '2.5px solid #000', borderRadius: '8px', boxShadow: '3px 3px 0px #000', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dot, flexShrink: 0, border: '1px solid rgba(0,0,0,0.25)' }} />}
      {label}
    </div>
  )
}

function PillBadge({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <div style={{ backgroundColor: bg, color: text, border: 'none', borderRadius: '999px', padding: '4px 12px', fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label}
    </div>
  )
}

export default function BadgesFullSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Badges & Status
      </div>

      {/* Order status */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Order Status</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' }}>
        {orderStatuses.map(s => <Badge key={s.label} {...s} />)}
      </div>

      {/* Vendor status */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Vendor Status</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' }}>
        {vendorStatuses.map(s => <Badge key={s.label} {...s} />)}
      </div>

      {/* Meta badges */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Meta Labels</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' }}>
        {metaBadges.map(s => <Badge key={s.label} {...s} />)}
      </div>

      {/* Pill variants */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Pill Variants</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {[...orderStatuses.slice(0, 4), ...metaBadges.slice(0, 3)].map(s => (
          <PillBadge key={s.label} label={s.label} bg={s.bg} text={s.text} />
        ))}
      </div>

      {/* Order timeline — FEZU highlighted */}
      <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '7px' }}>Order Timeline</div>
      <div style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000', padding: '14px 14px 10px', position: 'relative', overflow: 'hidden' }}>
        {/* FEZU watermark */}
        <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.07 }}>
          <FeaztoMascot size={90} />
        </div>
        {[
          { step: 'Order Placed', status: 'done', time: '12:30 PM' },
          { step: 'Accepted', status: 'done', time: '12:31 PM' },
          { step: 'Preparing', status: 'active', time: '12:32 PM' },
          { step: 'Ready', status: 'upcoming', time: '—' },
          { step: 'FEZU Pickup', status: 'upcoming', time: '—' },
          { step: 'Delivered', status: 'upcoming', time: '—' },
        ].map((s, i, arr) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: i < arr.length - 1 ? '12px' : 0, position: 'relative' }}>
            {i < arr.length - 1 && (
              <div style={{ position: 'absolute', left: '9px', top: '20px', width: '2px', height: '22px', backgroundColor: s.status === 'done' ? '#FFC50A' : '#ddd' }} />
            )}
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: s.status === 'done' ? '#FFC50A' : s.status === 'active' ? '#fff' : '#eee', border: `2.5px solid ${s.status === 'upcoming' ? '#ccc' : '#000'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              {s.status === 'done' && <span style={{ fontSize: '9px', fontWeight: 700 }}>✓</span>}
              {s.status === 'active' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFC50A' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: s.status === 'upcoming' ? '#aaa' : '#000' }}>{s.step}</div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>{s.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
