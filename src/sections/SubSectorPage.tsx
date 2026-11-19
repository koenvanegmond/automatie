import { content, type SectorKey } from "@/lib/content";
import { waLink } from "@/lib/config";
import type { SubPage } from "@/lib/md";
import { Button, TextLink } from "@/components/Buttons";
import { Markdown } from "@/components/Markdown";
import { EndCta } from "@/sections/HomeSections";

/** Branchepagina (bv. /oplossingen/kapsalon): subpagina van een groepspagina, tekst uit content/oplossingen/*.md */
export const SubSectorPage = ({ page }: { page: SubPage }) => {
  const t = content.nl;
  const parent = t.solutions[page.parent as SectorKey];
  const wa = `Hoi Appmaatje! Ik kom via de pagina ${page.name}.`;
  return (
    <>
      <section className="pb-14 pt-36 text-center md:pb-20 md:pt-44">
        <div className="container">
          <nav aria-label="Kruimelpad" className="font-ui text-[12px] font-bold uppercase text-ink/60">
            <a href={`/oplossingen/${parent.slug}`} className="hover:text-ink">{parent.name}</a> <span aria-hidden>/</span> <span className="text-ink">{page.name}</span>
          </nav>
          <p className="eyebrow mt-5">{page.name}</p>
          <h1 className="h2 mx-auto mt-5 max-w-5xl !text-[48px] md:!text-[88px]">{page.h1}</h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={waLink(wa)} external size="lg" variant="primary" arrow>{t.ui.nav.cta}</Button>
            <Button href="/kennismaken" variant="outline" size="lg">{t.ui.meet}</Button>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container">
          <div className="mx-auto max-w-[720px]">
            <Markdown>{page.body}</Markdown>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={waLink(wa)} external variant="primary" arrow>{t.ui.nav.cta}</Button>
              <Button href="/kennismaken">{t.ui.meet}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-ink bg-[#F7F7F2] py-14">
        <div className="container text-center">
          <TextLink href={`/oplossingen/${parent.slug}`}>Bekijk alles voor {parent.name.toLowerCase()}</TextLink>
        </div>
      </section>

      <EndCta />
    </>
  );
};
