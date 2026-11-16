"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { CheckIcon } from "@/components/Icons";
import { PixelWipe } from "@/components/PixelWipe";
import { ArrowButton, FillButton } from "@/components/Buttons";

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

/** Regel die van onder uit een masker omhoog schuift (ref. Sparkline) */
const Line = ({ children, i, go, className = "" }: { children: React.ReactNode; i: number; go: boolean; className?: string }) => (
  <span className="block overflow-hidden pb-[0.06em]">
    <motion.span className={`block ${className}`} initial={{ y: "105%" }} animate={go ? { y: 0 } : { y: "105%" }}
      transition={{ duration: 1, ease, delay: 0.1 + i * 0.12 }}>
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const t = useT().hero;
  const intro = useIntroDone();
  const reduce = useReducedMotion();
  const go = intro || !!reduce;

  return (
    <>
      <section id="top" className="relative overflow-hidden bg-ink text-white">
        {/* dunne rasterlijnen en gloed */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="container relative h-full">
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/[0.06]" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/[0.06]" />
          </div>
        </div>

        <div className="container relative flex min-h-[88svh] flex-col justify-between pb-14 pt-32 md:pt-40">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease }}
              className="mb-8 inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 font-mono uppercase tracking-[0.14em] text-[11px] text-[13px] text-white/70">
              <span className="h-2 w-2 bg-[#7CC7A0]" />
              {t.eyebrow}
            </motion.p>
            <h1 className="font-display font-medium leading-[0.98] tracking-[-0.05em] text-[48px] md:text-[96px] lg:text-[128px]">
              <Line i={0} go={go}>{t.h1a}</Line>
              <Line i={1} go={go} className="text-white/45">{t.h1b}</Line>
              <Line i={2} go={go}>
                <span className="relative inline-block px-[0.12em]">
                  <motion.span aria-hidden className="absolute inset-x-0 bottom-[0.06em] top-[0.12em] origin-left rounded-none bg-brand"
                    initial={{ scaleX: 0 }} animate={go ? { scaleX: 1 } : {}} transition={{ duration: 0.8, ease, delay: 0.85 }} />
                  <span className="relative">{t.h1c}</span>
                </span>
                <motion.span aria-hidden className="ml-[0.18em] inline-grid h-[0.5em] w-[0.5em] translate-y-[-0.08em] place-items-center bg-[#7CC7A0] align-middle text-ink"
                  initial={{ scale: 0, rotate: -45 }} animate={go ? { scale: 1, rotate: 0 } : {}} transition={{ delay: 1.35, type: "spring", stiffness: 360, damping: 14 }}>
                  <CheckIcon className="h-[0.3em] w-[0.3em]" />
                </motion.span>
              </Line>
            </h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mt-14 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[440px] text-xl leading-snug text-white/70">{t.sub}</p>
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <FillButton href={waLink(t.waText)} external tone="brand">{t.cta1}</FillButton>
                <ArrowButton href="#voorbeelden" dark>{t.cta2}</ArrowButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="bg-cream"><PixelWipe /></div>
    </>
  );
};
