"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";

export const Header = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [flyout, setFlyout] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 8);
      const hero = document.querySelector<HTMLElement>("[data-theme='dark']");
      setOnDark(!!hero && window.scrollY < hero.offsetHeight - 64);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const dark = onDark && !menu;
  const link = `py-2 text-[15px] tracking-[-0.01em] transition-colors ${dark ? "text-white/75 hover:text-white" : "text-ink/75 hover:text-ink"}`;
  const other = lang === "nl" ? "en" : "nl";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${dark
      ? scrolled ? "bg-ink/60 backdrop-blur-[20px] backdrop-saturate-[180%]" : "bg-transparent"
      : `bg-white/75 backdrop-blur-[20px] backdrop-saturate-[180%] ${scrolled ? "border-b border-black/[0.06]" : ""}`}`}>
      <div className="container flex h-14 items-center justify-between md:h-16">
        <a href="/" aria-label="Appmaatje home"><Logo light={dark} /></a>

        <nav className="hidden items-center gap-9 md:flex">
          <div className="relative" onMouseEnter={() => setFlyout(true)} onMouseLeave={() => setFlyout(false)}>
            <button className={`${link} inline-flex items-center gap-1`} aria-expanded={flyout} onClick={() => setFlyout((f) => !f)}>
              {t.ui.nav.solutions}
              <svg viewBox="0 0 12 8" className={`h-2 w-2.5 transition-transform ${flyout ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 1.5l5 5 5-5" /></svg>
            </button>
            <AnimatePresence>
              {flyout && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/95 p-2 shadow-[0_24px_60px_-20px_rgba(14,17,16,.3)] backdrop-blur-xl">
                    {sectorKeys.map((k) => (
                      <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-sand">
                        <span className="block text-[15px] font-medium text-ink">{t.solutions[k].name}</span>
                        <span className="block text-[13px] text-body/80">{t.solutions[k].tile}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="/#werkwijze" className={link}>{t.ui.nav.how}</a>
          <a href="/prijzen" className={link}>{t.ui.nav.pricing}</a>
          <a href="/kennismaken" className={link}>{t.ui.nav.meet}</a>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setLang(other)} aria-label={other === "en" ? "Switch to English" : "Naar Nederlands"}
            className={`hidden text-[14px] uppercase transition-colors md:block ${dark ? "text-white/60 hover:text-white" : "text-ink/55 hover:text-ink"}`}>
            {other}
          </button>
          <Button href={waLink(t.hero.waText)} external size="sm">{t.ui.nav.cta}</Button>
          <button onClick={() => setMenu((m) => !m)} aria-label={menu ? t.ui.nav.close : t.ui.nav.menu} aria-expanded={menu}
            className={`relative h-9 w-9 md:hidden ${dark ? "text-white" : "text-ink"}`}>
            <span className={`absolute left-2 right-2 h-[1.5px] bg-current transition-transform duration-300 ${menu ? "top-1/2 rotate-45" : "top-[14px]"}`} />
            <span className={`absolute left-2 right-2 h-[1.5px] bg-current transition-transform duration-300 ${menu ? "top-1/2 -rotate-45" : "top-[21px]"}`} />
          </button>
        </div>
      </div>

      {/* mobiel menu */}
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-14 flex flex-col bg-white px-6 pb-8 pt-6 md:hidden">
            <nav className="space-y-3">
              {[
                { href: "/#werkwijze", label: t.ui.nav.how },
                { href: "/prijzen", label: t.ui.nav.pricing },
                { href: "/kennismaken", label: t.ui.nav.meet },
              ].map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={() => setMenu(false)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="block font-display text-[28px] font-medium tracking-[-0.02em] text-ink">{l.label}</motion.a>
              ))}
              <p className="pt-4 text-[13px] text-body/60">{t.ui.nav.solutions}</p>
              {sectorKeys.map((k) => (
                <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} onClick={() => setMenu(false)} className="block text-[19px] text-ink">{t.solutions[k].name}</a>
              ))}
            </nav>
            <div className="mt-auto space-y-4">
              <Button href={waLink(t.hero.waText)} external size="lg" className="w-full">{t.ui.nav.cta}</Button>
              <button onClick={() => setLang(other)} className="w-full text-center text-[15px] text-body">{other === "en" ? "English" : "Nederlands"}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
