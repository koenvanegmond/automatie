"use client";
import { Mascot } from "@/components/Mascot";
import { Faq } from "@/sections/Faq";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button, TextLink, openChat } from "@/components/Buttons";
import { Slant } from "@/components/Slant";
import { BellSticker, CalendarSticker, ChatSticker, CoinSticker } from "@/components/Stickers";
import { BRAND_LOGOS } from "@/components/BrandLogos";
import { sectorKeys, type SectorKey } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease, delay }} className={className}>
    {children}
  </motion.div>
);

const pop = "transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]";

/* 2. Rekenmachine (donker): schuiven en zien hoeveel tijd je terugkrijgt */
const Slider = ({ id, label, value, min, max, onChange, suffix }: { id: string; label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix: string }) => (
  <div>
    <div className="flex items-baseline justify-between gap-4">
      <label htmlFor={id} className="font-ui text-[14px] font-bold uppercase text-white">{label}</label>
      <span className="font-display text-[44px] leading-none text-white tabular-nums">{value}<span className="ml-1 font-ui text-[13px] font-bold uppercase text-white/60">{suffix}</span></span>
    </div>
    <input id={id} type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="range mt-3" aria-valuetext={`${value} ${suffix}`} />
  </div>
);

export const Calculator = () => {
  const t = useT().home.calc;
  const [msgs, setMsgs] = useState(20);
  const [mins, setMins] = useState(2);
  const target = Math.round((msgs * mins * 21 * 0.7) / 60);
  const [shown, setShown] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const c = animate(prev.current, target, { duration: 0.5, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setShown(Math.round(x)), onComplete: () => { prev.current = target; } });
    return () => { prev.current = shown; c.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  const days = Math.max(1, Math.round((target * 12) / 8));
  return (
    <section className="bg-ink pb-24 pt-10 text-white md:pb-36">
      <div className="container grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <h2 className="font-display text-[56px] uppercase leading-[0.9] md:text-[96px]">{t.title}</h2>
          <p className="sub mt-6 max-w-lg !text-white/70">{t.sub}</p>
          <div className="mt-10 grid max-w-lg gap-8">
            <Slider id="calc-msgs" label={t.msgs} value={msgs} min={5} max={100} onChange={setMsgs} suffix="" />
            <Slider id="calc-mins" label={t.mins} value={mins} min={1} max={10} onChange={setMins} suffix="min" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-[28px] border-2 border-white bg-sun p-8 text-ink md:p-10">
            <p className="font-display text-[150px] leading-[0.8] tabular-nums md:text-[200px]" aria-live="polite">{shown}</p>
            <p className="mt-4 font-ui text-[15px] font-bold uppercase">{t.unit}</p>
            <p className="mt-3 text-[17px] font-medium text-ink/80">{t.year.replace("{d}", String(days))}</p>
            <ChatSticker className="absolute -right-6 -top-10 w-24 rotate-12" />
          </div>
          <p className="mt-4 text-[13px] font-medium text-white/50">{t.note}</p>
        </Reveal>
      </div>
    </section>
  );
};

/* 3. Oplossingen: 4 groepen, elk met eigen pagina */
const groupBg: Record<SectorKey, string> = { service: "bg-mint", techniek: "bg-sun", advies: "bg-lilac", handel: "bg-white" };

export const Branches = () => {
  const t = useT();
  const b = t.branches;
  return (
    <section id="oplossingen" className="scroll-mt-24 bg-white py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2 className="h2 mt-5">{b.title}</h2>
          <p className="lead mx-auto mt-5 max-w-2xl">{b.sub}</p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {sectorKeys.map((k, i) => {
            const s = t.solutions[k];
            return (
              <Reveal key={k} delay={(i % 2) * 0.06}>
                <a href={`/oplossingen/${s.slug}`} className={`group flex h-full flex-col rounded-[28px] border-2 border-ink p-7 md:p-9 ${groupBg[k]} ${pop}`}>
                  <h3 className="font-display text-[44px] uppercase leading-[0.92] text-ink md:text-[60px]">{s.name}</h3>
                  <p className="mt-3 text-[19px] font-semibold leading-snug text-ink/85">{s.tile}</p>
                  <p className="mt-6 font-ui text-[12px] font-bold uppercase text-ink/60">{b.covers}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.covers.map((c) => <span key={c} className="rounded-full border-2 border-ink bg-white/70 px-3 py-1 text-[14px] font-semibold text-ink">{c}</span>)}
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-ui text-[14px] font-bold uppercase text-ink">
                    {b.see}<span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="lead">{b.other.title} {b.other.text}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Button href={waLink(t.hero.waText)} external variant="primary" arrow>{t.ui.nav.cta}</Button>
            <Button onClick={openChat}>{t.ui.demo}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* 3b. Koppelingen als logo-tegels */
export const Integrations = () => {
  const t = useT();
  const g = t.integrations;
  return (
    <section id="koppelingen" className="scroll-mt-24 border-y-2 border-ink bg-lilac py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow !bg-white">{g.eyebrow}</p>
          <h2 className="h2 mt-5">{g.title}</h2>
          <p className="lead mx-auto mt-5 max-w-2xl">{g.sub}</p>
        </Reveal>
        <div role="list" className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {g.tools.map((n, i) => {
            const logo = BRAND_LOGOS[n];
            return (
              <Reveal key={n} delay={(i % 6) * 0.04}>
                <div role="listitem" className={`flex h-[112px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-ink bg-white px-3 text-center ${pop}`}>
                  {logo ? (
                    <>
                      <svg viewBox={logo.vb} className={(() => { const [,,w,hh] = logo.vb.split(" ").map(Number); return w / hh > 2 ? "h-auto w-[84%] max-h-9" : "h-9 w-9"; })()} aria-hidden dangerouslySetInnerHTML={{ __html: logo.body }} />
                      <span className="font-ui text-[12px] font-bold uppercase text-ink">{n}</span>
                    </>
                  ) : (
                    <span className="font-display text-[28px] uppercase leading-none text-ink">{n}</span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center font-ui text-[13px] font-bold uppercase tracking-[0.02em] text-ink/70">{g.cats}</p>
        <p className="lead mx-auto mt-4 max-w-2xl text-center">{g.note}</p>
      </div>
    </section>
  );
};

/* 4. Werkwijze */
export const HowSection = () => {
  const t = useT();
  const art = [<ChatSticker key="a" className="w-28" />, <CalendarSticker key="b" className="w-24" />, <CoinSticker key="c" className="w-28" />];
  const bg = ["bg-lilac", "bg-white", "bg-mint"];
  return (
    <section id="werkwijze" className="scroll-mt-24 border-t-2 border-ink bg-[#F7F7F2] py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">{t.ui.nav.how}</p>
          <h2 className="h2 mt-5">{t.home.how.title}</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.home.how.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08} className={`flex flex-col rounded-[28px] border-2 border-ink p-7 md:p-8 ${bg[i]} ${pop}`}>
              <div className="flex items-start justify-between">
                <span className="font-display text-[88px] leading-[0.8] text-ink">{i + 1}</span>
                <div className="bob" style={{ ["--r" as string]: `${i % 2 ? 6 : -6}deg`, ["--d" as string]: `${5 + i}s` }}>{art[i]}</div>
              </div>
              <h3 className="mt-8 font-display text-[44px] uppercase leading-[0.92] text-ink md:text-[56px]"><Slant text={s.t} /></h3>
              <p className="sub mt-3">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 5. Prijs + pilot */
export const PriceTeaser = () => {
  const t = useT();
  return (
    <section className="bg-white py-24 md:py-32">
      <Reveal className="container">
        <div className="relative overflow-hidden rounded-[28px] border-2 border-ink bg-sun px-7 py-12 text-center md:px-14 md:py-20">
          <BellSticker className="pointer-events-none absolute -left-4 -top-4 hidden w-28 -rotate-12 md:block" />
          <CoinSticker className="pointer-events-none absolute -bottom-6 -right-4 hidden w-36 rotate-6 md:block" />
          <h2 className="h2 relative">{t.home.price.title}</h2>
          <p className="lead relative mx-auto mt-5 max-w-2xl">{t.home.price.sub}</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-2.5">
            <Button href={waLink(t.pilot.waText)} external size="lg" variant="primary" arrow>{t.ui.pilotCta}</Button>
            <Button href="/prijzen" size="lg">{t.ui.seePricing}</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

/* 6. Afsluiter */
export const EndCta = () => {
  const t = useT();
  return (
    <section className="relative overflow-hidden border-t-2 border-ink bg-mint py-28 md:py-40">
      <Mascot className="pointer-events-none absolute bottom-[6%] left-[4%] hidden w-56 lg:block" />
      <CalendarSticker className="bob pointer-events-none absolute bottom-[14%] right-[7%] hidden w-28 md:block" />
      <Reveal className="container relative text-center">
        <h2 className="h2 mx-auto max-w-5xl"><Slant text={t.home.end.title} last={2} /></h2>
        <p className="lead mt-5">{t.home.end.sub}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          <Button href={waLink(t.hero.waText)} external size="lg" variant="primary" arrow>{t.ui.nav.cta}</Button>
          <Button href="/kennismaken" size="lg">{t.ui.meet}</Button>
        </div>
      </Reveal>
    </section>
  );
};

/* FAQ-teaser op de homepage */
export const FaqTeaser = () => <Faq limit={4} link />;
