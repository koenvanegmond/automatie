import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Pricing } from "@/sections/Pricing";
import { Pilot } from "@/sections/Pilot";
import { Faq } from "@/sections/Faq";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Prijzen | Appmaatje",
  description: "WhatsApp automatisering vanaf €300 eenmalig. Heldere prijzen, offerte vooraf. Eerste 5 bedrijven 50% korting.",
  alternates: { canonical: "/prijzen" },
};

export default function PrijzenPage() {
  return (
    <>
      <Header />
      <main>
        <Pricing />
        <Pilot />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
