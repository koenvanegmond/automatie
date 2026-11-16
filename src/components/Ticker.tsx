"use client";
import { useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";

/** Doorlopende aankondigingsband (ref. slush.app) */
export const Ticker = () => {
  const t = useT();
  const msg = t.pilot.title;
  const items = Array.from({ length: 10 });
  return (
    <a href={waLink(t.pilot.waText)} target="_blank" rel="noopener" className="group block overflow-hidden border-y-2 border-ink bg-sun py-3">
      <div className="ticker flex w-max gap-10 font-ui text-[14px] font-bold uppercase tracking-[0.02em] text-ink">
        {[...items, ...items].map((_, i) => (
          <span key={i} className="flex items-center gap-10">{msg}<span aria-hidden>✦</span></span>
        ))}
      </div>
    </a>
  );
};
