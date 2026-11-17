// Centrale instellingen: hier pas je nummer, partner en prijzen aan.
export const SITE = {
  name: "Appmaatje",
  url: "https://automatie.vercel.app",
  // TODO: vervang door het echte WhatsApp-nummer (internationaal, zonder + of spaties)
  whatsappNumber: "31622159048",
  // Pilotpartner: zet op null om te verbergen
  pilotPartner: "Stay Vastgoed" as string | null,
};

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
