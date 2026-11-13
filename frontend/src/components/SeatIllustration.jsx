// Ink drawing: people around one table, city landmarks behind. Only the empty chairs are purple (= open positions).
const INK = '#141414';
const OPEN = '#6d28d9';

const Person = ({ x }) => (
  <>
    <rect x={x - 14} y="226" width="28" height="32" rx="7" fill="#fff" />
    <path d={`M${x - 15} 258 V242 Q${x} 228 ${x + 15} 242 V258 Z`} fill="#fff" />
    <circle cx={x} cy="218" r="9" fill="#fff" />
  </>
);

const SeatIllustration = () => (
  <svg
    role="img"
    aria-label="Line drawing of people around one table, with landmarks of Delhi, Mumbai, Hyderabad and Bengaluru behind them. Two purple chairs are empty."
    viewBox="0 0 560 400"
    className="w-full h-auto block"
  >
    {/* Skyline: India Gate, a tower, Gateway of India, Charminar, a tower, Vidhana Soudha */}
    <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 235 V140 H110 V235" />
      <path d="M58 235 V185 A17 17 0 0 1 92 185 V235" />
      <path d="M34 140 H116 M44 140 V130 H106 V140 M60 130 V118 H90 V130" />
      <path d="M125 235 V110 H150 V235 M131 125 H144 M131 140 H144 M131 155 H144 M131 170 H144 M131 185 H144 M131 200 H144" />
      <path d="M175 235 V150 H245 V235" />
      <path d="M195 235 V185 A15 15 0 0 1 225 185 V235" />
      <path d="M165 235 V120 H179 V235 M241 235 V120 H255 V235" />
      <path d="M165 120 Q172 102 179 120 M241 120 Q248 102 255 120 M172 104 V98 M248 104 V98" />
      <path d="M190 150 V138 H230 V150 M200 138 Q210 124 220 138" />
      <path d="M282 235 V165 H338 V235" />
      <path d="M296 235 V198 A14 14 0 0 1 324 198 V235" />
      <path d="M270 235 V110 H280 V235 M340 235 V110 H350 V235" />
      <path d="M270 110 Q275 94 280 110 M340 110 Q345 94 350 110 M266 150 H284 M336 150 H354 M266 125 H284 M336 125 H354" />
      <path d="M362 235 V95 H384 V235 M373 95 V80 M367 112 H379 M367 130 H379 M367 148 H379 M367 166 H379" />
      <path d="M395 235 V180 H520 V235" />
      <path d="M410 190 V235 M425 190 V235 M440 190 V235 M475 190 V235 M490 190 V235 M505 190 V235" />
      <path d="M440 180 V160 H475 V180 M445 160 Q457.5 126 470 160 M457.5 134 V120" />
    </g>

    {/* Back row and sides */}
    <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
      <Person x={150} />
      <Person x={230} />
      <rect x="316" y="222" width="28" height="36" rx="7" fill={OPEN} />
      <Person x={410} />
      <rect x="46" y="250" width="12" height="38" rx="5" fill="#fff" />
      <path d="M62 300 V276 Q72 264 84 276 V300 Z" fill="#fff" />
      <circle cx="74" cy="258" r="9" fill="#fff" />
      <rect x="502" y="250" width="12" height="38" rx="5" fill="#fff" />
      <path d="M476 300 V276 Q488 264 498 276 V300 Z" fill="#fff" />
      <circle cx="486" cy="258" r="9" fill="#fff" />
    </g>

    {/* Table and what is on it */}
    <ellipse cx="280" cy="292" rx="196" ry="48" fill="#fff" stroke={INK} strokeWidth="2" />
    <g fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M138 270 L162 270 L158 258 L142 258 Z" />
      <path d="M218 270 L242 270 L238 258 L222 258 Z" />
      <path d="M398 270 L422 270 L418 258 L402 258 Z" />
      <rect x="300" y="282" width="10" height="11" rx="2" />
      <rect x="180" y="292" width="34" height="14" rx="2" transform="rotate(-8 197 299)" />
      <path d="M84 284 L104 280 M456 284 L476 280" />
    </g>

    {/* Front row: one person seen from behind, one open chair */}
    <g stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="200" cy="318" r="10" fill="#fff" />
      <rect x="182" y="326" width="36" height="40" rx="8" fill="#fff" />
      <path d="M200 366 V378 M184 384 L200 378 L216 384" fill="none" />
      <rect x="342" y="322" width="36" height="44" rx="8" fill={OPEN} />
      <path d="M360 366 V378 M344 384 L360 378 L376 384" fill="none" />
    </g>
  </svg>
);

export default SeatIllustration;
