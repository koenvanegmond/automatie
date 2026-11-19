import type { Metadata } from "next";
import { SITE } from "@/lib/config";

/**
 * Metadata per pagina: eigen title, description, canonical, Open Graph en Twitter.
 * Let op: zet een pagina `openGraph`, dan vervangt Next.js het hele object uit de layout.
 * Daarom vult deze helper alles opnieuw in, ook het OG-beeld (gemaakt door app/opengraph-image.tsx).
 */
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Appmaatje: WhatsApp automatisering op maat" };

export function pageMeta(opts: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = opts.path === "/" ? SITE.url : `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      locale: "nl_NL",
      type: opts.type ?? "website",
      images: [OG_IMAGE],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE.url],
    },
  };
}

/** Werkgebied (alleen voor structured data, niet als lijstje in de tekst). */
export const AREA_SERVED = ["Katwijk", "Rijnsburg", "Noordwijk", "Leiden", "Oegstgeest", "Wassenaar", "Voorschoten", "Den Haag"];

export const ORG_ID = `${SITE.url}/#organization`;

/** Veilig JSON-LD in een <script> zetten (geen `</script>` uit tekst laten ontsnappen). */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
