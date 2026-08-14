import { useEffect, useState } from "react";

export function Confetti({ run }: { run: boolean }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (run) setPieces(Array.from({ length: 40 }, (_, i) => i));
  }, [run]);
  if (!run) return null;
  const colors = ["#7C3AED", "#F59E0B", "#10B981", "#F8FAFC", "#06B6D4"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            background: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ${Math.random()}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
}

export function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-spring mt-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 text-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
      <p className="font-display text-2xl font-black text-white">🎉 {children}</p>
    </div>
  );
}
