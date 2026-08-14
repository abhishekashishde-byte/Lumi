import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { topics } from "@/content/topics";
import { useUI, useT } from "@/lib/i18n";
import { PENDING_ASK_KEY, loadRecentMeta, type RecentMeta } from "@/routes/entdecken";
import { usePassport, totalDiscoveries } from "@/lib/passport";
import { ExplorerBadge } from "@/components/passport/ExplorerBadge";
import { LumiAvatar } from "@/components/LumiAvatar";

const RECENT_KEY = "warum_entdecken_recent_v2";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

const topicArt: Record<string, string> = {
  planeten: "/planets/saturn.jpg",
  strom:
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  internet:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  ki: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  natur:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
};

const cardMotion: Record<string, string> = {
  planeten: "0s",
  strom: "0.45s",
  internet: "0.9s",
  ki: "1.35s",
  natur: "1.8s",
};

export const Route = createFileRoute("/erkunden")({
  head: () => ({
    meta: [
      { title: "Warum – Erkunden" },
      { name: "description", content: "Visuelle Antworten auf die Warum-Fragen deines Kindes." },
    ],
  }),
  component: Erkunden,
});

function Erkunden() {
  const ui = useUI();
  const tr = useT();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<string[]>([]);
  const [meta, setMeta] = useState<Record<string, RecentMeta>>({});
  const passport = usePassport();
  const total = totalDiscoveries(passport);

  useEffect(() => {
    const load = () => {
      setRecent(readRecent());
      setMeta(loadRecentMeta());
    };
    load();
    window.addEventListener("warum:recent", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("warum:recent", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const openRecent = (q: string) => {
    try {
      sessionStorage.setItem(PENDING_ASK_KEY, q);
    } catch {}
    navigate({ to: "/entdecken" });
  };

  const chipFor = (id: string) =>
    id === "natur"
      ? ui("chipNatur")
      : id === "ki"
        ? ui("chipKi")
        : id === "planeten"
          ? ui("chipPlaneten")
          : id === "strom"
            ? ui("chipStrom")
            : ui("chipInternet");

  const titleFor = (id: string, fallback: string) =>
    id === "planeten"
      ? tr("Planeten & Weltall", "Planets & Space")
      : id === "strom"
        ? tr("Strom & Schaltkreise", "Electricity & Circuits")
        : id === "internet"
          ? tr("Das Internet", "The Internet")
          : id === "ki"
            ? tr("Was ist KI?", "What is AI?")
            : id === "natur"
              ? tr("Erde & Natur", "Earth & Nature")
              : fallback;

  const questionFor = (id: string, fallback: string) =>
    id === "planeten"
      ? tr("Warum schweben die Planeten um die Sonne?", "Why do the planets float around the Sun?")
      : id === "strom"
        ? tr("Warum leuchtet eine Lampe, wenn du den Schalter drückst?", "Why does a lamp light up when you flip the switch?")
        : id === "internet"
          ? tr("Wie kommt eine Nachricht von dir zu deinem Freund?", "How does a message travel from you to your friend?")
          : id === "ki"
            ? tr("Wie lernt ein Computer, eine Katze zu erkennen?", "How does a computer learn to recognize a cat?")
            : id === "natur"
              ? tr("Warum braucht alles in der Natur einander?", "Why does everything in nature need each other?")
              : fallback;

  return (
    <main className="starfield mx-auto max-w-2xl px-4 pt-6 sm:pt-12">
      <header className="mb-4 flex flex-col items-center text-center sm:mb-6">
        <Link
          to="/passport"
          className="absolute right-4 top-4 z-30"
          aria-label={tr("Neugier-Pass öffnen", "Open Curiosity Passport")}
        >
          <ExplorerBadge total={total} compact />
        </Link>
        <Link to="/passport" aria-label={tr("Neugier-Pass öffnen", "Open Curiosity Passport")}>
          <LumiAvatar
            aura={passport.equippedAura}
            badge={passport.equippedBadge}
            size={192}
            className="h-24 w-24 sm:h-48 sm:w-48"
          />
        </Link>
        <h1 className="mt-2 font-display text-xl font-black leading-tight text-foreground sm:mt-3 sm:text-4xl">
          {ui("tagline")}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{ui("tapTopic")}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {topics.map((t, index) => {
          const title = titleFor(t.id, t.title);
          const question = questionFor(t.id, t.bigQuestion);
          return (
            <Link
              key={t.id}
              to="/topic/$id"
              params={{ id: t.id }}
              aria-label={`${title}: ${question}`}
              className="group relative aspect-[4/5] min-h-[170px] overflow-hidden rounded-2xl bg-neutral-900 shadow-lg ring-1 ring-white/10 transition-transform duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:min-h-[260px]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <img
                src={topicArt[t.id] ?? t.heroImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full animate-ken-burns object-cover transition duration-700 group-hover:scale-105"
                style={{ animationDelay: cardMotion[t.id] ?? "0s" }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.88)_100%)]" />

              <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
                <span className="self-start rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 ring-1 ring-white/15 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                  {chipFor(t.id)}
                </span>
                <div>
                  <h2 className="font-display text-sm font-black leading-tight text-white drop-shadow sm:text-xl">
                    {title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/75 sm:text-[12px]">
                    {question}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {recent.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-sm font-black uppercase tracking-widest text-amber-300">
              {tr("Deine Fragen", "Your questions")}
            </h2>
            <Link to="/entdecken" className="text-[11px] font-semibold text-white/60 hover:text-white">
              {tr("Neue Frage", "New question")} →
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recent.map((q) => {
              const m = meta[q];
              return (
                <button
                  key={q}
                  onClick={() => openRecent(q)}
                  className="group relative w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-900 text-left shadow-lg ring-1 ring-white/10 transition active:scale-[0.97] sm:w-48"
                  aria-label={`${tr("Frage erneut öffnen", "Reopen question")}: ${q}`}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {m?.image ? (
                      <img
                        src={m.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] to-[#0D0D1A]">
                        <Sparkles className="h-10 w-10 text-amber-300/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.92)_100%)]" />
                    <div className="relative flex h-full flex-col justify-end p-3">
                      <p className="line-clamp-3 font-display text-[13px] font-black leading-snug text-white drop-shadow">
                        {q}
                      </p>
                      {m?.headline && (
                        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-white/70">
                          {m.headline}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-xs text-muted-foreground">{ui("ageNote")}</p>
    </main>
  );
}