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
      <section className="pb-16 pt-36 text-center md:pb-24 md:pt-44">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="container">
          <p className="eyebrow">{s.name}</p>
          <h1 className="h2 mx-auto mt-5 max-w-5xl">{s.title}</h1>
          <p className="lead mx-auto mt-5 max-w-2xl">{s.sub}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={waLink(wa)} external size="lg" variant="primary" arrow>{t.ui.nav.cta}</Button>
            <Button href="/kennismaken" variant="outline" size="lg">{t.ui.meet}</Button>
          </div>
        </motion.div>
      </section>

      <section className="pb-24 md:pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="container">
          <div className={`rounded-[28px] border-2 border-ink p-6 md:p-14 ${k === "uitzend" ? "bg-ink" : "bg-lilac"}`}>
            {k === "uitzend" ? <div className="mx-auto max-w-3xl"><RosterScene /></div> : <Phone chat={item.chat} name={t.sectors.phoneName} status={t.sectors.online} />}
            {k === "vastgoed" && SITE.pilotPartner && <p className="mt-6 text-center text-[14px] text-body/70">{t.sectors.pilot} {SITE.pilotPartner}</p>}
          </div>
        </motion.div>
      </section>

      <section className="border-y-2 border-ink bg-[#F7F7F2] py-24 md:py-32">
        <div className="container">
          <h2 className="h2 text-center">{t.solutions.does}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {item.result.map((r, i) => (
              <motion.div key={r} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7, ease }}
                className="rounded-[28px] border-2 border-ink bg-white p-8 transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]">
                <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-mint text-ink"><CheckIcon className="h-5 w-5" /></span>
                <p className="mt-6 font-display text-[36px] uppercase leading-[0.95] text-ink">{r}</p>
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
              <div key={st.t}><p className="font-display text-[36px] uppercase leading-[0.95] text-ink">{st.t}</p><p className="mt-1 text-body">{st.d}</p></div>
            ))}
          </div>
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full border-2 border-ink bg-sun px-8 py-4">
            <span className="font-ui text-[15px] font-bold uppercase text-ink">{t.home.price.title} {lang === "nl" ? "Eenmalig." : "One-off."}</span>
            <TextLink href="/prijzen">{t.ui.seePricing}</TextLink>
          </div>
        </div>
      </section>

      <EndCta />
    </>
  );
};
