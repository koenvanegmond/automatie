// Centrale instellingen: hier pas je nummer, partner en prijzen aan.
export const SITE = {
  name: "Appmaatje",
  url: "https://appmaatje.com",
  // TODO: vervang door het echte WhatsApp-nummer (internationaal, zonder + of spaties)
  whatsappNumber: "31622159048",
  // Pilotpartner: zet op null om te verbergen
  pilotPartner: "Stay Vastgoed" as string | null,
  // Contact- en bedrijfsgegevens voor de footer (wettelijk netjes voor een .nl-bedrijf).
  email: "info@appmaatje.com",
  // KvK-nummer (8 cijfers). Zodra dit gevuld is, toont de footer het.
  kvk: "88371808" as string | null,
  // Optioneel: btw-id (NLxxxxxxxxxB01). null = verbergen.
  btw: null as string | null,
  // HubSpot Meetings-link voor het direct plannen van een kennismaking.
  bookingUrl: "https://meetings-eu1.hubspot.com/kvan-egmond",
};

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
