"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* Isometrische 3D-blokken in SVG (ref. Conduit / Chatsheet) */
const C = 0.866, S = 0.5;
export const proj = (x: number, y: number, z = 0) => [(x - y) * C, (x + y) * S - z] as const;
const poly = (pts: (readonly [number, number])[]) => pts.map((p) => p.join(",")).join(" ");

export const tones = {
  green: ["#46A877", "#25855A", "#1B6644"],
  white: ["#FFFFFF", "#EEECE6", "#DEDBD2"],
  sand: ["#F4F3EE", "#E4E2D9", "#D2CFC4"],
  ink: ["#34302C", "#1C1917", "#0F0D0C"],
  mint: ["#E4F3EA", "#C8E6D4", "#A9D5BB"],
} as const;
export type Tone = keyof typeof tones;

export const Box = ({ x, y, z = 0, w, d, h, tone = "white", children }:
  { x: number; y: number; z?: number; w: number; d: number; h: number; tone?: Tone; children?: ReactNode }) => {
  const [top, left, right] = tones[tone];
  const T = [proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)];
  const Lf = [proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)];
  const Rf = [proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)];
  return (
    <g>
      <polygon points={poly(Lf)} fill={left} />
      <polygon points={poly(Rf)} fill={right} />
      <polygon points={poly(T)} fill={top} stroke="rgba(255,255,255,.7)" strokeWidth={1} />
      {children}
    </g>
  );
};

/** Plat label op het bovenvlak van een blok */
export const TopLabel = ({ x, y, z, text, color = "#1C1917" }: { x: number; y: number; z: number; text: string; color?: string }) => {
  const [px, py] = proj(x, y, z);
  return (
    <text x={0} y={0} fill={color} fontSize={22} fontWeight={600} textAnchor="middle" dominantBaseline="middle"
      transform={`matrix(0.866 0.5 -0.866 0.5 ${px} ${py})`} style={{ fontFamily: "var(--font-zt)" }}>
      {text}
    </text>
  );
};

export const Float = ({ children, delay = 0, amp = 8, dur = 3.2 }: { children: ReactNode; delay?: number; amp?: number; dur?: number }) => (
  <motion.g animate={{ y: [0, -amp, 0] }} transition={{ repeat: Infinity, duration: dur, delay, ease: "easeInOut" }}>
    {children}
  </motion.g>
);

export const Shadow = ({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(28,25,23,.10)" filter="url(#soft)" />
);

export const IsoDefs = () => (
  <defs>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
  </defs>
);

/* ---------- Scènes voor "Hoe het werkt" ---------- */

/** Stap 1: we komen langs (gebouw + locatiepin + gesprek) */
export const SceneVisit = () => (
  <svg viewBox="-260 -230 520 400" className="h-full w-full" aria-hidden>
    <IsoDefs />
    <Shadow cx={0} cy={110} rx={210} ry={60} />
    <Box x={-140} y={-140} w={280} h={16} d={280} tone="sand" />
    {/* gebouw */}
    <Box x={-90} y={-90} z={16} w={110} d={90} h={90} tone="white" />
    <Box x={-90} y={-90} z={106} w={110} d={90} h={8} tone="green" />
    {[0, 1, 2].map((i) => <Box key={i} x={-80 + i * 34} y={0} z={40} w={22} d={1} h={30} tone="mint" />)}
    {/* tafeltje met twee blokjes = gesprek */}
    <Box x={40} y={20} z={16} w={70} d={70} h={10} tone="white" />
    <Float amp={6}><Box x={50} y={30} z={26} w={20} d={20} h={20} tone="green" /></Float>
    <Float amp={6} delay={0.6}><Box x={80} y={60} z={26} w={20} d={20} h={20} tone="ink" /></Float>
    {/* pin */}
    <Float amp={14} dur={2.4}>
      <g transform="translate(-35,-215)">
        <path d="M0 0c-26 0-44 19-44 42 0 31 44 70 44 70s44-39 44-70C44 19 26 0 0 0z" fill="#25855A" />
        <circle cx="0" cy="42" r="15" fill="#FAF9F6" />
      </g>
    </Float>
  </svg>
);

/** Stap 2: we bouwen (gestapelde lagen WhatsApp → flow → systemen) */
export const SceneBuild = ({ labels }: { labels: [string, string, string] }) => {
  const layer = (i: number, tone: Tone, label: string, labelColor: string) => (
    <motion.g key={i} animate={{ y: [0, -i * 14, 0] }} transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}>
      <Box x={-110} y={-110} z={i * 46} w={220} d={220} h={18} tone={tone} />
      <TopLabel x={0} y={0} z={i * 46 + 18} text={label} color={labelColor} />
    </motion.g>
  );
  return (
    <svg viewBox="-240 -260 480 420" className="h-full w-full" aria-hidden>
      <IsoDefs />
      <Shadow cx={0} cy={120} rx={190} ry={55} />
      {layer(0, "sand", labels[2], "#44403C")}
      {layer(1, "green", labels[1], "#FFFFFF")}
      {layer(2, "white", labels[0], "#1C1917")}
    </svg>
  );
};

/** Stap 3: het draait (raster van blokjes die om de beurt oplichten) */
export const SceneRun = () => {
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) cells.push({ r, c });
  return (
    <svg viewBox="-260 -200 520 380" className="h-full w-full" aria-hidden>
      <IsoDefs />
      <Shadow cx={0} cy={120} rx={210} ry={60} />
      <Box x={-130} y={-130} w={260} d={260} h={14} tone="sand" />
      {cells.map(({ r, c }) => {
        const x = -115 + c * 60, y = -115 + r * 60;
        return (
          <g key={`${r}-${c}`}>
            <Box x={x} y={y} z={14} w={50} d={50} h={12} tone="white" />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: (r + c) * 0.35, times: [0, 0.15, 0.5, 0.7] }}>
              <Box x={x} y={y} z={14} w={50} d={50} h={22} tone="green" />
            </motion.g>
          </g>
        );
      })}
      <Float amp={10}>
        <g transform="translate(150,-150)">
          <circle r="30" fill="#FFFFFF" stroke="#25855A" strokeWidth="3" />
          <path d="M-12 1l8 8 16-17" stroke="#25855A" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Float>
    </svg>
  );
};
