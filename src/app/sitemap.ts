import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { content, sectorKeys } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/prijzen`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/kennismaken`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/veelgestelde-vragen`, lastModified: now, priority: 0.6 },
    ...sectorKeys.map((k) => ({ url: `${SITE.url}/oplossingen/${content.nl.solutions[k].slug}`, lastModified: now, priority: 0.7 })),
  ];
}
