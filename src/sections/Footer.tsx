"use client";
import { Logo } from "@/components/Logo";
import { useLang, useT } from "@/lib/i18n";
import { sectorKeys } from "@/lib/content";

export const Footer = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const col = "text-[13px] text-body/80 hover:text-ink transition-colors";
  return (
    <footer className="bg-sand pt-14 text-[13px]">
      <div className="container">
        <div className="grid gap-10 border-b border-black/[0.08] pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 text-body/80">{t.footer.tagline}</p>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-ink">{t.ui.nav.solutions}</p>
            {sectorKeys.map((k) => <a key={k} href={`/oplossingen/${t.solutions[k].slug}`} className={`block ${col}`}>{t.solutions[k].name}</a>)}
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-ink">Appmaatje</p>
            <a href="/#werkwijze" className={`block ${col}`}>{t.ui.nav.how}</a>
            <a href="/prijzen" className={`block ${col}`}>{t.ui.nav.pricing}</a>
            <a href="/kennismaken" className={`block ${col}`}>{t.ui.nav.meet}</a>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-ink">{lang === "nl" ? "Taal" : "Language"}</p>
            <button onClick={() => setLang("nl")} className={`block ${col} ${lang === "nl" ? "!text-ink" : ""}`}>Nederlands</button>
            <button onClick={() => setLang("en")} className={`block ${col} ${lang === "en" ? "!text-ink" : ""}`}>English</button>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-6 text-body/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Appmaatje. {t.footer.rights}</p>
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
};
