"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { content, type Lang } from "./content";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "nl", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "nl") { setLangState(saved); document.documentElement.lang = saved; }
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch {}
  };
  return (
    <Ctx.Provider value={{ lang, setLang }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
export const useT = () => content[useContext(Ctx).lang];
