"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { SceneBuild, SceneRun, SceneVisit } from "@/components/Iso";

export const HowItWorks = () => {
  const t = useT();
  const h = t.how;
  const scenes = [
    <SceneVisit key="v" />,
    <SceneBuild key="b" labels={["WhatsApp", t.sectors.engine, t.hub.tools.slice(1, 3).join(" · ")]} />,
    <SceneRun key="r" />,
  ];
  return (
    <section id="hoe-het-werkt" className="py-28 md:py-36">
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{h.eyebrow}</p>
          <h2 className="h2 mt-4">{h.title}</h2>
        </div>
        <div className="mt-20 space-y-24 md:space-y-10">
          {h.steps.map((s, i) => (
            <div key={s.tag} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="md:px-10">
                <span className="inline-block rounded-none bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">{s.tag}</span>
                <h3 className="mt-4 font-display text-3xl md:text-[46px] font-medium leading-[1.04] tracking-[-0.04em] text-ink">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg">{s.text}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-[340px] md:h-[420px]">
                {scenes[i]}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
