/* Speelse stickers met dikke zwarte lijnen en pastelvullingen (ref. sleutel/munt/slot in screenshot) */
const S = { stroke: "#0E1110", strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export const Sparkle = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-12C1.5-3 3-1.5 12 0 3 1.5 1.5 3 0 12-1.5 3-3 1.5-12 0-3-1.5-1.5-3 0-12Z" fill="#fff" {...S} strokeWidth={2.5} />
);

const bubble = "M24 12h72a22 22 0 0 1 22 22v30a22 22 0 0 1-22 22H52l-22 18V86h-6A22 22 0 0 1 2 64V34a22 22 0 0 1 22-22Z";

export const ChatSticker = ({ className = "" }: { className?: string }) => (
  <svg viewBox="-6 -6 140 132" className={className} aria-hidden>
    <path d={bubble} transform="translate(7 8)" fill="#5CB884" {...S} />
    <path d={bubble} fill="#9FE0B8" {...S} />
    <circle cx="36" cy="49" r="6" fill="#0E1110" /><circle cx="60" cy="49" r="6" fill="#0E1110" /><circle cx="84" cy="49" r="6" fill="#0E1110" />
    <Sparkle x={122} y={6} s={0.9} />
  </svg>
);

export const CalendarSticker = ({ className = "" }: { className?: string }) => (
  <svg viewBox="-6 -10 136 132" className={className} aria-hidden>
    <rect x="10" y="16" width="100" height="94" rx="16" fill="#D9B53A" {...S} />
    <rect x="2" y="8" width="100" height="94" rx="16" fill="#F7D95C" {...S} />
    <path d="M2 34h100" {...S} fill="none" />
    <rect x="22" y="-2" width="10" height="20" rx="5" fill="#fff" {...S} />
    <rect x="72" y="-2" width="10" height="20" rx="5" fill="#fff" {...S} />
    <path d="M30 66l14 14 30-30" fill="none" {...S} strokeWidth={7} />
    <Sparkle x={-2} y={104} s={0.8} />
  </svg>
);

export const CoinSticker = ({ className = "" }: { className?: string }) => (
  <svg viewBox="-8 -8 136 120" className={className} aria-hidden>
    <ellipse cx="62" cy="62" rx="56" ry="40" fill="#1D6B48" {...S} />
    <path d="M6 62v-12" {...S} /><path d="M118 62v-12" {...S} />
    <ellipse cx="62" cy="50" rx="56" ry="40" fill="#25855A" {...S} />
    <ellipse cx="62" cy="50" rx="40" ry="27" fill="#9FE0B8" {...S} />
    <path d="M44 50l12 11 24-22" fill="none" {...S} strokeWidth={7} />
    <Sparkle x={112} y={6} s={0.9} />
  </svg>
);

export const BellSticker = ({ className = "" }: { className?: string }) => (
  <svg viewBox="-8 -8 132 140" className={className} aria-hidden>
    <path d="M60 14c-24 0-38 18-38 42v22L10 96h100L98 78V56c0-24-14-42-38-42Z" transform="translate(6 6)" fill="#B79CE6" {...S} />
    <path d="M60 14c-24 0-38 18-38 42v22L10 96h100L98 78V56c0-24-14-42-38-42Z" fill="#DCCBF7" {...S} />
    <circle cx="60" cy="10" r="7" fill="#DCCBF7" {...S} />
    <path d="M46 98a14 14 0 0 0 28 0" fill="#F7D95C" {...S} />
    <path d="M38 50c2-10 8-17 16-20" fill="none" {...S} stroke="#fff" strokeWidth={5} />
    <Sparkle x={-2} y={30} s={0.85} />
  </svg>
);
