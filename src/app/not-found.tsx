"use client";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Button } from "@/components/Buttons";
import { useLang } from "@/lib/i18n";

// Nette 404 in de huisstijl. Zonder deze pagina toont Next.js een kale standaard-404.
const copy = {
  nl: {
    title: "Pagina niet gevonden",
    sub: "Deze pagina bestaat niet (meer). Misschien is de link verouderd of verkeerd getypt.",
    home: "Naar de homepage",
    faq: "Veelgestelde vragen",
  },
  en: {
    title: "Page not found",
    sub: "This page doesn't exist (anymore). The link may be outdated or mistyped.",
    home: "Back to homepage",
    faq: "FAQ",
  },
} as const;

export default function NotFound() {
  const { lang } = useLang();
  const t = copy[lang];
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center">
        <div className="container text-center">
          <p className="font-display text-[22vw] uppercase leading-[0.8] text-ink/10 md:text-[180px]">404</p>
          <h1 className="h2 mt-2">{t.title}</h1>
          <p className="lead mx-auto mt-4 max-w-xl">{t.sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/" variant="primary" size="lg" arrow>{t.home}</Button>
            <Button href="/veelgestelde-vragen" size="lg">{t.faq}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
