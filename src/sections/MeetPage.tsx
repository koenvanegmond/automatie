"use client";
import { useState, type FormEvent } from "react";
import { useLang, useT } from "@/lib/i18n";
import { waLink } from "@/lib/config";
import { Button } from "@/components/Buttons";
import { Loader } from "@/components/Loader";
import { Slant } from "@/components/Slant";
import { BellSticker, ChatSticker } from "@/components/Stickers";
import { normalizePhone } from "@/components/intro/Widgets";

const field = "h-[60px] w-full rounded-full border-2 border-ink bg-white px-6 text-[17px] font-medium text-ink outline-none placeholder:text-ink/40 focus:bg-mint/40";

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
    <section className="pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="container">
        <div className="text-center">
          <h1 className="h2">{m.title}</h1>
          <p className="lead mx-auto mt-5 max-w-2xl">{m.sub}</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="relative flex min-h-[460px] flex-col overflow-hidden rounded-[28px] border-2 border-ink bg-lilac p-8 text-ink md:p-12">
            <ChatSticker className="bob pointer-events-none absolute bottom-8 right-8 w-28 md:w-40" />
            <h2 className="font-display text-[72px] uppercase leading-[0.88] md:text-[104px]"><Slant text={m.appTitle} /></h2>
            <p className="lead mt-6 max-w-md">{m.appText}</p>
            <div className="mt-auto pt-10"><Button href={waLink(t.hero.waText)} external size="lg" variant="primary" arrow>{t.ui.nav.cta}</Button></div>
          </div>
          <form onSubmit={submit} noValidate className="relative flex min-h-[460px] flex-col overflow-hidden rounded-[28px] border-2 border-ink bg-sun p-8 md:p-12">
            <BellSticker className="bob pointer-events-none absolute bottom-6 right-8 hidden w-24 lg:block" />
            <h2 className="font-display text-[72px] uppercase leading-[0.88] text-ink md:text-[104px]"><Slant text={m.formTitle} /></h2>
            {state === "ok" ? <p className="lead mt-6">{m.ok}</p> : state === "off" ? (
              <div className="mt-6"><p className="lead">{m.off}</p><Button href={waLink(t.hero.waText)} external className="mt-4">{t.ui.nav.cta}</Button></div>
            ) : (
              <>
                <div className="mt-auto grid gap-2.5 pt-10 sm:grid-cols-2">
                  <input className={field} placeholder={m.name} aria-label={m.name} autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className={field} placeholder={`${m.phone} (06…)`} aria-label={m.phone} inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[15px] font-medium text-ink">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#25855A]" />{m.consent}
                </label>
                {error && <p role="alert" className="mt-2 text-[14px] text-[#B42318]">{error}</p>}
                <Button type="submit" size="lg" variant="primary" className="mt-5 w-fit min-w-[200px]">{state === "busy" ? <Loader size={22} color="#FFFFFF" /> : m.send}</Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
