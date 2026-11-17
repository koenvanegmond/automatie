import layers from "./mascotLayers.json";

// Mascotte in lagen (public/mascot/*.png, uitgeknipt uit jouw plaatje): basis + zwaaiende hand + antenne + ogen.
// Het uiterlijk is pixel-voor-pixel hetzelfde; alleen de delen bewegen.
const L = layers as Record<string, { x: number; y: number; w: number; h: number; ox: number; oy: number }>;
const pos = (n: string) => ({ left: `${L[n].x}%`, top: `${L[n].y}%`, width: `${L[n].w}%`, height: `${L[n].h}%`, transformOrigin: `${L[n].ox}% ${L[n].oy}%` });

export const Mascot = ({ className = "" }: { className?: string }) => (
  <div role="img" aria-label="Appmaatje robot" className={`bob relative select-none ${className}`} style={{ aspectRatio: "522 / 502", ["--r" as string]: "-3deg", ["--d" as string]: "6s" }}>
    {/* eslint-disable @next/next/no-img-element */}
    <img src="/mascot/base.png" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
    <img src="/mascot/antenna.png" alt="" draggable={false} className="ml-layer ml-ant" style={pos("antenna")} />
    <img src="/mascot/hand.png" alt="" draggable={false} className="ml-layer ml-hand" style={pos("hand")} />
    <img src="/mascot/eyeL.png" alt="" draggable={false} className="ml-layer ml-eye" style={pos("eyeL")} />
    <img src="/mascot/eyeR.png" alt="" draggable={false} className="ml-layer ml-eye" style={pos("eyeR")} />
  </div>
);
