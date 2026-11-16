"use client";
import type { MouseEvent, ReactNode } from "react";

/**
 * Eén knoppenfamilie in Apple-stijl: pillen.
 * Effect: bij hover stroomt er licht in vanaf het punt waar je muis binnenkomt, bij klikken veert hij iets in.
 */
type Variant = "primary" | "secondary" | "secondaryDark";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-12 px-6 text-[17px]",
  lg: "h-14 px-8 text-[17px]",
};
const variants: Record<Variant, { base: string; fill: string }> = {
  primary: { base: "bg-brand text-white", fill: "bg-white/[0.16]" },
  secondary: { base: "border border-ink/15 text-ink hover:border-ink/30", fill: "bg-ink/[0.06]" },
  secondaryDark: { base: "border border-white/25 text-white hover:border-white/45", fill: "bg-white/[0.12]" },
};

const origin = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export const Button = ({ href, onClick, children, variant = "primary", size = "md", external, className = "", type }: {
  href?: string; onClick?: () => void; children: ReactNode; variant?: Variant; size?: Size; external?: boolean; className?: string; type?: "submit" | "button";
}) => {
  const v = variants[variant];
  const cls = `group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full tracking-[-0.01em] transition-[transform,border-color] duration-200 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 ${sizes[size]} ${v.base} ${className}`;
  const inner = (
    <>
      <span aria-hidden className={`pointer-events-none absolute left-[var(--x,50%)] top-[var(--y,50%)] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-500 ease-out group-hover:h-[260%] group-hover:w-[260%] group-hover:[aspect-ratio:1] ${v.fill}`} />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );
  if (href) {
    return <a href={href} onMouseEnter={origin} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>;
  }
  return <button type={type ?? "button"} onClick={onClick} onMouseEnter={origin} className={cls}>{inner}</button>;
};

const Chevron = () => (
  <svg viewBox="0 0 8 14" className="h-[0.7em] w-[0.4em] transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 1l6 6-6 6" />
  </svg>
);

/** Tekstlink met pijltje, zoals "Meer bekijken ›" bij Apple */
export const TextLink = ({ href, onClick, children, className = "", external, light = false }: {
  href?: string; onClick?: () => void; children: ReactNode; className?: string; external?: boolean; light?: boolean;
}) => {
  const cls = `group inline-flex items-center gap-1.5 text-[17px] tracking-[-0.01em] hover:underline underline-offset-4 ${light ? "text-[#7CC7A0]" : "text-brand"} ${className}`;
  if (href) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{children}<Chevron /></a>;
  return <button type="button" onClick={onClick} className={cls}>{children}<Chevron /></button>;
};

/** Opent de intro-chat vanaf elke plek */
export const openChat = () => window.dispatchEvent(new Event("appmaatje:open-chat"));
