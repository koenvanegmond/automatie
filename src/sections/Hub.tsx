"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Box, IsoDefs, Shadow, proj } from "@/components/Iso";
import { CalendarIcon, ChatIcon, CrmIcon, MailIcon, RosterIcon, SheetIcon } from "@/components/Icons";

const icons = [ChatIcon, CalendarIcon, RosterIcon, SheetIcon, CrmIcon, MailIcon];

export const Hub = () => {
  const t = useT().hub;
  const R = 250;
  const nodes = t.tools.map((label, i) => {
    const a = (i / t.tools.length) * Math.PI * 2 + Math.PI * 0.75;
    const x = Math.cos(a) * R, y = Math.sin(a) * R;
    const [sx, sy] = proj(x, y, 14);
    return { label, x, y, sx, sy, Icon: icons[i] };
  });
  const [cx, cy] = [0, -34];

  return (
    <section data-flow className="relative overflow-hidden py-28 md:py-36">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mx-auto mt-4 max-w-3xl">{t.title}</h2>
          <p className="mt-4 text-lg">{t.sub}</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }} className="relative mx-auto mt-10 h-[460px] max-w-[900px] md:h-[520px]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[90px]" />
          <svg viewBox="-420 -300 840 540" className="relative h-full w-full" aria-hidden>
            <IsoDefs />
            <Shadow cx={0} cy={30} rx={160} ry={60} />
            {nodes.map((n, i) => {
              const d = `M ${n.sx} ${n.sy} Q ${(n.sx + cx) / 2} ${n.sy - 60} ${cx} ${cy}`;
              const inward = i === 0;
              return (
                <g key={n.label}>
                  <path d={d} stroke="#25855A" strokeOpacity=".45" strokeWidth="2" fill="none" strokeDasharray="5 6" />
                  <circle r="5" fill="#25855A">
                    <animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" path={d}
                      keyPoints={inward ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear" />
                  </circle>
                </g>
              );
            })}
            {nodes.map((n, i) => n.sy < -40 && (
              <motion.g key={n.label} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.3, ease: "easeInOut" }}>
                <Box x={n.x - 34} y={n.y - 34} w={68} d={68} h={14} tone={i === 0 ? "green" : "white"} />
                <foreignObject x={n.sx - 60} y={n.sy - 74} width="120" height="64">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl shadow-card ${i === 0 ? "bg-brand text-white" : "bg-white text-brand"}`}><n.Icon className="h-5 w-5" /></span>
                    <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-ink shadow-sm">{n.label}</span>
                  </div>
                </foreignObject>
              </motion.g>
            ))}
            {/* centrale schijf */}
            <ellipse cx="0" cy="0" rx="120" ry="70" fill="#1B6644" />
            <rect x="-120" y="-34" width="240" height="34" fill="#1B6644" />
            <ellipse cx="0" cy="-34" rx="120" ry="70" fill="#25855A" />
            {[96, 70, 44].map((r, i) => (
              <ellipse key={r} cx="0" cy="-34" rx={r} ry={r * 0.58} fill="none" stroke="#FFFFFF" strokeOpacity={0.25 + i * 0.2} strokeWidth="6" />
            ))}
            <ellipse cx="0" cy="-34" rx="24" ry="14" fill="#FFFFFF" />
            {nodes.map((n, i) => n.sy >= -40 && (
              <motion.g key={n.label} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.3, ease: "easeInOut" }}>
                <Box x={n.x - 34} y={n.y - 34} w={68} d={68} h={14} tone={i === 0 ? "green" : "white"} />
                <foreignObject x={n.sx - 60} y={n.sy - 74} width="120" height="64">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl shadow-card ${i === 0 ? "bg-brand text-white" : "bg-white text-brand"}`}><n.Icon className="h-5 w-5" /></span>
                    <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-ink shadow-sm">{n.label}</span>
                  </div>
                </foreignObject>
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
