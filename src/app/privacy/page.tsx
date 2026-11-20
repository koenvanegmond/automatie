import { pageMeta } from "@/lib/seo";
import { Header } from "@/sections/Header";
import { PrivacyPage } from "@/sections/PrivacyPage";
import { Footer } from "@/sections/Footer";

export const metadata = pageMeta({
  path: "/privacy",
  title: "Privacyverklaring | Appmaatje",
  description: "Hoe Appmaatje omgaat met je persoonsgegevens: welke gegevens we verwerken, waarvoor, en welke rechten je hebt.",
});

export default function PrivacyRoute() {
  return (<><Header /><main><PrivacyPage /></main><Footer /></>);
}
