export type Lang = "nl" | "en";

export type SectorKey = "vastgoed" | "uitzend" | "horeca" | "zorg";

type Msg = { from: "them" | "bot"; text: string };

const nl = {
  nav: { how: "Hoe het werkt", examples: "Voorbeelden", pricing: "Prijzen", faq: "FAQ", cta: "App ons" },
  hero: {
    eyebrow: "WhatsApp-automatisering voor het mkb",
    l1a: "Laat",
    l1b: "WhatsApp",
    l2: "het werk",
    l3: "doen.",
    sub: "Afspraken, beschikbaarheid, klantvragen en opvolging: automatisch geregeld via WhatsApp. Op maat gebouwd, vaak binnen 2 dagen live.",
    cta1: "App ons",
    cta2: "Bekijk voorbeelden",
    trust: ["Officiële WhatsApp Business API", "Gratis kennismaking", "We komen langs"],
    waText: "Hoi Appmaat! Ik wil weten wat ik kan automatiseren.",
  },
  before: {
    eyebrow: "Het probleem",
    from: "Van dit…",
    to: "…naar dit.",
    fromSub: "Losse appjes, gemiste vragen, alles met de hand overtypen.",
    toSub: "Elk bericht komt op de juiste plek. Automatisch.",
    chaos: [
      "Kan ik morgen werken?",
      "Wanneer is de bezichtiging?",
      "Heb je mijn bericht gezien?",
      "Is er nog plek vanavond?",
      "Ik ben ziek vandaag 🤒",
      "Kun je me terugbellen?",
    ],
    order: [
      "Beschikbaarheid → rooster",
      "Bezichtiging → agenda",
      "Vraag → direct antwoord",
      "Reservering → bevestigd",
      "Ziekmelding → planner",
      "Terugbelverzoek → lijst",
    ],
  },
  how: {
    eyebrow: "Hoe het werkt",
    title: "In drie stappen live.",
    steps: [
      { tag: "Stap 1", title: "We komen langs.", text: "Gratis kennismaking bij jou op locatie. We kijken welke berichten steeds terugkomen.", bullets: ["Op locatie, niet via een call", "Vooraf een heldere offerte"] },
      { tag: "Stap 2", title: "We bouwen het op maat.", text: "Je eigen WhatsApp-flow, gekoppeld aan wat je al gebruikt.", bullets: ["Agenda, Excel, rooster of CRM", "Jouw toon, jouw huisstijl"] },
      { tag: "Stap 3", title: "Het draait. Jij niet.", text: "Vaak binnen 2 dagen live, afhankelijk van je data. Wij houden het draaiend.", bullets: ["Wij houden het in de gaten", "Aanpassen? Even appen"] },
    ],
  },
  sectors: {
    eyebrow: "Voorbeelden",
    title: "Zo ziet WhatsApp-automatisering eruit voor jouw bedrijf.",
    sub: "Kies je sector. Bekijk wat er gebeurt als er een bericht binnenkomt.",
    trigger: "Nieuw bericht",
    engine: "Appmaat-flow",
    pilot: "Pilot in opbouw met",
    phoneName: "Jouw bedrijf",
    online: "online",
    items: {
      vastgoed: {
        label: "Vastgoed",
        result: ["Bezichtiging in agenda", "Herinnering 24 uur vooraf", "Makelaar krijgt seintje"],
        chat: [
          { from: "them", text: "Hoi! Is het appartement aan de Laan nog beschikbaar?" },
          { from: "bot", text: "Ja, nog beschikbaar! Wil je een bezichtiging plannen? Kies een moment: di 14:00 · wo 10:30 · do 16:00" },
          { from: "them", text: "Woensdag 10:30 graag" },
          { from: "bot", text: "Staat erin ✅ Je krijgt een dag van tevoren een herinnering met het adres." },
        ] as Msg[],
      },
      uitzend: {
        label: "Uitzendbureaus",
        result: ["Beschikbaarheid in rooster", "Medewerker krijgt bevestiging", "Planner ziet het direct"],
        chat: [
          { from: "bot", text: "Hoi Sam! Ben je volgende week beschikbaar? Antwoord met de dagen, bijv. ma di vr" },
          { from: "them", text: "ma wo do" },
          { from: "bot", text: "Top, verwerkt in het rooster ✅ Je hoort vrijdag welke diensten je hebt." },
          { from: "them", text: "Thanks!" },
        ] as Msg[],
      },
      horeca: {
        label: "Horeca",
        result: ["Reservering bevestigd", "Direct in je reserveringslijst", "Manager krijgt overzicht"],
        chat: [
          { from: "them", text: "Hebben jullie zaterdag plek voor 6 personen?" },
          { from: "bot", text: "Ja! Om 18:00 of 20:30?" },
          { from: "them", text: "20:30" },
          { from: "bot", text: "Gereserveerd voor 6 personen, zaterdag 20:30 ✅ Tot dan!" },
        ] as Msg[],
      },
      zorg: {
        label: "Zorg & praktijken",
        result: ["Afspraak herinnerd", "Bevestigen met één tik", "Verzetten zonder bellen"],
        chat: [
          { from: "bot", text: "Herinnering: morgen 09:15 heb je een afspraak. Kom je? Antwoord met JA of VERZETTEN" },
          { from: "them", text: "VERZETTEN" },
          { from: "bot", text: "Geen probleem. Kies een nieuw moment: do 11:00 · vr 14:30" },
          { from: "them", text: "vr 14:30" },
        ] as Msg[],
      },
    } satisfies Record<SectorKey, { label: string; result: string[]; chat: Msg[] }>,
  },
  hub: {
    eyebrow: "Koppelingen",
    title: "WhatsApp, gekoppeld aan alles wat je al gebruikt.",
    sub: "Geen nieuw systeem leren. Wij verbinden WhatsApp met je huidige tools.",
    tools: ["WhatsApp", "Agenda", "Rooster", "Excel", "CRM", "E-mail"],
  },
  why: {
    eyebrow: "Waarom Appmaat",
    title: "Persoonlijk. Snel. Op maat.",
    items: [
      { title: "We komen langs", text: "Kennismaken doen we bij jou, niet via een call." },
      { title: "Maatwerk", text: "Gebouwd voor jouw proces, niet uit een doos." },
      { title: "Officiële API", text: "Via de officiële WhatsApp Business API. Stabiel en volgens de regels van Meta." },
      { title: "Snel live", text: "Vaak binnen 2 dagen, afhankelijk van je data." },
    ],
  },
  pilot: {
    eyebrow: "Pilot",
    title: "Eerste 5 bedrijven: 50% korting op de opzet.",
    text: "Net gestart. Bouw mee: jij krijgt 50% korting op de opzet, wij jouw feedback.",
    partner: "Pilot in opbouw met",
    cta: "Ik doe mee",
    waText: "Hoi Appmaat! Ik wil meedoen met de pilot.",
  },
  pricing: {
    eyebrow: "Prijzen",
    title: "Heldere prijzen. Offerte vooraf.",
    once: "eenmalig",
    from: "vanaf",
    popular: "Aanrader",
    plans: [
      { name: "Start", price: "300", from: false, text: "Eén automatisering.", bullets: ["Bijv. herinneringen of veelgestelde vragen", "Eén WhatsApp-flow", "Vaak binnen 2 dagen live"] },
      { name: "Groei", price: "700", from: false, text: "Meerdere flows, gekoppeld.", bullets: ["Meerdere automatiseringen", "Koppeling met agenda, Excel of CRM", "Op maat ingericht"] },
      { name: "Maatwerk", price: "1.500", from: true, text: "Complexe processen.", bullets: ["Meerdere systemen", "Teams en locaties", "Volledig op maat"] },
    ],
    cta: "Plan gratis kennismaking",
    note: "Daarnaast: onderhoud & hosting vanaf €29 p/m. WhatsApp-berichtkosten van Meta tegen kostprijs. Prijzen excl. btw, indicatie.",
    waText: "Hoi Appmaat! Ik wil een gratis kennismaking plannen.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Veelgestelde vragen over WhatsApp-automatisering",
    items: [
      { q: "Wat is WhatsApp-automatisering?", a: "Berichten die steeds terugkomen worden automatisch afgehandeld: afspraken, beschikbaarheid, herinneringen en vragen. Jij houdt tijd over." },
      { q: "Werkt dit met mijn huidige WhatsApp-nummer?", a: "Vaak wel, afhankelijk van hoe je nummer nu is ingericht. Anders kan een nieuw nummer. Dat bekijken we samen in de kennismaking." },
      { q: "Hoe snel is het live?", a: "Vaak binnen 2 dagen. Het hangt af van hoeveel data er al is en hoe makkelijk die bereikbaar is." },
      { q: "Wat kost een WhatsApp-chatbot laten maken?", a: "Eenmalig vanaf €300, plus onderhoud vanaf €29 per maand en de berichtkosten van Meta. Indicatief, excl. btw. Je krijgt vooraf een offerte." },
      { q: "Kan een medewerker het gesprek overnemen?", a: "Ja, als je dat wilt. We bouwen een overdracht naar een collega in voor vragen die de automatisering niet kan beantwoorden." },
      { q: "Hoe zit het met privacy (AVG)?", a: "We werken via de officiële WhatsApp Business API, verwerken alleen wat nodig is en maken vooraf afspraken over gegevens." },
    ],
  },
  cta: {
    title: "Benieuwd wat jij kunt automatiseren?",
    sub: "App ons. Geen bot, wij reageren zelf.",
    cta1: "App ons",
    cta2: "Vraag een demo",
    waDemo: "Hoi Appmaat! Ik wil graag een demo zien.",
  },
  footer: {
    tagline: "WhatsApp-automatisering op maat.",
    rights: "Alle rechten voorbehouden.",
    disclaimer: "WhatsApp is een handelsmerk van WhatsApp LLC. Appmaat is niet gelieerd aan Meta.",
  },
};

type Dict = typeof nl;

const en: Dict = {
  nav: { how: "How it works", examples: "Examples", pricing: "Pricing", faq: "FAQ", cta: "Message us" },
  hero: {
    eyebrow: "WhatsApp automation for small businesses",
    l1a: "Let",
    l1b: "WhatsApp",
    l2: "do the",
    l3: "work.",
    sub: "Appointments, availability, questions and follow-ups: handled automatically on WhatsApp. Custom-built, often live within 2 days.",
    cta1: "Message us",
    cta2: "See examples",
    trust: ["Official WhatsApp Business API", "Free intro meeting", "We come to you"],
    waText: "Hi Appmaat! I'd like to know what I can automate.",
  },
  before: {
    eyebrow: "The problem",
    from: "From this…",
    to: "…to this.",
    fromSub: "Scattered messages, missed questions, retyping everything by hand.",
    toSub: "Every message lands in the right place. Automatically.",
    chaos: [
      "Can I work tomorrow?",
      "When is the viewing?",
      "Did you see my message?",
      "Any tables free tonight?",
      "I'm sick today 🤒",
      "Can you call me back?",
    ],
    order: [
      "Availability → roster",
      "Viewing → calendar",
      "Question → instant answer",
      "Booking → confirmed",
      "Sick call → planner",
      "Call request → list",
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "Live in three steps.",
    steps: [
      { tag: "Step 1", title: "We come to you.", text: "A free intro meeting at your location. We spot the messages that keep coming back.", bullets: ["On site, not on a call", "A clear quote upfront"] },
      { tag: "Step 2", title: "We build it for you.", text: "Your own WhatsApp flow, connected to the tools you already use.", bullets: ["Calendar, Excel, roster or CRM", "Your tone, your brand"] },
      { tag: "Step 3", title: "It runs. You don't.", text: "Often live within 2 days, depending on your data. We keep it running.", bullets: ["We keep an eye on it", "Changes? Just message us"] },
    ],
  },
  sectors: {
    eyebrow: "Examples",
    title: "What WhatsApp automation looks like for your business.",
    sub: "Pick your sector. See what happens when a message comes in.",
    trigger: "New message",
    engine: "Appmaat flow",
    pilot: "Pilot being set up with",
    phoneName: "Your business",
    online: "online",
    items: {
      vastgoed: {
        label: "Real estate",
        result: ["Viewing in calendar", "Reminder 24h before", "Agent gets notified"],
        chat: [
          { from: "them", text: "Hi! Is the apartment on the Laan still available?" },
          { from: "bot", text: "Yes, still available! Want to book a viewing? Pick a time: Tue 14:00 · Wed 10:30 · Thu 16:00" },
          { from: "them", text: "Wednesday 10:30 please" },
          { from: "bot", text: "Booked ✅ You'll get a reminder with the address the day before." },
        ],
      },
      uitzend: {
        label: "Staffing agencies",
        result: ["Availability in roster", "Worker gets confirmation", "Planner sees it instantly"],
        chat: [
          { from: "bot", text: "Hi Sam! Are you available next week? Reply with the days, e.g. mon tue fri" },
          { from: "them", text: "mon wed thu" },
          { from: "bot", text: "Great, added to the roster ✅ You'll hear about your shifts on Friday." },
          { from: "them", text: "Thanks!" },
        ],
      },
      horeca: {
        label: "Hospitality",
        result: ["Booking confirmed", "Added to your booking list", "Manager gets overview"],
        chat: [
          { from: "them", text: "Do you have a table for 6 on Saturday?" },
          { from: "bot", text: "Yes! 18:00 or 20:30?" },
          { from: "them", text: "20:30" },
          { from: "bot", text: "Booked for 6 people, Saturday 20:30 ✅ See you then!" },
        ],
      },
      zorg: {
        label: "Healthcare & clinics",
        result: ["Reminder sent", "Confirm in one tap", "Reschedule without calling"],
        chat: [
          { from: "bot", text: "Reminder: you have an appointment tomorrow at 09:15. Coming? Reply YES or RESCHEDULE" },
          { from: "them", text: "RESCHEDULE" },
          { from: "bot", text: "No problem. Pick a new time: Thu 11:00 · Fri 14:30" },
          { from: "them", text: "Fri 14:30" },
        ],
      },
    },
  },
  hub: {
    eyebrow: "Integrations",
    title: "WhatsApp, connected to everything you already use.",
    sub: "No new system to learn. We connect WhatsApp to your current tools.",
    tools: ["WhatsApp", "Calendar", "Roster", "Excel", "CRM", "Email"],
  },
  why: {
    eyebrow: "Why Appmaat",
    title: "Personal. Fast. Custom.",
    items: [
      { title: "We come to you", text: "We meet at your place, not on a call." },
      { title: "Custom-built", text: "Built for your process, not out of a box." },
      { title: "Official API", text: "Through the official WhatsApp Business API. Stable and within Meta's rules." },
      { title: "Fast launch", text: "Often within 2 days, depending on your data." },
    ],
  },
  pilot: {
    eyebrow: "Pilot",
    title: "First 5 businesses: 50% off setup.",
    text: "Just launched. Build with us: 50% off setup for you, feedback for us.",
    partner: "Pilot being set up with",
    cta: "I'm in",
    waText: "Hi Appmaat! I'd like to join the pilot.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Clear pricing. Quote upfront.",
    once: "one-off",
    from: "from",
    popular: "Recommended",
    plans: [
      { name: "Start", price: "300", from: false, text: "One automation.", bullets: ["E.g. reminders or FAQs", "One WhatsApp flow", "Often live within 2 days"] },
      { name: "Growth", price: "700", from: false, text: "Multiple flows, connected.", bullets: ["Multiple automations", "Connected to calendar, Excel or CRM", "Set up for you"] },
      { name: "Custom", price: "1,500", from: true, text: "Complex processes.", bullets: ["Multiple systems", "Teams and locations", "Fully custom"] },
    ],
    cta: "Book a free intro",
    note: "Plus: maintenance & hosting from €29/month. WhatsApp message fees from Meta at cost. Prices excl. VAT, indicative.",
    waText: "Hi Appmaat! I'd like to book a free intro.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions about WhatsApp automation",
    items: [
      { q: "What is WhatsApp automation?", a: "Recurring messages are handled automatically: appointments, availability, reminders and questions. You save time." },
      { q: "Does it work with my current WhatsApp number?", a: "Often, depending on your current setup. Otherwise we use a new number. We'll check this together in the intro." },
      { q: "How quickly can it go live?", a: "Often within 2 days. It depends on how much data there is and how easy it is to access." },
      { q: "What does a WhatsApp chatbot cost?", a: "One-off from €300, plus maintenance from €29 per month and Meta's message fees. Indicative, excl. VAT. You get a quote upfront." },
      { q: "Can a team member take over the chat?", a: "Yes, if you want. We build in a handover to a colleague for questions the automation can't answer." },
      { q: "What about privacy (GDPR)?", a: "We use the official WhatsApp Business API, only process what's needed and agree on data handling upfront." },
    ],
  },
  cta: {
    title: "Curious what you could automate?",
    sub: "Message us. No bot, just us.",
    cta1: "Message us",
    cta2: "Ask for a demo",
    waDemo: "Hi Appmaat! I'd like to see a demo.",
  },
  footer: {
    tagline: "Custom WhatsApp automation.",
    rights: "All rights reserved.",
    disclaimer: "WhatsApp is a trademark of WhatsApp LLC. Appmaat is not affiliated with Meta.",
  },
};

export const content: Record<Lang, Dict> = { nl, en };
export const sectorKeys: SectorKey[] = ["vastgoed", "uitzend", "horeca", "zorg"];
