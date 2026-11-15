"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { from: "them" | "bot"; text: string };

/** Telefoon met een gesprek dat zich live uittypt (klant rechts, automatisering links) */
export const Phone = ({ chat, name, status }: { chat: Msg[]; name: string; status: string }) => {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    setShown(0);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const next = () => {
      if (i >= chat.length) {
        timers.push(setTimeout(() => { i = 0; setShown(0); next(); }, 4000));
        return;
      }
      const isBot = chat[i].from === "bot";
      setTyping(isBot);
      timers.push(setTimeout(() => {
        setTyping(false);
        i += 1;
        setShown(i);
        next();
      }, isBot ? 1300 : 900));
    };
    timers.push(setTimeout(next, 500));
    return () => timers.forEach(clearTimeout);
  }, [chat]);

  return (
    <div className="relative mx-auto w-[300px] rounded-[46px] bg-ink p-3 shadow-[0_40px_80px_-30px_rgba(28,25,23,.5)]">
      <div className="overflow-hidden rounded-[36px] bg-[#EFEDE6]">
        <div className="flex items-center gap-3 bg-brand px-4 pb-3 pt-7 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-display font-bold">{name[0]}</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-[11px] text-white/80">{status}</p>
          </div>
        </div>
        <div className="flex h-[440px] flex-col justify-end gap-2 px-3 py-4 dot-grid">
          <AnimatePresence initial={false}>
            {chat.slice(0, shown).map((m, i) => (
              <motion.div key={i} layout initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[82%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm ${m.from === "them" ? "self-end rounded-br-md bg-[#D5EFDF] text-ink" : "self-start rounded-bl-md bg-white text-ink"}`}>
                {m.text}
              </motion.div>
            ))}
            {typing && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="self-start flex gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-3 shadow-sm">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-ink/50" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.12 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
