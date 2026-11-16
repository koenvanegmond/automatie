"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";

const ease = [0.22, 1, 0.36, 1] as const;

/** Menu-blok linksboven, logo in het midden, App ons rechts. Het menu opent schermvullend. */
export const Header = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 8);
      const hero = document.querySelector<HTMLElement>("[data-theme='dark']");
      setOnDark(!!hero && window.scrollY < hero.offsetHeight - 72);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = onDark || open;
  const main = [
    { href: "/", label: lang === "nl" ? "Home" : "Home" },
    { href: "/#werkwijze", label: t.ui.nav.how },
    { href: "/prijzen", label: t.ui.nav.pricing },
    { href: "/kennismaken", label: t.ui.nav.meet },
  ];

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-300 ${open ? "bg-transparent" : dark ? (scrolled ? "bg-ink/80 backdrop-blur-xl" : "bg-transparent") : "bg-white/85 backdrop-blur-xl"}`}>
        <div className="container grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.ui.nav.close : t.ui.nav.menu}
            className={`group flex h-11 w-fit items-center gap-3 pl-3 pr-4 font-display text-[16px] font-extrabold tracking-[-0.01em] transition-colors active:scale-[0.97] ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}>
            <span className="relative block h-3 w-[18px]">
              <span className={`absolute left-0 right-0 h-[2.5px] bg-current transition-all duration-300 ${open ? "top-[5px] rotate-45" : "top-0 group-hover:right-1"}`} />
              <span className={`absolute left-0 right-0 h-[2.5px] bg-current transition-all duration-300 ${open ? "top-[5px] -rotate-45" : "top-[9.5px]"}`} />
            </span>
            {open ? t.ui.nav.close : t.ui.nav.menu}
          </button>
          <a href="/" aria-label="Appmaatje home" className="justify-self-center"><Logo light={dark} /></a>
          <div className="justify-self-end">
            <Button href={waLink(t.hero.waText)} external size="sm">{t.ui.nav.cta}</Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }} className="fixed inset-0 z-[55] overflow-y-auto bg-ink text-white">
            <div className="container grid min-h-full gap-12 pb-12 pt-28 md:grid-cols-[1.4fr_1fr] md:pt-36">
              <nav>
                {main.map((l, i) => (
                  <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                    className="group relative -mx-3 flex items-center justify-between overflow-hidden px-3 py-1 font-display text-[52px] font-black leading-[1.05] tracking-[-0.05em] md:text-[96px]">
                    <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <span className="relative">{l.label}</span>
                    <span className="relative translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
                  </motion.a>
                ))}
              </nav>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col md:pt-4">
                <p className="font-display text-[15px] font-extrabold text-white/40">{t.ui.nav.solutions}</p>
                <div className="mt-4 grid gap-2">
                  {sectorKeys.map((k) => (
                    <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} onClick={() => setOpen(false)}
                      className="group bg-white/[0.06] p-5 transition-colors hover:bg-white hover:text-ink">
                      <span className="block font-display text-[24px] font-extrabold tracking-[-0.02em]">{t.solutions[k].name}</span>
                      <span className="block text-[15px] text-white/55 group-hover:text-ink/60">{t.solutions[k].tile}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-auto flex gap-2 pt-10">
                  {(["nl", "en"] as const).map((l) => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`h-12 flex-1 font-display text-[16px] font-extrabold transition-colors ${lang === l ? "bg-white text-ink" : "bg-white/[0.06] text-white/60 hover:text-white"}`}>
                      {l === "nl" ? "Nederlands" : "English"}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
