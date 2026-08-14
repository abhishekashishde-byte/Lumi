import { useState } from "react";
import type { PlanetData } from "@/content/topics";

export function PlanetsOrrery({ planets }: { planets: PlanetData[] }) {
  const [selected, setSelected] = useState<PlanetData | null>(null);
  const max = 320;
  return (
    <div className="relative">
      <div
        className="relative mx-auto overflow-hidden rounded-3xl bg-black/40"
        style={{ width: "100%", maxWidth: max + 40, aspectRatio: "1 / 1" }}
      >
        <div className="absolute inset-0 starfield" />
        <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
          {/* Sun */}
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_40px_15px_rgba(253,224,71,0.6)]" />
          {planets.map((p) => {
            const scale = max / 2 / 305;
            const r = p.orbitRadius * scale;
            return (
              <div
                key={p.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 0,
                  height: 0,
                }}
              >
                {/* orbit ring */}
                <div
                  className="absolute rounded-full border border-white/10"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    left: -r,
                    top: -r,
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    // @ts-expect-error custom prop
                    "--orbit-r": `${r}px`,
                    animation: `orbit ${p.duration}s linear infinite`,
                    transformOrigin: "0 0",
                  }}
                >
                  <button
                    onClick={() => setSelected(p)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform active:scale-90"
                    style={{
                      width: p.size * 1.8,
                      height: p.size * 1.8,
                      background: p.color,
                      boxShadow: `0 0 ${p.size}px ${p.color}88`,
                    }}
                    aria-label={p.name}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md animate-spring rounded-3xl bg-[#1A1A2E] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full"
                style={{
                  background: selected.color,
                  boxShadow: `0 0 24px ${selected.color}88`,
                }}
              />
              <div>
                <h3 className="font-display text-2xl font-black text-white">{selected.name}</h3>
                <p className="text-xs text-slate-400">
                  {selected.sizeVsEarth} · {selected.distance}
                </p>
              </div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-200">{selected.fact}</p>
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
