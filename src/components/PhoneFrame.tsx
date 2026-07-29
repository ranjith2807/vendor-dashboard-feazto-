import type { ReactNode } from 'react'

interface PhoneFrameProps {
  label: string
  children: ReactNode
  screenBg?: string
}

export default function PhoneFrame({ label, children, screenBg = '#FFF8E7' }: PhoneFrameProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      {/* Screen label above frame */}
      <div
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#000',
          backgroundColor: '#FFC50A',
          border: 'none',
          borderRadius: '6px',
          padding: '4px 14px',
          boxShadow: '3px 3px 0px #000',
        }}
      >
        {label}
      </div>

      {/* Phone shell */}
      <div
        style={{
          width: '375px',
          backgroundColor: '#111',
          borderRadius: '44px',
          border: 'none',
          boxShadow: '8px 8px 0px #000',
          padding: '14px',
          position: 'relative',
        }}
      >
        {/* Side buttons left */}
        <div style={{ position: 'absolute', left: '-7px', top: '110px', width: '5px', height: '36px', backgroundColor: '#222', borderRadius: '3px 0 0 3px', border: '1.5px solid #000' }} />
        <div style={{ position: 'absolute', left: '-7px', top: '158px', width: '5px', height: '36px', backgroundColor: '#222', borderRadius: '3px 0 0 3px', border: '1.5px solid #000' }} />
        <div style={{ position: 'absolute', left: '-7px', top: '206px', width: '5px', height: '36px', backgroundColor: '#222', borderRadius: '3px 0 0 3px', border: '1.5px solid #000' }} />
        {/* Side button right (power) */}
        <div style={{ position: 'absolute', right: '-7px', top: '154px', width: '5px', height: '60px', backgroundColor: '#222', borderRadius: '0 3px 3px 0', border: '1.5px solid #000' }} />

        {/* Screen glass */}
        <div
          style={{
            width: '100%',
            backgroundColor: screenBg,
            borderRadius: '32px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: '44px',
              backgroundColor: screenBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 28px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#000' }}>9:41</span>
            {/* Dynamic island */}
            <div style={{ width: '120px', height: '34px', backgroundColor: '#000', borderRadius: '20px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '5px' }} />
            {/* Status icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="1" fill="#000" />
                <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#000" />
                <rect x="9" y="2" width="3" height="10" rx="1" fill="#000" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#000" />
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 10 L8 10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5.5 7.5 Q8 5.5 10.5 7.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M3 5 Q8 1.5 13 5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              {/* Battery */}
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#000" strokeWidth="1.2" fill="none" />
                <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#000" />
                <path d="M22.5 4 L22.5 8" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Screen content — scrollable */}
          <div
            style={{
              height: '724px',
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: screenBg,
              scrollbarWidth: 'none',
            }}
          >
            <style>{`.phone-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="phone-scroll" style={{ padding: '0 0 32px' }}>
              {children}
            </div>
          </div>

          {/* Home indicator */}
          <div
            style={{
              height: '34px',
              backgroundColor: screenBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '134px', height: '5px', backgroundColor: '#000', borderRadius: '3px', opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
