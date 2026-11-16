"use client";
import { motion } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { ArrowButton, FillButton } from "@/components/Buttons";
import { StackedForm } from "@/components/StackedForm";

export const CallToAction = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <section className="relative overflow-hidden border-t border-ink/10 py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="container relative grid items-center gap-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="h2 max-w-xl md:text-7xl">{t.cta.title}</h2>
          <p className="mt-5 text-xl">{t.cta.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <FillButton href={waLink(t.hero.waText)} external>{t.cta.cta1}</FillButton>
            <ArrowButton href={waLink(t.cta.waDemo)} external>{t.cta.cta2}</ArrowButton>
          </div>
        </div>
        <div className="md:justify-self-end">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/50">
            {lang === "nl" ? "Liever dat wij jou appen?" : "Rather have us message you?"}
          </p>
          <StackedForm />
        </div>
      </motion.div>
    </section>
  );
};
