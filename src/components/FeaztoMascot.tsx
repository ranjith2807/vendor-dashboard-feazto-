// FEZU mascot — traced from reference photo:
// Black chef hat with gold FEZU fork+spoon badge, fluffy cream oval body,
// large kawaii eyes, wide toothy smile, rosy cheeks, yellow FEZU apron,
// plate of South Indian food in left hand, whisk in right, stubby limbs.

export default function FeaztoMascot({ size = 220 }: { size?: number }) {
  const h = size * 1.15
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 260 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FEZU – the FEAZTO mascot"
    >
      <defs>
        {/* Fluffy body — warm cream, radial highlight */}
        <radialGradient id="fBody" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FEFAED" />
          <stop offset="45%" stopColor="#F2E8C8" />
          <stop offset="85%" stopColor="#DDD0A0" />
          <stop offset="100%" stopColor="#C8BC88" />
        </radialGradient>
        {/* Hat body — jet black with subtle shine */}
        <linearGradient id="fHat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="40%" stopColor="#111" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        {/* Hat highlight strip */}
        <linearGradient id="fHatShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* Apron yellow */}
        <linearGradient id="fApron" x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FFD740" />
          <stop offset="100%" stopColor="#FFC50A" />
        </linearGradient>
        {/* Eye iris dark brown */}
        <radialGradient id="fEye" cx="30%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#5C3A1E" />
          <stop offset="60%" stopColor="#2A1500" />
          <stop offset="100%" stopColor="#0A0500" />
        </radialGradient>
        {/* Cheek blush */}
        <radialGradient id="fCheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFAAA0" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#FF8878" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF8878" stopOpacity="0" />
        </radialGradient>
        {/* Plate / banana leaf dark */}
        <radialGradient id="fPlate" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#3D6B35" />
          <stop offset="100%" stopColor="#1E3A18" />
        </radialGradient>
        {/* Food bowl */}
        <radialGradient id="fBowl" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#F5DFA0" />
          <stop offset="100%" stopColor="#E8C870" />
        </radialGradient>
        {/* Arm */}
        <radialGradient id="fArmL" cx="55%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FEFAED" />
          <stop offset="100%" stopColor="#C8BC88" />
        </radialGradient>
        <radialGradient id="fArmR" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FEFAED" />
          <stop offset="100%" stopColor="#C8BC88" />
        </radialGradient>
        {/* Ground shadow */}
        <radialGradient id="fGnd" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* Drop shadow filter */}
        <filter id="fShadow" x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000" floodOpacity="0.2" />
        </filter>
        {/* Fluffy texture filter — faint inner noise */}
        <filter id="fFluffy" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="128" cy="293" rx="62" ry="8" fill="url(#fGnd)" />

      {/* ══════════ LEFT ARM — raised, holding plate ══════════ */}
      {/* Upper arm */}
      <ellipse cx="50" cy="200" rx="18" ry="13" fill="url(#fArmL)" stroke="#C0B07A" strokeWidth="2" transform="rotate(-40 50 200)" />
      {/* Forearm */}
      <ellipse cx="32" cy="215" rx="15" ry="10" fill="url(#fArmL)" stroke="#C0B07A" strokeWidth="2" transform="rotate(-60 32 215)" />
      {/* Hand */}
      <ellipse cx="20" cy="228" rx="12" ry="10" fill="url(#fArmL)" stroke="#C0B07A" strokeWidth="1.5" />

      {/* ══════════ PLATE (banana leaf) ══════════ */}
      <ellipse cx="18" cy="228" rx="22" ry="7" fill="url(#fPlate)" stroke="#0F2A0A" strokeWidth="1.5" />
      {/* Leaf vein */}
      <line x1="0" y1="228" x2="36" y2="228" stroke="#2A5A22" strokeWidth="0.8" opacity="0.6" />
      {/* Idli (white oval) */}
      <ellipse cx="10" cy="223" rx="6" ry="4" fill="#F5F0E0" stroke="#DDD0B0" strokeWidth="1" />
      <ellipse cx="22" cy="222" rx="5.5" ry="3.5" fill="#F5F0E0" stroke="#DDD0B0" strokeWidth="1" />
      {/* Sambar bowl */}
      <ellipse cx="16" cy="232" rx="5" ry="3.5" fill="url(#fBowl)" stroke="#C89500" strokeWidth="1" />
      <ellipse cx="16" cy="230" rx="5" ry="2" fill="#E8850A" opacity="0.8" />
      {/* Chutney dot */}
      <circle cx="26" cy="230" r="3" fill="#5CB85C" stroke="#3A8A3A" strokeWidth="0.8" />

      {/* ══════════ RIGHT ARM — holding whisk ══════════ */}
      {/* Upper arm */}
      <ellipse cx="210" cy="200" rx="18" ry="13" fill="url(#fArmR)" stroke="#C0B07A" strokeWidth="2" transform="rotate(40 210 200)" />
      {/* Forearm */}
      <ellipse cx="228" cy="216" rx="14" ry="9" fill="url(#fArmR)" stroke="#C0B07A" strokeWidth="2" transform="rotate(50 228 216)" />
      {/* Hand nub */}
      <ellipse cx="238" cy="228" rx="10" ry="9" fill="url(#fArmR)" stroke="#C0B07A" strokeWidth="1.5" />

      {/* ══════════ WHISK ══════════ */}
      <g transform="translate(235, 210) rotate(15)">
        {/* Handle */}
        <rect x="2" y="16" width="5" height="22" rx="2.5" fill="#C89050" stroke="#8B5E20" strokeWidth="1" />
        {/* Neck wrap */}
        <rect x="1.5" y="14" width="6" height="4" rx="1" fill="#888" />
        {/* Whisk wires */}
        <path d="M4.5 14 Q0 8 4.5 2 Q9 8 4.5 14" fill="none" stroke="#AAA" strokeWidth="1.2" />
        <path d="M4.5 14 Q-1 6 3 1" fill="none" stroke="#999" strokeWidth="1" />
        <path d="M4.5 14 Q10 6 6 1" fill="none" stroke="#999" strokeWidth="1" />
        <ellipse cx="4.5" cy="8" rx="4" ry="6" fill="none" stroke="#BBB" strokeWidth="1" />
      </g>

      {/* ══════════ BODY ══════════ */}
      {/* Outer body — filter for slight fluffiness edge */}
      <ellipse
        cx="130" cy="205"
        rx="82" ry="78"
        fill="url(#fBody)"
        stroke="#C8B878"
        strokeWidth="2.5"
        filter="url(#fShadow)"
      />
      {/* Fluffy texture dots — scattered small circles suggesting soft fur */}
      {[
        [88,170],[98,158],[115,152],[138,150],[158,153],[172,160],[182,172],
        [186,188],[183,205],[80,190],[78,207],[82,225],[92,238],[108,246],
        [128,250],[150,248],[168,242],[180,230],[186,216],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.8" fill="#E8D8A8" opacity="0.55" />
      ))}
      {/* Subtle inner highlight */}
      <ellipse cx="108" cy="185" rx="32" ry="26" fill="#fff" opacity="0.09" />

      {/* ══════════ APRON ══════════ */}
      {/* Apron bib */}
      <path d="M108 218 Q130 213 152 218 L156 255 Q130 252 104 255 Z" fill="url(#fApron)" stroke="#C89000" strokeWidth="2" />
      {/* Apron skirt */}
      <path d="M100 255 L160 255 L166 284 L94 284 Z" fill="url(#fApron)" stroke="#C89000" strokeWidth="2" />
      {/* Apron tie left */}
      <path d="M100 258 Q80 254 70 264 Q76 256 82 260 Q88 258 100 258" fill="#FFC50A" stroke="#C89000" strokeWidth="1.5" />
      {/* Apron tie right */}
      <path d="M160 258 Q180 254 190 264 Q184 256 178 260 Q170 258 160 258" fill="#FFC50A" stroke="#C89000" strokeWidth="1.5" />
      {/* FEZU text on bib */}
      <text x="130" y="238" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight="700" fontSize="18" fill="#7A5000" letterSpacing="2">FEZU</text>
      {/* Heart below FEZU */}
      <path d="M125.5 245 Q125.5 242 130 245.5 Q134.5 242 134.5 245 Q134.5 249.5 130 252.5 Q125.5 249.5 125.5 245Z" fill="#FF5252" stroke="#7A0000" strokeWidth="0.8" />
      {/* Apron pocket right side */}
      <rect x="146" y="263" width="16" height="18" rx="3" fill="#FFD010" stroke="#C89000" strokeWidth="1.5" />
      <line x1="146" y1="269" x2="162" y2="269" stroke="#C89000" strokeWidth="1" />

      {/* ══════════ FEET ══════════ */}
      <ellipse cx="112" cy="282" rx="18" ry="9" fill="#DDD0A0" stroke="#C0B07A" strokeWidth="2" />
      <ellipse cx="148" cy="282" rx="18" ry="9" fill="#DDD0A0" stroke="#C0B07A" strokeWidth="2" />

      {/* ══════════ FACE ══════════ */}
      {/* Eyebrows — thick, expressive */}
      <path d="M102 162 Q112 156 122 161" stroke="#4A2C0A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M138 161 Q148 156 158 162" stroke="#4A2C0A" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Eye whites */}
      <ellipse cx="112" cy="178" rx="16" ry="17" fill="#fff" stroke="#2A1500" strokeWidth="2.5" />
      <ellipse cx="148" cy="178" rx="16" ry="17" fill="#fff" stroke="#2A1500" strokeWidth="2.5" />
      {/* Iris */}
      <ellipse cx="113" cy="180" rx="11" ry="12" fill="url(#fEye)" />
      <ellipse cx="149" cy="180" rx="11" ry="12" fill="url(#fEye)" />
      {/* Pupil */}
      <circle cx="114" cy="181" r="6.5" fill="#050200" />
      <circle cx="150" cy="181" r="6.5" fill="#050200" />
      {/* Eye highlights — large + small */}
      <circle cx="118" cy="175" r="4" fill="#fff" opacity="0.95" />
      <circle cx="154" cy="175" r="4" fill="#fff" opacity="0.95" />
      <circle cx="109" cy="185" r="2" fill="#fff" opacity="0.55" />
      <circle cx="145" cy="185" r="2" fill="#fff" opacity="0.55" />
      {/* Lower eyelid shine */}
      <path d="M103 186 Q112 190 121 186" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M139 186 Q148 190 157 186" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* Nose */}
      <ellipse cx="130" cy="195" rx="4.5" ry="3" fill="#C8A070" opacity="0.65" />

      {/* Mouth — wide open happy smile with teeth */}
      {/* Smile outer shape */}
      <path d="M106 206 Q130 226 154 206" fill="#4A1A00" stroke="#4A1A00" strokeWidth="0" />
      {/* Teeth row */}
      <path d="M108 207 Q130 224 152 207 Q148 216 130 219 Q112 216 108 207 Z" fill="#fff" />
      {/* Tooth dividers */}
      <line x1="118" y1="207" x2="117" y2="218" stroke="#E0D0B0" strokeWidth="1" opacity="0.5" />
      <line x1="130" y1="208" x2="130" y2="219" stroke="#E0D0B0" strokeWidth="1" opacity="0.5" />
      <line x1="142" y1="207" x2="143" y2="218" stroke="#E0D0B0" strokeWidth="1" opacity="0.5" />
      {/* Lower lip */}
      <path d="M108 207 Q130 226 154 207" stroke="#7A3A10" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Upper lip edge */}
      <path d="M108 207 Q119 204 130 207 Q141 204 154 207" stroke="#7A3A10" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Rosy cheeks */}
      <ellipse cx="90" cy="200" rx="18" ry="14" fill="url(#fCheek)" />
      <ellipse cx="170" cy="200" rx="18" ry="14" fill="url(#fCheek)" />

      {/* ══════════ CHEF HAT ══════════ */}
      {/* Hat brim — wide flat base */}
      <rect x="76" y="108" width="108" height="18" rx="5" fill="#111" stroke="#000" strokeWidth="1.5" />
      {/* Hat body — tall, slightly tapered */}
      <path d="M86 110 L90 38 L170 38 L174 110 Z" fill="url(#fHat)" stroke="#000" strokeWidth="1.5" />
      {/* Hat shine overlay */}
      <path d="M90 42 L93 108 L100 108 L97 42 Z" fill="url(#fHatShine)" />
      {/* Hat top rounded cap */}
      <ellipse cx="130" cy="39" rx="42" ry="9" fill="#1A1A1A" stroke="#000" strokeWidth="1.5" />
      {/* Subtle hat fold lines */}
      <line x1="108" y1="42" x2="106" y2="108" stroke="#333" strokeWidth="1" opacity="0.6" />
      <line x1="130" y1="40" x2="130" y2="108" stroke="#333" strokeWidth="1" opacity="0.6" />
      <line x1="152" y1="42" x2="154" y2="108" stroke="#333" strokeWidth="1" opacity="0.6" />

      {/* ──── FEZU BADGE on hat band ──── */}
      {/* Badge background */}
      <rect x="96" y="109" width="68" height="17" rx="4" fill="#FFC50A" stroke="#000" strokeWidth="1.5" />
      {/* Fork icon (left) */}
      <g transform="translate(101, 111)">
        <line x1="3" y1="1" x2="3" y2="13" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1.5" y1="1" x2="1.5" y2="5.5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4.5" y1="1" x2="4.5" y2="5.5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1.5 5.5 Q3 7 4.5 5.5" fill="none" stroke="#000" strokeWidth="1" />
      </g>
      {/* Spoon icon (right) */}
      <g transform="translate(107, 111)">
        <ellipse cx="3" cy="3.5" rx="2.5" ry="3" fill="none" stroke="#000" strokeWidth="1.5" />
        <line x1="3" y1="6.5" x2="3" y2="13" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* FEZU text */}
      <text x="130" y="121.5" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight="700" fontSize="10" fill="#000" letterSpacing="1.5">FEZU</text>
    </svg>
  )
}
