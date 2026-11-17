import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Faq } from "@/sections/Faq";
import { EndCta } from "@/sections/HomeSections";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Veelgestelde vragen over WhatsApp-automatisering | Appmaatje",
  description: "Antwoorden over prijs, snelheid, koppelingen, privacy en kennismaken. Kort en duidelijk.",
  alternates: { canonical: "/veelgestelde-vragen" },
};

export default function FaqPage() {
  return (<><Header /><main><Faq page /><EndCta /></main><Footer /></>);
}
