"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { BoltIcon, PinIcon, ShieldIcon, ToolIcon } from "@/components/Icons";

const icons = [PinIcon, ToolIcon, ShieldIcon, BoltIcon];

export const WhyUs = () => {
  const t = useT().why;
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4">{t.title}</h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={it.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }} whileHover={{ y: -4 }}
                className="rounded-xl bg-sand p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-card"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-[-0.03em] text-ink">{it.title}</h3>
                <p className="mt-2">{it.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
