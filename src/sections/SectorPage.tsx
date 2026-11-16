"use client";
import { motion } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import type { SectorKey } from "@/lib/content";
import { SITE, waLink } from "@/lib/config";
import { Button, TextLink } from "@/components/Buttons";
import { Phone } from "@/components/Phone";
import { RosterScene } from "@/components/scenes/RosterScene";
import { CheckIcon } from "@/components/Icons";
import { EndCta } from "@/sections/HomeSections";

const ease = [0.22, 1, 0.36, 1] as const;

export const SectorPage = ({ k }: { k: SectorKey }) => {
  const t = useT();
  const { lang } = useLang();
  const s = t.solutions[k];
  const item = t.sectors.items[k];
  const wa = lang === "nl" ? `Hoi Appmaatje! Ik kom via de pagina ${s.name}.` : `Hi Appmaatje! I found you via the ${s.name} page.`;

  return (
    <>
      <section className="pb-16 pt-32 text-center md:pb-24 md:pt-44">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="container">
          <p className="eyebrow">{s.name}</p>
          <h1 className="h2 mx-auto mt-3 max-w-4xl md:text-[72px]">{s.title}</h1>
          <p className="lead mx-auto mt-5 max-w-2xl">{s.sub}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={waLink(wa)} external size="lg">{t.ui.nav.cta}</Button>
            <Button href="/kennismaken" variant="soft" size="lg">{t.ui.meet}</Button>
          </div>
        </motion.div>
      </section>

      <section className="pb-24 md:pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="container">
          <div className={`rounded-none p-6 md:p-14 ${k === "uitzend" ? "bg-ink" : "bg-sand"}`}>
            {k === "uitzend" ? <div className="mx-auto max-w-3xl"><RosterScene /></div> : <Phone chat={item.chat} name={t.sectors.phoneName} status={t.sectors.online} />}
            {k === "vastgoed" && SITE.pilotPartner && <p className="mt-6 text-center text-[14px] text-body/70">{t.sectors.pilot} {SITE.pilotPartner}</p>}
          </div>
        </motion.div>
      </section>

      <section className="bg-sand py-24 md:py-32">
        <div className="container">
          <h2 className="h2 text-center">{t.solutions.does}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {item.result.map((r, i) => (
              <motion.div key={r} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7, ease }}
                className="rounded-none bg-white p-8">
                <span className="grid h-10 w-10 place-items-center rounded-none bg-brand-light text-brand"><CheckIcon className="h-5 w-5" /></span>
                <p className="mt-6 font-display text-[24px] font-black leading-[1.2] tracking-[-0.015em] text-ink">{r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container text-center">
          <h2 className="h2">{t.home.how.title}</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {t.home.how.steps.map((st) => (
              <div key={st.t}><p className="font-display text-[24px] font-black tracking-[-0.015em] text-ink">{st.t}</p><p className="mt-1 text-body">{st.d}</p></div>
            ))}
          </div>
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-none bg-sand px-8 py-4">
            <span className="text-[17px] text-ink">{t.home.price.title} {lang === "nl" ? "Eenmalig." : "One-off."}</span>
            <TextLink href="/prijzen">{t.ui.seePricing}</TextLink>
          </div>
        </div>
      </section>

      <EndCta />
    </>
  );
};
