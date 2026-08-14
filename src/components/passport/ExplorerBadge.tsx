import { getLevel, getNextLevel } from "@/lib/levels";
import { useLang, useT } from "@/lib/i18n";

export function ExplorerBadge({ total, compact = false }: { total: number; compact?: boolean }) {
  const { lang } = useLang();
  const t = useT();
  const level = getLevel(total);
  const next = getNextLevel(total);
  const label = lang === "en" ? level.en : level.de;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15 backdrop-blur-md">
        <span aria-hidden="true">{level.emoji}</span>
        <span className="font-display text-[11px] font-black uppercase tracking-wider text-white">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-5 ring-1 ring-white/15">
      <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
        {t("Dein Titel", "Your title")}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">{level.emoji}</span>
        <div>
          <p className="font-display text-2xl font-black leading-tight text-white">{label}</p>
          <p className="text-xs text-white/70">
            {total} {t("Entdeckungen", "Discoveries")}
          </p>
        </div>
      </div>
      {next && (
        <p className="mt-3 text-[11px] text-white/60">
          {t(
            `Noch ${next.min - total} Entdeckungen bis „${lang === "en" ? next.en : next.de}" ${next.emoji}`,
            `${next.min - total} more discoveries to "${lang === "en" ? next.en : next.de}" ${next.emoji}`,
          )}
        </p>
      )}
    </div>
  );
}
