"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button, IconButton } from "@/components/Buttons";
import { ChatSticker, CoinSticker } from "@/components/Stickers";

const ease = [0.22, 1, 0.36, 1] as const;

/** Rond logo links, pillen rechts, + opent het volledige menu (ref. screenshot) */
export const Header = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
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

  const nav = [
    { href: `/oplossingen/${t.solutions.uitzend.slug}`, label: t.ui.nav.solutions, active: path.startsWith("/oplossingen") },
    { href: "/#werkwijze", label: t.ui.nav.how, active: false },
    { href: "/prijzen", label: t.ui.nav.pricing, active: path === "/prijzen" },
    { href: "/kennismaken", label: t.ui.nav.meet, active: path === "/kennismaken" },
  ];

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-300 ${scrolled && !open ? "bg-white/90 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="flex h-[84px] items-center justify-between px-6 pt-2 md:h-[96px] md:px-10 md:pt-3">
          <a href="/" aria-label="Appmaatje home"><span className="md:hidden"><Logo mark /></span><span className="hidden md:block"><Logo /></span></a>
          <nav className="flex items-center gap-1.5">
            {nav.map((l) => (
              <span key={l.href} className="hidden lg:inline-flex">
                <Button href={l.href} size="sm" variant={l.active ? "highlight" : "outline"}>{l.label}</Button>
              </span>
            ))}
            <IconButton onClick={() => setOpen((o) => !o)} label={open ? t.ui.nav.close : t.ui.nav.menu} active={open}>
              <svg viewBox="0 0 20 20" className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-45" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M10 2v16M2 10h16" /></svg>
            </IconButton>
            <Button href={waLink(t.hero.waText)} external size="sm" variant="primary">{t.ui.nav.cta}</Button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: "circle(0% at calc(100% - 120px) 48px)" }} animate={{ clipPath: "circle(150% at calc(100% - 120px) 48px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 120px) 48px)" }} transition={{ duration: 0.65, ease }}
            className="fixed inset-0 z-[65] overflow-y-auto bg-white">
            <ChatSticker className="pointer-events-none absolute right-[8%] top-[22%] hidden w-40 rotate-6 md:block" />
            <CoinSticker className="pointer-events-none absolute bottom-[12%] right-[30%] hidden w-36 -rotate-6 md:block" />
            <div className="grid min-h-full gap-12 px-6 pb-16 pt-32 md:grid-cols-[1.3fr_1fr] md:px-14 md:pt-36">
              <nav>
                {[{ href: "/", label: "Home" }, ...nav.slice(1)].map((l, i) => (
                  <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                    className="group block w-fit font-display text-[64px] uppercase leading-[0.95] text-ink md:text-[120px]">
                    <span className="bg-[linear-gradient(#9FE0B8,#9FE0B8)] bg-[length:0%_45%] bg-[position:0_85%] bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_45%]">{l.label}</span>
                  </motion.a>
                ))}
              </nav>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="relative flex flex-col md:pt-6">
                <p className="eyebrow w-fit">{t.ui.nav.solutions}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {sectorKeys.map((k) => (
                    <span key={k} onClick={() => setOpen(false)}><Button href={`/oplossingen/${t.solutions[k].slug}`} size="md">{t.solutions[k].name}</Button></span>
                  ))}
                </div>
                <div className="mt-auto flex gap-2 pt-12">
                  {(["nl", "en"] as const).map((l) => (
                    <Button key={l} onClick={() => setLang(l)} size="md" variant={lang === l ? "primary" : "outline"}>{l === "nl" ? "Nederlands" : "English"}</Button>
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
