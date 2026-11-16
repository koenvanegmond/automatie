"use client";
import type { MouseEvent, ReactNode } from "react";

/**
 * Eén knoppenfamilie: massieve blokken, dikke letters, geen randen of rondingen.
 * Effect: bij hover stroomt er licht in vanaf het punt waar je muis binnenkomt, bij klikken veert hij iets in.
 */
type Variant = "primary" | "light" | "dark" | "soft";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[15px]",
  md: "h-14 px-7 text-[17px]",
  lg: "h-16 px-9 text-[19px]",
};
const variants: Record<Variant, { base: string; fill: string }> = {
  primary: { base: "bg-brand text-white", fill: "bg-white/[0.18]" },
  light: { base: "bg-white text-ink", fill: "bg-brand/[0.15]" },
  dark: { base: "bg-ink text-white", fill: "bg-white/[0.12]" },
  soft: { base: "bg-sand text-ink", fill: "bg-ink/[0.07]" },
};

const origin = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

const Arrow = () => (
  <svg viewBox="0 0 16 16" className="h-[0.9em] w-[0.9em] transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="square" aria-hidden>
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

export const Button = ({ href, onClick, children, variant = "primary", size = "md", external, className = "", type, arrow }: {
  href?: string; onClick?: () => void; children: ReactNode; variant?: Variant; size?: Size; external?: boolean; className?: string; type?: "submit" | "button"; arrow?: boolean;
}) => {
  const v = variants[variant];
  const cls = `group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-display font-extrabold tracking-[-0.02em] transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${sizes[size]} ${v.base} ${className}`;
  const inner = (
    <>
      <span aria-hidden className={`pointer-events-none absolute left-[var(--x,50%)] top-[var(--y,50%)] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-500 ease-out group-hover:h-[300%] group-hover:w-[300%] group-hover:[aspect-ratio:1] ${v.fill}`} />
      <span className="relative inline-flex items-center gap-2.5">{children}{arrow && <Arrow />}</span>
    </>
  );
  if (href) return <a href={href} onMouseEnter={origin} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>;
  return <button type={type ?? "button"} onClick={onClick} onMouseEnter={origin} className={cls}>{inner}</button>;
};

/** Tekstlink met pijl */
export const TextLink = ({ href, onClick, children, className = "", external, light = false }: {
  href?: string; onClick?: () => void; children: ReactNode; className?: string; external?: boolean; light?: boolean;
}) => {
  const cls = `group inline-flex items-center gap-2 font-display text-[19px] font-extrabold tracking-[-0.02em] ${light ? "text-[#7CC7A0]" : "text-brand"} ${className}`;
  if (href) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{children}<Arrow /></a>;
  return <button type="button" onClick={onClick} className={cls}>{children}<Arrow /></button>;
};

/** Opent de intro-chat vanaf elke plek */
export const openChat = () => window.dispatchEvent(new Event("appmaatje:open-chat"));
