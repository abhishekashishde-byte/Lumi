import { useState } from "react";
import { Confetti, SuccessBanner } from "./Confetti";

const CHAIN = [
  { id: "sun", name: "Sonne", emoji: "☀️" },
  { id: "plant", name: "Pflanze", emoji: "🌿" },
  { id: "deer", name: "Reh", emoji: "🦌" },
  { id: "wolf", name: "Wolf", emoji: "🐺" },
];

const MISSING = "deer";
const OPTIONS = [
  { emoji: "🐟", name: "Fisch", correct: false },
  { emoji: "🦌", name: "Reh", correct: true },
  { emoji: "🦁", name: "Löwe", correct: false },
];

export function FoodChainGame() {
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState(false);

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">
        In der Nahrungskette fehlt ein Tier! Welches gehört dorthin?
      </p>

      <div className="rounded-3xl bg-[#1A1A2E] p-5">
        <div className="space-y-2">
          {CHAIN.map((c, i) => {
            const isMissing = c.id === MISSING && !solved;
            return (
              <div key={c.id} className="flex flex-col items-center">
                <div
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 ${
                    isMissing
                      ? "border-dashed border-red-500 bg-red-500/10"
                      : "border-white/10 bg-[#0D0D1A]"
                  } ${solved ? "animate-spring" : ""}`}
                >
                  <div className={`text-4xl ${isMissing ? "opacity-20" : ""}`}>
                    {isMissing ? "❓" : c.emoji}
                  </div>
                  <p
                    className={`font-display text-lg font-bold ${
                      isMissing ? "text-red-300" : "text-white"
                    }`}
                  >
                    {isMissing ? "Wer fehlt hier?" : c.name}
                  </p>
                </div>
                {i < CHAIN.length - 1 && (
                  <div className="my-1 text-2xl text-emerald-400">↓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!solved && (
        <>
          <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
            Wähle das fehlende Tier
          </p>
          <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.name}
                onClick={() => {
                  if (o.correct) setSolved(true);
                  else setHint(true);
                }}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg active:scale-95"
              >
                <span className="text-4xl">{o.emoji}</span>
                <span className="text-xs font-bold text-white">{o.name}</span>
              </button>
            ))}
          </div>
          {hint && (
            <p className="mt-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">
              Tipp: Welches Tier frisst Pflanzen und wird vom Wolf gejagt?
            </p>
          )}
        </>
      )}

      {solved && (
        <>
          <SuccessBanner>Die Kette ist gerettet!</SuccessBanner>
          <button
            onClick={() => {
              setSolved(false);
              setHint(false);
            }}
            className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
          >
            Nochmal spielen
          </button>
        </>
      )}
      <Confetti run={solved} />
    </div>
  );
}
