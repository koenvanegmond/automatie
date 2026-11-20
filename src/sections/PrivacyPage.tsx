"use client";
import { Fragment, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { SITE } from "@/lib/config";

/**
 * Privacyverklaring (NL + EN). Volgt de i18n-aanpak van de site: de taal volgt uit useLang().
 * De inhoud is bewust feitelijk en voorzichtig; niets wat we niet weten.
 */
type Section = { h: string; p: string[]; list?: string[] };
type Copy = { title: string; updated: string; intro: string; sections: Section[] };

const AP_URL = "https://autoriteitpersoonsgegevens.nl";

// Vervangt {mail} en {ap} in de tekst door echte links.
function withLinks(text: string): ReactNode {
  const parts = text.split(/(\{mail\}|\{ap\})/g);
  return parts.map((part, i) => {
    if (part === "{mail}")
      return (
        <a key={i} href={`mailto:${SITE.email}`} className="font-semibold underline decoration-2 underline-offset-2 decoration-brand hover:text-ink">
          {SITE.email}
        </a>
      );
    if (part === "{ap}")
      return (
        <a key={i} href={AP_URL} target="_blank" rel="noopener" className="font-semibold underline decoration-2 underline-offset-2 decoration-brand hover:text-ink">
          autoriteitpersoonsgegevens.nl
        </a>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const nl: Copy = {
  title: "Privacyverklaring",
  updated: "Laatst bijgewerkt: 20 november 2026",
  intro:
    "Appmaatje vindt je privacy belangrijk. In deze verklaring lees je welke persoonsgegevens we verwerken, waarom we dat doen en welke rechten je hebt.",
  sections: [
    {
      h: "Wie is verantwoordelijk?",
      p: [
        "Appmaatje is verantwoordelijk voor de verwerking van je persoonsgegevens zoals beschreven in deze verklaring.",
        "Appmaatje — KvK 88371808 — e-mail {mail}.",
      ],
    },
    {
      h: "Welke gegevens verwerken we?",
      p: ["Neem je contact met ons op via het formulier op de website of via WhatsApp, dan verwerken we:"],
      list: [
        "je naam;",
        "je telefoonnummer;",
        "de inhoud van je bericht;",
        "je voorkeur voor een afspraak (bijvoorbeeld een datum of dagdeel);",
        "je toestemming (opt-in) om via WhatsApp contact met je op te nemen, met het tijdstip waarop je die gaf.",
      ],
    },
    {
      h: "Technische en functionele gegevens",
      p: [
        "We bewaren je taalkeuze in de lokale opslag van je browser, zodat de site in de taal van je voorkeur verschijnt.",
        "We gebruiken geen tracking- of analyticscookies.",
      ],
    },
    {
      h: "Waarvoor gebruiken we je gegevens?",
      p: ["We gebruiken je gegevens om contact met je op te nemen, een kennismaking te plannen en onze dienst te leveren."],
    },
    {
      h: "Op welke grondslag?",
      p: [
        "We verwerken je gegevens op basis van je toestemming en voor de uitvoering van, of de aanloop naar, een overeenkomst met jou (artikel 6 AVG).",
      ],
    },
    {
      h: "Met wie delen we je gegevens?",
      p: ["We verkopen je gegevens niet. We schakelen enkele dienstverleners in die namens ons gegevens verwerken:"],
      list: [
        "het WhatsApp Business Platform van Meta, voor het berichtenverkeer via WhatsApp;",
        "onze hostingpartner, voor het draaien van de website;",
        "HubSpot, als CRM waarin we je aanvraag en contactgegevens bijhouden.",
      ],
    },
    {
      h: "Hoe lang bewaren we je gegevens?",
      p: ["We bewaren je gegevens niet langer dan nodig is voor het contact of de opdracht. Daarna verwijderen we ze."],
    },
    {
      h: "Jouw rechten",
      p: [
        "Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen, en om bezwaar te maken tegen de verwerking. Stuur daarvoor een bericht naar {mail}.",
        "Ben je het niet eens met hoe we met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens via {ap}.",
      ],
    },
    {
      h: "Wijzigingen",
      p: [
        "We kunnen deze privacyverklaring aanpassen. De meest recente versie staat altijd op deze pagina, met de datum van de laatste wijziging bovenaan.",
      ],
    },
  ],
};

const en: Copy = {
  title: "Privacy statement",
  updated: "Last updated: 20 November 2026",
  intro:
    "Appmaatje cares about your privacy. This statement explains which personal data we process, why we do so and what rights you have.",
  sections: [
    {
      h: "Who is responsible?",
      p: [
        "Appmaatje is responsible for processing your personal data as described in this statement.",
        "Appmaatje — Chamber of Commerce (KvK) 88371808 — email {mail}.",
      ],
    },
    {
      h: "Which data do we process?",
      p: ["When you contact us through the form on the website or via WhatsApp, we process:"],
      list: [
        "your name;",
        "your phone number;",
        "the content of your message;",
        "your preference for an appointment (for example a date or part of the day);",
        "your consent (opt-in) to be contacted via WhatsApp, with the time at which you gave it.",
      ],
    },
    {
      h: "Technical and functional data",
      p: [
        "We store your language choice in your browser's local storage so the site appears in your preferred language.",
        "We do not use tracking or analytics cookies.",
      ],
    },
    {
      h: "What do we use your data for?",
      p: ["We use your data to get in touch with you, to schedule an intro and to deliver our service."],
    },
    {
      h: "On what legal basis?",
      p: [
        "We process your data on the basis of your consent and for the performance of, or steps towards, an agreement with you (Article 6 GDPR).",
      ],
    },
    {
      h: "Who do we share your data with?",
      p: ["We do not sell your data. We use a few service providers that process data on our behalf:"],
      list: [
        "Meta's WhatsApp Business Platform, for messaging via WhatsApp;",
        "our hosting partner, for running the website;",
        "HubSpot, as the CRM where we keep your request and contact details.",
      ],
    },
    {
      h: "How long do we keep your data?",
      p: ["We keep your data no longer than needed for the contact or the assignment. After that we delete it."],
    },
    {
      h: "Your rights",
      p: [
        "You have the right to access, correct or erase your data, and to object to the processing. To do so, send a message to {mail}.",
        "If you disagree with how we handle your data, you can file a complaint with the Dutch Data Protection Authority via {ap}.",
      ],
    },
    {
      h: "Changes",
      p: [
        "We may update this privacy statement. The most recent version is always on this page, with the date of the last change at the top.",
      ],
    },
  ],
};

export const PrivacyPage = () => {
  const { lang } = useLang();
  const c = lang === "en" ? en : nl;
  return (
    <section className="pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="h2">{c.title}</h1>
          <p className="mt-4 text-[15px] font-semibold uppercase tracking-[0.04em] text-ink/50">{c.updated}</p>
          <p className="lead mt-6">{c.intro}</p>
          <div className="mt-12 space-y-10">
            {c.sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink md:text-[26px]">{s.h}</h2>
                {s.p.map((para, i) => (
                  <p key={i} className="mt-3 text-[17px] font-medium leading-relaxed text-ink/80">{withLinks(para)}</p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2 pl-1">
                    {s.list.map((li, i) => (
                      <li key={i} className="flex gap-3 text-[17px] font-medium leading-relaxed text-ink/80">
                        <span aria-hidden className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-brand" />
                        <span>{withLinks(li)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
