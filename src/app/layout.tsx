import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { content } from "@/lib/content";
import { SITE } from "@/lib/config";

const raveo = localFont({
  src: [
    { path: "../fonts/Raveo-Regular.woff2", weight: "400" },
    { path: "../fonts/Raveo-Medium.woff2", weight: "500" },
    { path: "../fonts/Raveo-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-raveo",
  display: "swap",
});
const raveoDisplay = localFont({
  src: [
    { path: "../fonts/RaveoDisplay-Medium.woff2", weight: "500" },
    { path: "../fonts/RaveoDisplay-SemiBold.woff2", weight: "600" },
    { path: "../fonts/RaveoDisplay-Bold.woff2", weight: "700" },
  ],
  variable: "--font-raveo-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "WhatsApp automatisering voor het mkb | Appmaat Den Haag",
  description:
    "WhatsApp automatisering en chatbots op maat voor het mkb in Den Haag en omgeving. Afspraken, roosters en klantvragen automatisch. Vaak binnen 2 dagen live.",
  openGraph: {
    title: "Appmaat | WhatsApp automatisering op maat",
    description: "Laat WhatsApp het werk doen. Op maat gebouwd, vaak binnen 2 dagen live.",
    locale: "nl_NL",
    url: "/",
    siteName: "Appmaat",
    type: "website",
  },
  alternates: { canonical: "/" },
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
  name: "Appmaat",
  url: SITE.url,
  description: "WhatsApp automatisering en chatbots op maat voor het mkb.",
  areaServed: [{ "@type": "City", name: "Den Haag" }, { "@type": "Country", name: "Nederland" }],
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
        <noscript><style>{`#intro{display:none!important}`}</style></noscript>
      </head>
      <body className={`${raveo.variable} ${raveoDisplay.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, faqJsonLd]) }} />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
