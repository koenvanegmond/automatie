"use client";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";

export const Footer = () => {
  const t = useT();
  return (
    <footer className="border-t border-ink/10 pt-12">
      <div className="container flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm">{t.footer.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <a href="#hoe-het-werkt" className="hover:text-ink">{t.nav.how}</a>
          <a href="#voorbeelden" className="hover:text-ink">{t.nav.examples}</a>
          <a href="#prijzen" className="hover:text-ink">{t.nav.pricing}</a>
          <a href="#faq" className="hover:text-ink">{t.nav.faq}</a>
        </nav>
      </div>
      <div className="container mt-10 flex flex-col gap-2 text-xs text-body/70 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Appmaat. {t.footer.rights}</p>
        <p>{t.footer.disclaimer}</p>
      </div>
      <div aria-hidden className="pointer-events-none mt-10 select-none overflow-hidden">
        <p className="bg-gradient-to-b from-brand/25 to-transparent bg-clip-text text-center font-display text-[24vw] font-medium leading-[0.8] tracking-[-0.06em] text-transparent">
          appmaat
        </p>
      </div>
    </footer>
  );
};
