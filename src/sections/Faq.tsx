"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export const Faq = () => {
  const t = useT().faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container">
        <h2 className="h2 text-center !text-[48px] md:!text-[80px]">{t.title}</h2>
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {t.items.map((it, i) => (
            <div key={it.q} className={`rounded-[24px] border-2 border-ink transition-colors ${open === i ? "bg-mint" : "bg-white"}`}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                <span className="text-[19px] font-bold tracking-[-0.01em] text-ink md:text-[21px]">{it.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-white text-[22px] leading-none text-ink">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-xl px-6 pb-6 text-[17px] font-medium text-ink/80">{it.a}</p>
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
