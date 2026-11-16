"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { HeroGlow } from "@/components/HeroGlow";
import { PixelWipe } from "@/components/PixelWipe";

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

const Line = ({ children, i, go, className = "" }: { children: React.ReactNode; i: number; go: boolean; className?: string }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className={`block ${className}`} initial={{ y: "105%" }} animate={go ? { y: 0 } : { y: "105%" }} transition={{ duration: 1, ease, delay: 0.1 + i * 0.12 }}>
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const t = useT();
  const reduce = useReducedMotion();
  const go = useIntroDone() || !!reduce;

  return (
    <>
      <section id="top" data-theme="dark" className="relative overflow-hidden bg-ink text-white">
        <HeroGlow />
        <div className="container relative flex min-h-[92svh] flex-col items-center justify-center pb-24 pt-28 text-center">
          <h1 className="font-display font-medium leading-[1.0] tracking-[-0.045em] text-[52px] md:text-[96px] lg:text-[120px]">
            <Line i={0} go={go}>{t.hero.h1a}</Line>
            <Line i={1} go={go} className="text-white/45">{t.hero.h1b}</Line>
            <Line i={2} go={go} className="text-[#7CC7A0]">{t.hero.h1c}</Line>
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="mt-12 w-full max-w-[640px] rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl md:p-8">
            <p className="text-[21px] leading-[1.4] tracking-[-0.01em] text-white/85 md:text-[24px]">{t.home.sub}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href={waLink(t.hero.waText)} external size="lg">{t.ui.nav.cta}</Button>
              <Button href="/kennismaken" variant="secondaryDark" size="lg">{t.ui.meet}</Button>
            </div>
            <p className="mt-5 text-[14px] text-white/50">{t.ui.noBot}</p>
          </motion.div>
        </div>
      </section>
      <div className="bg-white"><PixelWipe /></div>
    </>
  );
};
