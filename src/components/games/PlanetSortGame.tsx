import { useState } from "react";
import { Confetti, SuccessBanner } from "./Confetti";

const SOLUTION = ["Merkur", "Venus", "Erde", "Mars", "Jupiter", "Saturn", "Uranus", "Neptun"];
const EMOJI: Record<string, string> = {
  Merkur: "🪨", Venus: "🟡", Erde: "🌍", Mars: "🔴",
  Jupiter: "🟠", Saturn: "🪐", Uranus: "🔵", Neptun: "🌀",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PlanetSortGame() {
  const [pool, setPool] = useState<string[]>(() => shuffle(SOLUTION));
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(8).fill(null));
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  const placeNext = (planet: string) => {
    const nextSlot = slots.findIndex((s) => s === null);
    if (nextSlot < 0) return;
    if (SOLUTION[nextSlot] === planet) {
      setSlots((prev) => {
        const cp = [...prev];
        cp[nextSlot] = planet;
        return cp;
      });
      setPool((p) => p.filter((x) => x !== planet));
    } else {
      const slot = nextSlot;
      setWrongIdx(slot);
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  const done = slots.every((s) => s !== null);

  const reset = () => {
    setPool(shuffle(SOLUTION));
    setSlots(Array(8).fill(null));
  };

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">
        Tippe die Planeten in der richtigen Reihenfolge von der Sonne aus.
      </p>

      <div className="rounded-3xl bg-[#1A1A2E] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
          ☀️ Von der Sonne nach außen
        </p>
        <div className="grid grid-cols-4 gap-2">
          {slots.map((s, i) => (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 text-center ${
                s
                  ? "animate-spring border-emerald-500 bg-emerald-500/10"
                  : wrongIdx === i
                    ? "border-red-500 bg-red-500/10"
                    : "border-dashed border-white/20"
              }`}
            >
              {s ? (
                <>
                  <span className="text-2xl">{EMOJI[s]}</span>
                  <span className="text-[10px] font-bold text-white">{s}</span>
                </>
              ) : (
                <span className="text-xs text-slate-500">{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {pool.map((p) => (
          <button
            key={p}
            onClick={() => placeNext(p)}
            className="flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-2 text-center shadow-lg active:scale-95"
          >
            <span className="text-2xl">{EMOJI[p]}</span>
            <span className="text-[11px] font-bold text-white">{p}</span>
          </button>
        ))}
      </div>

      {done && (
        <>
          <SuccessBanner>Perfekt! Du kennst alle Planeten!</SuccessBanner>
          <button
            onClick={reset}
            className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
          >
            Nochmal spielen
          </button>
        </>
      )}
      <Confetti run={done} />
    </div>
  );
}
