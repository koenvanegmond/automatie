"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { FillButton } from "@/components/Buttons";
import { CheckIcon } from "@/components/Icons";

export const Pricing = () => {
  const t = useT().pricing;
  return (
    <section id="prijzen" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4">{t.title}</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3 md:items-center">
          {t.plans.map((p, i) => {
            const hi = i === 1;
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`rounded-xl p-8 ${hi ? "bg-ink text-white shadow-[0_30px_60px_-20px_rgba(28,25,23,.45)] md:py-12" : "card"}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-display text-xl font-medium ${hi ? "text-white" : "text-ink"}`}>{p.name}</h3>
                  {hi && <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold">{t.popular}</span>}
                </div>
                <p className={`mt-6 flex items-baseline gap-1.5 ${hi ? "text-white" : "text-ink"}`}>
                  {p.from && <span className="text-sm opacity-70">{t.from}</span>}
                  <span className="font-display text-5xl font-medium tracking-[-0.04em]">€{p.price}</span>
                  <span className="text-sm opacity-70">{t.once}</span>
                </p>
                <p className={`mt-2 ${hi ? "text-white/70" : ""}`}>{p.text}</p>
                <FillButton href={waLink(t.waText)} external tone={hi ? "brand" : "ink"} className="mt-7 w-full">{t.cta}</FillButton>
                <ul className="mt-7 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className={`flex items-start gap-2 text-sm ${hi ? "text-white/85" : "text-ink"}`}>
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-body/80">{t.note}</p>
      </div>
    </section>
  );
};
