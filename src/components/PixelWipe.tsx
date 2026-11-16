"use client";
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const COLS = 24, ROWS = 5;
const ACCENTS = ["#25855A", "#7CC7A0", "#FFFFFF"];

// vaste pseudo-random reeks: server en browser zien hetzelfde patroon
const rand = (i: number) => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };

const Tile = ({ p, th, color }: { p: MotionValue<number>; th: number; color: string }) => {
  const opacity = useTransform(p, [th - 0.004, th], [1, 0]);
  return <motion.div style={{ opacity, backgroundColor: color }} className="aspect-square" />;
};

/**
 * Blokjes-overgang van de donkere hero naar de lichte pagina (ref. Transform).
 * Onderste rijen zijn al deels weg; tijdens het scrollen lossen de rest op.
 */
export const PixelWipe = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const tiles = useMemo(() => {
    const out: { th: number; color: string }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const th = ((ROWS - r) / ROWS) * 0.95 + (rand(i) - 0.5) * 0.4;
      const a = rand(i + 777);
      const color = a > 0.86 ? ACCENTS[Math.floor(rand(i + 31) * ACCENTS.length)] : "#0E1110";
      out.push({ th, color });
    }
    return out;
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-10 grid w-full" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
      {tiles.map((t, i) => <Tile key={i} p={scrollYProgress} th={t.th} color={t.color} />)}
    </div>
  );
};
