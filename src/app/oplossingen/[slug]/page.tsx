import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SectorPage } from "@/sections/SectorPage";
import { SubSectorPage } from "@/sections/SubSectorPage";
import { content, sectorKeys, type SectorKey } from "@/lib/content";
import { subPages } from "@/lib/md";
import { pageMeta } from "@/lib/seo";
import { PAGE_EXAMPLES, pick } from "@/lib/voorbeelden";

const bySlug = (slug: string) => sectorKeys.find((k) => content.nl.solutions[k].slug === slug) as SectorKey | undefined;
const subBySlug = (slug: string) => subPages().find((s) => s.slug === slug);

// Alleen bekende slugs: groepspagina's + gepubliceerde branchepagina's. De rest (ook drafts) is 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...sectorKeys.map((k) => ({ slug: content.nl.solutions[k].slug })), ...subPages().map((s) => ({ slug: s.slug }))];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const k = bySlug(params.slug);
  if (k) {
    const s = content.nl.solutions[k];
    return pageMeta({ path: `/oplossingen/${s.slug}`, title: `WhatsApp automatisering voor ${s.name.toLowerCase()} | Appmaatje`, description: `${s.title} ${s.sub}` });
  }
  const sub = subBySlug(params.slug);
  if (sub) return pageMeta({ path: `/oplossingen/${sub.slug}`, title: sub.title, description: sub.description });
  return {};
}

export default function Page({ params }: { params: { slug: string } }) {
  const k = bySlug(params.slug);
  if (k) {
    const subs = subPages().filter((s) => s.parent === k).map((s) => ({ href: `/oplossingen/${s.slug}`, label: s.card }));
    return (<><Header /><main><SectorPage k={k} subs={subs} examples={pick(PAGE_EXAMPLES[k] ?? [])} /></main><Footer /></>);
  }
  const sub = subBySlug(params.slug);
  if (!sub) notFound();
  return (<><Header /><main><SubSectorPage page={sub} /></main><Footer /></>);
}
