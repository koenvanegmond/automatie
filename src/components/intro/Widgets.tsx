"use client";
import { useMemo, useState, type FormEvent } from "react";
import type { Lang } from "@/lib/content";
import { scripts } from "./script";

type UI = (typeof scripts)["nl"]["ui"];
type Done = (result: "ok" | "notConnected", summary: string) => void;

/** 06-nummers en +31 normaliseren naar internationaal formaat */
export function normalizePhone(raw: string) {
  let p = raw.replace(/[\s()-]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (p.startsWith("06")) p = "+31" + p.slice(1);
  if (!p.startsWith("+") && p.startsWith("31")) p = "+" + p;
  return /^\+[1-9]\d{8,14}$/.test(p) ? p : null;
}

async function send(payload: Record<string, unknown>): Promise<"ok" | "notConnected"> {
  try {
    const res = await fetch("/api/intake", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok ? "ok" : "notConnected";
  } catch {
    return "notConnected";
  }
}

const field = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand";

const Contact = ({ labels, name, setName, phone, setPhone, consent, setConsent, error }: {
  labels: { name: string; phone: string; consent: string };
  name: string; setName: (v: string) => void; phone: string; setPhone: (v: string) => void;
  consent: boolean; setConsent: (v: boolean) => void; error: string | null;
}) => (
  <>
    <div className="grid gap-2 sm:grid-cols-2">
      <input className={field} placeholder={labels.name} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" aria-label={labels.name} />
      <input className={field} placeholder={labels.phone + " (06…)"} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" aria-label={labels.phone} />
    </div>
    <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-white/60">
      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#25855A]" />
      {labels.consent}
    </label>
    {error && <p className="mt-2 text-[13px] text-[#F28B82]" role="alert">{error}</p>}
  </>
);

export const MeetingWidget = ({ ui, lang, interest, onDone }: { ui: UI; lang: Lang; interest: string; onDone: Done }) => {
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    }
    return out;
  }, []);
  const locale = lang === "nl" ? "nl-NL" : "en-GB";
  const [day, setDay] = useState<Date | null>(null);
  const [part, setPart] = useState<"morning" | "afternoon" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!day || !part) return setError(ui.meeting.pickDay);
    const p = normalizePhone(phone);
    if (!p) return setError(ui.invalidPhone);
    if (!consent) return setError(ui.needConsent);
    setError(null);
    setBusy(true);
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const result = await send({ type: "meeting", name, phone: p, consent, date: iso, part, interest, lang });
    const label = `${day.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}, ${part === "morning" ? ui.meeting.morning : ui.meeting.afternoon}`;
    onDone(result, `📅 ${label}`);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl rounded-tl-md border border-white/10 bg-[#141D1B] p-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]">
      <p className="font-semibold text-white">{ui.meeting.title}</p>
      <p className="mt-0.5 text-[13px] text-white/50">{ui.meeting.sub}</p>
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {days.map((d) => {
          const active = day?.toDateString() === d.toDateString();
          return (
            <button type="button" key={d.toISOString()} onClick={() => setDay(d)} aria-pressed={active}
              className={`rounded-xl border px-1 py-2 text-center transition-all ${active ? "border-brand bg-brand text-white" : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/30"}`}>
              <span className="block text-[10px] uppercase tracking-wider opacity-70">{d.toLocaleDateString(locale, { weekday: "short" })}</span>
              <span className="block text-lg font-semibold leading-tight">{d.getDate()}</span>
              <span className="block text-[10px] opacity-60">{d.toLocaleDateString(locale, { month: "short" })}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {(["morning", "afternoon"] as const).map((pt) => (
          <button type="button" key={pt} onClick={() => setPart(pt)} aria-pressed={part === pt}
            className={`rounded-xl border py-2 text-sm font-medium transition-all ${part === pt ? "border-brand bg-brand text-white" : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/30"}`}>
            {pt === "morning" ? ui.meeting.morning : ui.meeting.afternoon}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Contact labels={ui.meeting} name={name} setName={setName} phone={phone} setPhone={setPhone} consent={consent} setConsent={setConsent} error={error} />
      </div>
      <button disabled={busy} className="mt-4 w-full rounded-xl bg-brand py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
        {busy ? ui.meeting.sending : ui.meeting.submit}
      </button>
    </form>
  );
};

export const WhatsAppWidget = ({ ui, lang, interest, onDone }: { ui: UI; lang: Lang; interest: string; onDone: Done }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!p) return setError(ui.invalidPhone);
    if (!consent) return setError(ui.needConsent);
    setError(null);
    setBusy(true);
    const result = await send({ type: "whatsapp", name, phone: p, consent, interest, lang });
    onDone(result, `📱 ${p}`);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl rounded-tl-md border border-white/10 bg-[#141D1B] p-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]">
      <p className="font-semibold text-white">{ui.whatsapp.title}</p>
      <p className="mb-4 mt-0.5 text-[13px] text-white/50">{ui.whatsapp.sub}</p>
      <Contact labels={ui.whatsapp} name={name} setName={setName} phone={phone} setPhone={setPhone} consent={consent} setConsent={setConsent} error={error} />
      <button disabled={busy} className="mt-4 w-full rounded-xl bg-brand py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
        {busy ? ui.whatsapp.sending : ui.whatsapp.submit}
      </button>
    </form>
  );
};
