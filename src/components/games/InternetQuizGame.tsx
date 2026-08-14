import { useState } from "react";
import { Confetti, SuccessBanner } from "./Confetti";

interface Step {
  question: string;
  options: { emoji: string; label: string }[];
  correct: number;
}

const STEPS: Step[] = [
  {
    question: "Du tippst auf 'Senden'. Wohin geht die Nachricht zuerst?",
    options: [
      { emoji: "📡", label: "Zum Router zu Hause" },
      { emoji: "🚀", label: "Direkt ins Weltall" },
      { emoji: "📺", label: "In den Fernseher" },
    ],
    correct: 0,
  },
  {
    question: "Vom Router – wie reist die Nachricht weiter?",
    options: [
      { emoji: "🐦", label: "Mit einem Vogel" },
      { emoji: "🌊", label: "Durch Kabel, sogar unter dem Meer" },
      { emoji: "☁️", label: "Auf einer Wolke" },
    ],
    correct: 1,
  },
  {
    question: "Wo wird die Nachricht zwischengelagert?",
    options: [
      { emoji: "🏢", label: "Im Rechenzentrum" },
      { emoji: "🏫", label: "In der Schule" },
      { emoji: "🍕", label: "In der Pizzeria" },
    ],
    correct: 0,
  },
  {
    question: "Und am Ende?",
    options: [
      { emoji: "🗑️", label: "Sie wird gelöscht" },
      { emoji: "📱", label: "Sie kommt beim Freund an" },
      { emoji: "🌙", label: "Sie fliegt zum Mond" },
    ],
    correct: 1,
  },
];

export function InternetQuizGame() {
  const [idx, setIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const done = idx >= STEPS.length;

  if (done) {
    return (
      <div>
        <SuccessBanner>Du hast die Reise geschafft!</SuccessBanner>
        <button
          onClick={() => setIdx(0)}
          className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-3 font-display font-bold text-white"
        >
          Nochmal spielen
        </button>
        <Confetti run={true} />
      </div>
    );
  }

  const step = STEPS[idx];

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-[#F59E0B]" : "bg-white/10"}`}
          />
        ))}
      </div>
      <div className={`rounded-3xl bg-[#1A1A2E] p-5 ${shake ? "animate-spring" : ""}`}>
        <p className="font-display text-lg font-bold text-white">{step.question}</p>
        <div className="mt-4 space-y-2">
          {step.options.map((o, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === step.correct) setIdx((x) => x + 1);
                else {
                  setShake(true);
                  setTimeout(() => setShake(false), 500);
                }
              }}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-white/10 bg-[#0D0D1A] p-4 text-left active:scale-[0.98]"
            >
              <span className="text-3xl">{o.emoji}</span>
              <span className="font-display text-base font-bold text-white">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
