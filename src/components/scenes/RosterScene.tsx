"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import { ChatIcon } from "@/components/Icons";

const ease = [0.22, 1, 0.36, 1] as const;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const crew = [
  { n: "Sam", t: "07:00", l: "Bakkerij Jansen" },
  { n: "Noor", t: "08:00", l: "Hotel Duin" },
  { n: "Ayoub", t: "08:30", l: "Magazijn West" },
  { n: "Lisa", t: "09:00", l: "Hotel Duin" },
  { n: "Daan", t: "10:00", l: "Bakkerij Jansen", sick: "Mila" },
  { n: "Fatima", t: "12:00", l: "Magazijn West" },
];
type RowState = "idle" | "sent" | "ok" | "sick" | "swap";

/** Uitzendbureau: om 09:00 gaan de briefings automatisch naar iedereen die morgen werkt */
export const RosterScene = () => {
  const t = useT().hero.stage;
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });
  const reduce = useReducedMotion();
  const [clock, setClock] = useState("08:59");
  const [rows, setRows] = useState<RowState[]>(crew.map(() => "idle"));
  const [msgs, setMsgs] = useState<number[]>([]);
  const run = useRef(0);

  const play = useCallback(async () => {
    const id = ++run.current;
    const alive = () => id === run.current;
    setClock("08:59"); setRows(crew.map(() => "idle")); setMsgs([]);
    if (reduce) { setClock("09:00"); setRows(crew.map((c) => (c.sick ? "swap" : "ok"))); setMsgs(crew.map((_, i) => i)); return; }
    await sleep(900); if (!alive()) return;
    setClock("09:00");
    for (let i = 0; i < crew.length; i++) {
      await sleep(280); if (!alive()) return;
      setMsgs((m) => [...m, i]);
      setRows((r) => r.map((s, j) => (j === i ? "sent" : s)));
    }
    for (let i = 0; i < crew.length; i++) {
      await sleep(360); if (!alive()) return;
      setRows((r) => r.map((s, j) => (j === i ? (crew[i].sick ? "sick" : "ok") : s)));
    }
    await sleep(900); if (!alive()) return;
    setRows((r) => r.map((s, j) => (crew[j].sick ? "swap" : s)));
  }, [reduce]);

  useEffect(() => { if (inView) play(); }, [inView, play]);

  const pill = (s: RowState, i: number) => {
    const base = "rounded-full px-2 py-0.5 text-[10.5px] font-medium transition-colors duration-300 whitespace-nowrap";
    if (s === "ok") return <span className={`${base} bg-brand-light text-brand-dark`}>✓ {t.confirmed}</span>;
    if (s === "sent") return <span className={`${base} bg-sand text-body`}>{lang === "nl" ? "verstuurd" : "sent"}</span>;
    if (s === "sick") return <span className={`${base} bg-[#FDECEC] text-[#B42318]`}>{lang === "nl" ? "ziek" : "sick"}</span>;
    if (s === "swap") return <span className={`${base} bg-brand-light text-brand-dark`}>✓ {crew[i].sick}</span>;
    return <span className={`${base} text-ink/25`}>—</span>;
  };

  return (
    <div ref={ref} className="overflow-hidden rounded-none bg-white text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)]">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] bg-cream/70 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/10" /><span className="h-2.5 w-2.5 rounded-full bg-ink/10" /><span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
        <span className="ml-4 rounded-none bg-white px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm">{t.tab}</span>
        <button onClick={play} className="ml-auto mr-2 text-[11px] text-ink/40 transition-colors hover:text-ink" aria-label={t.replay}>↻</button>
        <motion.span key={clock} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className={`rounded-none px-2 py-0.5 font-mono text-[11px] tabular-nums ${clock === "09:00" ? "bg-brand text-white" : "text-ink/50"}`}>{clock}</motion.span>
      </div>
      <div className="grid md:h-[360px] md:grid-cols-[1.15fr_1fr]">
        <div className="border-ink/[0.06] p-3 md:border-r md:p-4">
          {crew.map((c, i) => (
            <div key={c.n} className={`grid grid-cols-[1fr_44px_1.3fr_auto] items-center gap-2 rounded-none px-2 py-2 text-[12.5px] transition-colors duration-500 ${rows[i] === "ok" || rows[i] === "swap" ? "bg-brand-light/50" : rows[i] === "sick" ? "bg-[#FDECEC]/60" : ""}`}>
              <span className="font-medium text-ink">{rows[i] === "swap" ? c.sick : c.n}</span>
              <span className="tabular-nums text-body">{c.t}</span>
              <span className="truncate text-body">{c.l}</span>
              {pill(rows[i], i)}
            </div>
          ))}
        </div>
        <div className="hidden flex-col bg-[#F3F4F3] p-3 md:flex">
          <div className="flex items-center gap-2 px-1 pb-2 text-[11px] text-ink/50"><ChatIcon className="h-3.5 w-3.5 text-brand" />{t.wa}</div>
          <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden">
            <AnimatePresence initial={false}>
              {msgs.slice(-4).map((i) => (
                <motion.div key={i} layout initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                  className="max-w-[92%] self-end rounded-none rounded-br-sm bg-[#D5EFDF] px-2.5 py-1.5 text-[11.5px] leading-snug text-ink shadow-sm">
                  {t.msg(crew[i].n, crew[i].t, crew[i].l)}<span className="ml-1.5 text-[9.5px] text-ink/40">09:00 ✓✓</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
