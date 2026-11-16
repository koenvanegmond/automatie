"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { PixelWipe } from "@/components/PixelWipe";

const ease = [0.22, 1, 0.36, 1] as const;

/** Wacht tot de intro-chat weg is, zodat het hero-moment niet achter de overlay afspeelt */
function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const check = () => {
      const hidden = !document.getElementById("intro") || document.documentElement.classList.contains("intro-seen");
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

const EVENTS = {
  nl: [
    "✓ Briefing → Sam · 07:00 Bakkerij Jansen", "📅 Bezichtiging wo 10:30 ingepland", "💬 Lead beantwoord in 8 sec", "🔔 Herinnering: morgen 09:15",
    "✓ Rooster bijgewerkt", "💶 Betaallink verstuurd", "⭐ Review-verzoek verstuurd", "🔁 Afspraak verzet → vr 14:30", "📦 Track & trace verstuurd",
    "👋 Welkom Noor! Contract staat klaar", "✓ 13/14 diensten bevestigd", "🤒 Daan ziek → Mila geappt", "🍽️ Tafel voor 6 · za 20:30", "📄 Offerte opgevolgd na 3 dagen",
    "✓ Akkoord → deal gewonnen", "📍 Adres + dresscode verstuurd", "💬 Vraag over openingstijden beantwoord", "📨 Urgente mail → samenvatting in WhatsApp",
  ],
  en: [
    "✓ Briefing → Sam · 07:00 Bakery Jansen", "📅 Viewing Wed 10:30 booked", "💬 Lead answered in 8 sec", "🔔 Reminder: tomorrow 09:15",
    "✓ Roster updated", "💶 Payment link sent", "⭐ Review request sent", "🔁 Appointment moved → Fri 14:30", "📦 Track & trace sent",
    "👋 Welcome Noor! Contract is ready", "✓ 13/14 shifts confirmed", "🤒 Daan sick → Mila messaged", "🍽️ Table for 6 · Sat 20:30", "📄 Quote followed up after 3 days",
    "✓ Approved → deal won", "📍 Address + dress code sent", "💬 Opening hours question answered", "📨 Urgent email → summary on WhatsApp",
  ],
};

const rand = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

/** Eén kolom stromende berichtblokken, met eigen diepte voor de muis-parallax */
const Column = ({ items, i, mx, my }: { items: string[]; i: number; mx: MotionValue<number>; my: MotionValue<number> }) => {
  const depth = 0.4 + (i % 3) * 0.35;
  const x = useTransform(mx, (v) => v * -28 * depth);
  const y = useTransform(my, (v) => v * -22 * depth);
  const list = [...items, ...items];
  return (
    <motion.div style={{ x, y, opacity: 0.25 + depth * 0.3 }} className="relative h-full overflow-hidden">
      <div className="wall-col flex flex-col gap-3" style={{ ["--dur" as string]: `${38 + (i % 4) * 9}s`, animationDelay: `${-rand(i) * 30}s` }}>
        {list.map((m, j) => {
          const hot = rand(i * 31 + j) > 0.82;
          return (
            <div key={j} className={`px-4 py-3.5 text-[14px] font-bold leading-snug tracking-[-0.01em] ${hot ? "bg-brand text-white" : "bg-white/[0.06] text-white/75"}`}>
              {m}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export const Hero = () => {
  const t = useT();
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const go = useIntroDone() || !!reduce;
  const ref = useRef<HTMLElement>(null);

  // muis → lagen
  const rmx = useMotionValue(0), rmy = useMotionValue(0);
  const mx = useSpring(rmx, { stiffness: 60, damping: 20 });
  const my = useSpring(rmy, { stiffness: 60, damping: 20 });
  const textX = useTransform(mx, (v) => v * 14);
  const textY = useTransform(my, (v) => v * 10);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); rmx.set((e.clientX - r.left) / r.width - 0.5); rmy.set((e.clientY - r.top) / r.height - 0.5); };
    const leave = () => { rmx.set(0); rmy.set(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [reduce, rmx, rmy]);

  // scroll → tekst zakt iets langzamer weg dan de muur
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const wallY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const cols = useMemo(() => {
    const ev = EVENTS[lang];
    return Array.from({ length: 6 }, (_, c) => ev.map((_, j) => ev[(j * 5 + c * 7) % ev.length]).slice(0, 12));
  }, [lang]);

  return (
    <>
      <section ref={ref} id="top" data-theme="dark" className="relative overflow-hidden bg-ink text-white">
        {/* muur van automatiseringen */}
        <motion.div aria-hidden style={{ y: wallY }} className="pointer-events-none absolute inset-[-60px] grid grid-cols-3 gap-3 md:grid-cols-6">
          {cols.map((items, i) => <Column key={`${lang}-${i}`} items={items} i={i} mx={mx} my={my} />)}
        </motion.div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 62% 58% at 38% 52%, rgba(14,17,16,.97) 30%, rgba(14,17,16,.75) 62%, rgba(14,17,16,.35))" }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        <motion.div style={{ y: contentY }} className="container relative flex min-h-[100svh] flex-col justify-center pb-20 pt-32">
          <motion.h1 style={{ x: textX, y: textY }} className="font-display text-[44px] font-black leading-[0.92] tracking-[-0.06em] sm:text-[52px] md:text-[112px] lg:text-[148px]">
            {[t.hero.h1a, t.hero.h1b, t.hero.h1c].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span className={`block ${i === 1 ? "text-white/40" : i === 2 ? "text-[#7CC7A0]" : ""}`}
                  initial={{ y: "105%" }} animate={go ? { y: 0 } : { y: "105%" }} transition={{ duration: 1, ease, delay: 0.1 + i * 0.12 }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="mt-12 grid max-w-[880px] gap-2 md:grid-cols-[1.2fr_1fr]">
            <div className="bg-white p-6 text-ink md:p-8">
              <p className="font-display text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em] md:text-[30px]">{t.home.sub}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button href={waLink(t.hero.waText)} external size="lg" arrow className="h-full min-h-16 w-full justify-between">{t.ui.nav.cta}</Button>
              <Button href="/kennismaken" variant="dark" size="lg" className="w-full justify-between !bg-white/[0.08]">{t.ui.meet}</Button>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : {}} transition={{ delay: 1.1 }} className="mt-5 text-[15px] font-semibold text-white/50">{t.ui.noBot}</motion.p>
        </motion.div>
      </section>
      <div className="bg-white"><PixelWipe /></div>
    </>
  );
};
