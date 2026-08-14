import { useState } from "react";

export function CircuitBuilder() {
  const [on, setOn] = useState(false);
  const [extra, setExtra] = useState(false);

  return (
    <div className="rounded-3xl bg-black/40 p-5">
      <svg viewBox="0 0 320 220" className="w-full">
        {/* battery */}
        <g>
          <rect x="20" y="160" width="50" height="30" rx="4" fill="#F59E0B" />
          <text x="45" y="180" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0D0D1A">
            🔋
          </text>
        </g>
        {/* wires */}
        <path
          d="M70 175 L150 175"
          stroke={on ? "#F59E0B" : "#475569"}
          strokeWidth="4"
          fill="none"
          className={on ? "flow-line" : ""}
        />
        <path
          d="M170 175 L290 175 L290 60 L160 60"
          stroke={on ? "#F59E0B" : "#475569"}
          strokeWidth="4"
          fill="none"
          className={on ? "flow-line" : ""}
        />
        <path
          d="M140 60 L20 60 L20 160"
          stroke={on ? "#F59E0B" : "#475569"}
          strokeWidth="4"
          fill="none"
          className={on ? "flow-line" : ""}
        />
        {/* switch */}
        <g onClick={() => setOn(!on)} style={{ cursor: "pointer" }}>
          <rect x="148" y="158" width="24" height="34" rx="6" fill="#1A1A2E" stroke="#7C3AED" strokeWidth="2" />
          <circle cx="160" cy={on ? 167 : 183} r="6" fill="#7C3AED" />
        </g>
        {/* bulb */}
        <g>
          <circle
            cx="150"
            cy="60"
            r="22"
            fill={on ? "#FBBF24" : "#1A1A2E"}
            stroke={on ? "#F59E0B" : "#475569"}
            strokeWidth="3"
            style={{
              filter: on ? "drop-shadow(0 0 20px #FBBF24)" : "none",
              transition: "all 0.3s",
            }}
          />
          <text x="150" y="68" textAnchor="middle" fontSize="20">
            💡
          </text>
        </g>
        {/* extra motor */}
        {extra && (
          <g>
            <circle cx="240" cy="60" r="20" fill={on ? "#10B981" : "#1A1A2E"} stroke="#10B981" strokeWidth="3" />
            <text x="240" y="68" textAnchor="middle" fontSize="20">
              ⚙️
            </text>
            <path
              d="M172 60 L218 60"
              stroke={on ? "#F59E0B" : "#475569"}
              strokeWidth="4"
              fill="none"
              className={on ? "flow-line" : ""}
            />
          </g>
        )}
      </svg>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setOn(!on)}
          className={`min-h-[48px] flex-1 rounded-2xl font-display font-bold transition-colors ${on ? "bg-[#F59E0B] text-[#0D0D1A]" : "bg-[#7C3AED] text-white"}`}
        >
          Schalter {on ? "AUS" : "EIN"}
        </button>
        <button
          onClick={() => setExtra(!extra)}
          className="min-h-[48px] rounded-2xl border-2 border-[#7C3AED] px-4 font-display font-bold text-white"
        >
          {extra ? "Motor weg" : "+ Motor"}
        </button>
      </div>
    </div>
  );
}
