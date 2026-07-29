import type { ReactNode } from 'react'
import KolamBg from './components/KolamBg'
import PhoneFrame from './components/PhoneFrame'
import FeaztoMascot from './components/FeaztoMascot'

// — Section components —
import MascotSection from './components/MascotSection'
import ColorsSection from './components/ColorsSection'
import TypographySection from './components/TypographySection'
import SpacingSection from './components/SpacingSection'
import ButtonSection from './components/ButtonSection'
import InputSection from './components/InputSection'
import InputsFullSection from './components/InputsFullSection'
import ToggleSection from './components/ToggleSection'
import OtpSection from './components/OtpSection'
import BadgesFullSection from './components/BadgesFullSection'
import CardSection from './components/CardSection'
import CardsFullSection from './components/CardsFullSection'
import FezuSection from './components/FezuSection'
import IconsSection from './components/IconsSection'

// — Module badge colors —
const MODULE_COLORS: Record<string, [string, string]> = {
  BRAND: ['#FFC50A', '#000'],
  COLORS: ['#FF6B35', '#fff'],
  TYPE: ['#3B82F6', '#fff'],
  SPACING: ['#22C55E', '#fff'],
  BUTTONS: ['#000', '#FFC50A'],
  INPUTS: ['#8B5CF6', '#fff'],
  CONTROLS: ['#F59E0B', '#000'],
  BADGES: ['#FF3B30', '#fff'],
  CARDS: ['#10B981', '#fff'],
  ICONS: ['#06B6D4', '#fff'],
  FEZU: ['#FFC50A', '#000'],
}

function ScreenHeader({ title, tag, desc }: { title: string; tag: string; desc: string }) {
  const [bg, text] = MODULE_COLORS[tag] ?? ['#FFC50A', '#000']
  return (
    <div style={{ backgroundColor: bg, borderBottom: '2.5px solid #000', padding: '14px 20px 12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: text, opacity: 0.65, marginBottom: '2px' }}>
          FEAZTO Design System
        </div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: 1, color: text }}>{title}</div>
        <div style={{ fontFamily: 'Inter', fontSize: '11px', color: text, opacity: 0.65, marginTop: '3px', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{ backgroundColor: text, color: bg, borderRadius: '6px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', border: `2px solid ${text}`, flexShrink: 0 }}>
        {tag}
      </div>
    </div>
  )
}

const screens: Array<{ frameLabel: string; screenBg?: string; header: { title: string; tag: string; desc: string }; content: ReactNode }> = [
  {
    frameLabel: '00 — Brand Mascot',
    header: { title: 'FEZU Mascot', tag: 'BRAND', desc: 'The face of FEAZTO — plush chef who loves food' },
    content: <MascotSection />,
  },
  {
    frameLabel: '01 — Color System',
    header: { title: 'Color System', tag: 'COLORS', desc: 'Brand, semantic, module & gradient tokens' },
    content: <ColorsSection />,
  },
  {
    frameLabel: '02 — Typography',
    screenBg: '#fff',
    header: { title: 'Typography', tag: 'TYPE', desc: 'Barlow Condensed Bold × Inter — display to caption' },
    content: <TypographySection />,
  },
  {
    frameLabel: '03 — Spacing & Elevation',
    header: { title: 'Spacing & Elevation', tag: 'SPACING', desc: '4px base grid · hard offset shadows · border radius' },
    content: <SpacingSection />,
  },
  {
    frameLabel: '04 — Buttons',
    screenBg: '#fff',
    header: { title: 'Buttons', tag: 'BUTTONS', desc: 'All variants — interactive with press feedback' },
    content: <ButtonSection />,
  },
  {
    frameLabel: '05 — Inputs & OTP',
    header: { title: 'Inputs & OTP', tag: 'INPUTS', desc: 'Text, phone, error state & 6-digit OTP box' },
    content: (
      <>
        <InputSection />
        <OtpSection />
      </>
    ),
  },
  {
    frameLabel: '06 — Form Controls',
    screenBg: '#fff',
    header: { title: 'Form Controls', tag: 'CONTROLS', desc: 'Search, dropdown, segments, chips, checkbox, radio' },
    content: <InputsFullSection />,
  },
  {
    frameLabel: '07 — Toggles',
    header: { title: 'Toggle Switch', tag: 'CONTROLS', desc: 'On/off switches with animated thumb' },
    content: <ToggleSection />,
  },
  {
    frameLabel: '08 — Badges & Status',
    header: { title: 'Badges & Status', tag: 'BADGES', desc: 'Order lifecycle, vendor status & order timeline' },
    content: <BadgesFullSection />,
  },
  {
    frameLabel: '09 — Card Library',
    screenBg: '#fff',
    header: { title: 'Card Library', tag: 'CARDS', desc: 'Dashboard, dish, review & wallet cards' },
    content: <CardsFullSection />,
  },
  {
    frameLabel: '10 — Sample App Cards',
    header: { title: 'Order & Profile', tag: 'CARDS', desc: 'Live order card + vendor profile card' },
    content: <CardSection />,
  },
  {
    frameLabel: '11 — Icon System',
    screenBg: '#fff',
    header: { title: 'Icon System', tag: 'ICONS', desc: '2px round-stroke icons — 24×24 grid, all app modules' },
    content: <IconsSection />,
  },
  {
    frameLabel: '12 — FEZU Module',
    header: { title: 'FEZU Delivery', tag: 'FEZU', desc: 'Rider assignment, live map & delivery analytics' },
    content: <FezuSection />,
  },
]

export default function StyleGuide() {
  return (
    <div style={{ backgroundColor: '#FFF8E7', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
      <KolamBg />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1800px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* ── Page header ── */}
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          {/* FEZU above title */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <FeaztoMascot size={120} />
          </div>

          <div style={{ display: 'inline-block', padding: '4px 18px', marginBottom: '12px', border: '3px solid #000', backgroundColor: '#FFC50A', boxShadow: '5px 5px 0px #000', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Mobile Design System · 13 Screens
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '88px', lineHeight: 1, letterSpacing: '-0.01em', color: '#000', margin: '0 0 8px' }}>
            FEAZTO
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#000', opacity: 0.5, letterSpacing: '0.06em', margin: 0 }}>
            Minimal Comic UI · v1.0 · 375 × 812 · Vendor App
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            {Object.entries(MODULE_COLORS).map(([tag, [bg, text]]) => (
              <div key={tag} style={{ backgroundColor: bg, color: text, border: '2px solid #000', borderRadius: '6px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', boxShadow: '2px 2px 0px #000' }}>
                {tag}
              </div>
            ))}
          </div>
          <div style={{ width: '64px', height: '4px', backgroundColor: '#FFC50A', border: '2px solid #000', margin: '18px auto 0' }} />
        </header>

        {/* ── Phone frames grid ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '52px', justifyContent: 'center', alignItems: 'flex-start' }}>
          {screens.map(screen => (
            <PhoneFrame key={screen.frameLabel} label={screen.frameLabel} screenBg={screen.screenBg}>
              <ScreenHeader {...screen.header} />
              {screen.content}
            </PhoneFrame>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer style={{ textAlign: 'center', marginTop: '64px', paddingTop: '32px', borderTop: '3px dashed rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <FeaztoMascot size={80} />
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '32px', color: '#000' }}>FEAZTO Design System</div>
          <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.45, marginTop: '4px' }}>
            FEAZTO Customer · FEAZTO Vendor · FEZU Delivery · Community · Admin · AI · Wallet
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.3, marginTop: '8px' }}>
            Minimal Comic UI · Barlow Condensed Bold + Inter · #FFC50A · v1.0
          </div>
        </footer>
      </div>
    </div>
  )
}
