"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useT } from "@/lib/i18n";
import { CheckIcon } from "@/components/Icons";

const ease = [0.22, 1, 0.36, 1] as const;

const Counter = ({ to, run, className }: { to: number; run: boolean; className?: string }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [run, to]);
  return <span className={className}>{v}</span>;
};

/** Handwerk tegenover Appmaat, met tellers (rekenvoorbeeld) */
export const BeforeAfter = () => {
  const t = useT().before;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const Step = ({ i, text, good }: { i: number; text: string; good: boolean }) => (
    <motion.li initial={{ opacity: 0, x: good ? 16 : -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3 + i * 0.18 + (good ? 0.5 : 0), duration: 0.6, ease }}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] ${good ? "bg-white text-ink shadow-[0_1px_2px_rgba(28,25,23,.04),0_8px_20px_-12px_rgba(28,25,23,.18)]" : "bg-white/60 text-body"}`}>
      {good
        ? <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white"><CheckIcon className="h-3.5 w-3.5" /></span>
        : <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/15 text-[11px] text-ink/40">{i + 1}</span>}
      {text}
    </motion.li>
  );

  return (
    <section className="pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mx-auto mt-4 max-w-4xl">{t.title}</h2>
          <p className="mt-4 text-lg">{t.sub}</p>
        </div>
        <div ref={ref} className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease }}
            className="rounded-[28px] bg-sand p-6 md:p-8">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-ink/50">{t.now}</p>
              <p className="font-display text-5xl font-medium tracking-[-0.04em] text-ink tabular-nums">
                <Counter to={t.nowMin} run={inView} /><span className="ml-1 text-xl text-ink/40">min</span>
              </p>
            </div>
            <p className="mt-1 text-right text-xs text-ink/40">{t.perDay}</p>
            <ul className="mt-6 space-y-2">{t.nowSteps.map((s, i) => <Step key={s} i={i} text={s} good={false} />)}</ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="relative overflow-hidden rounded-[28px] bg-brand-light/70 p-6 md:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-[70px]" />
            <div className="relative flex items-baseline justify-between">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-brand-dark">{t.with}</p>
              <p className="font-display text-5xl font-medium tracking-[-0.04em] text-brand-dark tabular-nums">0<span className="ml-1 text-xl text-brand-dark/50">min</span></p>
            </div>
            <p className="relative mt-1 text-right text-xs text-brand-dark/60">{t.perDay}</p>
            <ul className="relative mt-6 space-y-2">{t.withSteps.map((s, i) => <Step key={s} i={i} text={s} good />)}</ul>
          </motion.div>
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-body/70">{t.note}</p>
      </div>
    </section>
  );
};
