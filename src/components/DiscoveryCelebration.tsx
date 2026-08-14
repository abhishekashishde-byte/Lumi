import { useState } from "react";
import { Confetti } from "@/components/games/Confetti";
import { useCelebration, type CelebrationDetail } from "@/lib/passport";
import { useLang, useT } from "@/lib/i18n";
import { findTopic } from "@/content/discoveries";

export function DiscoveryCelebration() {
  const [detail, setDetail] = useState<CelebrationDetail | null>(null);
  const { lang } = useLang();
  const t = useT();

  useCelebration((d) => setDetail(d));

  if (!detail) return null;
  const { card, topicId, leveledUp } = detail;
  const topic = findTopic(topicId);

  const close = () => setDetail(null);

  return (
    <>
      <Confetti run={true} />
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md px-6"
        role="dialog"
        aria-modal="true"
        onClick={close}
      >
        <div
          className="animate-spring w-full max-w-sm rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-6 text-center ring-1 ring-white/15 shadow-[0_0_80px_rgba(168,85,247,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
            ✨ {t("Entdeckung freigeschaltet!", "Discovery unlocked!")}
          </p>
          <div className="mt-4 text-7xl leading-none" aria-hidden="true">{card.emoji}</div>
          <h2 className="mt-3 font-display text-2xl font-black leading-tight text-white">
            {card.title[lang]}
          </h2>
          {topic && (
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">
              {topic.emoji} {topic.title[lang]}
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-white/90">{card.fact[lang]}</p>

          {leveledUp && (
            <div className="mt-5 rounded-2xl bg-black/30 p-4 ring-1 ring-amber-300/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {t("Neuer Titel", "New title")}
              </p>
              <p className="mt-1 font-display text-lg font-black text-white">
                {leveledUp.emoji} {leveledUp.title}
              </p>
            </div>
          )}

          <button
            onClick={close}
            className="mt-6 min-h-14 w-full rounded-full bg-amber-300 py-4 font-display text-base font-black uppercase tracking-wide text-[#0D0D1A] transition-transform active:scale-[0.98]"
          >
            {t("Weiter erkunden", "Continue exploring")}
          </button>
        </div>
      </div>
    </>
  );
}
