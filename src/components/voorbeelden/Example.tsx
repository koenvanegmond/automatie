import type { Moment } from "@/lib/voorbeelden";
import { BRANCHE_LABEL, brancheOf, sceneIcon } from "@/lib/voorbeelden";
import { ChatMockup } from "./ChatMockup";
import { SceneArt } from "./Art";

/** Het aha-moment: wat er in het systeem gebeurde zonder dat iemand iets typte. */
export const BehindScenes = ({ moment, large = false }: { moment: Moment; large?: boolean }) => (
  <div className={`relative rounded-[24px] border-2 border-ink bg-sun ${large ? "p-6 md:p-8" : "p-5"}`}>
    <div className="flex items-center gap-3">
      <span className={`grid shrink-0 place-items-center rounded-full border-2 border-ink bg-white ${large ? "h-14 w-14" : "h-12 w-12"}`}>
        <SceneArt kind={sceneIcon(moment)} className={large ? "h-9 w-9" : "h-8 w-8"} />
      </span>
      <p className={`font-display uppercase leading-[0.95] text-ink ${large ? "text-[30px] md:text-[36px]" : "text-[26px]"}`}>Achter de schermen</p>
    </div>
    <p className={`mt-3 text-ink ${large ? "text-[18px] leading-[1.5] md:text-[19px]" : "text-[16px] leading-[1.5]"}`}>{moment.achter_de_schermen}</p>
  </div>
);

export const Without = ({ moment, large = false }: { moment: Moment; large?: boolean }) => (
  <p className={`border-l-[3px] border-ink/20 pl-3 text-body/80 ${large ? "text-[17px] leading-[1.5]" : "text-[15px] leading-[1.5]"}`}>
    <span className="font-bold text-ink/80">Zonder Appmaatje: </span>
    {moment.zonder_appmaatje}
  </p>
);

export const Disclaimer = ({ className = "" }: { className?: string }) => (
  <p className={`text-[14px] font-medium text-body/70 ${className}`}>Voorbeelden met verzonnen namen.</p>
);

/** Eén voorbeeld in een raster: titel, gesprek, achter de schermen, zonder Appmaatje. */
export const ExampleCard = ({ moment, showBranche = false, as: H = "h3" }: { moment: Moment; showBranche?: boolean; as?: "h2" | "h3" | "h4" }) => {
  const b = brancheOf(moment.slug);
  return (
    <article className="flex flex-col gap-4">
      <div>
        {showBranche && b && <p className="font-ui text-[12px] font-bold uppercase tracking-[0.02em] text-ink/60">{BRANCHE_LABEL[b.slug] ?? b.branche}{moment.kanaal === "email" ? " · per mail" : ""}</p>}
        <H className="mt-1 text-[22px] font-bold leading-[1.15] tracking-[-0.015em] text-ink">
          <a href={moment.link} className="underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-brand">{moment.titel}</a>
        </H>
      </div>
      <ChatMockup moment={moment} />
      <BehindScenes moment={moment} />
      <Without moment={moment} />
      <a href={moment.link} className="group inline-flex w-fit items-center gap-2 font-ui text-[14px] font-bold uppercase text-ink underline decoration-brand decoration-2 underline-offset-[6px] hover:decoration-ink">
        Bekijk dit voorbeeld <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
};

export const ExampleGrid = ({ moments, showBranche = false, as = "h3" }: { moments: Moment[]; showBranche?: boolean; as?: "h3" | "h4" }) => (
  <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
    {moments.map((m) => <ExampleCard key={m.slug} moment={m} showBranche={showBranche} as={as} />)}
  </div>
);

/** Blok voor branche- en groepspagina's: 2-3 voorbeelden + link naar alle voorbeelden. */
export const ExamplesSection = ({ moments, title = "Zo ziet dat eruit", bg = "bg-[#F7F7F2]" }: { moments: Moment[]; title?: string; bg?: string }) => (
  <section className={`border-y-2 border-ink ${bg} py-20 md:py-28`}>
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Voorbeelden</p>
        <h2 className="h2 mt-5 !text-[48px] md:!text-[80px]">{title}</h2>
        <p className="sub mx-auto mt-4 max-w-2xl">Links de klant, rechts jouw zaak. Daaronder wat er vanzelf gebeurt.</p>
      </div>
      <div className="mt-14"><ExampleGrid moments={moments} /></div>
      <div className="mt-14 flex flex-col items-center gap-3 text-center">
        <a href="/voorbeelden" className="group inline-flex items-center gap-2 font-ui text-[15px] font-bold uppercase text-ink underline decoration-brand decoration-2 underline-offset-[6px] hover:decoration-ink">
          Bekijk alle voorbeelden <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <Disclaimer />
      </div>
    </div>
  </section>
);
