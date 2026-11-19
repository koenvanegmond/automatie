import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Calculator, Branches, Integrations, HowSection, PriceTeaser, FaqTeaser, EndCta } from "@/sections/HomeSections";
import { PixelWipe } from "@/components/PixelWipe";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/",
  title: "WhatsApp-automatisering Katwijk–Leiden–Den Haag | Appmaatje",
  description: "WhatsApp-automatisering op maat voor ondernemers in Katwijk, Leiden en Den Haag. Afspraken, herinneringen en vragen lopen vanzelf. Eerst een offerte.",
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PixelWipe from="#FFFFFF" to="#0E1110" />
        <Calculator />
        <PixelWipe from="#0E1110" to="#FFFFFF" />
        <Branches />
      <Integrations />
        <HowSection />
        <PriceTeaser />
        <FaqTeaser />
      <EndCta />
      </main>
      <Footer />
      <Intro />
    </>
  );
}
