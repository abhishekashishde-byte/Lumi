import { useState } from "react";
import { Confetti, SuccessBanner } from "./Confetti";

type Slot = { id: string; needs: "battery" | "wire" | "bulb"; filled: boolean };
type Piece = { id: string; type: "battery" | "wire" | "bulb"; emoji: string; label: string };

const PIECES: Piece[] = [
  { id: "p1", type: "battery", emoji: "🔋", label: "Batterie" },
  { id: "p2", type: "wire", emoji: "➖", label: "Kabel" },
  { id: "p3", type: "bulb", emoji: "💡", label: "Lampe" },
  { id: "p4", type: "wire", emoji: "➖", label: "Kabel" },
];

const INITIAL: Slot[] = [
  { id: "s1", needs: "battery", filled: false },
  { id: "s2", needs: "wire", filled: false },
  { id: "s3", needs: "bulb", filled: false },
  { id: "s4", needs: "wire", filled: false },
];

export function CircuitPuzzleGame() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL);
  const [available, setAvailable] = useState<Piece[]>(PIECES);
  const [picked, setPicked] = useState<Piece | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const placeIn = (slot: Slot) => {
    if (!picked || slot.filled) return;
    if (slot.needs === picked.type) {
      setSlots((s) => s.map((x) => (x.id === slot.id ? { ...x, filled: true } : x)));
      setAvailable((a) => a.filter((p) => p.id !== picked.id));
      setPicked(null);
    } else {
      setWrong(slot.id);
      setTimeout(() => setWrong(null), 400);
    }
  };

  const complete = slots.every((s) => s.filled);

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">
        Tippe ein Teil unten an, dann setze es in die richtige Lücke.
      </p>

      <div className="rounded-3xl bg-[#1A1A2E] p-5">
        <div className="grid grid-cols-4 gap-3">
          {slots.map((s) => {
            const isWrong = wrong === s.id;
            return (
              <button
                key={s.id}
                onClick={() => placeIn(s)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 text-3xl transition-all ${
                  s.filled
                    ? complete
                      ? "animate-spring border-amber-400 bg-amber-400/20 shadow-[0_0_24px_rgba(245,158,11,0.5)]"
                      : "border-emerald-500 bg-emerald-500/10"
                    : isWrong
                      ? "border-red-500 bg-red-500/10"
                      : picked
                        ? "border-[#7C3AED] bg-[#7C3AED]/10 animate-pulse-glow"
                        : "border-dashed border-white/20"
                }`}
              >
                {s.filled ? (
                  s.needs === "battery" ? "🔋" : s.needs === "wire" ? "➖" : "💡"
                ) : (
                  <span className="text-xs font-bold text-slate-500">
                    {s.needs === "battery" ? "Batterie" : s.needs === "wire" ? "Kabel" : "Lampe"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
        Deine Teile
      </p>
      <div className="grid grid-cols-4 gap-2">
        {available.map((p) => (
          <button
            key={p.id}
            onClick={() => setPicked(p)}
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-2 shadow-lg transition-transform active:scale-95 ${
              picked?.id === p.id ? "ring-4 ring-white" : ""
            }`}
          >
            <span className="text-3xl">{p.emoji}</span>
            <span className="text-[10px] font-bold text-white">{p.label}</span>
          </button>
        ))}
      </div>

      {complete && (
        <>
          <SuccessBanner>Strom fließt! Gut gemacht!</SuccessBanner>
          <button
            onClick={() => {
              setSlots(INITIAL);
              setAvailable(PIECES);
              setPicked(null);
            }}
            className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
          >
            Nochmal spielen
          </button>
        </>
      )}
      <Confetti run={complete} />
    </div>
  );
}
