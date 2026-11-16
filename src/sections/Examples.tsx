"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { SITE } from "@/lib/config";
import { Phone } from "@/components/Phone";
import { RosterScene } from "@/components/scenes/RosterScene";

const ease = [0.22, 1, 0.36, 1] as const;

/** Redactionele voorbeelden 01–03 met een donkere kaart en echte interface (ref. Transform) */
export const Examples = () => {
  const all = useT();
  const t = all.examples;
  const scenes = [
    <RosterScene key="r" />,
    <div key="v" className="flex flex-col items-center gap-4">
      <Phone chat={all.sectors.items.vastgoed.chat} name={all.sectors.phoneName} status={all.sectors.online} />
      {SITE.pilotPartner && <p className="text-xs text-white/50">{all.sectors.pilot} <span className="text-white/80">{SITE.pilotPartner}</span></p>}
    </div>,
    <Phone key="l" chat={t.leadChat} name={all.sectors.phoneName} status={all.sectors.online} />,
  ];

  return (
    <section id="voorbeelden" className="py-24 md:py-32">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <p className="eyebrow pt-3">{t.eyebrow}</p>
          <h2 className="h2">{t.title}</h2>
        </div>

        {t.items.map((it, i) => (
          <div key={it.no} className="mt-20 border-t border-ink/10 pt-8 md:mt-28">
            <div className="grid gap-4 md:grid-cols-[220px_1fr_auto]">
              <p className="text-[13px] text-body/70">{it.label}</p>
              <div className="overflow-hidden">
                <motion.h3 initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
                  className="max-w-3xl font-display text-[34px] font-medium leading-[1.04] tracking-[-0.04em] text-ink md:text-[56px]">
                  {it.title}
                </motion.h3>
              </div>
              <p className="hidden font-mono text-sm text-ink/30 md:block">#{it.no}</p>
            </div>

            <motion.div initial={{ clipPath: "inset(12% 8% 0% 8% round 0px)", opacity: 0.4 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }} viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.1, ease }}
              className="relative mt-10 overflow-hidden rounded-none bg-ink p-6 md:p-12">
              <div className="relative grid items-center gap-10 md:grid-cols-[1fr_1.5fr]">
                <div className="text-white">
                  <p className="font-mono text-sm text-white/40">{it.no}</p>
                  <p className="mt-3 max-w-sm text-lg leading-relaxed text-white/75">{it.text}</p>
                </div>
                <div>{scenes[i]}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
