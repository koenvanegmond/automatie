import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { BeforeAfter } from "@/sections/BeforeAfter";
import { Examples } from "@/sections/Examples";
import { HowItWorks } from "@/sections/HowItWorks";
import { Pilot } from "@/sections/Pilot";
import { Pricing } from "@/sections/Pricing";
import { Faq } from "@/sections/Faq";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import { Intro } from "@/components/intro/Intro";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BeforeAfter />
        <Examples />
        <HowItWorks />
        <Pilot />
        <Pricing />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
      <Intro />
    </>
  );
}
