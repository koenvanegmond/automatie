"use client";
import type { MouseEvent, ReactNode } from "react";

/**
 * Pillen met een dikke zwarte rand en dikke kapitalen (ref. screenshot).
 * Effect: bij hover loopt de pil vol vanaf het punt waar je muis binnenkomt; bij klikken drukt hij in.
 */
type Variant = "outline" | "primary" | "highlight" | "brand";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-[13px]",
  md: "h-[52px] px-6 text-[14px]",
  lg: "h-[60px] px-7 text-[15px]",
};
const variants: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  outline: { base: "bg-white text-ink", fill: "bg-mint", hoverText: "" },
  primary: { base: "bg-ink text-white", fill: "bg-brand", hoverText: "" },
  highlight: { base: "bg-mint text-ink", fill: "bg-sun", hoverText: "" },
  brand: { base: "bg-brand text-white", fill: "bg-ink", hoverText: "" },
};

const origin = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export const Button = ({ href, onClick, children, variant = "outline", size = "md", external, className = "", type, icon, arrow }: {
  href?: string; onClick?: () => void; children: ReactNode; variant?: Variant; size?: Size; external?: boolean; className?: string;
  type?: "submit" | "button"; icon?: ReactNode; arrow?: boolean;
}) => {
  const v = variants[variant];
  const cls = `group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border-2 border-ink font-ui font-bold uppercase tracking-[0.01em] transition-transform duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${icon ? "pl-1.5" : ""} ${sizes[size]} ${v.base} ${className}`;
  const inner = (
    <>
      <span aria-hidden className={`pointer-events-none absolute left-[var(--x,50%)] top-[var(--y,50%)] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-500 ease-out group-hover:h-[320%] group-hover:w-[320%] ${v.fill}`} />
      {icon && <span className="relative grid h-[calc(100%-8px)] aspect-square place-items-center">{icon}</span>}
      <span className="relative">{children}</span>
      {arrow && <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>}
    </>
  );
  if (href) return <a href={href} onMouseEnter={origin} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>;
  return <button type={type ?? "button"} onClick={onClick} onMouseEnter={origin} className={cls}>{inner}</button>;
};

/** Rond icoonknopje (zoals de + in de screenshot) */
export const IconButton = ({ onClick, label, children, active = false }: { onClick: () => void; label: string; children: ReactNode; active?: boolean }) => (
  <button onClick={onClick} aria-label={label} aria-expanded={active}
    className={`grid h-11 w-11 place-items-center rounded-full border-2 border-ink transition-colors active:scale-[0.94] ${active ? "bg-ink text-white" : "bg-white text-ink hover:bg-mint"}`}>
    {children}
  </button>
);

/** Tekstlink met pijl */
export const TextLink = ({ href, onClick, children, className = "", external }: {
  href?: string; onClick?: () => void; children: ReactNode; className?: string; external?: boolean; light?: boolean;
}) => {
  const cls = `group inline-flex items-center gap-2 font-ui text-[15px] font-bold uppercase tracking-[0.01em] text-ink underline decoration-2 underline-offset-[6px] decoration-brand hover:decoration-ink ${className}`;
  const a = <span className="transition-transform group-hover:translate-x-1">→</span>;
  if (href) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{children}{a}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}{a}</button>;
};

/** Opent de intro-chat vanaf elke plek */
export const openChat = () => window.dispatchEvent(new Event("appmaatje:open-chat"));
