"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useT } from "@/lib/i18n";
import { sectorKeys, type SectorKey } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button, TextLink, openChat } from "@/components/Buttons";
import { SceneBuild, SceneRun, SceneVisit } from "@/components/Iso";

const ease = [0.22, 1, 0.36, 1] as const;

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease, delay }} className={className}>
    {children}
  </motion.div>
);

/* 2. Knelpunt: kop + groot groen blok dat van 42 naar 0 telt */
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
    <section className="py-20 md:py-32">
      <div ref={ref} className="container grid items-stretch gap-2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Reveal className="flex flex-col justify-between bg-sand p-8 md:p-12">
          <h2 className="h2 !text-[40px] md:!text-[52px] lg:!text-[60px]">{t.title}</h2>
          <p className="mt-10 text-[15px] font-semibold text-body/70">{t.note}</p>
        </Reveal>
        <Reveal delay={0.1} className={`flex flex-col justify-end p-8 transition-colors duration-700 md:p-12 ${v === 0 ? "bg-brand text-white" : "bg-ink text-white"}`}>
          <p className="font-display text-[140px] font-black leading-[0.8] tracking-[-0.07em] tabular-nums md:text-[220px]">{v}</p>
          <p className="mt-4 font-display text-[24px] font-extrabold tracking-[-0.02em]">{t.unit}</p>
        </Reveal>
      </div>
    </section>
  );
};

/* 3. Sectortegels als massieve blokken met een mini-chat */
const tileStyle: Record<SectorKey, { box: string; sub: string; inner: string; link: string }> = {
  uitzend: { box: "bg-ink text-white", sub: "text-white/55", inner: "bg-white/[0.07]", link: "text-[#7CC7A0]" },
  vastgoed: { box: "bg-brand text-white", sub: "text-white/70", inner: "bg-black/[0.12]", link: "text-white" },
  horeca: { box: "bg-sand text-ink", sub: "text-body/70", inner: "bg-white", link: "text-brand" },
  zorg: { box: "bg-brand-light text-ink", sub: "text-brand-dark/70", inner: "bg-white/70", link: "text-brand-dark" },
};

const MiniChat = ({ k }: { k: SectorKey }) => {
  const chat = useT().sectors.items[k].chat.slice(0, 3);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex h-[176px] flex-col justify-end gap-2">
      {chat.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.6, duration: 0.4, ease }}
          className={`max-w-[86%] px-3.5 py-2.5 text-[14px] font-semibold leading-snug ${m.from === "them" ? "self-end bg-[#D5EFDF] text-ink" : "self-start bg-white text-ink"}`}>
          {m.text}
        </motion.div>
      ))}
    </div>
  );
};

export const SectorTiles = () => {
  const t = useT();
  return (
    <section className="pb-20 md:pb-32">
      <div className="container">
        <Reveal><h2 className="h2 max-w-3xl">{t.home.sectors.title}</h2></Reveal>
        <div className="mt-10 grid gap-2 md:mt-14 md:grid-cols-2">
          {(["uitzend", "vastgoed", "horeca", "zorg"] as SectorKey[]).map((k, i) => {
            const st = tileStyle[k];
            return (
              <Reveal key={k} delay={i * 0.06}>
                <a href={`/oplossingen/${t.solutions[k].slug}`} className={`group block h-full p-7 transition-transform duration-300 hover:-translate-y-1 md:p-10 ${st.box}`}>
                  <p className={`font-display text-[17px] font-extrabold ${st.sub}`}>{t.solutions[k].name}</p>
                  <h3 className="mt-2 font-display text-[32px] font-black leading-[1] tracking-[-0.045em] md:text-[44px]">{t.solutions[k].tile}</h3>
                  <div className={`mt-8 p-4 ${st.inner}`}><MiniChat k={k} /></div>
                  <span className={`mt-6 inline-flex items-center gap-2 font-display text-[19px] font-extrabold ${st.link}`}>
                    {t.ui.more}<span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8"><TextLink onClick={openChat}>{t.ui.demo}</TextLink></div>
      </div>
    </section>
  );
};

/* 4. Werkwijze in drie blokken */
export const HowSection = () => {
  const t = useT();
  const scenes = [<SceneVisit key="v" />, <SceneBuild key="b" labels={["WhatsApp", "Appmaatje", t.hub.tools.slice(1, 3).join(" · ")]} />, <SceneRun key="r" />];
  return (
    <section id="werkwijze" className="scroll-mt-20 bg-sand py-20 md:py-32">
      <div className="container">
        <Reveal><h2 className="h2">{t.home.how.title}</h2></Reveal>
        <div className="mt-10 grid gap-2 md:mt-14 md:grid-cols-3">
          {t.home.how.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08} className="bg-white p-7 md:p-9">
              <p className="font-display text-[64px] font-black leading-none tracking-[-0.06em] text-brand">{i + 1}</p>
              <div className="my-4 h-[180px]">{scenes[i]}</div>
              <h3 className="font-display text-[30px] font-black leading-[1] tracking-[-0.04em] text-ink">{s.t}</h3>
              <p className="mt-2 text-[18px] font-semibold text-body">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 5. Prijs + pilot als groot groen blok */
export const PriceTeaser = () => {
  const t = useT();
  return (
    <section className="py-20 md:py-32">
      <Reveal className="container">
        <div className="grid gap-2 md:grid-cols-[1.5fr_1fr]">
          <div className="bg-brand p-8 text-white md:p-14">
            <h2 className="font-display text-[64px] font-black leading-[0.9] tracking-[-0.06em] md:text-[120px]">{t.home.price.title}</h2>
            <p className="mt-6 max-w-lg font-display text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white/85 md:text-[26px]">{t.home.price.sub}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button href={waLink(t.pilot.waText)} external variant="dark" size="lg" arrow className="h-full min-h-20 w-full justify-between">{t.ui.pilotCta}</Button>
            <Button href="/prijzen" variant="soft" size="lg" arrow className="h-full min-h-20 w-full justify-between">{t.ui.seePricing}</Button>
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
    <section className="bg-ink py-24 text-white md:py-40">
      <Reveal className="container">
        <h2 className="max-w-5xl font-display text-[52px] font-black leading-[0.95] tracking-[-0.055em] md:text-[104px]">{t.home.end.title}</h2>
        <p className="mt-6 font-display text-[22px] font-extrabold tracking-[-0.02em] text-white/60 md:text-[26px]">{t.home.end.sub}</p>
        <div className="mt-12 flex flex-wrap gap-2">
          <Button href={waLink(t.hero.waText)} external size="lg" arrow>{t.ui.nav.cta}</Button>
          <Button href="/kennismaken" variant="light" size="lg">{t.ui.meet}</Button>
        </div>
      </Reveal>
    </section>
  );
};
