"use client";
import { Mascot } from "@/components/Mascot";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button, TextLink, openChat } from "@/components/Buttons";
import { Slant } from "@/components/Slant";
import { BellSticker, CalendarSticker, ChatSticker, CoinSticker } from "@/components/Stickers";

const ease = [0.22, 1, 0.36, 1] as const;

export const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease, delay }} className={className}>
    {children}
  </motion.div>
);

const pop = "transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]";

/* 2. Knelpunt (donker): grote kop + kaart die van 42 naar 0 telt */
export const Problem = () => {
  const t = useT().home.problem;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [v, setV] = useState(42);
  useEffect(() => {
    if (!inView) return;
    const c = animate(42, 0, { duration: 2.2, delay: 0.5, ease: [0.65, 0, 0.35, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView]);
  return (
    <section className="bg-ink pb-24 pt-10 text-white md:pb-36">
      <div ref={ref} className="container grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className="font-display text-[56px] uppercase leading-[0.9] md:text-[104px]">{t.title}</h2>
          <p className="sub mt-6 max-w-lg !text-white/70">{t.note}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={`relative rounded-[28px] border-2 border-white p-8 text-ink transition-colors duration-700 md:p-10 ${v === 0 ? "bg-mint" : "bg-sun"}`}>
            <p className="font-display text-[150px] leading-[0.8] tabular-nums md:text-[200px]">{v}</p>
            <p className="mt-4 font-ui text-[15px] font-bold uppercase">{t.unit}</p>
            <ChatSticker className="absolute -right-6 -top-10 w-24 rotate-12" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* 3. Branches: algemeen, zodat elke ondernemer zich herkent */
const cardBg = ["bg-mint", "bg-sun", "bg-lilac", "bg-white"];

export const Branches = () => {
  const t = useT();
  const b = t.branches;
  return (
    <section id="branches" className="scroll-mt-24 bg-white py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2 className="h2 mt-5">{b.title}</h2>
          <p className="lead mx-auto mt-5 max-w-2xl">{b.sub}</p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {b.items.map((it, i) => (
            <Reveal key={it.name} delay={(i % 3) * 0.06}>
              <div className={`h-full rounded-[24px] border-2 border-ink p-6 md:p-7 ${cardBg[i % 4]} ${pop}`}>
                <h3 className="font-display text-[34px] uppercase leading-[0.95] text-ink md:text-[40px]">{it.name}</h3>
                <p className="mt-3 text-[17px] font-medium leading-snug text-ink/80">{it.flow}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[24px] border-2 border-ink bg-ink p-6 text-white md:p-7">
              <div>
                <h3 className="font-display text-[34px] uppercase leading-[0.95] md:text-[40px]">{b.other.title}</h3>
                <p className="mt-3 text-[17px] font-medium leading-snug text-white/80">{b.other.text}</p>
              </div>
              <div className="mt-6"><Button href={waLink(t.hero.waText)} external variant="highlight" arrow>{t.ui.nav.cta}</Button></div>
            </div>
          </Reveal>
        </div>
        <div className="mt-10 text-center"><TextLink onClick={openChat}>{t.ui.demo}</TextLink></div>
      </div>
    </section>
  );
};

/* 3b. Koppelingen */
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
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {g.groups.map((grp, i) => (
            <Reveal key={grp.name} delay={(i % 4) * 0.05}>
              <div className="h-full rounded-[24px] border-2 border-ink bg-white p-5 md:p-6">
                <p className="font-ui text-[13px] font-bold uppercase text-ink">{grp.name}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {grp.items.map((n) => <span key={n} className="rounded-full border-2 border-ink bg-[#F7F7F2] px-3 py-1 text-[14px] font-semibold text-ink">{n}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="lead mx-auto mt-10 max-w-2xl text-center">{g.note}</p>
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
