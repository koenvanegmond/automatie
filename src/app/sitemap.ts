import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { content, sectorKeys } from "@/lib/content";
import { subPages, visiblePosts } from "@/lib/md";

// Elk uur opnieuw opbouwen, zodat blogposts op hun publicatiedatum vanzelf in de sitemap komen.
export const revalidate = 3600;

// Datum van de laatste echte inhoudswijziging (niet de build-tijd). Pas aan als een pagina inhoudelijk verandert.
const UPDATED = new Date("2026-11-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = visiblePosts();
  const latestPost = posts[0] ? new Date(posts[0].date) : UPDATED;
  return [
    { url: SITE.url, lastModified: UPDATED, priority: 1 },
    { url: `${SITE.url}/prijzen`, lastModified: UPDATED, priority: 0.8 },
    { url: `${SITE.url}/kennismaken`, lastModified: UPDATED, priority: 0.8 },
    { url: `${SITE.url}/veelgestelde-vragen`, lastModified: UPDATED, priority: 0.6 },
    ...sectorKeys.map((k) => ({ url: `${SITE.url}/oplossingen/${content.nl.solutions[k].slug}`, lastModified: UPDATED, priority: 0.7 })),
    ...subPages().map((s) => ({ url: `${SITE.url}/oplossingen/${s.slug}`, lastModified: UPDATED, priority: 0.7 })),
    { url: `${SITE.url}/blog`, lastModified: latestPost > UPDATED ? latestPost : UPDATED, priority: 0.6 },
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
