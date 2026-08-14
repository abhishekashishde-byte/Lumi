import { Lock } from "lucide-react";
import type { DiscoveryCard } from "@/content/discoveries";
import { useLang } from "@/lib/i18n";

export function DiscoveryCardTile({
  card,
  unlocked,
  onClick,
}: {
  card: DiscoveryCard;
  unlocked: boolean;
  onClick?: () => void;
}) {
  const { lang } = useLang();
  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      className={`group relative aspect-square overflow-hidden rounded-2xl p-3 text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
        unlocked
          ? "bg-gradient-to-br from-violet-600/40 to-fuchsia-700/30 ring-1 ring-amber-300/40 active:scale-[0.96]"
          : "bg-white/[0.03] ring-1 ring-white/10"
      }`}
      aria-label={card.title[lang]}
    >
      <div className={`text-4xl transition ${unlocked ? "" : "grayscale opacity-30"}`} aria-hidden="true">
        {unlocked ? card.emoji : "❓"}
      </div>
      <p
        className={`mt-2 font-display text-[12px] font-black leading-tight ${
          unlocked ? "text-white" : "text-white/30"
        }`}
      >
        {unlocked ? card.title[lang] : "???"}
      </p>
      {!unlocked && (
        <Lock className="absolute right-2 top-2 h-3.5 w-3.5 text-white/30" aria-hidden="true" />
      )}
    </button>
  );
}
