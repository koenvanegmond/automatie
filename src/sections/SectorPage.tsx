"use client";
import { motion } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys, type SectorKey } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button, TextLink } from "@/components/Buttons";
import { Phone } from "@/components/Phone";
import { CheckIcon } from "@/components/Icons";
import { EndCta } from "@/sections/HomeSections";

const ease = [0.22, 1, 0.36, 1] as const;

export const SectorPage = ({ k, subs = [] }: { k: SectorKey; subs?: { href: string; label: string }[] }) => {
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="font-ui text-[12px] font-bold uppercase text-ink/60">{t.solutions.covers}</span>
            {s.covers.map((c) => <span key={c} className="rounded-full border-2 border-ink bg-white px-3 py-1 text-[14px] font-semibold text-ink">{c}</span>)}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={waLink(wa)} external size="lg" variant="primary" arrow>{t.ui.nav.cta}</Button>
            <Button href="/kennismaken" variant="outline" size="lg">{t.ui.meet}</Button>
          </div>
        </motion.div>
      </section>

      <section className="pb-24 md:pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="container">
          <div className="rounded-[28px] border-2 border-ink bg-lilac p-6 md:p-14">
            <Phone chat={item.chat} name={t.sectors.phoneName} status={t.sectors.online} />
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

      {subs.length > 0 && (
        <section className="pt-24 md:pt-32">
          <div className="container text-center">
            <p className="eyebrow">{lang === "nl" ? "Per branche" : "By industry"}</p>
            <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
              {subs.map((s) => (
                <a key={s.href} href={s.href} className="group flex items-center justify-between gap-4 rounded-[24px] border-2 border-ink bg-white px-6 py-5 text-left transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]">
                  <span className="text-[19px] font-bold leading-tight text-ink md:text-[21px]">{s.label}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint text-ink transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 md:py-32">
        <div className="container text-center">
          <h2 className="h2">{t.home.how.title}</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {t.home.how.steps.map((st) => (
              <div key={st.t}><p className="font-display text-[36px] uppercase leading-[0.95] text-ink">{st.t}</p><p className="sub mt-2">{st.d}</p></div>
            ))}
          </div>
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full border-2 border-ink bg-sun px-8 py-4">
            <span className="font-ui text-[15px] font-bold uppercase text-ink">{t.home.price.title} {lang === "nl" ? "Eenmalig." : "One-off."}</span>
            <TextLink href="/prijzen">{t.ui.seePricing}</TextLink>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container text-center">
          <p className="eyebrow">{t.solutions.others}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {sectorKeys.filter((o) => o !== k).map((o) => <Button key={o} href={`/oplossingen/${t.solutions[o].slug}`} size="md">{t.solutions[o].name}</Button>)}
          </div>
        </div>
      </section>

      <EndCta />
    </>
  );
};
