import { LogoMark } from "@/components/LogoMark";
import { Wordmark } from "@/components/Wordmark";

// Logo: robothoofd (chatbubbel) + APPMAATJE in Anton. Vectoren staan ook in /public (logo.svg, logo-light.svg, logo-mark.svg).
export const Logo = ({ className = "", light = false, mark = false }: { className?: string; light?: boolean; mark?: boolean }) => (
  <span className={`inline-flex items-center gap-2.5 ${light ? "text-white" : "text-ink"} ${className}`} aria-label="Appmaatje">
    <LogoMark className="h-12 w-auto" />
    {!mark && <Wordmark className="h-[22px] w-auto" />}
  </span>
);
