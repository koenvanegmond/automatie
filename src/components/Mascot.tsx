// Mascotte: Koens robot als gevectoriseerde SVG (tools/build_mascot_vector.py).
// De animatie (zwaaien, antenne, knipperen) zit in de SVG zelf en stopt bij "minder beweging".
export const Mascot = ({ className = "" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/mascot.svg" alt="Appmaatje robot" width={2200} height={2120} className={`bob h-auto select-none ${className}`} style={{ ["--r" as string]: "-3deg", ["--d" as string]: "6s" }} draggable={false} />
);
