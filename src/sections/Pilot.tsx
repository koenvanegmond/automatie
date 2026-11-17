"use client";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { BellSticker } from "@/components/Stickers";

export const Pilot = () => {
  const t = useT();
  return (
    <section className="pb-10">
      <div className="container">
        <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[28px] border-2 border-ink bg-sun px-8 py-12 md:flex-row md:items-center md:px-14">
          <BellSticker className="pointer-events-none absolute -right-2 -top-6 hidden w-24 rotate-12 md:block" />
          <div>
            <h2 className="font-display text-[44px] uppercase leading-[0.92] text-ink md:text-[64px]">{t.pilot.title}</h2>
            <p className="sub mt-3">{t.pilot.text}</p>
          </div>
          <Button href={waLink(t.pilot.waText)} external size="lg" variant="primary" arrow>{t.ui.pilotCta}</Button>
        </div>
      </div>
    </section>
  );
};
