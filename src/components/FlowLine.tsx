"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ChatIcon } from "./Icons";

type Pt = [number, number];

/** Polyline met afgeronde hoeken */
function roundedPath(pts: Pt[], r = 48) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(x - px, y - py), l2 = Math.hypot(nx - x, ny - y);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = x - ((x - px) / l1) * rr, ay = y - ((y - py) / l1) * rr;
    const bx = x + ((nx - x) / l2) * rr, by = y + ((ny - y) / l2) * rr;
    d += ` L ${ax} ${ay} Q ${x} ${y} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

/**
 * De groene lijn = het WhatsApp-gesprek. Loopt slingerend langs de secties
 * en tekent zichzelf tijdens het scrollen (ref. Conduit).
 */
export const FlowLine = ({ children }: { children: ReactNode }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const [dot, setDot] = useState<Pt>([0, 0]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const build = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const inset = Math.max(28, (w - 1200) / 2 + 36);
      const L = inset, R = w - inset, cx = w / 2;
      const secs = Array.from(el.querySelectorAll<HTMLElement>("[data-flow]"));
      const pts: Pt[] = [[cx, 0], [cx, 40]];
      let side = R;
      pts.push([side, 40]);
      secs.slice(1).forEach((s) => {
        const y = s.offsetTop + 8;
        pts.push([side, y]);
        side = side === R ? L : R;
        pts.push([side, y]);
      });
      pts.push([side, h - 40], [cx, h - 40], [cx, h]);
      setGeo({ w, h, d: roundedPath(pts) });
      setDot([cx, 0]);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 55%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  useMotionValueEvent(progress, "change", (v) => {
    const p = pathRef.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * Math.min(1, Math.max(0, v)));
    setDot([pt.x, pt.y]);
  });

  return (
    <div ref={wrap} className="relative">
      {geo && (
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          <svg width={geo.w} height={geo.h} className="absolute inset-0 overflow-visible">
            <path d={geo.d} fill="none" stroke="rgba(28,25,23,.08)" strokeWidth={2} />
            <motion.path ref={pathRef} d={geo.d} fill="none" stroke="#25855A" strokeWidth={2.5}
              strokeLinecap="round" style={{ pathLength: progress }} />
          </svg>
          <div className="absolute -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-[0_0_0_8px_rgba(37,133,90,.15),0_8px_24px_rgba(37,133,90,.45)]"
            style={{ left: dot[0], top: dot[1] }}>
            <ChatIcon className="h-5 w-5" />
          </div>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
};
