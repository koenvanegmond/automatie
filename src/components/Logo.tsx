// Tijdelijk logo: woordmerk "appmaatje" met een vinkje.
export const Logo = ({ className = "", light = false }: { className?: string; light?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 font-display text-[22px] font-semibold tracking-[-0.03em] ${light ? "text-white" : "text-ink"} ${className}`}>
    <span className="relative grid h-7 w-7 place-items-center rounded-none bg-brand">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
    appmaatje
  </span>
);
