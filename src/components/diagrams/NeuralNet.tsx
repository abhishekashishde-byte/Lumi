import { useEffect, useState } from "react";

interface Node {
  id: string;
  label: string;
  emoji?: string;
  explanation: string;
}

interface NNData {
  inputs: Node[];
  hidden: Node[];
  output: Node[];
}

export function NeuralNet({ data }: { data: NNData }) {
  const [pulse, setPulse] = useState(0);
  const [selected, setSelected] = useState<Node | null>(null);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 3), 700);
    return () => clearInterval(id);
  }, []);

  const renderCol = (nodes: Node[], colIdx: number) => (
    <div className="flex flex-1 flex-col items-center justify-around gap-3">
      {nodes.map((n) => {
        const lit = pulse === colIdx;
        return (
          <button
            key={n.id}
            onClick={() => setSelected(n)}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-xl font-bold transition-all ${
              lit
                ? "border-[#7C3AED] bg-[#7C3AED]/30 scale-110 shadow-[0_0_24px_rgba(124,58,237,0.6)]"
                : "border-white/10 bg-[#1A1A2E] text-slate-300"
            }`}
          >
            {n.emoji ?? "●"}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-3xl bg-black/40 p-5">
      <div className="flex h-64 items-stretch gap-2">
        {renderCol(data.inputs, 0)}
        {renderCol(data.hidden, 1)}
        {renderCol(data.output, 2)}
      </div>
      <div className="mt-3 flex justify-around text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span>Eingabe</span>
        <span>Verstecktes Netz</span>
        <span>Ergebnis</span>
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
            <h3 className="font-display text-xl font-black text-white">Was macht dieser Knoten?</h3>
            <p className="mt-3 text-base text-slate-200">{selected.explanation}</p>
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
