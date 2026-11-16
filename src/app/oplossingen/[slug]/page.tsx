import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SectorPage } from "@/sections/SectorPage";
import { content, sectorKeys, type SectorKey } from "@/lib/content";

const bySlug = (slug: string) => sectorKeys.find((k) => content.nl.solutions[k].slug === slug) as SectorKey | undefined;

export function generateStaticParams() {
  return sectorKeys.map((k) => ({ slug: content.nl.solutions[k].slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const k = bySlug(params.slug);
  if (!k) return {};
  const s = content.nl.solutions[k];
  return {
    title: `WhatsApp automatisering voor ${s.name.toLowerCase()} | Appmaatje`,
    description: `${s.title} ${s.sub}`,
    alternates: { canonical: `/oplossingen/${s.slug}` },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const k = bySlug(params.slug);
  if (!k) notFound();
  return (<><Header /><main><SectorPage k={k} /></main><Footer /></>);
}
