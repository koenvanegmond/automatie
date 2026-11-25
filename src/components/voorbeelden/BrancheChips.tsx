"use client";
import { useEffect, useState } from "react";

/**
 * Chips boven de branches. Zonder JS zijn het gewone ankerlinks (#garage);
 * met JS filteren ze de secties met data-branche (en "Alle" toont alles weer).
 */
export const BrancheChips = ({ items }: { items: { slug: string; label: string; count: number }[] }) => {
  const [active, setActive] = useState("alle");

  const apply = (slug: string) => {
    setActive(slug);
    document.querySelectorAll<HTMLElement>("[data-branche]").forEach((el) => {
      el.hidden = slug !== "alle" && el.dataset.branche !== slug;
    });
  };

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (items.some((i) => i.slug === h)) apply(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chip = (on: boolean) =>
    `inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink px-4 font-ui text-[14px] font-bold uppercase transition-colors ${on ? "bg-ink text-white" : "bg-white text-ink hover:bg-mint"}`;

  return (
    <nav aria-label="Kies een branche" className="flex flex-wrap justify-center gap-2">
      <a href="#branches" aria-current={active === "alle" ? "true" : undefined} className={chip(active === "alle")}
        onClick={(e) => { e.preventDefault(); apply("alle"); history.replaceState(null, "", "#branches"); }}>
        Alle
      </a>
      {items.map((i) => (
        <a key={i.slug} href={`#${i.slug}`} aria-current={active === i.slug ? "true" : undefined} className={chip(active === i.slug)}
          onClick={(e) => { e.preventDefault(); apply(i.slug); history.replaceState(null, "", `#${i.slug}`); document.getElementById("branches")?.scrollIntoView({ block: "start" }); }}>
          {i.label} <span className={active === i.slug ? "text-white/60" : "text-ink/50"}>{i.count}</span>
        </a>
      ))}
    </nav>
  );
};
