import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BRANCHE_LABEL, allMomenten, brancheOf, displayName, getMoment, initials, type Bericht, type Element } from "@/lib/voorbeelden";
import { MiniMap, PhotoArt } from "@/components/voorbeelden/Art";

/**
 * OG-beeld per voorbeeld (1200x630): titel links, het begin van het gesprek als telefoon rechts.
 * Los op te vragen als PNG: /voorbeelden/<slug>/opengraph-image
 */
export const alt = "Voorbeeldgesprek van Appmaatje";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allMomenten().map((m) => ({ slug: m.slug }));
}

const INK = "#0E1110";
const GREEN = "#1F7A50";
const BUBBLE_W = 372;

const font = (f: string) => readFile(path.join(process.cwd(), "src/fonts/og", f));

/** Grove hoogteschatting om 3 tot 5 berichten te kiezen die in beeld passen. */
const estimate = (m: Bericht) => {
  const lines = Math.ceil((m.tekst.length + 6) / 31);
  let h = 30 + lines * 27;
  for (const e of [m.element, m.element_extra]) {
    if (!e) continue;
    if (e.type === "knoppen") h += e.knoppen.length * 50;
    if (e.type === "foto") h += 200;
    if (e.type === "lijst") h += 50;
    if (e.type === "document" || e.type === "link" || e.type === "knop_bellen") h += 60;
    if (e.type === "locatie") h += 150;
  }
  if (m.dag) h += 46;
  if (m.sjabloon) h += 22;
  return h + 8;
};

const pickMessages = (msgs: Bericht[], budget: number) => {
  const out: Bericht[] = [];
  let used = 0;
  for (const m of msgs) {
    const h = estimate(m);
    if (out.length >= 3 && used + h > budget) break;
    out.push(m);
    used += h;
    if (out.length === 5) break;
  }
  return out;
};

/** Mailtekst kort maken: aanhef en groet eruit, max n tekens. */
const short = (t: string, n = 105) => {
  const lines = t.split(/\n+/).filter((l) => l.trim() && !/^(Hoi|Groet)\b.*,$/.test(l.trim()) && !/^(De Vonk|Installatiebedrijf)/.test(l.trim()));
  const s = lines.join(" ");
  return s.length > n ? `${s.slice(0, n).replace(/[\s.,;:]+\S*$/, "")}…` : s;
};

const els = (m: Bericht) => [m.element, m.element_extra].filter(Boolean) as Element[];

export default async function Image({ params }: { params: { slug: string } }) {
  const [zt, ztBold, anton] = await Promise.all([font("ZTNature-Medium.ttf"), font("ZTNature-Bold.ttf"), font("Anton-Regular.ttf")]);
  const m = getMoment(params.slug);
  const b = m ? brancheOf(m.slug) : undefined;
  const label = b ? BRANCHE_LABEL[b.slug] ?? b.branche : "";
  const title = m?.titel ?? "Voorbeeldgesprek";
  const isMail = m?.kanaal === "email";
  const msgs = m ? pickMessages(m.berichten, isMail ? 560 : 600) : [];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#9FE0B8", color: INK, position: "relative", fontFamily: "ZT" }}>
        {/* links: titel */}
        <div style={{ width: 600, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 0 54px 64px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", border: `3px solid ${INK}`, borderRadius: 999, background: "#FFFFFF", padding: "9px 22px", fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>
              {`VOORBEELD · ${label.toUpperCase()}${isMail ? " · PER MAIL" : ""}`}
            </div>
            {m ? (
              <div style={{ display: "flex", marginLeft: 12, border: `3px solid ${INK}`, borderRadius: 999, background: m.niveau === "basis" ? "#FFFFFF" : "#DCCBF7", padding: "9px 20px", fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>
                {m.niveau === "basis" ? "BASIS" : "MET KOPPELING"}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Anton", fontSize: title.length > 34 ? 72 : 84, lineHeight: 0.98, textTransform: "uppercase", letterSpacing: -0.5 }}>{title}</div>
            <div style={{ display: "flex", marginTop: 22, fontSize: 25, color: "#25403A" }}>{`${m ? displayName(m.bedrijf) : ""} · verzonnen naam`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 700 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#25855A", border: `3px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </div>
            appmaatje.com
          </div>
        </div>

        {/* rechts: telefoon */}
        {m && !isMail && (
          <div style={{ position: "absolute", left: 650, top: 34, width: 480, height: 660, display: "flex", background: INK, borderRadius: 58, padding: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#EFEAE2", borderRadius: 47, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: GREEN, color: "#fff", padding: "34px 22px 15px" }}>
                <div style={{ width: 50, height: 50, borderRadius: 999, background: "#9FE0B8", color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700 }}>{initials(m.bedrijf)}</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 23, fontWeight: 700 }}>{displayName(m.bedrijf)}</div>
                  <div style={{ fontSize: 18, opacity: 0.85 }}>Zakelijk account</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "12px 14px", gap: 8 }}>
                {msgs.map((x, i) => <OgBubble key={i} m={x} />)}
              </div>
            </div>
          </div>
        )}

        {/* rechts: mailvenster */}
        {m && isMail && (
          <div style={{ position: "absolute", left: 630, top: 46, width: 530, height: 640, display: "flex", flexDirection: "column", background: "#FFFFFF", border: `3px solid ${INK}`, borderRadius: 22, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F3", borderBottom: `3px solid ${INK}`, padding: "14px 18px", fontSize: 20, fontWeight: 700, color: "#3A3F3D" }}>
              <div style={{ width: 14, height: 14, borderRadius: 99, background: "#E4572E" }} />
              <div style={{ width: 14, height: 14, borderRadius: 99, background: "#F7D95C" }} />
              <div style={{ width: 14, height: 14, borderRadius: 99, background: "#9FE0B8" }} />
              <div style={{ marginLeft: 10 }}>Postvak IN</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "#F7F7F2", height: "100%" }}>
              {msgs.map((x, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", background: "#fff", border: x.van === "klant" ? "2px dashed #9AA09D" : "2px solid #E2E4E2", borderRadius: 14, padding: "12px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#6B706E" }}>
                    <div>{x.van === "klant" ? "Websiteformulier" : displayName(m.bedrijf)}</div>
                    <div>{x.tijd}</div>
                  </div>
                  {x.onderwerp ? <div style={{ marginTop: 4, fontSize: 23, fontWeight: 700 }}>{x.onderwerp}</div> : null}
                  <div style={{ display: "flex", marginTop: 4, fontSize: 19, color: "#3A3F3D", lineHeight: 1.3 }}>{short(x.tekst)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "ZT", data: zt, weight: 500, style: "normal" },
        { name: "ZT", data: ztBold, weight: 700, style: "normal" },
        { name: "Anton", data: anton, weight: 400, style: "normal" },
      ],
    }
  );
}

const OgBubble = ({ m }: { m: Bericht }) => {
  const mine = m.van === "bedrijf";
  const e = els(m);
  const foto = e.find((x) => x.type === "foto");
  const doc = e.find((x) => x.type === "document");
  const link = e.find((x) => x.type === "link");
  const knoppen = e.find((x) => x.type === "knoppen");
  const bellen = e.find((x) => x.type === "knop_bellen");
  const lijst = e.find((x) => x.type === "lijst");
  const loc = e.find((x) => x.type === "locatie");
  const btn = { display: "flex", justifyContent: "center", background: "#fff", color: GREEN, borderRadius: 14, padding: "9px 12px", fontSize: 19, fontWeight: 700, marginTop: 6 } as const;
  const wide = foto || loc || doc;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
      {m.dag ? (
        <div style={{ display: "flex", alignSelf: "center", background: "#fff", borderRadius: 10, padding: "5px 14px", fontSize: 17, fontWeight: 700, color: "#545957", marginBottom: 8 }}>{m.dag}</div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: BUBBLE_W, ...(wide ? { width: BUBBLE_W } : {}), background: mine ? "#D9FDD3" : "#FFFFFF", borderRadius: 16, padding: "8px 12px", fontSize: 20, lineHeight: 1.33 }}>
        {m.sjabloon ? <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, letterSpacing: 1, marginBottom: 2 }}>AUTOMATISCH</div> : null}
        {foto && foto.type === "foto" ? (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 6, borderRadius: 10, overflow: "hidden", background: "#EEF1EF" }}>
            <PhotoArt beschrijving={foto.beschrijving} width={BUBBLE_W - 24} height={150} />
            <div style={{ display: "flex", padding: "6px 8px", fontSize: 15, color: "#4B504E" }}>{foto.beschrijving}</div>
          </div>
        ) : null}
        {loc && loc.type === "locatie" ? (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 6, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <MiniMap width={BUBBLE_W - 24} height={100} />
            <div style={{ display: "flex", padding: "6px 8px", fontSize: 17, fontWeight: 700 }}>{loc.naam}</div>
          </div>
        ) : null}
        {doc && doc.type === "document" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, borderRadius: 10, background: "#E6EDE4", padding: 8 }}>
            <div style={{ display: "flex", width: 34, height: 42, borderRadius: 6, background: "#E4572E", color: "#fff", fontSize: 13, fontWeight: 700, alignItems: "center", justifyContent: "center" }}>PDF</div>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700 }}>{doc.bestandsnaam}</div>
          </div>
        ) : null}
        <div style={{ display: "flex" }}>{m.tekst}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, alignSelf: "flex-end", fontSize: 15, color: "#7A807D", marginTop: 2 }}>
          {m.tijd}
          {mine ? (
            <svg width="20" height="12" viewBox="0 0 18 11"><path d="M1 6l3 3 6-7.5" fill="none" stroke="#3A97D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.5 9l1 .4 6-7.5" fill="none" stroke="#3A97D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : null}
        </div>
        {link && link.type === "link" ? (
          <div style={{ display: "flex", marginTop: 6, borderRadius: 10, background: "#E6EDE4", padding: "8px 10px", fontSize: 19, fontWeight: 700, color: GREEN }}>{link.label}</div>
        ) : null}
      </div>
      {knoppen && knoppen.type === "knoppen" ? (
        <div style={{ display: "flex", flexDirection: "column", width: BUBBLE_W }}>
          {knoppen.knoppen.map((k) => <div key={k} style={btn}>{k}</div>)}
        </div>
      ) : null}
      {bellen && bellen.type === "knop_bellen" ? <div style={{ ...btn, width: BUBBLE_W }}>{bellen.label}</div> : null}
      {lijst && lijst.type === "lijst" ? <div style={{ ...btn, width: BUBBLE_W }}>{lijst.knop}</div> : null}
    </div>
  );
};
