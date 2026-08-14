import lumiLogo from "@/assets/lumi-logo.png";
import { findAdornment, type AdornmentId } from "@/content/adornments";

/**
 * Lumi mascot with optional aura (glow behind) + side badge (floating pin).
 * Fits a lightbulb character — no headwear stacking.
 */
export function LumiAvatar({
  aura,
  badge,
  size = 96,
  className = "",
}: {
  aura?: AdornmentId | null;
  badge?: AdornmentId | null;
  size?: number;
  className?: string;
}) {
  const a = findAdornment(aura ?? null);
  const b = findAdornment(badge ?? null);

  const auraFrom = a?.auraFrom ?? "rgba(255,200,80,0.5)";
  const auraTo = a?.auraTo ?? "rgba(255,200,80,0)";

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Aura glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${auraFrom} 0%, ${auraTo} 65%)`,
          transform: "scale(1.35)",
          filter: "blur(4px)",
        }}
      />
      <img
        src={lumiLogo}
        alt="Lumi"
        width={size}
        height={size}
        className="relative"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Side badge */}
      {b?.image && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -bottom-2 select-none rounded-full bg-black/40 ring-1 ring-white/15 backdrop-blur"
          style={{
            padding: Math.round(size * 0.04),
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.5))",
          }}
        >
          <img
            src={b.image}
            alt=""
            width={Math.round(size * 0.42)}
            height={Math.round(size * 0.42)}
            className="block"
          />
        </span>
      )}
    </div>
  );
}
