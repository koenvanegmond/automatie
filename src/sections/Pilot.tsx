"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { SITE, waLink } from "@/lib/config";

export const Pilot = () => {
  const t = useT().pilot;
  return (
    <section className="py-10">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-14 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/40 blur-[100px]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#7CC7A0]">{t.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl md:text-[56px] font-medium leading-[1.03] tracking-[-0.04em] text-white">{t.title}</h2>
              <p className="mt-4 max-w-lg text-lg text-white/70">{t.text}</p>
              <a href={waLink(t.waText)} target="_blank" rel="noopener" className="btn btn-primary btn-glow mt-8 px-6 py-3 text-base">{t.cta}</a>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex gap-2" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span key={i} className={`h-12 w-12 rounded-2xl border ${i === 0 && SITE.pilotPartner ? "border-brand bg-brand" : "border-white/20 bg-white/5"}`}
                    animate={i > 0 ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
                ))}
              </div>
              {SITE.pilotPartner && (
                <p className="text-sm text-white/60">{t.partner} <span className="font-semibold text-white">{SITE.pilotPartner}</span></p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
