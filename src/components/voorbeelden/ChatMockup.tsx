"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import type { Bericht, Element, Moment } from "@/lib/voorbeelden";
import { displayName, initials } from "@/lib/voorbeelden";
import {
  IcoBolt, IcoCamera, IcoForm, IcoLink, IcoList, IcoMail, IcoPhone, IcoPin, IcoTap, MiniMap, PhotoArt, Ticks,
} from "./Art";

/**
 * Voorbeeldgesprek als telefoon (WhatsApp-achtig, zonder logo) of als mailvenster.
 *
 * Alle tekst staat in de server-HTML. Animatie is progressive enhancement:
 * - layout.tsx zet `chat-js` op <html>; alleen dan verbergt CSS de berichten tot de telefoon in beeld komt.
 * - bij prefers-reduced-motion staat alles meteen in beeld (CSS + hier geen timers).
 */

declare global { interface Window { __cmReady?: boolean } }

const LINK_SOORT: Record<string, string> = {
  betaallink: "Betaalpagina",
  review: "Reviewpagina",
  brochure: "Brochure van de woning",
};

const fileKind = (name: string) => (/\.ics$/i.test(name) ? "Agenda-afspraak" : /\.pdf$/i.test(name) ? "PDF-document" : "Bestand");

/** Speelt de berichten één voor één af zodra het blok in beeld komt. */
function useReveal(count: number, kinds: ("bedrijf" | "klant" | "tap")[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"pending" | "run" | "done">("pending");
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(-1);

  useEffect(() => {
    window.__cmReady = true;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setState("done");
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      setState("run");
      let t = 250;
      for (let i = 0; i < count; i++) {
        const k = kinds[i];
        const wait = k === "tap" ? 0 : k === "bedrijf" ? 750 : 650;
        const idx = i;
        if (wait) timers.push(setTimeout(() => setTyping(idx), t));
        t += wait || 420;
        timers.push(setTimeout(() => { setTyping(-1); setShown(idx + 1); }, t));
        t += 380;
      }
      timers.push(setTimeout(() => setState("done"), t));
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(); }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [count, kinds]);

  return { ref, state, shown, typing };
}

const kindsOf = (b: Bericht[]) => b.map((m) => (m.element?.type === "knopantwoord" ? "tap" : m.van)) as ("bedrijf" | "klant" | "tap")[];

export const ChatMockup = ({ moment, className = "" }: { moment: Moment; className?: string }) =>
  moment.kanaal === "email" ? <MailMockup moment={moment} className={className} /> : <PhoneMockup moment={moment} className={className} />;

/* ============================== Telefoon ============================== */

const PhoneMockup = ({ moment, className }: { moment: Moment; className: string }) => {
  const msgs = moment.berichten;
  const [kinds] = useState(() => kindsOf(msgs));
  const { ref, state, shown, typing } = useReveal(msgs.length, kinds);
  const name = displayName(moment.bedrijf);

  return (
    <div ref={ref} data-anim={state} className={`cm mx-auto w-full max-w-[380px] rounded-[44px] bg-ink p-[9px] shadow-[0_30px_60px_-30px_rgba(14,17,16,.55)] ${className}`}>
      <div className="relative overflow-hidden rounded-[36px] bg-[#EFEAE2]">
        {/* kop */}
        <div className="relative bg-[#1F7A50] px-4 pb-3 pt-8 text-white">
          <span aria-hidden className="absolute left-1/2 top-2.5 h-[18px] w-[92px] -translate-x-1/2 rounded-full bg-ink" />
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-[22px] leading-none text-white/90">‹</span>
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint font-ui text-[14px] font-bold text-ink">{initials(moment.bedrijf)}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[16px] font-semibold">{name}</p>
              <p className="text-[13px] text-white/80">Zakelijk account</p>
            </div>
          </div>
        </div>

        {/* gesprek */}
        <div className="cm-bg flex flex-col gap-1.5 px-3 pb-5 pt-3">
          {msgs.map((m, i) => {
            const next = msgs[i + 1];
            const chosen = next?.element?.type === "knopantwoord" ? next.tekst : undefined;
            return (
              <Fragment key={i}>
                {m.dag && <DaySep>{m.dag}</DaySep>}
                <div className={`cm-msg relative ${m.van === "bedrijf" ? "self-end" : "self-start"} w-full`}
                  data-on={i < shown ? "" : undefined} data-typing={typing === i ? "" : undefined}>
                  <span aria-hidden className={`cm-typing absolute top-1 flex gap-1 rounded-[14px] bg-white px-3 py-3 shadow-sm ${m.van === "bedrijf" ? "right-0 !bg-[#D9FDD3]" : "left-0"}`}>
                    <i /><i /><i />
                  </span>
                  <ChatBubble m={m} chosen={chosen} />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DaySep = ({ children }: { children: ReactNode }) => (
  <div className="cm-msg-day my-2 flex justify-center">
    <span className="rounded-[8px] bg-white/90 px-3 py-1 text-[13px] font-semibold text-ink/70 shadow-sm">{children}</span>
  </div>
);

const Meta = ({ m }: { m: Bericht }) => (
  <span className="ml-2 mt-1 inline-flex translate-y-[3px] items-center gap-1 whitespace-nowrap align-bottom text-[12px] leading-none text-ink/50 float-right">
    {m.tijd}
    {m.van === "bedrijf" && <Ticks className="h-[11px] w-[17px] text-[#3A97D4]" />}
  </span>
);

const ChatBubble = ({ m, chosen }: { m: Bericht; chosen?: string }) => {
  const mine = m.van === "bedrijf";
  const els = [m.element, m.element_extra].filter(Boolean) as Element[];
  const header = els.filter((e) => e.type === "foto" || e.type === "document" || e.type === "locatie");
  const cards = els.filter((e) => e.type === "link");
  const below = els.filter((e) => e.type === "knoppen" || e.type === "knop_bellen" || e.type === "lijst");
  const tapped = m.element?.type === "knopantwoord";

  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div className={`relative max-w-[86%] rounded-[14px] px-2.5 pb-1.5 pt-1.5 text-[15px] leading-[1.38] text-ink shadow-[0_1px_0.5px_rgba(14,17,16,.13)] ${mine ? "rounded-tr-[4px] bg-[#D9FDD3]" : "rounded-tl-[4px] bg-white"} ${header.length || cards.length ? "w-[86%]" : ""}`}>
        {m.sjabloon && (
          <p className="mb-1 flex items-center gap-1 px-0.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1F7A50]"><IcoBolt className="h-3.5 w-3.5" />Automatisch</p>
        )}
        {header.map((e, i) => <HeaderMedia key={i} e={e} />)}
        <p className="whitespace-pre-line break-words px-0.5 after:block after:clear-both after:content-['']">
          {tapped && <IcoTap className="mr-1 inline h-4 w-4 -translate-y-px text-ink/50" />}
          {m.tekst}
          <Meta m={m} />
        </p>
        {cards.map((e, i) => e.type === "link" && (
          <div key={i} className="clear-both mt-1.5 flex items-center gap-2.5 rounded-[10px] bg-black/[.05] p-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-brand text-white"><IcoLink className="h-5 w-5" /></span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-semibold text-ink">{e.label}</span>
              <span className="block text-[13px] text-ink/60">{LINK_SOORT[e.soort] ?? "Link"}</span>
            </span>
          </div>
        ))}
      </div>
      {below.map((e, i) => <BelowButtons key={i} e={e} chosen={chosen} />)}
    </div>
  );
};

const HeaderMedia = ({ e }: { e: Element }) => {
  if (e.type === "foto")
    return (
      <figure className="-mx-1 mb-1.5 overflow-hidden rounded-[10px] bg-white">
        <PhotoArt beschrijving={e.beschrijving} className="block aspect-[16/10] w-full" />
        <figcaption className="flex gap-1.5 bg-black/[.04] px-2 py-1.5 text-[14px] leading-snug text-ink/70">
          <IcoCamera className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{e.beschrijving}</span>
        </figcaption>
      </figure>
    );
  if (e.type === "document")
    return (
      <div className="-mx-1 mb-1.5 flex items-center gap-2.5 rounded-[10px] bg-black/[.05] p-2">
        <span className="grid h-11 w-9 shrink-0 place-items-center rounded-[6px] bg-[#E4572E] font-ui text-[11px] font-bold text-white">{/\.ics$/i.test(e.bestandsnaam) ? "ICS" : "PDF"}</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-semibold text-ink">{e.bestandsnaam}</span>
          <span className="block text-[13px] text-ink/60">{fileKind(e.bestandsnaam)}</span>
        </span>
      </div>
    );
  if (e.type === "locatie")
    return (
      <div className="-mx-1 mb-1.5 overflow-hidden rounded-[10px] bg-white">
        <MiniMap className="block aspect-[16/7] w-full" />
        <div className="flex items-start gap-1.5 px-2 py-1.5 leading-tight">
          <IcoPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E4572E]" />
          <span><span className="block text-[15px] font-semibold text-ink">{e.naam}</span><span className="block text-[13px] text-ink/60">{e.adres}</span></span>
        </div>
      </div>
    );
  return null;
};

const BelowButtons = ({ e, chosen }: { e: Element; chosen?: string }) => {
  const btn = "flex min-h-[40px] items-center justify-center gap-1.5 rounded-[12px] bg-white px-3 py-2 text-center text-[15px] font-semibold leading-tight text-[#1F7A50] shadow-[0_1px_0.5px_rgba(14,17,16,.13)]";
  if (e.type === "knoppen")
    return (
      <div className="mt-1 grid w-[86%] gap-1">
        {e.knoppen.map((k) => {
          const on = chosen === k;
          return (
            <span key={k} className={`${btn} ${on ? "!bg-[#1F7A50] !text-white" : ""}`}>
              {on && <IcoTap className="h-4 w-4" />}{k}
            </span>
          );
        })}
      </div>
    );
  if (e.type === "knop_bellen")
    return <div className="mt-1 grid w-[86%]"><span className={btn}><IcoPhone className="h-4 w-4" />{e.label}</span></div>;
  if (e.type === "lijst")
    return (
      <div className="mt-1 w-[86%]">
        <span className={btn}><IcoList className="h-4 w-4" />{e.knop}</span>
        <div className="mt-1 overflow-hidden rounded-[12px] bg-white shadow-[0_1px_0.5px_rgba(14,17,16,.13)]">
          {e.opties.map((o) => {
            const on = chosen === o;
            return (
              <div key={o} className="flex items-center justify-between gap-3 border-t border-ink/10 px-3 py-2 text-[15px] leading-tight text-ink first:border-t-0">
                <span className={on ? "font-semibold" : ""}>{o}</span>
                <span aria-hidden className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${on ? "border-[#1F7A50]" : "border-ink/30"}`}>
                  {on && <span className="h-2 w-2 rounded-full bg-[#1F7A50]" />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  return null;
};

/* ============================== Mail ============================== */

const MailMockup = ({ moment, className }: { moment: Moment; className: string }) => {
  const msgs = moment.berichten;
  const [kinds] = useState(() => kindsOf(msgs));
  const { ref, state, shown, typing } = useReveal(msgs.length, kinds);
  const name = displayName(moment.bedrijf);

  return (
    <div ref={ref} data-anim={state} className={`cm mx-auto w-full max-w-[560px] overflow-hidden rounded-[18px] border-2 border-ink bg-white shadow-[0_30px_60px_-30px_rgba(14,17,16,.45)] ${className}`}>
      <div className="flex items-center gap-2 border-b-2 border-ink bg-sand px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5"><i className="h-3 w-3 rounded-full bg-[#E4572E]" /><i className="h-3 w-3 rounded-full bg-sun" /><i className="h-3 w-3 rounded-full bg-mint" /></span>
        <span className="ml-2 flex items-center gap-1.5 text-[14px] font-semibold text-ink/70"><IcoMail className="h-4 w-4" />Postvak IN</span>
      </div>
      <div className="flex flex-col gap-3 bg-[#F7F7F2] p-3 md:p-4">
        {msgs.map((m, i) => (
          <Fragment key={i}>
            {m.dag && <p className="cm-msg-day mt-1 text-center text-[13px] font-semibold text-ink/60">{m.dag}</p>}
            <div className="cm-msg relative" data-on={i < shown ? "" : undefined} data-typing={typing === i ? "" : undefined}>
              <span aria-hidden className="cm-typing absolute left-3 top-3 flex gap-1 rounded-full bg-white px-3 py-2.5 shadow-sm"><i /><i /><i /></span>
              <MailItem m={m} name={name} initials={initials(moment.bedrijf)} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const MailItem = ({ m, name, initials: ini }: { m: Bericht; name: string; initials: string }) => {
  // Bijlagen eerst, knoppen eronder (zoals in een echte mail).
  const els = ([m.element, m.element_extra].filter(Boolean) as Element[]).sort((a, b) => Number(b.type === "document") - Number(a.type === "document"));
  if (m.van === "klant") {
    const form = els.find((e) => e.type === "formulier");
    return (
      <div className="rounded-[14px] border-2 border-dashed border-ink/30 bg-white p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[14px] font-bold text-ink"><IcoForm className="h-4 w-4" />Websiteformulier</span>
          <span className="text-[13px] text-ink/50">{m.tijd}</span>
        </div>
        <p className="mt-2 text-[15px] leading-[1.45] text-ink">{m.tekst}</p>
        {form && form.type === "formulier" && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {form.velden.map((v) => <span key={v} className="rounded-full bg-sand px-2.5 py-1 text-[13px] font-semibold text-ink/70">{v}</span>)}
          </div>
        )}
      </div>
    );
  }
  return (
    <article className="rounded-[14px] border border-ink/15 bg-white p-3.5 shadow-[0_1px_0_rgba(14,17,16,.06)]">
      <header className="flex items-start gap-2.5">
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint font-ui text-[13px] font-bold text-ink">{ini}</span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[14px] font-semibold text-ink/70">{name}</span>
            <span className="shrink-0 text-[13px] text-ink/50">{m.tijd}</span>
          </div>
          {m.onderwerp && <p className="mt-0.5 text-[16px] font-bold text-ink">{m.onderwerp}</p>}
          {m.sjabloon && <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1F7A50]"><IcoBolt className="h-3.5 w-3.5" />Automatisch</p>}
        </div>
      </header>
      <p className="mt-2.5 whitespace-pre-line text-[15px] leading-[1.45] text-body">{m.tekst}</p>
      {els.map((e, i) => {
        if (e.type === "knoppen")
          return (
            <div key={i} className="mt-3 flex flex-wrap gap-2">
              {e.knoppen.map((k) => <span key={k} className="rounded-[8px] border-2 border-[#1F7A50] px-3 py-1.5 text-[14px] font-semibold text-[#1F7A50]">{k}</span>)}
            </div>
          );
        if (e.type === "link")
          return <span key={i} className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-[#1F7A50] px-4 py-2 text-[15px] font-semibold text-white"><IcoLink className="h-4 w-4" />{e.label}</span>;
        if (e.type === "document")
          return (
            <div key={i} className="mt-3 flex w-fit max-w-full items-center gap-2 rounded-[10px] border border-ink/15 bg-sand px-2.5 py-1.5">
              <span className="grid h-8 w-7 shrink-0 place-items-center rounded-[4px] bg-[#E4572E] font-ui text-[10px] font-bold text-white">{/\.ics$/i.test(e.bestandsnaam) ? "ICS" : "PDF"}</span>
              <span className="min-w-0 leading-tight"><span className="block truncate text-[14px] font-semibold text-ink">{e.bestandsnaam}</span><span className="block text-[12px] text-ink/60">{fileKind(e.bestandsnaam)}</span></span>
            </div>
          );
        return null;
      })}
    </article>
  );
};
