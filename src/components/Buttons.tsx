"use client";
import type { ReactNode } from "react";

/* Knoppen gebaseerd op Uiverse.io-snippets (cssbuttons-io, karthik092726122003), in Appmaatje-kleuren */

type LinkProps = { href: string; children: ReactNode; className?: string; external?: boolean };
const ext = (e?: boolean) => (e ? { target: "_blank", rel: "noopener" } : {});

/** Hoofdknop: vlak, met een cirkel die vanuit het midden vol loopt bij hover */
export const FillButton = ({ href, children, className = "", external, tone = "ink" }: LinkProps & { tone?: "ink" | "brand" }) => (
  <a href={href} {...ext(external)}
    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-[2.2em] py-[0.95em] font-medium text-white transition-transform active:scale-[0.97] ${tone === "ink" ? "bg-ink" : "bg-brand"} ${className}`}>
    <span aria-hidden className="absolute inset-0 -mt-[0.25em] rounded-lg bg-gradient-to-b from-transparent via-transparent to-black/30" />
    <span aria-hidden className={`absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-out group-hover:h-[14em] group-hover:w-[14em] ${tone === "ink" ? "bg-brand/90" : "bg-ink/60"}`} />
    <span className="relative -top-px">{children}</span>
  </a>
);

/** Tweede knop: cirkel met pijl die bij hover uitrekt tot de hele knop */
export const ArrowButton = ({ href, children, className = "", external, dark = false }: LinkProps & { dark?: boolean }) => (
  <a href={href} {...ext(external)} className={`group relative inline-block h-12 w-[15.5rem] ${className}`}>
    <span aria-hidden className={`absolute left-0 top-0 block h-12 w-12 rounded-full transition-all duration-[450ms] ease-[cubic-bezier(.65,0,.076,1)] group-hover:w-full ${dark ? "bg-cream" : "bg-ink"}`}>
      <span className={`absolute left-[0.625rem] top-1/2 h-[2px] w-[1.125rem] -translate-y-1/2 bg-transparent transition-all duration-[450ms] ease-[cubic-bezier(.65,0,.076,1)] group-hover:translate-x-4 ${dark ? "group-hover:bg-ink" : "group-hover:bg-white"}`}>
        <span className={`absolute -top-[0.29rem] right-[0.0625rem] h-[0.625rem] w-[0.625rem] rotate-45 border-r-2 border-t-2 ${dark ? "border-ink" : "border-white"}`} />
      </span>
    </span>
    <span className={`absolute inset-0 ml-[1.85rem] flex items-center justify-center text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-[450ms] ${dark ? "text-cream group-hover:text-ink" : "text-ink group-hover:text-white"}`}>
      {children}
    </span>
  </a>
);

/** Ronde terug-knop: ring wisselt naar groen en de pijl schuift door */
export const BackButton = ({ href, label, className = "" }: { href: string; label: string; className?: string }) => {
  const arrow = (
    <svg viewBox="0 0 46 40" className="mx-[18px] ml-[22px] mt-[24px] block h-[30px] w-[30px] shrink-0 fill-ink" aria-hidden>
      <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" transform="rotate(180 23 20)" />
    </svg>
  );
  return (
    <a href={href} aria-label={label} className={`group relative block h-[76px] w-[76px] overflow-hidden ${className}`}>
      <span aria-hidden className="absolute inset-[7px] rounded-full border-[3px] border-ink transition-all delay-[80ms] duration-500 group-hover:scale-[0.7] group-hover:opacity-0 group-focus-visible:scale-[0.7] group-focus-visible:opacity-0" />
      <span aria-hidden className="absolute inset-[7px] scale-[1.3] rounded-full border-4 border-brand opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[80ms] group-focus-visible:scale-100 group-focus-visible:opacity-100" />
      <span className="absolute left-0 top-0 flex transition-transform duration-[400ms] group-hover:-translate-x-[69px] group-focus-visible:-translate-x-[69px]">
        {arrow}{arrow}
      </span>
    </a>
  );
};
