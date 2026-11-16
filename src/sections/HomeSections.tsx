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
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease, delay }} className={className}>
    {children}
  </motion.div>
);

/* 2. Knelpunt: één groot getal van 42 naar 0 */
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
    <section className="py-24 md:py-36">
      <div ref={ref} className="container text-center">
        <Reveal><h2 className="h2 mx-auto max-w-4xl">{t.title}</h2></Reveal>
        <Reveal delay={0.1}>
          <p className={`mt-14 font-display text-[120px] font-medium leading-none tracking-[-0.06em] tabular-nums transition-colors duration-500 md:text-[200px] ${v === 0 ? "text-brand" : "text-ink"}`}>{v}</p>
          <p className="lead mt-2">{t.unit}</p>
          <p className="mt-6 text-[14px] text-body/60">{t.note}</p>
        </Reveal>
      </div>
    </section>
  );
};

/* 3. Sectortegels met mini-chat */
const MiniChat = ({ k }: { k: SectorKey }) => {
  const chat = useT().sectors.items[k].chat.slice(0, 3);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex h-[168px] flex-col justify-end gap-2">
      {chat.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.6, duration: 0.4, ease }}
          className={`max-w-[85%] rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${m.from === "them" ? "self-end rounded-br-md bg-brand text-white" : "self-start rounded-bl-md bg-white text-ink shadow-[0_1px_2px_rgba(14,17,16,.06)]"}`}>
          {m.text}
        </motion.div>
      ))}
    </div>
  );
};

export const SectorTiles = () => {
  const t = useT();
  return (
    <section className="bg-sand py-24 md:py-36">
      <div className="container">
        <Reveal><h2 className="h2 text-center">{t.home.sectors.title}</h2></Reveal>
        <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-2">
          {sectorKeys.map((k, i) => (
            <Reveal key={k} delay={i * 0.06}>
              <a href={`/oplossingen/${t.solutions[k].slug}`} className="group block rounded-[28px] bg-white p-7 transition-transform duration-300 hover:-translate-y-1 md:p-10">
                <p className="text-[17px] text-body">{t.solutions[k].name}</p>
                <h3 className="mt-1 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.025em] text-ink md:text-[34px]">{t.solutions[k].tile}</h3>
                <div className="mt-8 rounded-[22px] bg-sand p-4"><MiniChat k={k} /></div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[17px] text-brand group-hover:underline group-hover:underline-offset-4">
                  {t.ui.more}
                  <svg viewBox="0 0 8 14" className="h-[0.7em] w-[0.4em] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M1 1l6 6-6 6" /></svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center"><TextLink onClick={openChat}>{t.ui.demo}</TextLink></div>
      </div>
    </section>
  );
};

/* 4. Werkwijze */
export const HowSection = () => {
  const t = useT();
  const scenes = [<SceneVisit key="v" />, <SceneBuild key="b" labels={["WhatsApp", "Appmaatje", t.hub.tools.slice(1, 3).join(" · ")]} />, <SceneRun key="r" />];
  return (
    <section id="werkwijze" className="scroll-mt-16 py-24 md:py-36">
      <div className="container">
        <Reveal><h2 className="h2 text-center">{t.home.how.title}</h2></Reveal>
        <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-3">
          {t.home.how.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08} className="rounded-[28px] bg-sand p-7 md:p-8">
              <div className="h-[200px]">{scenes[i]}</div>
              <h3 className="mt-4 font-display text-[24px] font-semibold tracking-[-0.015em] text-ink">{s.t}</h3>
              <p className="mt-1 text-[17px] text-body">{s.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center"><Button href="/kennismaken" variant="secondary">{t.ui.meet}</Button></div>
      </div>
    </section>
  );
};

/* 5. Prijs + pilot */
export const PriceTeaser = () => {
  const t = useT();
  return (
    <section className="bg-sand py-24 md:py-36">
      <Reveal className="container text-center">
        <h2 className="h2">{t.home.price.title}</h2>
        <p className="lead mx-auto mt-4 max-w-xl">{t.home.price.sub}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button href={waLink(t.pilot.waText)} external>{t.ui.pilotCta}</Button>
          <TextLink href="/prijzen">{t.ui.seePricing}</TextLink>
        </div>
      </Reveal>
    </section>
  );
};

/* 6. Afsluiter */
export const EndCta = () => {
  const t = useT();
  return (
    <section className="py-28 md:py-40">
      <Reveal className="container text-center">
        <h2 className="h2 mx-auto max-w-3xl">{t.home.end.title}</h2>
        <p className="lead mt-4">{t.home.end.sub}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={waLink(t.hero.waText)} external size="lg">{t.ui.nav.cta}</Button>
          <Button href="/kennismaken" variant="secondary" size="lg">{t.ui.meet}</Button>
        </div>
      </Reveal>
    </section>
  );
};
