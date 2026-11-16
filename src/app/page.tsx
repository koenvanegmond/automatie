import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Problem, SectorTiles, HowSection, PriceTeaser, EndCta } from "@/sections/HomeSections";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <SectorTiles />
        <HowSection />
        <PriceTeaser />
        <EndCta />
      </main>
      <Footer />
      <Intro />
    </>
  );
}
