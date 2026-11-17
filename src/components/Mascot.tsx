// Mascotte: sticker-PNG met transparante achtergrond (public/mascot.png).
export const Mascot = ({ className = "" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/mascot.png" alt="Appmaatje robot" width={522} height={502} className={`bob h-auto select-none ${className}`} style={{ ["--r" as string]: "-3deg", ["--d" as string]: "6s" }} draggable={false} />
);
