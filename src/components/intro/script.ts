import type { Lang } from "@/lib/content";

export type NodeId =
  | "start" | "browse" | "interested"
  | "leads" | "appts" | "followup" | "service" | "unsure"
  | "offer" | "meeting" | "whatsapp"
  | "meetingDone" | "waDone" | "notConnected" | "outro";

export type Option = { label: string; next: NodeId };
export type ChatNode = { msgs: string[]; options?: Option[]; widget?: "meeting" | "whatsapp"; finish?: boolean };

type Script = {
  ui: {
    skip: string; name: string; online: string; typing: string; you: string;
    placeholder: string; step: string; reopen: string; auto: string;
    meeting: {
      title: string; sub: string; morning: string; afternoon: string; name: string; phone: string;
      consent: string; submit: string; sending: string; pickDay: string;
    };
    whatsapp: { title: string; sub: string; name: string; phone: string; consent: string; submit: string; sending: string };
    invalidPhone: string; needConsent: string; openWa: string;
    waFallbackText: string;
  };
  nodes: Record<NodeId, ChatNode>;
};

const nl: Script = {
  ui: {
    skip: "Naar de website",
    name: "Appmaatje",
    online: "online",
    typing: "typt…",
    you: "Jij",
    placeholder: "Kies een antwoord hierboven",
    step: "Stap",
    reopen: "Chat met ons",
    auto: "Dit gesprek is zelf een automatisering. Zo kan het ook voor jouw klanten.",
    meeting: {
      title: "Kennismaking plannen",
      sub: "Kies je voorkeur. We bevestigen het definitieve tijdstip via WhatsApp.",
      morning: "Ochtend",
      afternoon: "Middag",
      name: "Je naam",
      phone: "Mobiel nummer",
      consent: "Door te versturen mag Appmaatje je over deze afspraak appen.",
      submit: "Voorkeur versturen",
      sending: "Versturen…",
      pickDay: "Kies een dag en dagdeel",
    },
    whatsapp: {
      title: "Ontvang een WhatsApp van ons",
      sub: "Vul je nummer in. Je krijgt een bericht van ons.",
      name: "Je naam",
      phone: "Mobiel nummer",
      consent: "Door te versturen mag Appmaatje je appen.",
      submit: "Stuur mij een bericht",
      sending: "Versturen…",
    },
    invalidPhone: "Vul een geldig mobiel nummer in.",
    needConsent: "Vink de toestemming aan om verder te gaan.",
    openWa: "Open WhatsApp",
    waFallbackText: "Hoi Appmaatje! Ik kom via de website en wil graag kennismaken.",
  },
  nodes: {
    start: {
      msgs: ["Hey! 👋 Welkom bij Appmaatje. Leuk dat je er bent.", "Ben je hier omdat je je WhatsApp wilt automatiseren?"],
      options: [{ label: "Ja, zeker!", next: "interested" }, { label: "Ik kijk even rond", next: "browse" }],
    },
    browse: {
      msgs: ["Helemaal goed! In het kort: wij bouwen WhatsApp-automatiseringen op maat.", "Zoals dit gesprek, maar dan voor jouw klanten of medewerkers. Zal ik je de website laten zien?"],
      options: [{ label: "Laat maar zien", next: "outro" }, { label: "Toch even proberen", next: "interested" }],
    },
    interested: {
      msgs: ["Top! Wat zou je het liefst automatiseren?"],
      options: [
        { label: "Nieuwe leads beantwoorden", next: "leads" },
        { label: "Afspraken inplannen", next: "appts" },
        { label: "Klanten opvolgen", next: "followup" },
        { label: "Klantenservice", next: "service" },
        { label: "Weet ik nog niet", next: "unsure" },
      ],
    },
    leads: { msgs: ["Slim. Een lead om 23:14 krijgt direct antwoord, de juiste vragen en een vervolgstap.", "Jij krijgt een seintje met alle info. Geen lead meer die afhaakt omdat je pas de volgende ochtend reageert."], options: [{ label: "Klinkt goed", next: "offer" }] },
    appts: { msgs: ["Fijn. Klanten kiezen zelf een moment in WhatsApp, het komt direct in je agenda.", "Een dag van tevoren krijgen ze automatisch een herinnering. Verzetten kan zonder te bellen."], options: [{ label: "Klinkt goed", next: "offer" }] },
    followup: { msgs: ["Goeie. Na een offerte, bezoek of aankoop sturen we automatisch het juiste bericht op het juiste moment.", "Bijvoorbeeld een herinnering, een review-verzoek of een vraag of alles naar wens is."], options: [{ label: "Klinkt goed", next: "offer" }] },
    service: { msgs: ["Logisch. De vragen die steeds terugkomen worden direct beantwoord, ook 's avonds en in het weekend.", "Kan de automatisering iets niet? Dan neemt een collega het gesprek over."], options: [{ label: "Klinkt goed", next: "offer" }] },
    unsure: { msgs: ["Geen probleem, daar zijn we voor.", "Meestal begin je met wat het vaakst terugkomt: afspraken, beschikbaarheid of dezelfde vragen. Dat zoeken we samen uit."], options: [{ label: "Vertel meer", next: "offer" }] },
    offer: {
      msgs: ["Zullen we kennismaken? Gratis en online."],
      options: [
        { label: "Plan een kennismaking", next: "meeting" },
        { label: "Stuur me een WhatsApp", next: "whatsapp" },
        { label: "Eerst de website bekijken", next: "outro" },
      ],
    },
    meeting: { msgs: ["Kies hieronder een dag en dagdeel dat je uitkomt."], widget: "meeting" },
    whatsapp: { msgs: ["Vul je nummer in, dan sturen we je een bericht."], widget: "whatsapp" },
    meetingDone: { msgs: ["Gelukt! ✅ We bevestigen het tijdstip via WhatsApp.", "Ik laat je nu de website zien."], finish: true },
    waDone: { msgs: ["Verstuurd! ✅ Je krijgt zo een bericht van ons.", "Ik laat je nu de website zien."], finish: true },
    notConnected: {
      msgs: ["Dit formulier is nog niet gekoppeld. Stuur je bericht direct via WhatsApp, dan reageren we zelf."],
      options: [{ label: "Bekijk de website", next: "outro" }],
    },
    outro: { msgs: ["Ik laat je de website zien. 👇"], finish: true },
  },
};

const en: Script = {
  ui: {
    skip: "Go to website",
    name: "Appmaatje",
    online: "online",
    typing: "typing…",
    you: "You",
    placeholder: "Pick an answer above",
    step: "Step",
    reopen: "Chat with us",
    auto: "This chat is an automation itself. It can work like this for your customers too.",
    meeting: {
      title: "Book an intro",
      sub: "Pick your preference. We'll confirm the exact time on WhatsApp.",
      morning: "Morning",
      afternoon: "Afternoon",
      name: "Your name",
      phone: "Mobile number",
      consent: "By sending, Appmaatje may message you about this appointment.",
      submit: "Send preference",
      sending: "Sending…",
      pickDay: "Pick a day and time of day",
    },
    whatsapp: {
      title: "Get a WhatsApp from us",
      sub: "Enter your number and we'll send you a message.",
      name: "Your name",
      phone: "Mobile number",
      consent: "By sending, Appmaatje may message you.",
      submit: "Message me",
      sending: "Sending…",
    },
    invalidPhone: "Enter a valid mobile number.",
    needConsent: "Tick the consent box to continue.",
    openWa: "Open WhatsApp",
    waFallbackText: "Hi Appmaatje! I found you through the website and would like an intro.",
  },
  nodes: {
    start: {
      msgs: ["Hey! 👋 Welcome to Appmaatje. Great to have you here.", "Are you here because you want to automate your WhatsApp?"],
      options: [{ label: "Yes, definitely!", next: "interested" }, { label: "Just looking around", next: "browse" }],
    },
    browse: {
      msgs: ["No problem! In short: we build custom WhatsApp automations.", "Like this chat, but for your customers or staff. Shall I show you the website?"],
      options: [{ label: "Show me", next: "outro" }, { label: "Let me try it", next: "interested" }],
    },
    interested: {
      msgs: ["Great! What would you like to automate most?"],
      options: [
        { label: "Reply to new leads", next: "leads" },
        { label: "Book appointments", next: "appts" },
        { label: "Follow up customers", next: "followup" },
        { label: "Customer service", next: "service" },
        { label: "Not sure yet", next: "unsure" },
      ],
    },
    leads: { msgs: ["Smart. A lead at 11:14 pm gets an instant reply, the right questions and a next step.", "You get a ping with all the details. No more leads lost because you replied the next morning."], options: [{ label: "Sounds good", next: "offer" }] },
    appts: { msgs: ["Nice. Customers pick a time in WhatsApp and it goes straight into your calendar.", "They get an automatic reminder the day before. Rescheduling works without calling."], options: [{ label: "Sounds good", next: "offer" }] },
    followup: { msgs: ["Good one. After a quote, visit or purchase, the right message goes out at the right moment.", "Like a reminder, a review request or a check-in."], options: [{ label: "Sounds good", next: "offer" }] },
    service: { msgs: ["Makes sense. Recurring questions get answered instantly, evenings and weekends too.", "If the automation can't help, a colleague takes over the chat."], options: [{ label: "Sounds good", next: "offer" }] },
    unsure: { msgs: ["No problem, that's what we're here for.", "Most businesses start with what comes up most: appointments, availability or the same questions. We'll figure it out together."], options: [{ label: "Tell me more", next: "offer" }] },
    offer: {
      msgs: ["Shall we meet? It's free and online."],
      options: [
        { label: "Book an intro", next: "meeting" },
        { label: "Send me a WhatsApp", next: "whatsapp" },
        { label: "See the website first", next: "outro" },
      ],
    },
    meeting: { msgs: ["Pick a day and time of day that suits you below."], widget: "meeting" },
    whatsapp: { msgs: ["Enter your number and we'll message you."], widget: "whatsapp" },
    meetingDone: { msgs: ["Done! ✅ We'll confirm the time on WhatsApp.", "Let me show you the website now."], finish: true },
    waDone: { msgs: ["Sent! ✅ You'll get a message from us shortly.", "Let me show you the website now."], finish: true },
    notConnected: {
      msgs: ["This form isn't connected yet. Send us a WhatsApp directly and we'll reply ourselves."],
      options: [{ label: "See the website", next: "outro" }],
    },
    outro: { msgs: ["Let me show you the website. 👇"], finish: true },
  },
};

export const scripts: Record<Lang, Script> = { nl, en };
