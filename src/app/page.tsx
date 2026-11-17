import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Branches, Integrations, HowSection, PriceTeaser, FaqTeaser, EndCta } from "@/sections/HomeSections";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
