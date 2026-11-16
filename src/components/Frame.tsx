/** Zwart kader met ronde binnenhoeken rond de hele pagina (ref. screenshot) */
export const Frame = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
    <div className="absolute inset-[8px] rounded-[22px] shadow-[0_0_0_60px_#0E1110] md:inset-[12px] md:rounded-[28px]" />
  </div>
);
