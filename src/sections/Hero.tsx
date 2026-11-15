"use client";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { ArrowIcon, CheckIcon } from "@/components/Icons";

const rise = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }),
};

/* Inline bewegende elementen in de kop (ref. "bring a team together") */
const Toggle = () => (
  <span aria-hidden="true" className="relative inline-flex h-[0.78em] items-center align-middle mx-[0.12em]">
    <motion.span
      className="grid h-[0.78em] w-[0.78em] place-items-center rounded-full bg-brand text-white"
      animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}>
      <ArrowIcon className="h-[0.36em] w-[0.36em]" />
    </motion.span>
    <span className="relative -ml-[0.18em] h-[0.78em] w-[1.9em] overflow-hidden rounded-full bg-gradient-to-r from-brand to-[#7CC7A0]">
      <motion.span
        className="absolute top-[0.07em] h-[0.64em] w-[0.64em] rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,.18)]"
        animate={{ left: ["0.07em", "1.19em", "1.19em", "0.07em"] }}
        transition={{ repeat: Infinity, duration: 3.2, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }}>
        <svg viewBox="0 0 24 24" className="m-auto mt-[0.16em] h-[0.32em] w-[0.32em] text-brand" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><circle cx="12" cy="12" r="7" strokeDasharray="30 14" /></svg>
      </motion.span>
    </span>
  </span>
);

const Typing = () => (
  <span aria-hidden="true" className="relative inline-flex h-[0.78em] items-center align-middle mr-[0.18em]">
    <span className="h-[0.78em] w-[0.78em] rounded-full bg-[#F2C14E]" />
    <span className="-ml-[0.2em] inline-flex h-[0.6em] items-center gap-[0.08em] rounded-full rounded-bl-[0.08em] border border-ink/10 bg-white px-[0.2em] shadow-card">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="h-[0.12em] w-[0.12em] rounded-full bg-ink/60"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} />
      ))}
    </span>
  </span>
);

const Check = () => (
  <span aria-hidden="true" className="relative inline-flex h-[0.78em] items-center align-middle ml-[0.16em]">
    <motion.span className="grid h-[0.78em] w-[0.78em] place-items-center rounded-full border-[0.05em] border-brand bg-white text-brand"
      animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
      <CheckIcon className="h-[0.42em] w-[0.42em]" />
    </motion.span>
    <span className="hidden lg:block absolute left-full top-1/2 h-[2px] w-[2.2em] bg-gradient-to-r from-brand to-transparent" />
    <motion.span className="hidden lg:block absolute top-1/2 -mt-[4px] h-2 w-2 rounded-full bg-brand"
      animate={{ left: ["100%", "300%"], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeIn" }} />
  </span>
);

export const Hero = () => {
  const t = useT();
  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
      <div className="container relative text-center">
        <motion.p variants={rise} initial="hidden" animate="show" custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-dark">
          <span className="h-2 w-2 rounded-full bg-brand" />{t.hero.eyebrow}
        </motion.p>
        <h1 className="font-display font-bold tracking-[-0.045em] text-ink leading-[1.02] text-[44px] md:text-[76px] lg:text-[100px]">
          <motion.span className="block" variants={rise} initial="hidden" animate="show" custom={0}>
            {t.hero.l1a}{" "}<Toggle />{" "}{t.hero.l1b}
          </motion.span>
          <motion.span className="block" variants={rise} initial="hidden" animate="show" custom={1}>
            <Typing />{" "}{t.hero.l2}
          </motion.span>
          <motion.span className="block" variants={rise} initial="hidden" animate="show" custom={2}>
            {t.hero.l3}{" "}<Check />
          </motion.span>
        </h1>
        <motion.p variants={rise} initial="hidden" animate="show" custom={3}
          className="mx-auto mt-8 max-w-[620px] text-lg md:text-xl leading-relaxed text-body">
          {t.hero.sub}
        </motion.p>
        <motion.div variants={rise} initial="hidden" animate="show" custom={4} className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={waLink(t.hero.waText)} target="_blank" rel="noopener" className="btn btn-primary text-base px-6 py-3">{t.hero.cta1}</a>
          <a href="#voorbeelden" className="btn btn-ghost text-base px-6 py-3 group">
            {t.hero.cta2}<ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        <motion.ul variants={rise} initial="hidden" animate="show" custom={5} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-body/80">
          {t.hero.trust.map((x) => (
            <li key={x} className="flex items-center gap-1.5"><CheckIcon className="h-4 w-4 text-brand" />{x}</li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
