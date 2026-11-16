"use client";
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const COLS = 24, ROWS = 5;
const rand = (i: number) => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };

const Tile = ({ p, th, color }: { p: MotionValue<number>; th: number; color: string }) => {
  const opacity = useTransform(p, [th - 0.004, th], [1, 0]);
  return <motion.div style={{ opacity, backgroundColor: color }} className="aspect-square" />;
};

/**
 * Blokjes-overgang tussen twee kleuren. De tegels hebben de kleur van de sectie erboven ("from")
 * en lossen tijdens het scrollen op in de achtergrond ("to").
 */
export const PixelWipe = ({ from = "#FFFFFF", to = "#0E1110", accents = ["#9FE0B8", "#F7D95C", "#DCCBF7"] }: { from?: string; to?: string; accents?: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const tiles = useMemo(() => {
    const out: { th: number; color: string }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const th = ((ROWS - r) / ROWS) * 0.95 + (rand(i) - 0.5) * 0.4;
      const color = rand(i + 777) > 0.9 ? accents[Math.floor(rand(i + 31) * accents.length)] : from;
      out.push({ th, color });
    }
    return out;
  }, [from, accents]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-10 grid w-full" style={{ backgroundColor: to, gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
      {tiles.map((t, i) => <Tile key={i} p={scrollYProgress} th={t.th} color={t.color} />)}
    </div>
  );
};
