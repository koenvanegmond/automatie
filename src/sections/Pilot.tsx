"use client";
import { useT } from "@/lib/i18n";
import { SITE, waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";

export const Pilot = () => {
  const t = useT();
  return (
    <section className="py-10">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 rounded-none bg-ink px-8 py-12 md:flex-row md:items-center md:px-14 md:py-16">
          <div>
            <h2 className="font-display text-[34px] font-black leading-[1.08] tracking-[-0.03em] text-white md:text-[48px]">{t.pilot.title}</h2>
            <p className="mt-3 text-[17px] text-white/65">{t.pilot.text}{SITE.pilotPartner && <> · {t.pilot.partner} {SITE.pilotPartner}</>}</p>
          </div>
          <Button href={waLink(t.pilot.waText)} external size="lg">{t.ui.pilotCta}</Button>
        </div>
      </div>
    </section>
  );
};
