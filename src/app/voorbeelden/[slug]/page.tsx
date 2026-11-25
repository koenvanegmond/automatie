import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Button } from "@/components/Buttons";
import { pageMeta } from "@/lib/seo";
import { BRANCHE_LABEL, allMomenten, brancheOf, displayName, getMoment } from "@/lib/voorbeelden";
import { ChatMockup } from "@/components/voorbeelden/ChatMockup";
import { BehindScenes, Without } from "@/components/voorbeelden/Example";

export const dynamicParams = false;

const clip = (s: string, max = 158) => (s.length <= max ? s : s.slice(0, max).replace(/\s+\S*$/, "") + "…");

export function generateStaticParams() {
  return allMomenten().map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = getMoment(params.slug);
  if (!m) return {};
  const b = brancheOf(m.slug);
  const label = b ? BRANCHE_LABEL[b.slug] ?? b.branche : "";
  const kanaal = m.kanaal === "email" ? "per mail" : "via WhatsApp";
  return pageMeta({
    path: `/voorbeelden/${m.slug}`,
    title: `${m.titel} | Voorbeeld ${label.toLowerCase()} | Appmaatje`,
    description: clip(`Voorbeeldgesprek ${kanaal} voor een ${label.toLowerCase()}, met wat er achter de schermen gebeurt. ${m.achter_de_schermen}`),
    image: { url: `/voorbeelden/${m.slug}/opengraph-image`, alt: `Voorbeeldgesprek: ${m.titel}` },
  });
}

export default function VoorbeeldPage({ params }: { params: { slug: string } }) {
  const m = getMoment(params.slug);
  if (!m) notFound();
  const b = brancheOf(m.slug);
  const label = b ? BRANCHE_LABEL[b.slug] ?? b.branche : "";
  const others = (b?.momenten ?? []).filter((o) => o.slug !== m.slug);
  const isMail = m.kanaal === "email";

  return (
    <>
      <Header />
      <main>
        <section className="pb-10 pt-36 text-center md:pb-14 md:pt-44">
          <div className="container">
            <nav aria-label="Kruimelpad" className="font-ui text-[12px] font-bold uppercase text-ink/60">
              <a href="/voorbeelden" className="hover:text-ink">Voorbeelden</a> <span aria-hidden>/</span>{" "}
              <a href={`/voorbeelden#${b?.slug ?? ""}`} className="hover:text-ink">{label}</a>
            </nav>
            <p className="eyebrow mt-5">{label}{isMail ? " · per mail" : " · WhatsApp"}</p>
            <h1 className="h2 mx-auto mt-5 max-w-4xl !text-[44px] md:!text-[80px]">{m.titel}</h1>
            <p className="mt-4 text-[17px] text-body/80">{displayName(m.bedrijf)} <span aria-hidden>·</span> <span>Voorbeelden met verzonnen namen.</span></p>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className={`container grid items-start gap-10 lg:gap-16 ${isMail ? "lg:grid-cols-[minmax(0,560px)_minmax(0,560px)]" : "lg:grid-cols-[380px_minmax(0,620px)]"} lg:justify-center`}>
            <ChatMockup moment={m} />
            <div className="flex max-w-[620px] flex-col gap-6 lg:sticky lg:top-28">
              <BehindScenes moment={m} large />
              <Without moment={m} large />
              <p className="text-[15px] leading-[1.5] text-body/70"><span className="font-bold text-ink/70">Toestemming: </span>{m.opt_in}</p>
              <div className="rounded-[24px] border-2 border-ink bg-mint p-6 md:p-7">
                <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-ink md:text-[26px]">Zo&apos;n voorbeeld voor jouw zaak?</p>
                <p className="mt-2 text-[17px] text-ink/80">In een gratis kennismaking kijken we welke berichten jij nu zelf typt.</p>
                <div className="mt-5"><Button href="/kennismaken" variant="primary" arrow>Plan een kennismaking</Button></div>
              </div>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="border-t-2 border-ink bg-[#F7F7F2] py-16 md:py-20">
            <div className="container">
              <h2 className="text-center font-display text-[34px] uppercase leading-[0.95] text-ink md:text-[48px]">Meer voor {label.toLowerCase()}</h2>
              <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
                {others.map((o) => (
                  <a key={o.slug} href={o.link} className="group flex items-center justify-between gap-4 rounded-[24px] border-2 border-ink bg-white px-6 py-5 transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110]">
                    <span className="text-[19px] font-bold leading-tight text-ink">{o.titel}</span>
                    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint text-ink transition-transform group-hover:translate-x-1">→</span>
                  </a>
                ))}
              </div>
              <div className="mt-10 text-center">
                <a href="/voorbeelden" className="group inline-flex items-center gap-2 font-ui text-[15px] font-bold uppercase text-ink underline decoration-brand decoration-2 underline-offset-[6px] hover:decoration-ink">
                  Bekijk alle voorbeelden <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
