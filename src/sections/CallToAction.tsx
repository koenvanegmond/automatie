"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { ArrowIcon } from "@/components/Icons";

export const CallToAction = () => {
  const t = useT();
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[110px]" />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="container relative text-center">
        <h2 className="h2 mx-auto max-w-3xl md:text-7xl">{t.cta.title}</h2>
        <p className="mt-5 text-xl">{t.cta.sub}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={waLink(t.hero.waText)} target="_blank" rel="noopener" className="btn btn-primary btn-glow px-7 py-3.5 text-base">{t.cta.cta1}</a>
          <a href={waLink(t.cta.waDemo)} target="_blank" rel="noopener" className="btn btn-ghost group px-7 py-3.5 text-base">
            {t.cta.cta2}<ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};
