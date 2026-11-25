"use client";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";
import { SITE } from "@/lib/config";

export const Footer = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const link = "block font-ui text-[13px] font-bold uppercase text-ink/70 hover:text-ink";
  return (
    <footer className="overflow-hidden border-t-2 border-ink bg-white pt-14">
      <div className="container">
        <div className="grid gap-10 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div><Logo /><p className="mt-3 text-[15px] font-semibold text-body/80">{t.footer.tagline}</p></div>
          <div className="space-y-2.5">{sectorKeys.map((k) => <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} className={link}>{t.solutions[k].name}</a>)}</div>
          <div className="space-y-2.5">
            <a href="/#werkwijze" className={link}>{t.ui.nav.how}</a>
            <a href="/voorbeelden" className={link}>{lang === "nl" ? "Voorbeelden" : "Examples"}</a>
            <a href="/prijzen" className={link}>{t.ui.nav.pricing}</a>
            <a href="/veelgestelde-vragen" className={link}>{t.ui.nav.faq}</a>
            <a href="/kennismaken" className={link}>{t.ui.nav.meet}</a>
            <a href="/blog" className={link}>Blog</a>
          </div>
          <div className="space-y-2.5">
            <button onClick={() => setLang("nl")} className={`${link} ${lang === "nl" ? "!text-ink underline decoration-2 underline-offset-4" : ""}`}>Nederlands</button>
            <button onClick={() => setLang("en")} className={`${link} ${lang === "en" ? "!text-ink underline decoration-2 underline-offset-4" : ""}`}>English</button>
          </div>
        </div>
        {/* Bedrijfsgegevens. Email staat er altijd; KvK/btw verschijnen zodra ze in lib/config.ts zijn ingevuld. */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t-2 border-ink pt-5 text-[13px] font-medium text-body/70">
          <a href={`mailto:${SITE.email}`} className="hover:text-ink">{SITE.email}</a>
          {SITE.kvk && <span>KvK {SITE.kvk}</span>}
          {SITE.btw && <span>Btw {SITE.btw}</span>}
          <a href="/privacy" className="hover:text-ink">Privacy</a>
        </div>
        <div className="flex flex-col gap-2 py-5 text-[13px] font-medium text-body/70 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Appmaatje. {t.footer.rights}</p>
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
      <p aria-hidden className="select-none whitespace-nowrap text-center font-display text-[20vw] uppercase leading-[0.78] text-ink">appmaatje</p>
    </footer>
  );
};
