"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export const Faq = () => {
  const t = useT().faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container grid gap-12 md:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="h2 mt-4">{t.title}</h2>
        </div>
        <div className="space-y-2">
          {t.items.map((it, i) => (
            <div key={it.q} className="bg-sand px-6">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="font-display text-[22px] font-extrabold tracking-[-0.025em] text-ink md:text-[26px]">{it.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-none bg-sand text-xl text-ink">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-xl pb-6 text-[17px] text-body">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
