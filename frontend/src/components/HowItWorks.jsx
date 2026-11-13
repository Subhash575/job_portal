// Three steps drawn in the same ink + pastel style as the hero.
const INK = '#141414';

const SearchArt = () => (
  <svg aria-hidden="true" viewBox="0 0 160 120" className="w-full h-auto">
    <g stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="22" width="92" height="70" rx="8" fill="#fff" />
      <rect x="28" y="32" width="18" height="18" rx="4" fill="#ffd8c2" />
      <path d="M54 36 H96 M54 46 H84 M28 62 H98 M28 72 H88 M28 82 H70" fill="none" />
      <circle cx="108" cy="70" r="24" fill="#fff" />
      <circle cx="108" cy="70" r="16" fill="#cfe3ff" />
      <path d="M126 88 L144 106" strokeWidth="6" />
    </g>
  </svg>
);

const ApplyArt = () => (
  <svg aria-hidden="true" viewBox="0 0 160 120" className="w-full h-auto">
    <g stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="16" width="66" height="88" rx="6" fill="#fff" />
      <rect x="30" y="26" width="20" height="22" rx="4" fill="#c9f0dc" />
      <path d="M56 30 H76 M56 40 H72 M30 60 H76 M30 70 H70 M30 80 H76 M30 90 H62" fill="none" />
      <path d="M98 70 L148 44 L132 96 L118 78 Z" fill="#fdeaa7" />
      <path d="M148 44 L118 78" fill="none" />
      <path d="M92 86 Q80 96 70 110" fill="none" strokeDasharray="4 6" />
    </g>
  </svg>
);

const SeatArt = () => (
  <svg aria-hidden="true" viewBox="0 0 160 120" className="w-full h-auto">
    <g stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="36" y="10" width="50" height="66" rx="11" fill="#fff" />
      <path d="M46 18 H76" fill="none" />
      <path d="M43 76 V60 Q61 44 79 60 V76 Z" fill="#fbd3e6" />
      <circle cx="61" cy="36" r="11" fill="#fff" />
      <path d="M61 80 V96 M45 104 L61 96 L77 104" fill="none" />
      <circle cx="45" cy="105" r="2.5" fill="#fff" />
      <circle cx="77" cy="105" r="2.5" fill="#fff" />
      <rect x="92" y="52" width="26" height="20" rx="2" fill="#e4dcff" />
      <path d="M88 74 H122" fill="none" />
      <rect x="14" y="74" width="116" height="6" rx="2" fill="#fff" />
      <path d="M24 80 V112 M120 80 V112" fill="none" />
      <circle cx="128" cy="34" r="16" fill="#6d28d9" />
      <path d="M120 34 L126 40 L137 28" stroke="#fff" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

const steps = [
  {
    art: SearchArt,
    tile: '#fff1e8',
    title: 'Search',
    text: 'Type a role, skill or company, then narrow it down by city and salary.',
  },
  {
    art: ApplyArt,
    tile: '#ecfdf3',
    title: 'Apply in one click',
    text: 'Your profile and resume go straight to the recruiter. No long forms.',
  },
  {
    art: SeatArt,
    tile: '#fdf2f8',
    title: 'Take your seat',
    text: 'Follow every application from pending to accepted on your profile.',
  },
];

// Curved arrow between steps (wide screens only); the head is aligned to the curve's end.
const Arrow = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 80 40"
    className="hidden lg:block absolute -right-[88px] top-24 w-20 text-brand"
  >
    <path
      d="M6 30 C24 8 52 6 70 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M74 25.5 L62 22.5 L69.5 13.5 Z" fill="currentColor" />
  </svg>
);

const HowItWorks = () => (
  <section
    aria-labelledby="how-it-works"
    className="max-w-6xl mx-auto px-4 sm:px-6 pb-16"
  >
    <p className="mb-2 font-mono text-[13px] tracking-[.12em] uppercase text-brand">
      How it works
    </p>
    <h2
      id="how-it-works"
      className="mb-10 text-3xl sm:text-4xl font-light tracking-[-0.03em] text-ink"
    >
      From search to <b className="font-bold">seat</b>, in three steps
    </h2>
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-24">
      {steps.map(({ art, tile, title, text }, i) => (
        <li key={title} className="relative flex flex-col gap-4">
          <div className="rounded-3xl p-6" style={{ background: tile }}>
            {art()}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-4xl text-brand leading-none">
              {i + 1}.
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-ink">
              {title}
            </h3>
          </div>
          <p className="text-ink-muted leading-relaxed">{text}</p>
          {i < steps.length - 1 && <Arrow />}
        </li>
      ))}
    </ol>
  </section>
);

export default HowItWorks;
