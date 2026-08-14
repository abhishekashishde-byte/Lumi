import { useState } from "react";
import { Confetti, SuccessBanner } from "./Confetti";

const IMAGES = [
  { id: 1, emoji: "🐱", label: "Katze" },
  { id: 2, emoji: "🐶", label: "Hund" },
  { id: 3, emoji: "😼", label: "Katze" },
  { id: 4, emoji: "🐕", label: "Hund" },
  { id: 5, emoji: "🐈", label: "Katze" },
  { id: 6, emoji: "🦮", label: "Hund" },
];

export function AiTrainerGame() {
  const [pool, setPool] = useState(IMAGES);
  const [cats, setCats] = useState<typeof IMAGES>([]);
  const [dogs, setDogs] = useState<typeof IMAGES>([]);
  const [wrong, setWrong] = useState(false);
  const [picked, setPicked] = useState<(typeof IMAGES)[number] | null>(null);

  const drop = (target: "Katze" | "Hund") => {
    if (!picked) return;
    if (picked.label === target) {
      if (target === "Katze") setCats((c) => [...c, picked]);
      else setDogs((d) => [...d, picked]);
      setPool((p) => p.filter((x) => x.id !== picked.id));
      setPicked(null);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
  };

  const done = pool.length === 0;

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">
        Tippe ein Bild an, dann sortiere es. Du trainierst gerade die KI!
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => drop("Katze")}
          className={`min-h-[100px] rounded-3xl border-2 p-3 transition-all ${
            wrong && picked?.label !== "Katze"
              ? "border-red-500 bg-red-500/10"
              : picked
                ? "border-[#7C3AED] bg-[#7C3AED]/10 animate-pulse-glow"
                : "border-white/10 bg-[#1A1A2E]"
          }`}
        >
          <p className="font-display text-lg font-black text-white">🐱 Katze</p>
          <div className="mt-2 flex flex-wrap gap-1 text-2xl">
            {cats.map((c) => <span key={c.id}>{c.emoji}</span>)}
          </div>
        </button>
        <button
          onClick={() => drop("Hund")}
          className={`min-h-[100px] rounded-3xl border-2 p-3 transition-all ${
            wrong && picked?.label !== "Hund"
              ? "border-red-500 bg-red-500/10"
              : picked
                ? "border-[#7C3AED] bg-[#7C3AED]/10 animate-pulse-glow"
                : "border-white/10 bg-[#1A1A2E]"
          }`}
        >
          <p className="font-display text-lg font-black text-white">🐶 Hund</p>
          <div className="mt-2 flex flex-wrap gap-1 text-2xl">
            {dogs.map((c) => <span key={c.id}>{c.emoji}</span>)}
          </div>
        </button>
      </div>

      <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
        Bilder
      </p>
      <div className="grid grid-cols-3 gap-2">
        {pool.map((p) => (
          <button
            key={p.id}
            onClick={() => setPicked(p)}
            className={`aspect-square rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 text-4xl shadow-lg active:scale-95 ${
              picked?.id === p.id ? "ring-4 ring-white" : ""
            }`}
          >
            {p.emoji}
          </button>
        ))}
      </div>

      {done && (
        <>
          <SuccessBanner>Du hast die KI trainiert!</SuccessBanner>
          <div className="mt-3 rounded-3xl bg-[#1A1A2E] p-4">
            <p className="font-display text-sm font-bold text-white">Was hat die KI gelernt?</p>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>🐱 Katze</span>
                  <span>{cats.length}</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-white/5">
                  <div
                    className="h-3 rounded-full bg-[#7C3AED]"
                    style={{ width: `${(cats.length / 3) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>🐶 Hund</span>
                  <span>{dogs.length}</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-white/5">
                  <div
                    className="h-3 rounded-full bg-[#F59E0B]"
                    style={{ width: `${(dogs.length / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setPool(IMAGES);
              setCats([]);
              setDogs([]);
            }}
            className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
          >
            Nochmal trainieren
          </button>
        </>
      )}
      <Confetti run={done} />
    </div>
  );
}
