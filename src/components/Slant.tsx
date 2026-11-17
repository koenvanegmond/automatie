/** Kop waarvan de laatste woorden schuin staan, zoals in de referentie ("ALWAYS *HERE TO HELP*") */
export const Slant = ({ text, last = 1 }: { text: string; last?: number }) => {
  const words = text.split(" ");
  const cut = Math.max(0, words.length - last);
  return (
    <>
      {words.slice(0, cut).join(" ")}{cut > 0 ? " " : ""}
      <span className="inline-block origin-bottom-left -skew-x-[11deg] pr-[0.08em]">{words.slice(cut).join(" ")}</span>
    </>
  );
};
