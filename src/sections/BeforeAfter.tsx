"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useT } from "@/lib/i18n";
import { CheckIcon } from "@/components/Icons";

const scatter = [
  { x: 2, y: 4, r: -8 }, { x: 34, y: 14, r: 6 }, { x: 14, y: 32, r: -4 },
  { x: 30, y: 48, r: 8 }, { x: 0, y: 64, r: 5 }, { x: 22, y: 82, r: -6 },
];

const Tile = ({ i, p, chaos, order }: { i: number; p: MotionValue<number>; chaos: string; order: string }) => {
  const s = scatter[i];
  const left = useTransform(p, [0, 1], [`${s.x}%`, "8%"]);
  const top = useTransform(p, [0, 1], [`${s.y}%`, `${i * 15.5 + 3}%`]);
  const rotate = useTransform(p, [0, 1], [s.r, 0]);
  const chaosOp = useTransform(p, [0.4, 0.6], [1, 0]);
  const orderOp = useTransform(p, [0.4, 0.6], [0, 1]);
  const bg = useTransform(p, [0.4, 0.6], ["#FFFFFF", "#FFFFFF"]);
  return (
    <motion.div style={{ left, top, rotate, background: bg }}
      className="absolute w-[66%] max-w-[340px] rounded-2xl border border-ink/[0.07] px-4 py-3 shadow-card">
      <motion.span style={{ opacity: chaosOp }} className="absolute inset-0 flex items-center px-4 text-[15px] text-ink">
        <span className="mr-2 h-2 w-2 rounded-full bg-[#E5484D]" />{chaos}
      </motion.span>
      <motion.span style={{ opacity: orderOp }} className="flex items-center gap-2 text-[15px] font-medium text-ink">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white"><CheckIcon className="h-3 w-3" /></span>{order}
      </motion.span>
    </motion.div>
  );
};

export const BeforeAfter = () => {
  const t = useT().before;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);
  const fromOp = useTransform(p, [0.3, 0.55], [1, 0.25]);
  const toOp = useTransform(p, [0.45, 0.7], [0.15, 1]);
  const scribble = useTransform(p, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} data-flow className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <motion.h2 style={{ opacity: fromOp }} className="h2 mt-4">{t.from}</motion.h2>
            <motion.p style={{ opacity: fromOp }} className="mt-3 max-w-sm text-lg">{t.fromSub}</motion.p>
            <motion.h3 style={{ opacity: toOp }} className="h2 mt-10 text-brand">{t.to}</motion.h3>
            <motion.p style={{ opacity: toOp }} className="mt-3 max-w-sm text-lg">{t.toSub}</motion.p>
          </div>
          <div className="relative h-[460px]">
            <motion.svg style={{ opacity: scribble }} viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
              <path d="M40 60c120-40 260 40 200 120S60 160 120 260s240 40 220-60-180-60-160 60 140 120 180 100" stroke="#1C1917" strokeOpacity=".18" strokeWidth="2" />
              <path d="M300 40c-80 60-220 0-200 100s200 40 160 140-200-20-180 80" stroke="#1C1917" strokeOpacity=".12" strokeWidth="2" />
            </motion.svg>
            <motion.div style={{ opacity: useTransform(p, [0.5, 0.8], [0, 1]) }} className="absolute left-[calc(8%-14px)] top-[6%] bottom-[10%] w-[2px] bg-brand/40" />
            {t.chaos.map((c, i) => <Tile key={i} i={i} p={p} chaos={c} order={t.order[i]} />)}
          </div>
        </div>
      </div>
    </section>
  );
};
