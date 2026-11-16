// Tijdelijk logo: rond merkteken met vinkje + woordmerk (ref. rond logo in screenshot).
export const Logo = ({ className = "", light = false, mark = false }: { className?: string; light?: boolean; mark?: boolean }) => (
  <span className={`inline-flex items-center gap-2.5 ${light ? "text-white" : "text-ink"} ${className}`}>
    <span className={`grid h-11 w-11 place-items-center rounded-full border-2 ${light ? "border-white" : "border-ink"}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </span>
    {!mark && <span className="font-display text-[26px] uppercase leading-none tracking-[0.005em]">appmaatje</span>}
  </span>
);
