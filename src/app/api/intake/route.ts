import { NextResponse } from "next/server";

/**
 * Ontvangt aanvragen uit de intro-chat (kennismaking of WhatsApp-bericht).
 * Stuurt ze door naar INTAKE_WEBHOOK_URL (bv. een n8n- of YCloud-flow die het bericht verstuurt).
 * Zonder die variabele antwoordt de route 501, en valt de chat terug op "app ons direct".
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

  const url = process.env.INTAKE_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, configured: false }, { status: 501 });

  const payload = {
    ...body,
    name: (body.name || "").slice(0, 80),
    phone,
    consentText: "WhatsApp opt-in via appmaatje intro",
    consentAt: new Date().toISOString(),
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
