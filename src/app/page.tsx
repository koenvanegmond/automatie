import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Calculator, Branches, Integrations, HowSection, PriceTeaser, FaqTeaser, EndCta } from "@/sections/HomeSections";
import { PixelWipe } from "@/components/PixelWipe";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";

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
