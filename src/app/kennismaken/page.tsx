import { pageMeta } from "@/lib/seo";
import { Header } from "@/sections/Header";
import { MeetPage } from "@/sections/MeetPage";
import { Footer } from "@/sections/Footer";

export const metadata = pageMeta({
  path: "/kennismaken",
  title: "Gratis kennismaking over WhatsApp-automatisering | Appmaatje",
  description: "Gratis kennismaking, meestal online. Of app ons direct.",
});

export default function KennismakenPage() {
  return (<><Header /><main><MeetPage /></main><Footer /></>);
}
