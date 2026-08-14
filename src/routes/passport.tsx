import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";
import {
  usePassport,
  topicProgress,
  isUnlocked,
  totalDiscoveries,
  setEquippedAura,
  setEquippedBadge,
} from "@/lib/passport";
import { discoveryTopics, type DiscoveryCard } from "@/content/discoveries";
import { AURAS, BADGES, findAdornment } from "@/content/adornments";
import { ExplorerBadge } from "@/components/passport/ExplorerBadge";
import { DiscoveryCardTile } from "@/components/passport/DiscoveryCardTile";
import { LumiAvatar } from "@/components/LumiAvatar";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Curiosity Passport – Warum" },
      { name: "description", content: "Deine gesammelten Entdeckungen." },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const passport = usePassport();
  const total = totalDiscoveries(passport);
  const { lang } = useLang();
  const t = useT();
  const [openCard, setOpenCard] = useState<{ card: DiscoveryCard; topicId: string } | null>(null);

  return (
    <main className="min-h-screen bg-[#0D0D1A] pb-24">
      <Link
        to="/erkunden"
        className="fixed left-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10"
        aria-label={t("Zurück", "Back")}
      >
        <ArrowLeft className="h-6 w-6 text-white" aria-hidden="true" />
      </Link>

      <div className="mx-auto max-w-2xl px-5 pt-20">
        <header className="mb-6">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
            {t("Neugier-Pass", "Curiosity Passport")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-black leading-tight text-white">
            {t("Deine Entdeckungen", "Your Discoveries")}
          </h1>
        </header>

        <ExplorerBadge total={total} />

        {/* Lumi & Glow Collection */}
        <section className="mt-6 rounded-3xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <LumiAvatar aura={passport.equippedAura} badge={passport.equippedBadge} size={80} />
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
                {t("Lumis Leuchtsammlung", "Lumi's Glow Collection")}
              </p>
              <p className="mt-1 font-display text-lg font-black text-white">
                {findAdornment(passport.equippedAura)?.[lang] ??
                  t("Wähle ein Leuchten", "Pick a glow")}
              </p>
              {passport.equippedBadge && (
                <p className="text-xs text-white/60">
                  + {findAdornment(passport.equippedBadge)?.[lang]}
                </p>
              )}
            </div>
          </div>

          {/* Auras */}
          <p className="mt-5 font-display text-[10px] font-bold uppercase tracking-widest text-white/50">
            {t("Aura", "Aura")}
          </p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {AURAS.map((a) => {
              const unlocked = passport.unlockedAdornments.includes(a.id);
              const active = passport.equippedAura === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => unlocked && setEquippedAura(a.id)}
                  disabled={!unlocked}
                  title={unlocked ? a[lang] : `${t("Frei bei", "Unlocks at")} ${a.atDiscoveries}`}
                  className={`relative aspect-square rounded-2xl ring-1 transition ${
                    unlocked
                      ? active
                        ? "ring-amber-300"
                        : "ring-white/10 active:scale-95"
                      : "ring-white/5 opacity-40"
                  }`}
                  style={{
                    background: unlocked
                      ? `radial-gradient(circle at 50% 50%, ${a.auraFrom} 0%, ${a.auraTo} 70%)`
                      : "rgba(255,255,255,0.02)",
                  }}
                  aria-label={a[lang]}
                >
                  {!unlocked && (
                    <Lock className="absolute right-1 top-1 h-3 w-3 text-white/40" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Badges */}
          <p className="mt-5 font-display text-[10px] font-bold uppercase tracking-widest text-white/50">
            {t("Abzeichen", "Badges")}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <button
              onClick={() => setEquippedBadge(null)}
              className={`aspect-square rounded-2xl bg-white/5 text-2xl ring-1 transition ${
                passport.equippedBadge === null ? "ring-amber-300" : "ring-white/10"
              }`}
              aria-label={t("Kein Abzeichen", "No badge")}
            >
              —
            </button>
            {BADGES.map((b) => {
              const unlocked = passport.unlockedAdornments.includes(b.id);
              const active = passport.equippedBadge === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => unlocked && setEquippedBadge(b.id)}
                  disabled={!unlocked}
                  title={unlocked ? b[lang] : `${t("Frei bei", "Unlocks at")} ${b.atDiscoveries}`}
                  className={`relative flex aspect-square items-center justify-center rounded-2xl p-2 ring-1 transition ${
                    unlocked
                      ? active
                        ? "bg-amber-300/20 ring-amber-300"
                        : "bg-white/5 ring-white/10 active:scale-95"
                      : "bg-white/[0.02] ring-white/5 opacity-40"
                  }`}
                >
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b[lang]}
                      className={`h-full w-full object-contain ${unlocked ? "" : "grayscale"}`}
                      loading="lazy"
                    />
                  )}
                  {!unlocked && (
                    <Lock className="absolute right-1 top-1 h-3 w-3 text-white/40" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Topics */}
        <div className="mt-6 space-y-5">
          {discoveryTopics.map((topic) => {
            const { unlocked, total: topicTotal } = topicProgress(passport, topic.id);
            return (
              <section
                key={topic.id}
                className={`rounded-3xl bg-gradient-to-br p-5 ring-1 ring-white/10 ${topic.gradient}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-black text-white">
                    {topic.emoji} {topic.title[lang]}
                  </h2>
                  <span className="rounded-full bg-black/30 px-3 py-1 font-display text-xs font-black text-amber-300 ring-1 ring-white/10">
                    {unlocked} / {topicTotal}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  {unlocked === 0
                    ? t("Stelle eine Frage, um etwas freizuschalten.", "Ask a question to unlock something.")
                    : t(
                        `${topicTotal - unlocked} weitere Entdeckungen warten.`,
                        `${topicTotal - unlocked} more discoveries waiting.`,
                      )}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {topic.cards.map((c) => (
                    <DiscoveryCardTile
                      key={c.id}
                      card={c}
                      unlocked={isUnlocked(passport, topic.id, c.id)}
                      onClick={() =>
                        isUnlocked(passport, topic.id, c.id)
                          ? setOpenCard({ card: c, topicId: topic.id })
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          {t(
            "Jede Frage öffnet eine neue Welt.",
            "Every question opens a new world.",
          )}
        </p>
      </div>

      {openCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
          onClick={() => setOpenCard(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="animate-spring w-full max-w-sm rounded-3xl bg-[#10101e] p-6 text-center ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl" aria-hidden="true">{openCard.card.emoji}</div>
            <h3 className="mt-3 font-display text-2xl font-black text-white">
              {openCard.card.title[lang]}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {openCard.card.fact[lang]}
            </p>
            <button
              onClick={() => setOpenCard(null)}
              className="mt-6 min-h-12 w-full rounded-full bg-amber-300 py-3 font-display text-sm font-black uppercase tracking-wide text-[#0D0D1A]"
            >
              {t("Schließen", "Close")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
