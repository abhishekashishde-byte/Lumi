import { useState } from "react";
import type { ChainLink } from "@/content/topics";

export function FoodChain({ chain }: { chain: ChainLink[] }) {
  const [broken, setBroken] = useState(false);
  const [selected, setSelected] = useState<ChainLink | null>(null);

  return (
    <div className="rounded-3xl bg-black/40 p-5">
      <div className="flex flex-col gap-2">
        {chain.map((c, i) => {
          const isWolf = c.id === "wolf";
          const hide = broken && isWolf;
          const decayed = broken && i < chain.length - 1;
          return (
            <div key={c.id} className="flex flex-col items-center">
              <button
                onClick={() => setSelected(c)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 border-white/10 bg-[#1A1A2E] p-3 text-left transition-all ${
                  hide ? "opacity-20 line-through" : decayed ? "opacity-60" : ""
                }`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <div className="flex-1">
                  <p className="font-display text-lg font-bold text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">Tippen für Details</p>
                </div>
              </button>
              {i < chain.length - 1 && (
                <div
                  className={`my-1 text-2xl ${
                    broken && i >= 1 ? "text-red-500" : "text-emerald-400"
                  }`}
                >
                  {broken && i >= 1 ? "✕" : "↓"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setBroken(!broken)}
        className="mt-4 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
      >
        {broken ? "Wolf zurückbringen" : "Was, wenn der Wolf verschwindet?"}
      </button>

      {broken && (
        <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
          Ohne Wolf wachsen die Rehe stark – sie fressen zu viele Pflanzen. Das Gleichgewicht
          kippt.
        </p>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md animate-spring rounded-3xl bg-[#1A1A2E] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl">{selected.emoji}</div>
            <h3 className="mt-2 font-display text-2xl font-black text-white">{selected.name}</h3>
            <p className="mt-3 text-base text-slate-200">{selected.role}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
