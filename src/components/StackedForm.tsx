"use client";
import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { normalizePhone } from "@/components/intro/Widgets";
import { Loader } from "@/components/Loader";

/* Gestapeld 3D-formulier, gebaseerd op Uiverse.io (MBerkayHamurcu), in Appmaatje-groen */

const txt = {
  nl: { name: "Je naam", phone: "Mobiel nummer (06…)", company: "Bedrijf", send: "Stuur mij een appje", consent: "Ik geef Appmaatje toestemming om mij via WhatsApp te benaderen.", bad: "Vul een geldig mobiel nummer in.", noConsent: "Vink de toestemming aan.", ok: "Verstuurd ✓ Je krijgt zo een appje van ons.", off: "Dit formulier is nog niet gekoppeld.", openWa: "App ons direct", wa: "Hoi Appmaatje! Ik wil graag kennismaken." },
  en: { name: "Your name", phone: "Mobile number", company: "Company", send: "Message me", consent: "I allow Appmaatje to contact me on WhatsApp.", bad: "Enter a valid mobile number.", noConsent: "Tick the consent box.", ok: "Sent ✓ You'll get a message from us shortly.", off: "This form isn't connected yet.", openWa: "Message us directly", wa: "Hi Appmaatje! I'd like an intro." },
};

export const StackedForm = () => {
  const { lang } = useLang();
  const t = txt[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "ok" | "off">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!p) return setError(t.bad);
    if (!consent) return setError(t.noConsent);
    setError(null);
    setState("busy");
    try {
      const res = await fetch("/api/intake", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "whatsapp", name: `${name}${company ? ` (${company})` : ""}`, phone: p, consent, lang }) });
      setState(res.ok ? "ok" : "off");
    } catch { setState("off"); }
  };

  if (state === "ok") return <p className="font-medium text-brand-dark">{t.ok}</p>;
  if (state === "off") return (
    <div className="text-left">
      <p className="text-body">{t.off}</p>
      <a href={waLink(t.wa)} target="_blank" rel="noopener" className="mt-3 inline-block font-medium text-brand-dark underline underline-offset-4">{t.openWa} →</a>
    </div>
  );

  const fields = [
    { v: name, set: setName, ph: t.name, type: "text", ac: "given-name" },
    { v: phone, set: setPhone, ph: t.phone, type: "tel", ac: "tel" },
    { v: company, set: setCompany, ph: t.company, type: "text", ac: "organization" },
  ];

  return (
    <div>
      <form onSubmit={submit} className="stacked-form" noValidate>
        <ul className="wrapper">
          {fields.map((f, i) => (
            <li key={f.ph} style={{ ["--i" as string]: 4 - i }}>
              <input className="input" type={f.type} autoComplete={f.ac} placeholder={f.ph} aria-label={f.ph}
                value={f.v} onChange={(e) => f.set(e.target.value)} />
            </li>
          ))}
          <button type="submit" style={{ ["--i" as string]: 1 }} disabled={state === "busy"}>
            <span className="flex h-full items-center justify-center">{state === "busy" ? <Loader size={22} color="#FFFFFF" /> : t.send}</span>
          </button>
        </ul>
      </form>
      <label className="mt-16 flex max-w-xs cursor-pointer items-start gap-2 text-left text-[13px] leading-snug text-body">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#25855A]" />
        {t.consent}
      </label>
      {error && <p role="alert" className="mt-2 text-left text-[13px] text-[#B42318]">{error}</p>}
    </div>
  );
};
