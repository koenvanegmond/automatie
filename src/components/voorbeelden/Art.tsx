/**
 * Gestileerde illustraties voor de voorbeeldgesprekken (geen foto's, niets van internet).
 * Platte vormen in de huisstijlkleuren; de echte beschrijving staat altijd als tekst eronder.
 */

type ArtKind = "meterkast" | "ketel" | "remblok" | "goot-los" | "goot-nieuw" | "gevel" | "algemeen";

export const artKind = (beschrijving: string): ArtKind => {
  const t = beschrijving.toLowerCase();
  if (/meterkast|aardlek/.test(t)) return "meterkast";
  if (/ketel/.test(t)) return "ketel";
  if (/remblok/.test(t)) return "remblok";
  if (/gevel|rijtjeshuis/.test(t)) return "gevel";
  if (/goot/.test(t) && /nieuw|strak/.test(t)) return "goot-nieuw";
  if (/goot/.test(t)) return "goot-los";
  return "algemeen";
};

const INK = "#0E1110";

export const PhotoArt = ({ beschrijving, className = "", width, height }: { beschrijving: string; className?: string; width?: number; height?: number }) => {
  const kind = artKind(beschrijving);
  const size = width && height ? { width, height } : {};
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label={beschrijving} preserveAspectRatio="xMidYMid slice" {...size}>
      {kind === "meterkast" && (
        <g>
          <rect width="320" height="200" fill="#E9E4D8" />
          <rect x="40" y="18" width="240" height="168" rx="8" fill="#F7F7F2" stroke={INK} strokeWidth="3" />
          <rect x="56" y="34" width="208" height="14" rx="3" fill="#C9C4B8" />
          {/* rail met groepen */}
          <rect x="56" y="70" width="208" height="70" rx="4" fill="#DCDAD3" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const down = i === 2;
            const x = 66 + i * 26;
            return (
              <g key={i}>
                <rect x={x} y="76" width="20" height="58" rx="3" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
                <rect x={x + 5} y={down ? 108 : 84} width="10" height="18" rx="2" fill={down ? "#E4572E" : INK} />
              </g>
            );
          })}
          {/* aardlekschakelaar (breder, omlaag) */}
          <rect x="226" y="76" width="30" height="58" rx="3" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
          <rect x="234" y="108" width="14" height="18" rx="2" fill="#E4572E" />
          <circle cx="241" cy="86" r="4" fill="#25855A" />
          <path d="M120 150 l10 10 l10 -10" stroke="#E4572E" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M231 150 l10 10 l10 -10" stroke="#E4572E" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "ketel" && (
        <g>
          <rect width="320" height="200" fill="#E6ECEA" />
          <rect x="88" y="10" width="144" height="196" rx="12" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
          <rect x="108" y="40" width="104" height="46" rx="6" fill={INK} />
          <path d="M126 74 l14 -24 l14 24 z" fill="#F7D95C" />
          <rect x="139" y="57" width="2.5" height="8" fill={INK} />
          <rect x="139" y="68" width="2.5" height="2.5" fill={INK} />
          <rect x="162" y="52" width="38" height="8" rx="2" fill="#F7D95C" opacity=".9" />
          <rect x="162" y="66" width="26" height="8" rx="2" fill="#F7D95C" opacity=".6" />
          {/* drukmeter, wijzer laag */}
          <circle cx="160" cy="132" r="28" fill="#F7F7F2" stroke={INK} strokeWidth="3" />
          <path d="M138 140 A24 24 0 0 1 182 140" stroke="#C9C4B8" strokeWidth="5" fill="none" />
          <path d="M138 140 A24 24 0 0 1 142 122" stroke="#E4572E" strokeWidth="5" fill="none" />
          <line x1="160" y1="132" x2="141" y2="138" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="160" cy="132" r="4" fill={INK} />
          <circle cx="120" cy="178" r="6" fill="#C9C4B8" />
          <circle cx="200" cy="178" r="6" fill="#C9C4B8" />
        </g>
      )}
      {kind === "remblok" && (
        <g>
          <rect width="320" height="200" fill="#D9DCDA" />
          <rect x="0" y="150" width="320" height="50" fill="#C4C8C5" />
          {/* oud: dun */}
          <g transform="translate(36 60)">
            <rect x="0" y="0" width="112" height="70" rx="10" fill="#8B8F8C" stroke={INK} strokeWidth="3" />
            <rect x="10" y="50" width="92" height="10" rx="3" fill="#4A4540" />
          </g>
          {/* nieuw: dik */}
          <g transform="translate(172 60)">
            <rect x="0" y="0" width="112" height="70" rx="10" fill="#B5BAB7" stroke={INK} strokeWidth="3" />
            <rect x="10" y="26" width="92" height="34" rx="4" fill="#4A4540" />
          </g>
          <circle cx="92" cy="166" r="13" fill="#E4572E" stroke={INK} strokeWidth="2.5" />
          <path d="M87 161l10 10M97 161l-10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="228" cy="166" r="13" fill="#25855A" stroke={INK} strokeWidth="2.5" />
          <path d="M222 166l4 4 8-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "goot-los" && (
        <g>
          <rect width="320" height="200" fill="#CFE3EE" />
          <rect x="0" y="70" width="320" height="130" fill="#C98B6B" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <line key={r} x1="0" x2="320" y1={92 + r * 20} y2={92 + r * 20} stroke="#A96E52" strokeWidth="2" />
          ))}
          <path d="M0 40 L320 40 L320 64 L0 64 Z" fill="#7A3E2E" />
          {/* beugels */}
          <rect x="60" y="62" width="8" height="18" fill={INK} />
          <rect x="190" y="62" width="8" height="18" fill={INK} />
          {/* goot hangt scheef */}
          <path d="M10 78 L200 84 L300 118 L300 132 L200 98 L10 92 Z" fill="#A9B3B0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          {/* water langs de muur */}
          <path d="M296 134 C292 150 300 162 294 178 C290 188 298 196 296 200" stroke="#3A87C8" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="282" cy="150" r="4" fill="#3A87C8" />
          <circle cx="286" cy="172" r="3" fill="#3A87C8" />
        </g>
      )}
      {kind === "goot-nieuw" && (
        <g>
          <rect width="320" height="200" fill="#D6E9F2" />
          <rect x="0" y="80" width="320" height="120" fill="#C98B6B" />
          {[0, 1, 2, 3, 4].map((r) => (
            <line key={r} x1="0" x2="320" y1={102 + r * 20} y2={102 + r * 20} stroke="#A96E52" strokeWidth="2" />
          ))}
          <path d="M0 30 L320 30 L320 64 L0 64 Z" fill="#7A3E2E" />
          {[40, 140, 240].map((x) => <rect key={x} x={x} y="60" width="8" height="26" fill={INK} />)}
          <path d="M0 70 L320 70 L320 96 Q160 104 0 96 Z" fill="#C8D0CD" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <line x1="0" y1="76" x2="320" y2="76" stroke="#FFFFFF" strokeWidth="3" opacity=".8" />
          {/* ladder */}
          <g opacity=".95">
            <line x1="250" y1="200" x2="270" y2="100" stroke="#8A8F8C" strokeWidth="8" />
            <line x1="296" y1="200" x2="310" y2="100" stroke="#8A8F8C" strokeWidth="8" />
            {[130, 160, 190].map((y) => <line key={y} x1={256 - (y - 130) * -0.2} y1={y} x2={302 + (y - 130) * 0.15} y2={y} stroke="#8A8F8C" strokeWidth="6" />)}
          </g>
          <circle cx="40" cy="160" r="18" fill="#25855A" />
          <path d="M31 160 l6 6 l12 -12" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "gevel" && (
        <g>
          <rect width="320" height="200" fill="#D6E9F2" />
          <rect x="0" y="176" width="320" height="24" fill="#B9C4BE" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 110 - 10} 0)`}>
              <path d="M5 80 L55 30 L105 80 Z" fill={i === 1 ? "#8A3F2C" : "#7A3E2E"} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="10" y="80" width="90" height="100" fill={i === 1 ? "#C98B6B" : "#BE8264"} stroke={INK} strokeWidth="2.5" />
              <rect x="22" y="96" width="30" height="26" fill="#EAF4F8" stroke={INK} strokeWidth="2" />
              <rect x="62" y="130" width="24" height="46" fill={i === 1 ? "#25855A" : "#3A3F3D"} stroke={INK} strokeWidth="2" />
              <rect x="22" y="134" width="30" height="26" fill="#EAF4F8" stroke={INK} strokeWidth="2" />
            </g>
          ))}
          {/* goot: rechtsboven los */}
          <rect x="0" y="78" width="200" height="7" fill="#A9B3B0" stroke={INK} strokeWidth="2" />
          <path d="M200 78 L232 84 L300 98 L300 106 L232 92 L200 85 Z" fill="#A9B3B0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="270" cy="90" r="22" fill="none" stroke="#E4572E" strokeWidth="4" />
        </g>
      )}
      {kind === "algemeen" && (
        <g>
          <rect width="320" height="200" fill="#E6ECEA" />
          <circle cx="110" cy="70" r="22" fill="#F7D95C" />
          <path d="M0 200 L90 110 L160 170 L220 120 L320 200 Z" fill="#25855A" />
        </g>
      )}
    </svg>
  );
};

/** Mini-kaartje voor een locatiebericht. */
export const MiniMap = ({ className = "", width, height }: { className?: string; width?: number; height?: number }) => (
  <svg viewBox="0 0 320 140" className={className} aria-hidden preserveAspectRatio="xMidYMid slice" {...(width && height ? { width, height } : {})}>
    <rect width="320" height="140" fill="#EAF0E6" />
    <rect x="0" y="0" width="90" height="56" fill="#DCE8D2" />
    <rect x="232" y="84" width="88" height="56" fill="#DCE8D2" />
    <path d="M0 98 C80 90 140 104 220 80 S300 60 320 64" stroke="#FFFFFF" strokeWidth="14" fill="none" />
    <path d="M0 98 C80 90 140 104 220 80 S300 60 320 64" stroke="#F7D95C" strokeWidth="5" fill="none" />
    <line x1="120" y1="0" x2="150" y2="140" stroke="#FFFFFF" strokeWidth="10" />
    <line x1="0" y1="30" x2="320" y2="20" stroke="#FFFFFF" strokeWidth="7" />
    <line x1="250" y1="0" x2="236" y2="140" stroke="#FFFFFF" strokeWidth="7" />
    <rect x="0" y="118" width="320" height="22" fill="#BFDCEB" opacity=".9" />
    <g transform="translate(176 26)">
      <path d="M18 0 C8 0 0 8 0 18 C0 32 18 50 18 50 C18 50 36 32 36 18 C36 8 28 0 18 0 Z" fill="#E4572E" stroke={INK} strokeWidth="2.5" />
      <circle cx="18" cy="18" r="6.5" fill="#FFFFFF" />
    </g>
  </svg>
);

/* ---------- Kleine iconen ---------- */
type IP = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IcoDoc = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
);
export const IcoLink = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const IcoPhone = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const IcoList = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r=".6" fill="currentColor" /><circle cx="4" cy="12" r=".6" fill="currentColor" /><circle cx="4" cy="18" r=".6" fill="currentColor" /></svg>
);
export const IcoBolt = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
);
export const IcoTap = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M9 11V5a2 2 0 0 1 4 0v6" /><path d="M13 10a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L5.5 14a1.8 1.8 0 0 1 3-2L9 13" /></svg>
);
export const IcoCamera = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.5" /></svg>
);
export const IcoPin = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IcoForm = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
);
export const IcoMail = ({ className }: IP) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
/** Dubbele vinkjes (gelezen) */
export const Ticks = ({ className }: IP) => (
  <svg viewBox="0 0 18 11" className={className} aria-label="Gelezen" role="img">
    <path d="M1 6l3 3 6-7.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 9l1 0.4 6-7.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Iconen voor "Achter de schermen" */
export const SceneArt = ({ kind, className = "" }: { kind: "werkbon" | "agenda" | "lijst" | "ster" | "huis"; className?: string }) => {
  const s = { stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      {kind === "werkbon" && (
        <g>
          <rect x="10" y="6" width="28" height="36" rx="4" fill="#FFFFFF" {...s} />
          <rect x="18" y="3" width="12" height="7" rx="2" fill="#F7D95C" {...s} />
          <path d="M16 20h16M16 26h16M16 32h9" {...s} />
          <circle cx="34" cy="36" r="8" fill="#25855A" stroke={INK} strokeWidth="2.4" />
          <path d="M30.5 36l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "agenda" && (
        <g>
          <rect x="6" y="10" width="36" height="32" rx="5" fill="#FFFFFF" {...s} />
          <path d="M6 18h36" {...s} />
          <rect x="6" y="10" width="36" height="8" rx="4" fill="#E4572E" stroke={INK} strokeWidth="2.4" />
          <path d="M15 6v8M33 6v8" {...s} />
          <rect x="13" y="24" width="10" height="7" rx="1.5" fill="#9FE0B8" stroke={INK} strokeWidth="2" />
          <path d="M28 27h8M14 36h8M28 36h8" {...s} strokeWidth={2} />
        </g>
      )}
      {kind === "lijst" && (
        <g>
          <rect x="8" y="6" width="32" height="36" rx="4" fill="#FFFFFF" {...s} />
          <circle cx="16" cy="16" r="3" fill="#9FE0B8" stroke={INK} strokeWidth="2" />
          <circle cx="16" cy="25" r="3" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
          <circle cx="16" cy="34" r="3" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
          <path d="M23 16h11M23 25h11M23 34h8" {...s} />
        </g>
      )}
      {kind === "ster" && (
        <g>
          <rect x="6" y="8" width="36" height="28" rx="5" fill="#FFFFFF" {...s} />
          <path d="M16 36l-4 7 10-7" fill="#FFFFFF" {...s} />
          <path d="M24 13l3 6 6.5 1-4.7 4.5 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5L14.5 20l6.5-1z" fill="#F7D95C" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}
      {kind === "huis" && (
        <g>
          <path d="M6 22L24 7l18 15" {...s} />
          <rect x="11" y="20" width="26" height="22" fill="#FFFFFF" {...s} />
        </g>
      )}
    </svg>
  );
};
