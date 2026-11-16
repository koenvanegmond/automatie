"use client";
import { useState, type FormEvent } from "react";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { Loader } from "@/components/Loader";
import { normalizePhone } from "@/components/intro/Widgets";

const field = "h-14 w-full bg-white px-4 text-[18px] font-semibold text-ink outline-none transition-shadow placeholder:text-body/50 focus:shadow-[inset_0_-3px_0_#25855A]";

export const MeetPage = () => {
  const t = useT();
  const m = t.meetPage;
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "ok" | "off">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!p) return setError(m.bad);
    if (!consent) return setError(m.noConsent);
    setError(null); setState("busy");
    try {
      const res = await fetch("/api/intake", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "whatsapp", name, phone: p, consent, lang }) });
      setState(res.ok ? "ok" : "off");
    } catch { setState("off"); }
  };

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="container">
        <div className="text-center">
          <h1 className="h2 md:text-[72px]">{m.title}</h1>
          <p className="lead mx-auto mt-4 max-w-xl">{m.sub}</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="flex flex-col rounded-none bg-ink p-8 text-white md:p-10">
            <h2 className="font-display text-[28px] font-black tracking-[-0.025em]">{m.appTitle}</h2>
            <p className="mt-2 text-white/65">{m.appText}</p>
            <Button href={waLink(t.hero.waText)} external size="lg" className="mt-auto w-full md:mt-12">{t.ui.nav.cta}</Button>
          </div>
          <form onSubmit={submit} noValidate className="rounded-none bg-sand p-8 md:p-10">
            <h2 className="font-display text-[28px] font-black tracking-[-0.025em] text-ink">{m.formTitle}</h2>
            {state === "ok" ? <p className="mt-6 text-brand-dark">{m.ok}</p> : state === "off" ? (
              <div className="mt-6"><p className="text-body">{m.off}</p><Button href={waLink(t.hero.waText)} external className="mt-4">{t.ui.nav.cta}</Button></div>
            ) : (
              <>
                <div className="mt-6 space-y-3">
                  <input className={field} placeholder={m.name} aria-label={m.name} autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className={field} placeholder={`${m.phone} (06…)`} aria-label={m.phone} inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[14px] text-body">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#25855A]" />{m.consent}
                </label>
                {error && <p role="alert" className="mt-2 text-[14px] text-[#B42318]">{error}</p>}
                <Button type="submit" size="lg" className="mt-6 w-full">{state === "busy" ? <Loader size={22} color="#FFFFFF" /> : m.send}</Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
