"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { CoinSticker } from "@/components/Stickers";

const bg = ["bg-white", "bg-mint", "bg-lilac"];

export const Pricing = () => {
  const all = useT();
  const t = all.pricing;
  return (
    <section className="relative pb-20 pt-36 md:pb-28 md:pt-44">
      <CoinSticker className="bob pointer-events-none absolute right-[10%] top-[14%] hidden w-32 md:block" />
      <div className="container">
        <div className="text-center">
          <p className="eyebrow">{all.ui.nav.pricing}</p>
          <h1 className="h2 mt-5">{t.title}</h1>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          {t.plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
              className={`flex flex-col rounded-[28px] border-2 border-ink p-7 ${bg[i]} transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]`}>
              <div className="flex items-center justify-between">
                <h2 className="font-ui text-[15px] font-bold uppercase text-ink">{p.name}</h2>
                {i === 1 && <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 font-ui text-[12px] font-bold uppercase">{t.popular}</span>}
              </div>
              <p className="mt-6 flex items-baseline gap-2 text-ink">
                {p.from && <span className="font-ui text-[13px] font-bold uppercase">{t.from}</span>}
                <span className="font-display text-[72px] leading-none">€{p.price}</span>
              </p>
              <p className="mt-1 font-ui text-[13px] font-bold uppercase text-ink/60">{t.once}</p>
              <p className="mt-4 text-[18px] font-semibold text-ink">{p.text}</p>
              <ul className="mb-8 mt-3 space-y-1.5">
                {p.bullets.slice(0, 2).map((b) => <li key={b} className="text-[16px] font-medium text-ink/75">→ {b}</li>)}
              </ul>
              <Button href={waLink(t.waText)} external variant={i === 1 ? "primary" : "outline"} className="mt-auto w-full">{all.ui.meet}</Button>
            </motion.div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] font-medium text-body/70">{t.note}</p>
      </div>
    </section>
  );
};
