"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
  type MotionValue,
} from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { ArrowIcon, CalendarIcon, CheckIcon, ChatIcon, CrmIcon } from "@/components/Icons";

const ease = [0.22, 1, 0.36, 1] as const;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Wacht tot de intro-chat weg is, zodat het hero-moment niet achter de overlay afspeelt */
function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = document.getElementById("intro");
      const hidden = !el || document.documentElement.classList.contains("intro-seen");
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

/* ---------------- Kop: "niet bij AI-agents" → "bij WhatsApp" ---------------- */

const Headline = ({ start }: { start: boolean }) => {
  const t = useT().hero;
  const reduce = useReducedMotion();
  const [jargon, setJargon] = useState(0);
  const [phase, setPhase] = useState<"doubt" | "strike" | "yes">("doubt");

  useEffect(() => {
    if (!start) return;
    if (reduce) { setPhase("yes"); return; }
    let alive = true;
    (async () => {
      await sleep(1100);
      for (let i = 1; i < t.h1jargon.length && alive; i++) { setJargon(i); await sleep(620); }
      if (!alive) return;
      setPhase("strike");
      await sleep(650);
      if (alive) setPhase("yes");
    })();
    return () => { alive = false; };
  }, [start, reduce, t.h1jargon.length]);

  return (
    <>
      <h1 className="sr-only">{t.h1a} {t.h1yes}</h1>
      <div aria-hidden className="font-display font-medium tracking-[-0.045em] leading-[1.02] text-ink whitespace-nowrap text-[34px] md:text-[76px] lg:text-[100px]">
        <motion.span className="block" initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9, ease }}>
          {t.h1a}
        </motion.span>
        <span className="relative block h-[1.08em]">
          <AnimatePresence mode="wait" initial={false}>
            {phase !== "yes" ? (
              <motion.span key="no" className="absolute inset-x-0 flex justify-center"
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, filter: "blur(10px)", scale: 0.96 }}
                transition={{ duration: 0.55, ease, delay: start ? 0 : 0.15 }}>
                <span className="relative text-ink/30">
                  {t.h1not}{" "}
                  <span className="relative inline-block min-w-[3ch]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={jargon} className="inline-block"
                        initial={{ opacity: 0, y: "0.4em" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-0.4em" }} transition={{ duration: 0.3 }}>
                        {t.h1jargon[jargon]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <motion.span className="absolute left-[-2%] right-[-2%] top-[55%] h-[0.07em] origin-left rounded-full bg-ink/70"
                    initial={{ scaleX: 0 }} animate={{ scaleX: phase === "strike" ? 1 : 0 }} transition={{ duration: 0.5, ease }} />
                </span>
              </motion.span>
            ) : (
              <motion.span key="yes" className="absolute inset-x-0 flex items-center justify-center gap-[0.18em]"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, ease }}>
                <span>{t.h1yes.replace(/\.$/, "").split(" ").slice(0, -1).join(" ")}</span>
                <span className="relative text-brand">
                  {t.h1yes.split(" ").slice(-1)[0]}
                  <motion.span className="absolute -bottom-[0.06em] left-0 right-[0.25em] h-[0.06em] origin-left rounded-full bg-brand/40"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.6, ease }} />
                </span>
                <motion.span className="grid h-[0.62em] w-[0.62em] place-items-center rounded-full bg-brand text-white shadow-[0_0_0_0.12em_rgba(37,133,90,.18),0_0.2em_0.6em_rgba(37,133,90,.45)]"
                  initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.35, type: "spring", stiffness: 380, damping: 14 }}>
                  <CheckIcon className="h-[0.36em] w-[0.36em]" />
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
    </>
  );
};

/* ---------------- Podium: het scherm van de klant + zwevende kaartjes ---------------- */

const crew = [
  { n: "Sam", t: "07:00", l: "Bakkerij Jansen" },
  { n: "Noor", t: "08:00", l: "Hotel Duin" },
  { n: "Ayoub", t: "08:30", l: "Magazijn West" },
  { n: "Lisa", t: "09:00", l: "Hotel Duin" },
  { n: "Daan", t: "10:00", l: "Bakkerij Jansen", sick: "Mila" },
  { n: "Fatima", t: "12:00", l: "Magazijn West" },
];

type RowState = "idle" | "sent" | "ok" | "sick" | "swap";

const Float = ({ children, className, p, depth, delay, show }: {
  children: React.ReactNode; className: string; p: MotionValue<number>; depth: number; delay: number; show: boolean;
}) => {
  const y = useTransform(p, [0, 1], [depth * 60, depth * -60]);
  return (
    <div className={`absolute z-20 ${className}`}>
    <motion.div style={{ y }}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.92 }}
        transition={{ duration: 0.7, ease, delay: show ? delay : 0 }}>
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4 + depth, ease: "easeInOut" }}
          className="rounded-2xl border border-ink/[0.06] bg-white/90 p-3.5 shadow-[0_1px_2px_rgba(28,25,23,.04),0_18px_40px_-14px_rgba(28,25,23,.22)] backdrop-blur">
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
  );
};

const Stage = ({ start }: { start: boolean }) => {
  const t = useT().hero.stage;
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [clock, setClock] = useState("08:59");
  const [rows, setRows] = useState<RowState[]>(crew.map(() => "idle"));
  const [msgs, setMsgs] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const [cards, setCards] = useState(0);
  const run = useRef(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // lichte 3D-kanteling op de muis
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const play = useCallback(async () => {
    const id = ++run.current;
    const alive = () => id === run.current;
    setClock("08:59"); setRows(crew.map(() => "idle")); setMsgs([]); setCount(0); setCards(0);
    if (reduce) {
      setClock("09:00"); setRows(crew.map((c) => (c.sick ? "swap" : "ok"))); setMsgs(crew.map((_, i) => i)); setCount(14); setCards(4);
      return;
    }
    await sleep(900); if (!alive()) return;
    setClock("09:00");
    for (let i = 0; i < crew.length; i++) {
      await sleep(260); if (!alive()) return;
      setMsgs((m) => [...m, i]);
      setRows((r) => r.map((s, j) => (j === i ? "sent" : s)));
      setCount((c) => Math.min(14, c + 2));
    }
    setCount(14); setCards(1);
    for (let i = 0; i < crew.length; i++) {
      await sleep(340); if (!alive()) return;
      setRows((r) => r.map((s, j) => (j === i ? (crew[i].sick ? "sick" : "ok") : s)));
    }
    setCards(2);
    await sleep(800); if (!alive()) return;
    setRows((r) => r.map((s, j) => (crew[j].sick ? "swap" : s)));
    setCards(3);
    await sleep(700); if (!alive()) return;
    setCards(4);
  }, [reduce]);

  useEffect(() => { if (start && inView) play(); }, [start, inView, play]);

  const ok = rows.filter((r) => r === "ok" || r === "swap").length;
  const pill = (s: RowState, i: number) => {
    const base = "rounded-full px-2 py-0.5 text-[10.5px] font-medium transition-colors duration-300";
    if (s === "ok") return <span className={`${base} bg-brand-light text-brand-dark`}>✓ {t.confirmed}</span>;
    if (s === "sent") return <span className={`${base} bg-sand text-body`}>{lang === "nl" ? "verstuurd" : "sent"}</span>;
    if (s === "sick") return <span className={`${base} bg-[#FDECEC] text-[#B42318]`}>{lang === "nl" ? "ziek" : "sick"}</span>;
    if (s === "swap") return <span className={`${base} bg-brand-light text-brand-dark`}>✓ {crew[i].sick}</span>;
    return <span className={`${base} text-ink/25`}>—</span>;
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="relative mx-auto mt-14 h-[330px] max-w-[1120px] md:mt-20 md:h-[500px] lg:h-[560px]" style={{ perspective: 1600 }}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />

      {/* het scherm */}
      <div className="absolute left-1/2 top-0 z-10 w-[780px] origin-top -translate-x-1/2 scale-[.44] md:scale-[.82] lg:scale-100">
      <motion.div style={{ rotateX: rx, rotateY: ry }}
        initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.5 }}>
        <div className="overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(28,25,23,.05),0_40px_90px_-30px_rgba(28,25,23,.35)]">
          <div className="flex items-center gap-2 border-b border-ink/[0.06] bg-cream/70 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" /><span className="h-2.5 w-2.5 rounded-full bg-ink/10" /><span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <div className="ml-4 flex gap-1.5 text-[11px]">
              <span className="rounded-md bg-white px-2.5 py-1 font-medium text-ink shadow-sm">{t.tab}</span>
              <span className="rounded-md px-2.5 py-1 text-ink/45">{t.wa}</span>
            </div>
            <motion.span key={clock} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className={`ml-auto rounded-md px-2 py-0.5 font-mono text-[11px] tabular-nums ${clock === "09:00" ? "bg-brand text-white" : "text-ink/50"}`}>
              {clock}
            </motion.span>
          </div>
          <div className="grid h-[400px] grid-cols-[1.15fr_1fr]">
            <div className="border-r border-ink/[0.06] p-4">
              <div className="mb-2 grid grid-cols-[1fr_52px_1.3fr_auto] gap-2 px-2 text-[10px] uppercase tracking-[0.15em] text-ink/35">
                <span>{lang === "nl" ? "Naam" : "Name"}</span><span>{lang === "nl" ? "Tijd" : "Time"}</span><span>{lang === "nl" ? "Locatie" : "Location"}</span><span>Status</span>
              </div>
              {crew.map((c, i) => (
                <motion.div key={c.n} layout
                  className={`grid grid-cols-[1fr_52px_1.3fr_auto] items-center gap-2 rounded-lg px-2 py-2.5 text-[12.5px] transition-colors duration-500 ${rows[i] === "ok" || rows[i] === "swap" ? "bg-brand-light/50" : rows[i] === "sick" ? "bg-[#FDECEC]/60" : ""}`}>
                  <span className="font-medium text-ink">{rows[i] === "swap" ? c.sick : c.n}</span>
                  <span className="tabular-nums text-body">{c.t}</span>
                  <span className="truncate text-body">{c.l}</span>
                  {pill(rows[i], i)}
                </motion.div>
              ))}
              <p className="mt-1 px-2 text-[11px] text-ink/35">+ 8 {lang === "nl" ? "meer" : "more"}</p>
            </div>
            <div className="flex flex-col bg-[#F4F2EC] p-3">
              <div className="flex items-center gap-2 px-1 pb-2 text-[11px] text-ink/50"><ChatIcon className="h-3.5 w-3.5 text-brand" />{t.wa}</div>
              <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden">
                <AnimatePresence initial={false}>
                  {msgs.slice(-5).map((i) => (
                    <motion.div key={i} layout initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease }}
                      className="self-end max-w-[92%] rounded-xl rounded-br-sm bg-[#D5EFDF] px-2.5 py-1.5 text-[11.5px] leading-snug text-ink shadow-sm">
                      {t.msg(crew[i].n, crew[i].t, crew[i].l)}
                      <span className="ml-1.5 text-[9.5px] text-ink/40">09:00 ✓✓</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>

      {/* zwevende kaartjes */}
      <Float p={p} depth={1.2} delay={0} show={cards >= 1} className="left-[0%] top-[8%] hidden md:block">
        <div className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90"><circle cx="18" cy="18" r="15" fill="none" stroke="#F0EFEA" strokeWidth="4" />
              <motion.circle cx="18" cy="18" r="15" fill="none" stroke="#25855A" strokeWidth="4" strokeLinecap="round" pathLength={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: ok / crew.length }} transition={{ duration: 0.5 }} /></svg>
            <span className="text-[11px] font-semibold text-ink">{ok}/{crew.length}</span>
          </span>
          <div><p className="font-display text-2xl font-medium leading-none tracking-tight text-ink tabular-nums">{count}</p><p className="mt-1 text-[11px] text-body">{t.sent}</p></div>
        </div>
      </Float>
      <Float p={p} depth={0.6} delay={0.1} show={cards >= 2} className="right-[1%] top-[2%] hidden md:block">
        <div className="flex items-center gap-2.5 text-[12px]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-light text-brand"><CrmIcon className="h-4 w-4" /></span><span className="font-medium text-ink">{t.lead}</span></div>
      </Float>
      <Float p={p} depth={1.6} delay={0} show={cards >= 3} className="bottom-[10%] left-[3%] hidden lg:block">
        <div className="flex items-center gap-2.5 text-[12px]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FDECEC] text-[#B42318]">!</span><span className="font-medium text-ink">{t.sick}</span><CheckIcon className="h-4 w-4 text-brand" /></div>
      </Float>
      <Float p={p} depth={1} delay={0.15} show={cards >= 3} className="bottom-[16%] right-[0%] hidden md:block">
        <div className="flex items-center gap-2.5 text-[12px]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-light text-brand"><CalendarIcon className="h-4 w-4" /></span><span className="font-medium text-ink">{t.viewing}</span><CheckIcon className="h-4 w-4 text-brand" /></div>
      </Float>
      <Float p={p} depth={0.4} delay={0.1} show={cards >= 4} className="bottom-[-2%] left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="font-medium text-brand-dark">{t.work}</span>
          <button onClick={play} className="rounded-full border border-ink/10 px-2.5 py-1 text-[11px] text-ink/60 transition-colors hover:border-ink/30 hover:text-ink">↻ {t.replay}</button>
        </div>
      </Float>
    </div>
  );
};

export const Hero = () => {
  const t = useT().hero;
  const start = useIntroDone();
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand/[0.13] blur-[130px]" />
      <div className="container relative text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white/70 px-3.5 py-1.5 text-[13px] text-body backdrop-blur">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand" /></span>
          {t.eyebrow}
        </motion.p>
        <Headline start={start} />
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}
          className="mx-auto mt-7 max-w-[600px] text-[17px] leading-relaxed text-body md:text-lg">
          {t.sub}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.35 }} className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={waLink(t.waText)} target="_blank" rel="noopener" className="btn btn-primary btn-glow px-6 py-3 text-base">{t.cta1}</a>
          <a href="#hoe-het-werkt" className="btn btn-ghost group px-6 py-3 text-base">
            {t.cta2}<ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-body/75">
          {t.trust.map((x) => <li key={x} className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-brand" />{x}</li>)}
        </motion.ul>
        <Stage start={start} />
      </div>
    </section>
  );
};
