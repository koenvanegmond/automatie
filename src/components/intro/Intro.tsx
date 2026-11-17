"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Buttons";
import { Slant } from "@/components/Slant";
import { BellSticker, CalendarSticker, ChatSticker, CoinSticker } from "@/components/Stickers";
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
  <svg viewBox="0 0 18 12" className="h-3 w-[18px] text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 6.5l3.2 3.2L10 3.5M7 9.7L13 3.5" />
  </svg>
);

const Avatar = ({ size = "h-10 w-10" }: { size?: string }) => (
  <span className={`grid ${size} shrink-0 place-items-center rounded-full border-2 border-ink bg-mint text-ink`}>
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
    const onOpen = () => start();
    window.addEventListener("appmaatje:open-chat", onOpen);
    return () => window.removeEventListener("appmaatje:open-chat", onOpen);
  }, [start]);

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

  if (!open) return null;

  return (
    <motion.div id="intro" role="dialog" aria-modal="true" aria-label="Appmaatje chat"
      className="fixed inset-0 z-[75] flex flex-col overflow-hidden bg-white"
      initial={false} animate={{ opacity: leaving ? 0 : 1 }} transition={leaving ? { duration: 0.45, delay: 0.55 } : { duration: 0.3 }}>

      {/* stickers rond het venster */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" animate={{ opacity: leaving ? 0 : 1 }}>
        <div className="bob absolute left-[3%] top-[20%] w-28" style={{ ["--r" as string]: "-10deg" }}><CalendarSticker /></div>
        <div className="bob absolute bottom-[8%] left-[5%] w-32" style={{ ["--r" as string]: "8deg", ["--d" as string]: "6s" }}><CoinSticker /></div>
        <div className="bob absolute right-[3%] top-[24%] w-24" style={{ ["--r" as string]: "10deg", ["--d" as string]: "6.5s" }}><BellSticker /></div>
      </motion.div>

      {/* bovenbalk */}
      <motion.div animate={{ opacity: leaving ? 0 : 1 }} className="relative z-10 flex h-[84px] shrink-0 items-center justify-between px-6 pt-2 md:h-[96px] md:px-10 md:pt-3">
        <span className="md:hidden"><Logo mark /></span><span className="hidden md:block"><Logo /></span>
        <div className="hidden items-center gap-1.5 md:flex" aria-label={`${s.ui.step} ${step}/${TOTAL_STEPS}`}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span key={i} className={`h-3 w-10 rounded-full border-2 border-ink transition-colors duration-500 ${i < step ? "bg-brand" : "bg-white"}`} />
          ))}
        </div>
        <Button onClick={exit} variant="primary" size="sm" arrow>{s.ui.skip}</Button>
      </motion.div>

      {/* venster */}
      <div className="relative z-10 flex flex-1 items-stretch justify-center overflow-hidden px-3 pb-5 md:items-center md:px-10 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -1.5 }}
          animate={leaving ? { opacity: 0, y: 120, scale: 0.8, rotate: 4 } : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={leaving ? { duration: 0.6, ease: [0.5, 0, 0.75, 0] } : { type: "spring", stiffness: 160, damping: 18 }}
          className="flex h-full w-full max-w-[1080px] overflow-hidden rounded-[28px] border-2 border-ink bg-white shadow-[8px_8px_0_#0E1110] md:h-[min(740px,80vh)]">

          {/* zijpaneel (desktop) */}
          <aside className="relative hidden w-[360px] shrink-0 flex-col justify-between overflow-hidden border-r-2 border-ink bg-lilac p-8 lg:flex">
            <div className="bob w-32" style={{ ["--r" as string]: "-6deg" }}><ChatSticker /></div>
            <div>
              <p className="font-display text-[64px] uppercase leading-[0.88] text-ink">
                <Slant text={lang === "nl" ? "Laat WhatsApp het werk doen." : "Let WhatsApp do the work."} last={2} />
              </p>
              <p className="mt-5 text-[18px] font-medium leading-snug tracking-[-0.015em] text-ink">{s.ui.auto}</p>
            </div>
          </aside>

          {/* chat */}
          <section className="flex min-w-0 flex-1 flex-col bg-white">
            <header className="flex items-center gap-3 border-b-2 border-ink bg-mint px-4 py-3 md:px-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-white text-ink">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <div className="leading-tight">
                <p className="font-ui text-[15px] font-bold uppercase text-ink">{s.ui.name}</p>
                <p className="text-[13px] font-medium text-ink/70" aria-live="polite">{typing ? s.ui.typing : s.ui.online}</p>
              </div>
              <span className="ml-auto font-ui text-[12px] font-bold tabular-nums text-ink md:hidden">{Math.max(1, step)}/{TOTAL_STEPS}</span>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto bg-[#F7F7F2] px-3 py-5 md:px-8" aria-live="polite">
              <div className="mx-auto flex max-w-[620px] flex-col gap-2.5">
                <span className="mx-auto mb-2 rounded-full border-2 border-ink bg-white px-3 py-0.5 font-ui text-[11px] font-bold uppercase text-ink">{lang === "nl" ? "Vandaag" : "Today"}</span>
                <AnimatePresence initial={false}>
                  {items.map((it) => {
                    if (it.kind === "msg") {
                      const me = it.from === "me";
                      return (
                        <motion.div key={it.id} layout initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`max-w-[85%] rounded-[20px] border-2 border-ink px-4 pb-1.5 pt-2.5 text-[16px] font-medium leading-snug text-ink ${me ? "self-end rounded-br-md bg-mint" : "self-start rounded-bl-md bg-white"}`}>
                          <span>{it.text}</span>
                          <span className="float-right ml-3 mt-1.5 flex items-center gap-1 text-[11px] text-ink/50">
                            {it.time}{me && <Ticks />}
                          </span>
                        </motion.div>
                      );
                    }
                    if (it.kind === "wa") {
                      return (
                        <motion.div key={it.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-start">
                          <Button href={waLink(s.ui.waFallbackText)} external variant="primary" size="sm" arrow>{s.ui.openWa}</Button>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div key={it.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[460px] self-start">
                        {it.widget === "meeting"
                          ? <MeetingWidget ui={s.ui} lang={lang} interest={interest} onDone={(r, sum) => onWidgetDone(r, "meeting", sum)} />
                          : <WhatsAppWidget ui={s.ui} lang={lang} interest={interest} onDone={(r, sum) => onWidgetDone(r, "whatsapp", sum)} />}
                      </motion.div>
                    );
                  })}
                  {typing && (
                    <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex gap-1.5 self-start rounded-[20px] rounded-bl-md border-2 border-ink bg-white px-4 py-3.5">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} className="h-2 w-2 rounded-full bg-ink" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {options && (
                  <div className="mt-2 flex flex-wrap justify-end gap-2" role="group">
                    {options.map((o, i) => (
                      <motion.button key={o.label} ref={i === 0 ? firstOptRef : undefined}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => choose(o)}
                        className="h-11 rounded-full border-2 border-ink bg-white px-5 font-ui text-[13px] font-bold uppercase text-ink transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-sun hover:shadow-[4px_4px_0_#0E1110] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/40">
                        {o.label}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <footer className="flex items-center gap-2 border-t-2 border-ink bg-white px-3 py-3 md:px-5">
              <div className="flex h-11 flex-1 items-center rounded-full border-2 border-ink/20 px-4 text-[14px] font-medium text-ink/40">{s.ui.placeholder}</div>
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-ink text-white" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
              </span>
            </footer>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};
