"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { BellSticker, CalendarSticker, ChatSticker, CoinSticker } from "@/components/Stickers";
import { Ticker } from "@/components/Ticker";

const ease = [0.22, 1, 0.36, 1] as const;

/** Wacht tot de intro-chat weg is, zodat het hero-moment niet achter de overlay afspeelt */
function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const check = () => {
      const hidden = !document.getElementById("intro") || document.documentElement.classList.contains("intro-seen");
      if (hidden) setDone(true);
      return hidden;
    };
    if (check()) return;
    const mo = new MutationObserver(() => { if (check()) mo.disconnect(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return done;
}

/** Sticker die zweeft en meebeweegt met de muis */
const Float = ({ children, className, mx, my, depth, r, d, delay, go }: {
  children: React.ReactNode; className: string; mx: MotionValue<number>; my: MotionValue<number>; depth: number; r: number; d: number; delay: number; go: boolean;
}) => {
  const x = useTransform(mx, (v) => v * 50 * depth);
  const y = useTransform(my, (v) => v * 40 * depth);
  return (
    <motion.div style={{ x, y }} className={`pointer-events-none absolute ${className}`}>
      <motion.div initial={{ scale: 0, rotate: r - 30 }} animate={go ? { scale: 1, rotate: 0 } : {}} transition={{ type: "spring", stiffness: 220, damping: 14, delay }}>
        <div className="bob" style={{ ["--r" as string]: `${r}deg`, ["--d" as string]: `${d}s` }}>{children}</div>
      </motion.div>
    </motion.div>
  );
};

const Chat = () => (
  <span className="grid h-full w-full place-items-center rounded-full bg-mint">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#0E1110" strokeWidth={2.4} strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
  </span>
);

export const Hero = () => {
  const t = useT();
  const reduce = useReducedMotion();
  const go = useIntroDone() || !!reduce;
  const ref = useRef<HTMLElement>(null);
  const rmx = useMotionValue(0), rmy = useMotionValue(0);
  const mx = useSpring(rmx, { stiffness: 70, damping: 18 });
  const my = useSpring(rmy, { stiffness: 70, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); rmx.set((e.clientX - r.left) / r.width - 0.5); rmy.set((e.clientY - r.top) / r.height - 0.5); };
    const leave = () => { rmx.set(0); rmy.set(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [reduce, rmx, rmy]);

  const words = `${t.hero.h1a} ${t.hero.h1b} ${t.hero.h1c}`.split(" ");

  return (
    <section ref={ref} id="top" className="relative overflow-hidden bg-white">
      <div className="relative flex min-h-[92svh] flex-col items-center justify-center px-6 pb-16 pt-36 text-center">
        <Float mx={mx} my={my} depth={1.2} r={-12} d={5.5} delay={0.5} go={go} className="left-[6%] top-[13%] w-20 md:left-[30%] md:top-[9%] md:w-32"><ChatSticker /></Float>
        <Float mx={mx} my={my} depth={0.8} r={8} d={6.2} delay={0.65} go={go} className="right-[6%] top-[14%] w-16 md:right-[7%] md:top-[30%] md:w-28"><CalendarSticker /></Float>
        <Float mx={mx} my={my} depth={1.5} r={-6} d={5} delay={0.8} go={go} className="bottom-[14%] left-[5%] w-20 md:bottom-[20%] md:left-[10%] md:w-36"><CoinSticker /></Float>
        <Float mx={mx} my={my} depth={1} r={10} d={6.8} delay={0.95} go={go} className="bottom-[13%] right-[7%] w-16 md:bottom-[18%] md:right-[17%] md:w-28"><BellSticker /></Float>

        <h1 className="relative z-10 mx-auto max-w-[1200px] font-display text-[clamp(44px,14vw,80px)] uppercase leading-[0.86] tracking-[-0.005em] text-ink md:text-[120px] lg:text-[150px]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
              <motion.span className={`inline-block ${i === words.length - 1 ? "text-brand" : ""}`} initial={{ y: "110%" }} animate={go ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease, delay: 0.05 + i * 0.07 }}>
                {w}{i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.7, ease }}
          className="lead relative z-10 mt-7 max-w-2xl">{t.home.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.62, duration: 0.7, ease }}
          className="relative z-10 mt-9 flex flex-wrap justify-center gap-2.5">
          <Button href={waLink(t.hero.waText)} external size="lg" icon={<Chat />}>{t.ui.nav.cta}</Button>
          <Button href="/kennismaken" size="lg" variant="primary">{t.ui.meet}</Button>
        </motion.div>
        <motion.a href="/demo" initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : {}} transition={{ delay: 0.75, duration: 0.7, ease }}
          className="relative z-10 mt-5 inline-block text-[16px] font-semibold text-ink underline decoration-2 underline-offset-4 hover:text-brand">Of klik zelf door de demo →</motion.a>
      </div>
      <Ticker />
    </section>
  );
};
