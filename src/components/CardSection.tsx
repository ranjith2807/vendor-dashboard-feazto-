export default function CardSection() {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '12px' }}>
        Sample Card
      </div>

      {/* Order card */}
      <div style={{ border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', backgroundColor: '#fff', overflow: 'hidden', marginBottom: '12px' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#FFC50A', borderBottom: 'none', padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px' }}>Order #FZ-0042</div>
          <div style={{ backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '7px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
            READY
          </div>
        </div>

        <div style={{ padding: '14px 16px' }}>
          {/* Customer + total row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>Priya Krishnan</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>₹ 348</div>
            </div>
          </div>

          {/* Items */}
          <div style={{ backgroundColor: '#FFF8E7', border: 'none', borderRadius: '9px', padding: '10px 12px', marginBottom: '12px' }}>
            {[
              { name: 'Masala Dosa', qty: 2, price: '₹ 120' },
              { name: 'Filter Coffee', qty: 2, price: '₹ 80' },
              { name: 'Vada', qty: 1, price: '₹ 28' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Inter', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, backgroundColor: '#FFC50A', borderRadius: '4px', padding: '0 5px', fontSize: '11px', border: '1.5px solid #000' }}>×{item.qty}</span>
                  {item.name}
                </div>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{item.price}</div>
              </div>
            ))}
          </div>

          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#000" strokeWidth="2" /><path d="M7 3.5V7L9.5 9" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></svg>
            <span style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.5 }}>Placed 12:34 PM · 8 min ago</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '9px', padding: '10px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Accept</button>
            <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '9px', padding: '10px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>Decline</button>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div style={{ border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#000', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FFC50A', border: '3px solid #FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', color: '#000', flexShrink: 0 }}>PK</div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', color: '#FFF8E7' }}>Priya Krishnan</div>
            <div style={{ backgroundColor: '#22C55E', color: '#fff', border: '2px solid #fff', borderRadius: '5px', padding: '2px 10px', fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-block', marginTop: '4px' }}>Active Vendor</div>
          </div>
        </div>
        <div style={{ padding: '4px 16px 8px' }}>
          {[{ label: 'Orders Today', value: '24' }, { label: 'Rating', value: '4.8 ★' }, { label: 'Revenue', value: '₹ 4,820' }].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '2px dashed rgba(0,0,0,0.1)' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.5 }}>{row.label}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
