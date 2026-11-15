"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { sectorKeys, type SectorKey } from "@/lib/content";
import { SITE } from "@/lib/config";
import { Phone } from "@/components/Phone";
import { ChatIcon, CheckIcon } from "@/components/Icons";

const Connector = ({ h = 44 }: { h?: number }) => (
  <svg width="2" height={h} className="mx-auto block overflow-visible" aria-hidden>
    <line x1="1" y1="0" x2="1" y2={h} stroke="#25855A" strokeWidth="2" className="flow-dash" />
  </svg>
);

export const Sectors = () => {
  const t = useT().sectors;
  const [key, setKey] = useState<SectorKey>("vastgoed");
  const item = t.items[key];
  const firstMsg = item.chat[0].text;

  return (
    <section id="voorbeelden" data-flow className="py-28 md:py-36">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mx-auto mt-4 max-w-3xl">{t.title}</h2>
          <p className="mt-4 text-lg">{t.sub}</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist">
          {sectorKeys.map((k) => (
            <button key={k} role="tab" aria-selected={key === k} onClick={() => setKey(k)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${key === k ? "bg-ink text-white shadow-card" : "bg-white text-ink border border-ink/10 hover:border-ink/30"}`}>
              {t.items[k].label}
            </button>
          ))}
        </div>

        <div className="relative mt-14 rounded-[32px] bg-sand p-6 md:p-12">
          <div className="pointer-events-none absolute inset-0 rounded-[32px] dot-grid opacity-60" />
          <div className="relative grid items-center gap-12 md:grid-cols-[1fr_auto]">
            {/* Flow: bericht → Appmaat → resultaat */}
            <AnimatePresence mode="wait">
              <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
                className="mx-auto w-full max-w-[460px]">
                <div className="flex justify-center"><span className="rounded-md bg-brand-light px-2 py-1 font-mono text-xs text-brand-dark">{t.trigger}</span></div>
                <div className="card mt-3 flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-light text-brand"><ChatIcon /></span>
                  <p className="truncate text-[15px] text-ink">{firstMsg}</p>
                </div>
                <Connector />
                <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-white shadow-card">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand"><CheckIcon className="h-4 w-4" /></span>
                  <span className="font-medium">{t.engine}</span>
                  <motion.span className="h-2 w-2 rounded-full bg-[#7CC7A0]" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                </div>
                <svg viewBox="0 0 300 50" className="mx-auto block h-[50px] w-full max-w-[460px]" fill="none" aria-hidden>
                  {[50, 150, 250].map((x) => (
                    <path key={x} d={`M150 0 C150 25 ${x} 25 ${x} 50`} stroke="#25855A" strokeWidth="2" className="flow-dash" vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
                <div className="grid grid-cols-3 gap-3">
                  {item.result.map((r, i) => (
                    <motion.div key={r} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.25 }}
                      className="card p-3 text-center">
                      <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-brand text-white"><CheckIcon className="h-4 w-4" /></span>
                      <p className="mt-2 text-[13px] font-medium leading-snug text-ink">{r}</p>
                    </motion.div>
                  ))}
                </div>
                {key === "vastgoed" && SITE.pilotPartner && (
                  <p className="mt-6 text-center text-sm text-body">{t.pilot} <span className="font-semibold text-ink">{SITE.pilotPartner}</span></p>
                )}
              </motion.div>
            </AnimatePresence>
            <Phone chat={item.chat} name={t.phoneName} status={t.online} />
          </div>
        </div>
      </div>
    </section>
  );
};
