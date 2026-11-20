import { NextResponse } from "next/server";

/**
 * Ontvangt aanvragen uit de intro-chat en het kennismaken-formulier.
 *
 * - Staat HUBSPOT_TOKEN in de omgeving? Dan maken we de aanvraag rechtstreeks in HubSpot aan
 *   (een contact + een deal in de Appmaatje sales-pipeline).
 * - Staat die niet, maar wel INTAKE_WEBHOOK_URL? Dan sturen we het bericht naar die webhook.
 * - Staat geen van beide? Dan antwoordt de route 501 en valt de chat terug op "app ons direct".
 *
 * Zo kan de site veilig deployen; zodra de token in Vercel staat, schrijft het vanzelf naar HubSpot.
 */
type Body = {
  type: "meeting" | "whatsapp";
  name?: string;
  phone: string;
  consent: boolean;
  date?: string;
  part?: "morning" | "afternoon";
  interest?: string;
  lang?: string;
};

const PHONE = /^\+?[1-9]\d{8,14}$/;
const HUBSPOT_API = "https://api.hubapi.com";
// Stage "Nieuw" van de Appmaatje sales-pipeline.
const DEAL_PIPELINE = "default";
const DEAL_STAGE = "6483704033";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const phone = (body.phone || "").replace(/[\s()-]/g, "");
  if (!["meeting", "whatsapp"].includes(body.type)) return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
  if (!PHONE.test(phone)) return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ ok: false, error: "no_consent" }, { status: 400 });
  if (body.type === "meeting" && (!body.date || !body.part)) return NextResponse.json({ ok: false, error: "missing_slot" }, { status: 400 });

  const name = (body.name || "").slice(0, 80).trim();
  const consentAt = new Date().toISOString();

  // --- Voorkeur: rechtstreeks naar HubSpot ---
  const token = process.env.HUBSPOT_TOKEN;
  if (token) {
    try {
      await createInHubspot(token, { type: body.type, name, phone, date: body.date, part: body.part, interest: body.interest, lang: body.lang, consentAt });
      return NextResponse.json({ ok: true });
    } catch {
      // Geen gevoelige gegevens loggen; alleen dat het misging.
      console.error("intake: HubSpot-aanmaak mislukt");
      return NextResponse.json({ ok: false, error: "hubspot" }, { status: 502 });
    }
  }

  // --- Fallback: webhook ---
  const url = process.env.INTAKE_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, configured: false }, { status: 501 });

  const payload = {
    ...body,
    name,
    phone,
    consentText: "WhatsApp opt-in via appmaatje intro",
    consentAt,
    source: "website-intro",
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.INTAKE_WEBHOOK_SECRET ? { authorization: `Bearer ${process.env.INTAKE_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}

type Intake = {
  type: "meeting" | "whatsapp";
  name: string;
  phone: string;
  date?: string;
  part?: "morning" | "afternoon";
  interest?: string;
  lang?: string;
  consentAt: string;
};

/** Maakt een contact + deal in HubSpot via de CRM API v3 en koppelt ze aan elkaar. */
async function createInHubspot(token: string, d: Intake): Promise<void> {
  const headers = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  // 1. Contact aanmaken (of een bestaand contact nemen bij een 409-conflict).
  const contactProps: Record<string, string> = { phone: d.phone };
  if (d.name) contactProps.firstname = d.name;

  let contactId: string | null = null;
  const cRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ properties: contactProps }),
  });
  if (cRes.ok) {
    const cJson = (await cRes.json()) as { id?: string };
    contactId = cJson.id ?? null;
  } else if (cRes.status === 409) {
    // Contact bestaat al: HubSpot noemt het bestaande id in de melding. Doorgaan.
    const txt = await cRes.text();
    const match = txt.match(/\b(\d{4,})\b/);
    contactId = match ? match[1] : null;
  } else {
    // Andere fout bij het contact: niet de hele aanvraag laten vallen, deal is leidend.
    await cRes.text();
  }

  // 2. Deal aanmaken, met default-koppeling naar het contact (association type 3: deal → contact).
  const details = [
    `Type: ${d.type === "meeting" ? "kennismaking" : "WhatsApp"}`,
    d.type === "meeting" && d.date ? `Voorkeur: ${d.date}${d.part ? ` (${d.part === "morning" ? "ochtend" : "middag"})` : ""}` : null,
    d.interest ? `Interesse: ${d.interest}` : null,
    `Telefoon: ${d.phone}`,
    d.lang ? `Taal: ${d.lang}` : null,
    `Opt-in gegeven: ja, op ${d.consentAt}`,
  ].filter(Boolean).join("\n");

  const dealBody: Record<string, unknown> = {
    properties: {
      dealname: `Website-aanvraag - ${d.name || d.phone}`,
      pipeline: DEAL_PIPELINE,
      dealstage: DEAL_STAGE,
      description: details,
    },
  };
  if (contactId) {
    dealBody.associations = [
      { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] },
    ];
  }

  const dRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals`, {
    method: "POST",
    headers,
    body: JSON.stringify(dealBody),
  });
  if (!dRes.ok) {
    await dRes.text();
    throw new Error("hubspot_deal_failed");
  }
}
