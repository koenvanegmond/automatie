// Tijdelijk logo: woordmerk "appmaat" met een vinkje.
export const Logo = ({ className = "", light = false }: { className?: string; light?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 font-display text-[22px] font-bold tracking-[-0.04em] ${light ? "text-white" : "text-ink"} ${className}`}>
    <span className="relative grid h-7 w-7 place-items-center rounded-[9px] bg-brand">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
    appmaat
  </span>
);
