"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/**
 * Donkere achtergrond met een zachte groene gloed die de muis vertraagd volgt,
 * een vleugje glas-licht, korrel en donkere randen. Alleen transform/opacity; statisch op touch en bij reduced motion.
 */
export const HeroGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const gx = useMotionValue(0), gy = useMotionValue(0);
  const glowX = useSpring(gx, { stiffness: 50, damping: 20, mass: 1 });
  const glowY = useSpring(gy, { stiffness: 50, damping: 20, mass: 1 });
  const hiX = useSpring(gx, { stiffness: 120, damping: 22 });
  const hiY = useSpring(gy, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const rest = () => { const r = el.getBoundingClientRect(); gx.set(r.width * 0.62); gy.set(r.height * 0.38); };
    rest();
    if (reduce || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); gx.set(e.clientX - r.left); gy.set(e.clientY - r.top); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", rest);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", rest); };
  }, [reduce, gx, gy]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 110%, rgba(37,133,90,.16), transparent 70%)" }} />
        <motion.div className="absolute left-0 top-0 h-[1000px] w-[1000px] -ml-[500px] -mt-[500px] rounded-full will-change-transform"
          style={{ x: glowX, y: glowY, background: "radial-gradient(circle, rgba(37,133,90,.26) 0%, rgba(37,133,90,.08) 38%, transparent 68%)" }} />
        <motion.div className="absolute left-0 top-0 h-[280px] w-[280px] -ml-[140px] -mt-[140px] rounded-full mix-blend-soft-light will-change-transform"
          style={{ x: hiX, y: hiY, background: "radial-gradient(circle, rgba(255,255,255,.07), transparent 70%)" }} />
      </div>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.35))" }} />
    </div>
  );
};
