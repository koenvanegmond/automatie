import { ImageResponse } from "next/og";

export const alt = "Appmaatje: WhatsApp automatisering op maat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#FFFFFF", color: "#0E1110" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 48, fontWeight: 700 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#25855A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          appmaatje
        </div>
        <div style={{ marginTop: 50, fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Laat WhatsApp het werk doen.</div>
        <div style={{ marginTop: 26, fontSize: 34, color: "#4B504E" }}>WhatsApp automatisering op maat · vaak binnen 2 dagen live</div>
      </div>
    ),
    size
  );
}
