import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Problem, Branches, Integrations, HowSection, PriceTeaser, EndCta } from "@/sections/HomeSections";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";
import { PixelWipe } from "@/components/PixelWipe";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PixelWipe from="#FFFFFF" to="#0E1110" />
        <Problem />
        <PixelWipe from="#0E1110" to="#FFFFFF" />
        <Branches />
      <Integrations />
        <HowSection />
        <PriceTeaser />
        <EndCta />
      </main>
      <Footer />
      <Intro />
    </>
  );
}
