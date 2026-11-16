"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { CheckIcon } from "@/components/Icons";

export const Pricing = () => {
  const t = useT().pricing;
  const ui = useT().ui;
  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="container">
        <h1 className="h2 text-center md:text-[72px]">{t.title}</h1>
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:mt-16 md:grid-cols-3">
          {t.plans.map((p, i) => {
            const hi = i === 1;
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`flex flex-col rounded-none p-8 ${hi ? "bg-ink text-white" : "bg-sand"}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`font-display text-[24px] font-black tracking-[-0.015em] ${hi ? "text-white" : "text-ink"}`}>{p.name}</h2>
                  {hi && <span className="rounded-none bg-brand px-3 py-1 text-[12px]">{t.popular}</span>}
                </div>
                <p className={`mt-6 flex items-baseline gap-1.5 ${hi ? "text-white" : "text-ink"}`}>
                  {p.from && <span className="text-[14px] opacity-60">{t.from}</span>}
                  <span className="font-display text-[48px] font-black tracking-[-0.04em]">€{p.price}</span>
                  <span className="text-[14px] opacity-60">{t.once}</span>
                </p>
                <p className={`mt-1 ${hi ? "text-white/70" : "text-body"}`}>{p.text}</p>
                <ul className="mb-8 mt-6 space-y-2.5">
                  {p.bullets.slice(0, 2).map((b) => (
                    <li key={b} className={`flex items-start gap-2 text-[15px] ${hi ? "text-white/85" : "text-ink"}`}><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" />{b}</li>
                  ))}
                </ul>
                <Button href={waLink(t.waText)} external variant={hi ? "primary" : "dark"} className="mt-auto w-full">{ui.meet}</Button>
              </motion.div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] text-body/70">{t.note}</p>
      </div>
    </section>
  );
};
