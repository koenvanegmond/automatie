"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Logo } from "@/components/Logo";
import { ChatIcon } from "@/components/Icons";
import { scripts, type NodeId, type Option } from "./script";
import { MeetingWidget, WhatsAppWidget } from "./Widgets";

type Item =
  | { id: number; kind: "msg"; from: "bot" | "me"; text: string; time: string }
  | { id: number; kind: "widget"; widget: "meeting" | "whatsapp" }
  | { id: number; kind: "wa" };

type NewItem = Item extends infer T ? (T extends Item ? Omit<T, "id"> : never) : never;

const STORAGE = "intro-seen";
const TOTAL_STEPS = 4;
const now = () => new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Ticks = () => (
  <svg viewBox="0 0 18 12" className="h-3 w-[18px] text-[#7CC7A0]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 6.5l3.2 3.2L10 3.5M7 9.7L13 3.5" />
  </svg>
);

const Avatar = ({ size = "h-10 w-10" }: { size?: string }) => (
  <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_0_0_3px_rgba(37,133,90,.25)]`}>
    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </span>
);

export const Intro = () => {
  const { lang } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const s = scripts[lang];

  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState(false);
  const [options, setOptions] = useState<Option[] | null>(null);
  const [step, setStep] = useState(0);
  const [interest, setInterest] = useState("");
  const idRef = useRef(0);
  const runRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const firstOptRef = useRef<HTMLButtonElement>(null);

  const push = (it: NewItem) =>
    setItems((xs) => [...xs, { ...it, id: ++idRef.current } as Item]);

  const exit = useCallback(() => {
    runRef.current++;
    setOptions(null);
    setTyping(false);
    setLeaving(true);
    try { localStorage.setItem(STORAGE, "1"); } catch {}
    setTimeout(() => {
      document.documentElement.classList.add("intro-seen");
      setOpen(false);
      setLeaving(false);
      window.scrollTo(0, 0);
    }, 1150);
  }, []);

  const play = useCallback(async (id: NodeId) => {
    const run = ++runRef.current;
    const node = scripts[langRef.current].nodes[id];
    setOptions(null);
    for (const text of node.msgs) {
      setTyping(true);
      await sleep(Math.min(1500, 550 + text.length * 11));
      if (run !== runRef.current) return;
      setTyping(false);
      push({ kind: "msg", from: "bot", text, time: now() });
      await sleep(260);
      if (run !== runRef.current) return;
    }
    if (id === "notConnected") push({ kind: "wa" });
    if (node.widget) push({ kind: "widget", widget: node.widget });
    if (node.options) setOptions(node.options);
    if (node.finish) {
      await sleep(1100);
      if (run === runRef.current) exit();
    }
  }, [exit]);

  const start = useCallback(() => {
    setItems([]);
    setStep(0);
    setInterest("");
    document.documentElement.classList.remove("intro-seen");
    setOpen(true);
    setTimeout(() => play("start"), 450);
  }, [play]);

  // Eerste bezoek: intro tonen. Daarna niet meer (de CSS in layout verbergt hem al vóór hydratatie).
  useEffect(() => {
    let seen = false;
    try { seen = !!localStorage.getItem(STORAGE); } catch {}
    if (seen) setOpen(false);
    else setTimeout(() => play("start"), 600);
  }, [play]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, exit]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [items, typing, options]);

  useEffect(() => {
    if (options) setTimeout(() => firstOptRef.current?.focus({ preventScroll: true }), 300);
  }, [options]);

  const choose = (o: Option) => {
    setOptions(null);
    push({ kind: "msg", from: "me", text: o.label, time: now() });
    setStep((x) => Math.min(TOTAL_STEPS, x + 1));
    if (["leads", "appts", "followup", "service", "unsure"].includes(o.next)) setInterest(o.next);
    play(o.next);
  };

  const onWidgetDone = (result: "ok" | "notConnected", kind: "meeting" | "whatsapp", summary: string) => {
    setItems((xs) => xs.filter((x) => x.kind !== "widget"));
    push({ kind: "msg", from: "me", text: summary, time: now() });
    setStep(TOTAL_STEPS);
    play(result === "ok" ? (kind === "meeting" ? "meetingDone" : "waDone") : "notConnected");
  };

  if (!open) {
    return (
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        onClick={start}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-ink py-2.5 pl-2.5 pr-4 text-sm font-medium text-white shadow-[0_10px_30px_-8px_rgba(14,17,16,.5)] hover:-translate-y-0.5 transition-transform">
        <span className="grid h-8 w-8 place-items-center bg-brand"><ChatIcon className="h-4 w-4" /></span>
        {s.ui.reopen}
      </motion.button>
    );
  }

  return (
    <motion.div id="intro" role="dialog" aria-modal="true" aria-label="Appmaatje chat"
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      initial={false}
      animate={leaving ? { backgroundColor: "#0E1110", opacity: 0 } : { backgroundColor: "#0A0B0B", opacity: 1 }}
      transition={leaving ? { backgroundColor: { duration: 0.7 }, opacity: { duration: 0.45, delay: 0.7 } } : { duration: 0.3 }}>

      {/* glows */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.5 }}>
        <div className="absolute bottom-[-30%] left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-brand/30 blur-[140px]" />
        <div className="absolute -right-40 -top-40 h-[50vh] w-[50vh] rounded-full bg-[#1E6B6B]/30 blur-[120px]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      </motion.div>

      {/* bovenbalk */}
      <motion.div animate={{ opacity: leaving ? 0 : 1 }} className="relative z-10 flex h-14 shrink-0 items-center justify-between px-4 md:h-16 md:px-8">
        <Logo light className="!text-lg md:!text-[22px]" />
        <div className="hidden items-center gap-3 md:flex" aria-label={`${s.ui.step} ${step}/${TOTAL_STEPS}`}>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span key={i} className="h-1 w-10 overflow-hidden rounded-full bg-white/10">
                <motion.span className="block h-full bg-brand" initial={false} animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
              </span>
            ))}
          </div>
          <span className="text-xs tabular-nums text-white/40">{s.ui.step} {Math.max(1, step)}/{TOTAL_STEPS}</span>
        </div>
        <button onClick={exit} className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white">
          {s.ui.skip}
          <kbd className="hidden rounded border border-white/15 px-1.5 text-[10px] text-white/40 md:inline">Esc</kbd>
        </button>
      </motion.div>

      {/* venster */}
      <div className="relative z-10 flex flex-1 items-stretch justify-center md:items-center md:px-8 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={leaving ? { opacity: 0, y: 80, scale: 0.78, filter: "blur(8px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: leaving ? 0.8 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200 }}
          className="flex h-full w-full max-w-[1080px] overflow-hidden border-white/10 bg-[#0F1413]/90 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_40px_120px_-30px_rgba(37,133,90,.45)] backdrop-blur-xl md:h-[min(760px,84vh)] md:rounded-[28px] md:border">

          {/* zijpaneel (desktop) */}
          <aside className="relative hidden w-[340px] shrink-0 flex-col justify-between overflow-hidden p-8 lg:flex">
            <div aria-hidden className="absolute inset-0 bg-[#0B0F0E]">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} className="absolute -left-1/2 h-24 w-[200%] bg-gradient-to-r from-transparent via-brand/25 to-transparent"
                  style={{ top: `${8 + i * 24}%`, rotate: -28 }}
                  animate={{ x: ["-6%", "6%", "-6%"] }} transition={{ repeat: Infinity, duration: 9 + i * 2, ease: "easeInOut" }} />
              ))}
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[28px] border-brand/30" />
            </div>
            <div className="relative"><Avatar size="h-12 w-12" /></div>
            <div className="relative">
              <p className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                {lang === "nl" ? "Laat WhatsApp het werk doen." : "Let WhatsApp do the work."}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{s.ui.auto}</p>
              <svg viewBox="0 0 120 60" className="mt-6 h-12 w-28 text-white/50" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden>
                <path d="M4 6c6 30 30 44 50 30 14-10-2-26-12-12-9 13 14 26 66 20" /><path d="M100 38l8 6-9 4" />
              </svg>
            </div>
          </aside>

          {/* chat */}
          <section className="flex min-w-0 flex-1 flex-col bg-[#0B1211] lg:border-l lg:border-white/5">
            <header className="flex items-center gap-3 border-b border-white/5 bg-[#121A18] px-4 py-3 md:px-5">
              <Avatar />
              <div className="leading-tight">
                <p className="font-semibold text-white">{s.ui.name}</p>
                <p className={`text-xs ${typing ? "text-[#7CC7A0]" : "text-white/45"}`} aria-live="polite">{typing ? s.ui.typing : s.ui.online}</p>
              </div>
              <span className="ml-auto text-[11px] tabular-nums text-white/35 md:hidden">{Math.max(1, step)}/{TOTAL_STEPS}</span>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-5 md:px-8 [background-image:radial-gradient(rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:18px_18px]" aria-live="polite">
              <div className="mx-auto flex max-w-[620px] flex-col gap-2">
                <span className="mx-auto mb-2 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-white/45">{lang === "nl" ? "Vandaag" : "Today"}</span>
                <AnimatePresence initial={false}>
                  {items.map((it) => {
                    if (it.kind === "msg") {
                      const me = it.from === "me";
                      return (
                        <motion.div key={it.id} layout initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className={`max-w-[85%] rounded-2xl px-3.5 pb-1.5 pt-2 text-[15px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,.3)] ${me ? "self-end rounded-tr-md bg-[#1D6B48] text-white" : "self-start rounded-tl-md bg-[#1C2523] text-white/90"}`}>
                          <span>{it.text}</span>
                          <span className="float-right ml-3 mt-1.5 flex items-center gap-1 text-[10.5px] text-white/45">
                            {it.time}{me && <Ticks />}
                          </span>
                        </motion.div>
                      );
                    }
                    if (it.kind === "wa") {
                      return (
                        <motion.a key={it.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          href={waLink(s.ui.waFallbackText)} target="_blank" rel="noopener"
                          className="self-start rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
                          {s.ui.openWa} →
                        </motion.a>
                      );
                    }
                    return (
                      <motion.div key={it.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="self-start w-full max-w-[440px]">
                        {it.widget === "meeting"
                          ? <MeetingWidget ui={s.ui} lang={lang} interest={interest} onDone={(r, sum) => onWidgetDone(r, "meeting", sum)} />
                          : <WhatsAppWidget ui={s.ui} lang={lang} interest={interest} onDone={(r, sum) => onWidgetDone(r, "whatsapp", sum)} />}
                      </motion.div>
                    );
                  })}
                  {typing && (
                    <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex gap-1 self-start rounded-2xl rounded-tl-md bg-[#1C2523] px-4 py-3.5">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} className="h-2 w-2 rounded-full bg-white/50" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {options && (
                  <div className="mt-2 flex flex-wrap gap-2" role="group">
                    {options.map((o, i) => (
                      <motion.button key={o.label} ref={i === 0 ? firstOptRef : undefined}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        onClick={() => choose(o)}
                        className="rounded-full border border-[#7CC7A0]/30 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[#9BDDB8] transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7A0]">
                        {o.label}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <footer className="flex items-center gap-2 border-t border-white/5 bg-[#121A18] px-3 py-3 md:px-5">
              <div className="flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white/30">{s.ui.placeholder}</div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/40 text-white/60" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
              </span>
            </footer>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};
