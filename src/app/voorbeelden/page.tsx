import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { EndCta } from "@/sections/HomeSections";
import { pageMeta } from "@/lib/seo";
import { BRANCHE_LABEL, branches, top6 } from "@/lib/voorbeelden";
import { Disclaimer, ExampleGrid } from "@/components/voorbeelden/Example";
import { BrancheChips } from "@/components/voorbeelden/BrancheChips";

export const metadata = pageMeta({
  path: "/voorbeelden",
  title: "Voorbeelden: zo ziet WhatsApp-automatisering eruit | Appmaatje",
  description:
    "Echte gesprekken, verzonnen namen. Zie per branche wat de klant op WhatsApp ziet en wat er achter de schermen vanzelf gebeurt: agenda, werkbon, betaallink.",
});

export default function VoorbeeldenPage() {
  const chips = branches.map((b) => ({ slug: b.slug, label: BRANCHE_LABEL[b.slug] ?? b.branche, count: b.momenten.length }));
  return (
    <>
      <Header />
      <main>
        <section className="pb-14 pt-36 text-center md:pb-20 md:pt-44">
          <div className="container">
            <p className="eyebrow">Voorbeelden</p>
            <h1 className="h2 mx-auto mt-5 max-w-5xl !text-[56px] md:!text-[96px]">Zo ziet het eruit.</h1>
            <p className="lead mx-auto mt-5 max-w-2xl">Wat je klant op zijn telefoon ziet, en wat er ondertussen in jouw agenda of werkbon gebeurt. Zonder dat jij iets typt.</p>
            <Disclaimer className="mt-5" />
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container">
            <h2 className="mb-12 text-center font-display text-[40px] uppercase leading-[0.95] text-ink md:text-[64px]">De 6 sterkste</h2>
            <ExampleGrid moments={top6()} showBranche />
          </div>
        </section>

        <section id="branches" className="scroll-mt-28 border-t-2 border-ink bg-[#F7F7F2] py-20 md:py-28">
          <div className="container">
            <h2 className="text-center font-display text-[40px] uppercase leading-[0.95] text-ink md:text-[64px]">Per branche</h2>
            <div className="mt-8"><BrancheChips items={chips} /></div>
            {branches.map((b) => (
              <div key={b.slug} id={b.slug} data-branche={b.slug} className="scroll-mt-28 pt-16 md:pt-20">
                <h3 className="mb-10 font-display text-[34px] uppercase leading-[0.95] text-ink md:text-[48px]">{b.branche}</h3>
                <ExampleGrid moments={b.momenten} as="h4" />
              </div>
            ))}
            <Disclaimer className="mt-16 text-center" />
          </div>
        </section>

        <EndCta />
      </main>
      <Footer />
    </>
  );
}
