import { pageMeta } from "@/lib/seo";
import { Header } from "@/sections/Header";
import { Faq } from "@/sections/Faq";
import { EndCta } from "@/sections/HomeSections";
import { Footer } from "@/sections/Footer";

export const metadata = pageMeta({
  path: "/veelgestelde-vragen",
  title: "Veelgestelde vragen over WhatsApp-automatisering | Appmaatje",
  description: "Antwoorden over prijs, snelheid, koppelingen, privacy en kennismaken. Kort en duidelijk.",
});

export default function FaqPage() {
  return (<><Header /><main><Faq page /><EndCta /></main><Footer /></>);
}
