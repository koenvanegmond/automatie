import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { content } from "@/lib/content";
import { SITE } from "@/lib/config";
import { Frame } from "@/components/Frame";
import { AREA_SERVED, ORG_ID, jsonLd } from "@/lib/seo";

const zt = localFont({
  src: [
    { path: "../fonts/ZTNature-Light.woff2", weight: "300" },
    { path: "../fonts/ZTNature-Regular.woff2", weight: "400" },
    { path: "../fonts/ZTNature-Medium.woff2", weight: "500" },
    { path: "../fonts/ZTNature-SemiBold.woff2", weight: "600" },
    { path: "../fonts/ZTNature-Bold.woff2", weight: "700" },
    { path: "../fonts/ZTNature-ExtraBold.woff2", weight: "800" },
    { path: "../fonts/ZTNature-Black.woff2", weight: "900" },
  ],
  variable: "--font-zt",
  display: "swap",
});

const anton = localFont({
  src: [{ path: "../fonts/Anton-Regular.woff2", weight: "400" }],
  variable: "--font-anton",
  display: "swap",
});

// Standaardwaarden. Elke pagina zet zelf title, description, canonical, Open Graph en Twitter (zie lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "WhatsApp-automatisering Katwijk–Leiden–Den Haag | Appmaatje",
  description:
    "WhatsApp-automatisering op maat voor ondernemers in Katwijk, Leiden en Den Haag. Afspraken, herinneringen en vragen lopen vanzelf. Eerst een offerte.",
  openGraph: {
    title: "Appmaatje | WhatsApp automatisering op maat",
    description: "Laat WhatsApp het werk doen. Op maat gebouwd, binnen een week live.",
    locale: "nl_NL",
    siteName: "Appmaatje",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: content.nl.faq.items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "Appmaatje",
  url: SITE.url,
  logo: `${SITE.url}/mascot.png`,
  image: `${SITE.url}/opengraph-image`,
  email: "info@appmaatje.com",
  telephone: `+${SITE.whatsappNumber}`,
  description: "WhatsApp automatisering en chatbots op maat voor het mkb.",
  areaServed: AREA_SERVED.map((name) => ({ "@type": "City", name })),
  makesOffer: {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: "WhatsApp automatisering op maat", serviceType: "WhatsApp chatbot en automatisering" },
    priceSpecification: { "@type": "PriceSpecification", minPrice: 300, priceCurrency: "EUR" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/* Intro alleen bij eerste bezoek: verbergen vóór de eerste paint om flitsen te voorkomen */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('intro-seen'))document.documentElement.classList.add('intro-seen')}catch(e){}` }} />
        {/* Voorbeeldgesprekken: berichten pas laten binnenkomen als JS draait. Komt de app niet op gang, dan na 6 s gewoon alles tonen. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;d.classList.add('chat-js');setTimeout(function(){if(!window.__cmReady)d.classList.remove('chat-js')},6000)})()` }} />
        <noscript><style>{`#intro{display:none!important}`}</style></noscript>
      </head>
      <body className={`${zt.variable} ${anton.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([orgJsonLd, faqJsonLd]) }} />
        <LangProvider><div className="bg-white">{children}</div></LangProvider>
        <Frame />
      </body>
    </html>
  );
}
