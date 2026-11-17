"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";

const ease = [0.22, 1, 0.36, 1] as const;
const dot: Record<string, string> = { service: "bg-mint", techniek: "bg-sun", advies: "bg-lilac", handel: "bg-white" };

/** Desktop: pillen met Oplossingen-dropdown. Mobiel: duidelijke MENU-pil met label. */
export const Header = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => { setScrolled(window.scrollY > 8); setDd(false); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setDd(false); } };
    const onClick = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDd(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, [open]);
  useEffect(() => { setOpen(false); setDd(false); }, [path]);

  const links = [
    { href: "/#werkwijze", label: t.ui.nav.how, active: false },
    { href: "/prijzen", label: t.ui.nav.pricing, active: path === "/prijzen" },
    { href: "/veelgestelde-vragen", label: t.ui.nav.faq, active: path === "/veelgestelde-vragen" },
    { href: "/kennismaken", label: t.ui.nav.meet, active: path === "/kennismaken" },
  ];
  const solActive = path.startsWith("/oplossingen");

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-300 ${scrolled && !open ? "bg-white/90 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="flex h-[84px] items-center justify-between px-5 pt-2 md:h-[96px] md:px-10 md:pt-3">
          <a href="/" aria-label="Appmaatje home"><span className="lg:hidden"><Logo mark /></span><span className="hidden lg:block"><Logo /></span></a>

          <nav className="flex items-center gap-1.5" aria-label="Hoofdmenu">
            {/* Desktop */}
            <div ref={ddRef} className="relative hidden lg:block">
              <button onClick={() => setDd((d) => !d)} aria-expanded={dd} aria-haspopup="true"
                className={`inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink px-5 font-ui text-[13px] font-bold uppercase transition-colors ${dd || solActive ? "bg-mint" : "bg-white hover:bg-mint"}`}>
                {t.ui.nav.solutions}
                <svg viewBox="0 0 12 8" className={`h-2 w-3 transition-transform ${dd ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M1 1.5l5 5 5-5" /></svg>
              </button>
              <AnimatePresence>
                {dd && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+10px)] w-[460px] rounded-[24px] border-2 border-ink bg-white p-3 shadow-[6px_6px_0_#111]">
                    {sectorKeys.map((k) => (
                      <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} className="group flex items-center gap-4 rounded-[16px] px-3 py-3 hover:bg-[#F7F7F2]">
                        <span className={`h-9 w-9 shrink-0 rounded-full border-2 border-ink ${dot[k]}`} />
                        <span>
                          <span className="block text-[17px] font-bold text-ink">{t.solutions[k].name}</span>
                          <span className="block text-[14px] font-medium text-ink/60">{t.solutions[k].covers.join(" · ")}</span>
                        </span>
                        <span className="ml-auto text-ink opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {links.map((l) => (
              <span key={l.href} className="hidden lg:inline-flex">
                <Button href={l.href} size="sm" variant={l.active ? "highlight" : "outline"}>{l.label}</Button>
              </span>
            ))}

            {/* Mobiel/tablet: gelabelde menu-knop */}
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.ui.nav.close : t.ui.nav.menu}
              className={`inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-ink px-4 font-ui text-[13px] font-bold uppercase transition-colors active:scale-[0.96] lg:hidden ${open ? "bg-ink text-white" : "bg-white text-ink"}`}>
              {open ? t.ui.nav.close : t.ui.nav.menu}
              <svg viewBox="0 0 20 14" className="h-3.5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                {open ? <path d="M3 1l14 12M17 1L3 13" /> : <path d="M1 2h18M1 7h18M1 12h18" />}
              </svg>
            </button>
            <Button href={waLink(t.hero.waText)} external size="sm" variant="primary">{t.ui.nav.cta}</Button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease }}
            className="fixed inset-0 z-[65] overflow-y-auto bg-white lg:hidden">
            <div className="px-5 pb-12 pt-28 md:px-10">
              <p className="eyebrow w-fit">{t.ui.nav.solutions}</p>
              <div className="mt-4 grid gap-2.5 md:grid-cols-2">
                {sectorKeys.map((k, i) => (
                  <motion.a key={k} href={`/oplossingen/${t.solutions[k].slug}`} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.05 }}
                    className="flex items-center gap-4 rounded-[20px] border-2 border-ink bg-white p-3.5 active:bg-mint">
                    <span className={`h-11 w-11 shrink-0 rounded-full border-2 border-ink ${dot[k]}`} />
                    <span>
                      <span className="block text-[18px] font-bold leading-tight text-ink">{t.solutions[k].name}</span>
                      <span className="block text-[13px] font-medium text-ink/60">{t.solutions[k].covers.join(" · ")}</span>
                    </span>
                    <span className="ml-auto text-[20px] text-ink">→</span>
                  </motion.a>
                ))}
              </div>
              <nav className="mt-8 border-t-2 border-ink pt-4">
                {[{ href: "/", label: "Home" }, ...links].map((l, i) => (
                  <motion.a key={l.href} href={l.href} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.04 }}
                    className="block py-1.5 font-display text-[44px] uppercase leading-[1.05] text-ink">{l.label}</motion.a>
                ))}
              </nav>
              <div className="mt-8 flex flex-wrap gap-2">
                {(["nl", "en"] as const).map((l) => (
                  <Button key={l} onClick={() => setLang(l)} size="sm" variant={lang === l ? "primary" : "outline"}>{l === "nl" ? "Nederlands" : "English"}</Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Taalkeuze desktop zit in de footer */}
    </>
  );
};
