import { useEffect, useState } from "react";
import type { InternetStep } from "@/content/topics";

export function InternetJourney({ steps }: { steps: InternetStep[] }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<InternetStep | null>(null);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1400);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="rounded-3xl bg-black/40 p-5">
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                isActive
                  ? "border-[#F59E0B] bg-[#F59E0B]/10 scale-[1.02]"
                  : "border-white/10 bg-[#1A1A2E]"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                  isActive ? "bg-[#F59E0B] animate-pulse-glow" : "bg-white/5"
                }`}
              >
                {s.emoji}
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-bold text-white">{s.label}</p>
                <p className="text-xs text-slate-400">Tippen für Details</p>
              </div>
              {i < steps.length - 1 && (
                <span className={`text-2xl ${isActive ? "text-[#F59E0B]" : "text-slate-600"}`}>
                  ↓
                </span>
              )}
            </button>
          );
        })}
      </div>
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
            <h3 className="mt-2 font-display text-2xl font-black text-white">{selected.label}</h3>
            <p className="mt-3 text-base text-slate-200">{selected.explanation}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
