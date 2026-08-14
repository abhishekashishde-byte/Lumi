import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useUI } from "@/lib/i18n";


/* ============= Level system (per-topic) ============= */

export const MAX_LEVEL = 4;

const eventName = (topic: string) => `${topic}-level-change`;
const storageKey = (topic: string) => `${topic}_level`;

function clamp(n: number) {
  return Math.max(0, Math.min(MAX_LEVEL, n));
}

export function readTopicLevel(topic: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(localStorage.getItem(storageKey(topic)) ?? "0");
    return Number.isFinite(n) ? clamp(n) : 0;
  } catch {
    return 0;
  }
}

export function writeTopicLevel(topic: string, n: number) {
  try {
    localStorage.setItem(storageKey(topic), String(clamp(n)));
    window.dispatchEvent(new Event(eventName(topic)));
  } catch {
    /* ignore */
  }
}

export function useTopicLevel(topic: string): number {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    setLevel(readTopicLevel(topic));
    const h = () => setLevel(readTopicLevel(topic));
    window.addEventListener(eventName(topic), h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(eventName(topic), h);
      window.removeEventListener("storage", h);
    };
  }, [topic]);
  return level;
}

/* ============= Page chrome ============= */

export function TopicShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const t = useUI();
  return (
    <main className="min-h-screen bg-[#0D0D1A] pb-24">
      <Link
        to="/erkunden"
        className="fixed left-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        aria-label={t("backAria")}
      >
        <ArrowLeft className="h-6 w-6 text-white" aria-hidden="true" />
      </Link>
      <header className="px-5 pt-20">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-2xl font-black leading-tight text-white">
          {title}
        </h1>
      </header>
      <div className="mx-auto mt-5 max-w-2xl space-y-7 px-5">{children}</div>
    </main>
  );
}

/* ============= Chapter (numbered DK-style block) ============= */

export function Chapter({
  num,
  title,
  intro,
  children,
}: {
  num: number;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-5xl font-black leading-none text-amber-300">
          {num}
        </span>
        <h2 className="font-display text-xl font-black leading-tight text-white">
          {title}
        </h2>
      </div>
      {intro && (
        <p className="mb-4 text-sm leading-relaxed text-slate-300">{intro}</p>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ============= Image card with optional callouts ============= */

export function ImageCard({
  src,
  alt,
  caption,
  aspect = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-3xl bg-[#10101e]">
      <div className={`relative ${aspect} w-full overflow-hidden`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-xs text-slate-300">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ============= Big stat (DK pull-quote style) ============= */

export function BigStat({
  value,
  caption,
}: {
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 to-orange-500/5 p-5 ring-1 ring-amber-300/30">
      <p className="font-display text-4xl font-black leading-none text-amber-300">
        {value}
      </p>
      <p className="mt-2 text-sm leading-snug text-white/85">{caption}</p>
    </div>
  );
}

/* ============= Dense atlas notes for real learning depth ============= */

export type AtlasPoint = {
  label: string;
  text: string;
};

export function AtlasNotes({
  title,
  intro,
  points,
}: {
  title: string;
  intro?: string;
  points: AtlasPoint[];
}) {
  const t = useUI();
  return (
    <article className="rounded-3xl bg-[#10101e] p-5 ring-1 ring-white/10">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("knowledgeToKeep")}
      </p>
      <h3 className="mt-1 font-display text-lg font-black leading-tight text-white">
        {title}
      </h3>
      {intro && <p className="mt-2 text-sm leading-relaxed text-slate-300">{intro}</p>}
      <dl className="mt-4 space-y-3">
        {points.map((point) => (
          <div key={point.label} className="border-l-2 border-amber-300/50 pl-3">
            <dt className="font-display text-sm font-black text-white">{point.label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-300">{point.text}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function MiniFactTable({
  rows,
}: {
  rows: Array<{ term: string; value: string; note: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-[#10101e] ring-1 ring-white/10">
      {rows.map((row) => (
        <div key={row.term} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-white/10 p-4 last:border-b-0">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {row.term}
            </p>
            <p className="mt-1 font-display text-base font-black text-amber-300">{row.value}</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{row.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ============= Tap card grid (component cards like Widerstand/Diode) ============= */

export type TapCard = {
  emoji: string;
  title: string;
  body: string;
};

export function TapCardGrid({ cards }: { cards: TapCard[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <button
          key={c.title}
          onClick={() => setOpen(open === i ? null : i)}
          className={`rounded-2xl bg-[#10101e] p-4 text-left transition-all ${open === i ? "ring-2 ring-amber-300" : "ring-1 ring-white/10"}`}
        >
          <div className="text-3xl">{c.emoji}</div>
          <p className="mt-2 font-display text-sm font-black text-white">
            {c.title}
          </p>
          <p
            className={`mt-1 text-[11px] leading-snug text-slate-300 transition-all ${open === i ? "max-h-32 opacity-100" : "max-h-4 overflow-hidden opacity-60"}`}
          >
            {c.body}
          </p>
        </button>
      ))}
    </div>
  );
}

/* ============= Locked gate ============= */

export function LockedGate({
  level,
  required,
  hint,
}: {
  level: number;
  required: number;
  hint: string;
}) {
  const t = useUI();
  if (level >= required) return null;
  return (
    <div className="flex items-center gap-2 px-1 py-2 opacity-40">
      <Lock className="h-3 w-3 text-amber-300/70" aria-hidden="true" />
      <p className="text-[11px] text-slate-500">
        {t("stage")} {required} · {hint}
      </p>
    </div>
  );
}

/* ============= Quiz system ============= */

export type QuizQ = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type QuizLevel = {
  title: string;
  reward: string;
  questions: QuizQ[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizLauncher({
  topic,
  pools,
}: {
  topic: string;
  pools: QuizLevel[];
}) {
  const level = useTopicLevel(topic);
  const t = useUI();
  const [open, setOpen] = useState(false);
  const maxed = level >= MAX_LEVEL;
  const next = level + 1;
  const pool = pools[Math.min(level, pools.length - 1)];

  return (
    <>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
            {t("researcherLevel")}
          </p>
          <div className="flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={MAX_LEVEL} aria-valuenow={level} aria-label={`${t("researcherLevel")} ${level}/${MAX_LEVEL}`}>
            {Array.from({ length: MAX_LEVEL }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-5 rounded-full ${i < level ? "bg-amber-300" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 font-display text-xl font-black leading-snug text-white">
          {maxed
            ? t("maxLevel")
            : `${t("stage")} ${level} → ${t("stage")} ${next}.`}
        </p>
        <p className="mt-2 text-sm text-white/85">
          {maxed ? t("maxLevelSub") : pool.reward}
        </p>
        {!maxed && (
          <button
            onClick={() => setOpen(true)}
            className="mt-4 min-h-14 w-full rounded-full bg-amber-300 px-5 py-4 font-display text-base font-black uppercase tracking-wide text-[#0D0D1A] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t("startQuizCh")} · {pool.title}
          </button>
        )}
      </section>
      {open && !maxed && (
        <QuizModal
          pool={pool}
          onClose={() => setOpen(false)}
          onPerfect={() => writeTopicLevel(topic, next)}
        />
      )}
    </>
  );
}

function QuizModal({
  pool,
  onClose,
  onPerfect,
}: {
  pool: QuizLevel;
  onClose: () => void;
  onPerfect: () => void;
}) {
  const t = useUI();
  const [questions] = useState(() => shuffle(pool.questions).slice(0, Math.min(6, pool.questions.length)));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const done = i >= questions.length;
  const q = questions[i];

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setCorrect((c) => c + 1);
  };
  const next = () => {
    setPicked(null);
    setI((v) => v + 1);
  };

  useEffect(() => {
    if (done && correct === questions.length) onPerfect();
  }, [done, correct, questions.length, onPerfect]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={pool.title}>
      <div className="w-full max-w-lg rounded-t-3xl bg-[#10101e] p-5 sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
            {pool.title}
          </p>
          <button
            onClick={onClose}
            className="min-h-11 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label={t("closeAria")}
          >
            {t("close")}
          </button>
        </div>

        {!done ? (
          <>
            <div className="mt-2 flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={i}>
              {questions.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${idx < i ? "bg-amber-300" : idx === i ? "bg-white/40" : "bg-white/10"}`}
                />
              ))}
            </div>
            <p className="mt-4 font-display text-lg font-black leading-snug text-white">
              {q.q}
            </p>
            <div className="mt-3 grid gap-2" role="radiogroup" aria-label={q.q}>
              {q.options.map((opt, idx) => {
                const isPicked = picked === idx;
                const isAnswer = idx === q.answer;
                const show = picked !== null;
                return (
                  <button
                    key={idx}
                    disabled={show}
                    onClick={() => pick(idx)}
                    role="radio"
                    aria-checked={isPicked}
                    className={`min-h-14 rounded-2xl border-2 px-4 py-4 text-left font-display text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      show
                        ? isAnswer
                          ? "border-emerald-400 bg-emerald-500/15 text-white"
                          : isPicked
                            ? "border-rose-400 bg-rose-500/15 text-white"
                            : "border-white/10 text-white/40"
                        : "border-white/15 text-white active:scale-[0.98]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <p className="mt-3 text-sm text-slate-300" role="status">{q.explain}</p>
                <button
                  onClick={next}
                  className="mt-4 min-h-14 w-full rounded-full bg-amber-300 py-4 font-display text-base font-black uppercase tracking-wide text-[#0D0D1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {t("weiter")}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="font-display text-5xl" aria-hidden="true">
              {correct === questions.length ? "🏆" : correct >= questions.length - 1 ? "🎯" : "💪"}
            </p>
            <p className="mt-3 font-display text-2xl font-black text-white">
              {correct} / {questions.length}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {correct === questions.length ? t("perfectShort") : t("almost")}
            </p>
            <button
              onClick={onClose}
              className="mt-4 min-h-14 w-full rounded-full bg-amber-300 py-4 font-display text-base font-black uppercase tracking-wide text-[#0D0D1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {correct === questions.length ? t("openLevel") : t("close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

