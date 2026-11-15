import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { BeforeAfter } from "@/sections/BeforeAfter";
import { HowItWorks } from "@/sections/HowItWorks";
import { Sectors } from "@/sections/Sectors";
import { Hub } from "@/sections/Hub";
import { WhyUs } from "@/sections/WhyUs";
import { Pilot } from "@/sections/Pilot";
import { Pricing } from "@/sections/Pricing";
import { Faq } from "@/sections/Faq";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import { FlowLine } from "@/components/FlowLine";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FlowLine>
          <BeforeAfter />
          <HowItWorks />
          <Sectors />
          <Hub />
        </FlowLine>
        <WhyUs />
        <Pilot />
        <Pricing />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
