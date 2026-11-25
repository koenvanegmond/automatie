import data from "../../content/voorbeelden.json";

/**
 * Voorbeeldgesprekken (content/voorbeelden.json). Teksten staan er letterlijk in; hier alleen types en helpers.
 * Alle bedrijven en namen in de voorbeelden zijn verzonnen.
 */

export type Element =
  | { type: "knoppen"; knoppen: string[] }
  | { type: "knopantwoord" }
  | { type: "lijst"; knop: string; opties: string[] }
  | { type: "foto"; beschrijving: string }
  | { type: "document"; bestandsnaam: string }
  | { type: "locatie"; naam: string; adres: string }
  | { type: "link"; soort: string; label: string }
  | { type: "knop_bellen"; label: string }
  | { type: "formulier"; velden: string[] };

export type Bericht = {
  van: "bedrijf" | "klant";
  tijd: string;
  tekst: string;
  dag?: string;
  sjabloon?: boolean;
  onderwerp?: string;
  element?: Element;
  element_extra?: Element;
};

export type Moment = {
  titel: string;
  slug: string;
  bedrijf: string;
  kanaal: "whatsapp" | "email";
  tags: string[];
  opt_in: string;
  berichten: Bericht[];
  achter_de_schermen: string;
  zonder_appmaatje: string;
  link: string;
  top6: boolean;
  top6_waarom?: string;
};

export type Branche = { branche: string; slug: string; momenten: Moment[] };

export const branches = data as unknown as Branche[];

export const allMomenten = (): Moment[] => branches.flatMap((b) => b.momenten);

export const getMoment = (slug: string) => allMomenten().find((m) => m.slug === slug);

export const brancheOf = (slug: string) => branches.find((b) => b.momenten.some((m) => m.slug === slug));

/** Volgorde zoals in onderzoek.md (top 6 voor in een mail). */
const TOP6_ORDER = [
  "installateur-workmate-werkbon",
  "installateur-eenmanszaak-storing",
  "garage-auto-klaar",
  "dakdekker-offerte-fotos",
  "garage-apk-herinnering",
  "fysio-wachtlijst",
];
export const top6 = (): Moment[] => {
  const all = allMomenten().filter((m) => m.top6);
  const rank = (s: string) => (TOP6_ORDER.indexOf(s) + 1 || 99);
  return all.sort((a, b) => rank(a.slug) - rank(b.slug));
};

export const pick = (slugs: string[]): Moment[] => slugs.map(getMoment).filter((m): m is Moment => !!m);

/** Korte, gewone branchenaam voor chips en koppen. */
export const BRANCHE_LABEL: Record<string, string> = {
  installateur: "Installateur",
  garage: "Garage",
  kapper: "Kapper",
  fysio: "Fysio",
  makelaar: "Makelaar",
  restaurant: "Restaurant",
  dakdekker: "Dakdekker",
};

/** Bedrijfsnaam zonder labels als "(eenmanszaak)". */
export const displayName = (bedrijf: string) => bedrijf.replace(/\s*\([^)]*\)\s*$/, "").trim();

const STOP = new Set(["de", "het", "van", "en"]);
export const initials = (bedrijf: string) => {
  const words = displayName(bedrijf).split(/\s+/).filter((w) => !STOP.has(w.toLowerCase()));
  if (words.length === 0) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
};

/** Welk icoon past bij het achter-de-schermen-effect. */
export type SceneIcon = "werkbon" | "agenda" | "lijst" | "ster" | "huis";
export const sceneIcon = (m: Moment): SceneIcon => {
  const t = m.achter_de_schermen.toLowerCase();
  if (/werkbon|workmate|offerte/.test(t)) return "werkbon";
  if (/review/.test(t)) return "ster";
  if (/agenda|ingepland|planning|rooster|reservering/.test(t)) return "agenda";
  if (/wachtlijst|lijst/.test(t)) return "lijst";
  return "agenda";
};

/** Welke voorbeelden op welke branche- of groepspagina staan. */
export const PAGE_EXAMPLES: Record<string, string[]> = {
  installateur: ["installateur-workmate-werkbon", "installateur-eenmanszaak-storing", "installateur-onderhoud-plannen"],
  garage: ["garage-auto-klaar", "garage-apk-herinnering", "garage-vraag-na-sluiting"],
  kapsalon: ["kapper-afspraak", "kapper-herinnering-verzetten", "kapper-nazorg-review"],
  makelaar: ["makelaar-bezichtiging", "makelaar-opvolgen", "makelaar-update-verkoper"],
  // Groepspagina's (SectorKey)
  service: ["restaurant-groep", "restaurant-wachtlijst", "kapper-herinnering-verzetten"],
  techniek: ["installateur-eenmanszaak-storing", "garage-auto-klaar", "dakdekker-offerte-fotos"],
  advies: ["makelaar-bezichtiging", "makelaar-opvolgen", "makelaar-update-verkoper"],
};
