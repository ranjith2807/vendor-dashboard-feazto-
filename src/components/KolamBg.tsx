// Sikku Kolam — infinite-knot / loop pattern rendered as SVG tile at low opacity
export default function KolamBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ opacity: 0.055 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sikku kolam tile: a looped figure-8 knot motif in a 80×80 grid */}
          <pattern id="kolam" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Outer square frame */}
            <rect x="4" y="4" width="72" height="72" fill="none" stroke="#000" strokeWidth="2.5" />
            {/* Inner diamond */}
            <polygon points="40,8 72,40 40,72 8,40" fill="none" stroke="#000" strokeWidth="2.5" />
            {/* Corner loops — top-left */}
            <path d="M4,4 Q20,4 20,20 Q20,4 36,4" fill="none" stroke="#000" strokeWidth="2" />
            {/* Corner loop top-right */}
            <path d="M76,4 Q60,4 60,20 Q60,4 44,4" fill="none" stroke="#000" strokeWidth="2" />
            {/* Corner loop bottom-left */}
            <path d="M4,76 Q20,76 20,60 Q20,76 36,76" fill="none" stroke="#000" strokeWidth="2" />
            {/* Corner loop bottom-right */}
            <path d="M76,76 Q60,76 60,60 Q60,76 44,76" fill="none" stroke="#000" strokeWidth="2" />
            {/* Center cross knot */}
            <line x1="28" y1="28" x2="52" y2="52" stroke="#000" strokeWidth="2" />
            <line x1="52" y1="28" x2="28" y2="52" stroke="#000" strokeWidth="2" />
            <circle cx="40" cy="40" r="6" fill="none" stroke="#000" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="2" fill="#000" />
            {/* Side dots */}
            <circle cx="40" cy="10" r="2.5" fill="#000" />
            <circle cx="40" cy="70" r="2.5" fill="#000" />
            <circle cx="10" cy="40" r="2.5" fill="#000" />
            <circle cx="70" cy="40" r="2.5" fill="#000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kolam)" />
      </svg>
    </div>
  )
}
