"use client";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";

export const Header = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 10);
      const hero = document.getElementById("top");
      setOnDark(!!hero && window.scrollY < hero.offsetHeight - 72);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["#hoe-het-werkt", t.nav.how],
    ["#voorbeelden", t.nav.examples],
    ["#prijzen", t.nav.pricing],
    ["#faq", t.nav.faq],
  ];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${onDark ? (scrolled ? "bg-ink/70 backdrop-blur-md" : "bg-transparent") : "bg-cream/80 backdrop-blur-md border-b border-ink/5"}`}>
      <div className="container flex h-[72px] items-center justify-between">
        <a href="#top" aria-label="Appmaat home"><Logo light={onDark} /></a>
        <nav className="hidden md:flex items-center gap-10">
          {links.map(([href, label]) => (
            <a key={href} href={href} className={`text-[11px] font-medium uppercase tracking-[0.22em] transition-colors ${onDark ? "text-white/60 hover:text-white" : "text-ink/70 hover:text-ink"}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className={`flex rounded-full border p-0.5 text-[11px] font-semibold uppercase tracking-wider ${onDark ? "border-white/15 bg-white/5" : "border-ink/10 bg-white"}`} role="group" aria-label="Language">
            {(["nl", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 transition-colors ${lang === l ? (onDark ? "bg-white text-ink" : "bg-ink text-white") : onDark ? "text-white/60 hover:text-white" : "text-ink/60 hover:text-ink"}`}>
                {l}
              </button>
            ))}
          </div>
          <a href={waLink(t.hero.waText)} target="_blank" rel="noopener" className="btn btn-primary !py-2 text-sm">{t.nav.cta}</a>
        </div>
      </div>
    </header>
  );
};
