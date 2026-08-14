import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Compass, Wand2, HeartHandshake, BookOpen } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";
import lumiLogo from "@/assets/lumi-logo.png";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Warum – A wonder engine for curious kids" },
      {
        name: "description",
        content:
          "Warum turns a child's endless 'why?' into vivid, illustrated, age-tuned answers — read aloud by Lumi. Sign in with Google to start exploring.",
      },
      { property: "og:title", content: "Warum – A wonder engine for curious kids" },
      {
        property: "og:description",
        content:
          "Vivid, illustrated answers to every 'why?', read aloud by Lumi. Built for curious minds aged 6 to 99.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomePage,
});

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F4E4BC";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-full border border-[#D4AF37]/25 bg-black/50 p-1 backdrop-blur">
      <button
        onClick={() => setLang("de")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${lang === "de" ? "bg-[#D4AF37] text-black" : "text-[#F4E4BC]/60"}`}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${lang === "en" ? "bg-[#D4AF37] text-black" : "text-[#F4E4BC]/60"}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.9 39.3 16.4 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.1l6.2 5.2c-.4.4 6.6-4.8 6.6-14.3 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

// Curated Wikimedia example photos for "why?" prompts
const EXAMPLES: Array<{
  de: string;
  en: string;
  src: string;
  credit: string;
}> = [
  {
    de: "Warum ist der Himmel blau?",
    en: "Why is the sky blue?",
    src: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=800&q=80",
    credit: "Unsplash",
  },
  {
    de: "Warum haben Schmetterlinge Muster?",
    en: "Why do butterflies have patterns?",
    src: "https://images.unsplash.com/photo-1560015534-cee980ba7e13?auto=format&fit=crop&w=800&q=80",
    credit: "Unsplash",
  },
  {
    de: "Warum hat der Saturn Ringe?",
    en: "Why does Saturn have rings?",
    src: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=800&q=80",
    credit: "Unsplash",
  },
  {
    de: "Warum brummen Bienen?",
    en: "Why do bees buzz?",
    src: "https://images.unsplash.com/photo-1568526381923-caf3fd520382?auto=format&fit=crop&w=800&q=80",
    credit: "Unsplash",
  },
];

function WelcomePage() {
  const t = useT();
  const { session, loading } = useProfile();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/welcome` },
      });
      if (error) {
        setError(error.message ?? "Sign-in failed");
        setBusy(false);
      }
    } catch (e: any) {
      setError(e?.message ?? "Sign-in failed");
      setBusy(false);
    }
  }

  function handleContinue() {
    navigate({ to: "/erkunden" });
  }

  const signedIn = !loading && !!session;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#F4E4BC]">
      {/* Ambient gold glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: `${GOLD}1A` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: `${GOLD}14` }}
      />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:py-5">
        <Link to="/welcome" className="flex items-center gap-2.5">
          <span
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-black/60"
            style={{ boxShadow: `0 0 24px ${GOLD}33` }}
          >
            <img
              src={lumiLogo}
              alt="Lumi"
              className="h-8 w-8 animate-logo-bob"
              style={{ mixBlendMode: "screen" }}
            />
          </span>
          <span
            className="font-serif text-xl font-semibold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD }}
          >
            Warum<span style={{ color: GOLD_LIGHT }}>.</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle />
          {signedIn ? (
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3.5 py-2 text-xs font-bold text-black transition hover:scale-[1.03] active:scale-95 sm:text-sm"
            >
              {t("Weiter", "Continue")}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-3.5 py-2 text-xs font-bold text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition hover:scale-[1.03] active:scale-95 disabled:opacity-60 sm:text-sm"
            >
              <GoogleG />
              <span className="hidden sm:inline">
                {t("Mit Google anmelden", "Sign in with Google")}
              </span>
              <span className="sm:hidden">Google</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-4 pb-14 sm:pt-10 sm:pb-20">
        <div className="grid items-center gap-10 sm:grid-cols-2 sm:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" style={{ color: GOLD }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                {t("Für neugierige Köpfe", "For curious minds")}
              </span>
            </div>
            <h1
              className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
            >
              {t(
                <>
                  Jedes <span className="italic" style={{ color: GOLD }}>Warum</span>
                  <br />
                  verdient ein <span className="italic" style={{ color: GOLD }}>Wow</span>.
                </>,
                <>
                  Every <span className="italic" style={{ color: GOLD }}>why</span>
                  <br />
                  deserves a <span className="italic" style={{ color: GOLD }}>wow</span>.
                </>,
              )}
            </h1>
            <p className="mt-5 max-w-md text-base font-light leading-relaxed text-[#F4E4BC]/70">
              {t(
                "Warum verwandelt die endlosen Fragen deines Kindes in lebendige, altersgerechte Antworten — mit echten Bildern, Analogien zum Anfassen und Lumis warmer Vorlesestimme.",
                "Warum turns your child's endless questions into vivid, age-tuned answers — with real photos, hands-on analogies, and Lumi reading it aloud in a warm, kid-friendly voice.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {signedIn ? (
                <button
                  onClick={handleContinue}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-wide text-black shadow-[0_15px_45px_rgba(212,175,55,0.3)] transition hover:scale-[1.02] active:scale-95"
                >
                  {t("Zum Erkunden", "Start exploring")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <button
                  onClick={handleGoogle}
                  disabled={busy}
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-wide text-black shadow-[0_15px_45px_rgba(212,175,55,0.3)] transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                >
                  <GoogleG />
                  {t("Mit Google starten", "Continue with Google")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
            {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
            <p className="mt-4 text-[11px] text-[#F4E4BC]/40">
              {t(
                "Kostenlos starten · Kein Werbebanner · Fortschritt geräteübergreifend gespeichert",
                "Free to start · No ads · Progress synced across devices",
              )}
            </p>
          </div>

          {/* Lumi hero medallion */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <div
                aria-hidden
                className="absolute inset-6 rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${GOLD}55 0%, transparent 70%)` }}
              />
              <div
                className="relative flex h-full w-full flex-col items-center justify-center rounded-[2.5rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#0a0a0a] to-black p-8"
                style={{ boxShadow: `inset 0 0 60px ${GOLD}18, 0 30px 80px rgba(0,0,0,0.6)` }}
              >
                {/* Gilded hairline frame */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 rounded-[2rem] border"
                  style={{ borderColor: `${GOLD}33` }}
                />
                <img
                  src={lumiLogo}
                  alt="Lumi mascot"
                  className="h-48 w-48 animate-logo-bob sm:h-56 sm:w-56"
                  style={{
                    mixBlendMode: "screen",
                    filter: `drop-shadow(0 20px 50px ${GOLD}66)`,
                  }}
                />
                <p
                  className="mt-6 text-center text-sm font-medium italic"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD }}
                >
                  {t("Hi, ich bin Lumi.", "Hi, I'm Lumi.")}
                </p>
                <p className="mt-1 max-w-[240px] text-center text-xs leading-relaxed text-[#F4E4BC]/60">
                  {t(
                    "Frag mich alles. Ich erkläre es dir langsam, warm und mit Bildern.",
                    "Ask me anything. I'll explain it slowly, warmly, and with pictures.",
                  )}
                </p>
              </div>
              <span
                aria-hidden
                className="absolute -top-2 -right-2 h-2 w-2 rounded-full animate-twinkle"
                style={{ background: GOLD }}
              />
              <span
                aria-hidden
                className="absolute top-10 -left-3 h-1.5 w-1.5 rounded-full animate-twinkle-delayed"
                style={{ background: GOLD_LIGHT }}
              />
              <span
                aria-hidden
                className="absolute -bottom-2 right-14 h-2 w-2 rounded-full animate-twinkle"
                style={{ background: GOLD }}
              />
            </div>
          </div>
        </div>
      </section>


      {/* Why we built this */}
      <section
        className="relative z-10 border-y py-14 sm:py-20"
        style={{ borderColor: `${GOLD}1F`, background: "#0A0A0A" }}
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: GOLD }}
            >
              {t("Warum wir das gebaut haben", "Why we built this")}
            </p>
            <h2
              className="mt-3 text-3xl font-medium leading-tight sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
            >
              {t(
                "Kinder verlieren ihre Neugier nicht — sie wird ihnen wegerklärt.",
                "Kids don't lose their curiosity — it gets explained away.",
              )}
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-[#F4E4BC]/70">
              {t(
                'Warum entstand, weil ein Kind ein „Warum ist der Himmel blau?" fragte — und die schnelle Google-Antwort langweilig, falsch dosiert oder komplett am Kind vorbei war. Warum ist die Antwort, die ein guter Bilderbuchautor geben würde: konkret, lebendig, mit einem Bild, einer Analogie und einer überraschenden Zahl.',
                'Warum began because a child asked "why is the sky blue?" — and the quick web answer was boring, wrong-pitched, or missed the child entirely. Warum is the answer a great picture-book author would give: concrete, vivid, with an image, an analogy, and a surprising number.',
              )}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Compass,
                title: t("Altersgerecht", "Age-tuned"),
                text: t(
                  "Von 6 bis 99 — Wortschatz, Tiefe und Ton passen sich an.",
                  "From age 6 to 99 — vocabulary, depth and tone adapt.",
                ),
              },
              {
                icon: Wand2,
                title: t("Echte Bilder", "Real photos"),
                text: t(
                  "Wikimedia-Fotos statt generischer KI-Bilder — die Welt, wie sie ist.",
                  "Wikimedia photos, not generic AI images — the world as it actually is.",
                ),
              },
              {
                icon: HeartHandshake,
                title: t("Lumi liest vor", "Lumi reads aloud"),
                text: t(
                  "Warme, langsame Vorlesestimme — für Kinder, die lieber hören.",
                  "Warm, slow bedtime-story voice — for kids who prefer listening.",
                ),
              },
              {
                icon: BookOpen,
                title: t("Wow-Momente sammeln", "Collect wow moments"),
                text: t(
                  "Jede Entdeckung landet im Pass — mit Titel und Abzeichen.",
                  "Every discovery lands in the passport — with a title and badges.",
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative rounded-3xl border border-[#D4AF37]/20 bg-black/40 p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/50"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/30"
                  style={{ background: `${GOLD}12` }}
                >
                  <f.icon className="h-5 w-5" style={{ color: GOLD }} />
                </div>
                <h3
                  className="mt-4 text-lg font-medium"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
                >
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-[#F4E4BC]/60">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prospect / who it's for */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 p-8 sm:p-12"
          style={{ background: "linear-gradient(160deg, #0e0e0e 0%, #050505 100%)" }}
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: `${GOLD}22` }}
          />
          <div className="relative grid gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                {t("Für wen", "Who it's for")}
              </p>
              <h2
                className="mt-3 text-3xl font-medium leading-tight sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
              >
                {t(
                  'Für Familien, die „weiß ich nicht" nicht als Antwort akzeptieren.',
                  "For families who don't accept \"I don't know\" as an answer.",
                )}
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-[#F4E4BC]/70">
                {t(
                  "Für Eltern beim Autofahren, für Lehrer:innen zwischen zwei Stunden, für Großeltern am Küchentisch, für Kinder, die das Warum in sich noch nicht abgeschaltet haben.",
                  "For parents on car rides, for teachers between two lessons, for grandparents at the kitchen table, for kids who haven't switched off the why inside them yet.",
                )}
              </p>
            </div>
            <ul className="space-y-3">
              {[
                t("Ein Kind, das nicht aufhört zu fragen", "A child who won't stop asking"),
                t("Ein Elternteil, der ehrlich antworten will", "A parent who wants to answer honestly"),
                t("Eine Lehrkraft, die ein Aha-Bild braucht", "A teacher who needs one aha-image"),
                t("Ein Erwachsener, der die Welt neu sehen will", "An adult who wants to see the world again"),
              ].map((row) => (
                <li
                  key={row}
                  className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/15 bg-black/40 px-4 py-3"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm font-light text-[#F4E4BC]/85">{row}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-6 text-center sm:pb-32">
        <div
          className="mx-auto mb-10 h-16 w-px"
          style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}
        />
        <span
          className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/60"
          style={{ boxShadow: `0 0 40px ${GOLD}44` }}
        >
          <img
            src={lumiLogo}
            alt=""
            className="h-14 w-14 animate-logo-bob"
            style={{ mixBlendMode: "screen" }}
          />
        </span>
        <h2
          className="mt-6 text-3xl font-medium leading-tight sm:text-4xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
        >
          {t("Bereit für das nächste Warum?", "Ready for the next why?")}
        </h2>
        <p className="mt-3 text-sm font-light text-[#F4E4BC]/60">
          {t(
            "Melde dich mit Google an und Lumi merkt sich, was ihr schon entdeckt habt.",
            "Sign in with Google and Lumi will remember what you've already discovered.",
          )}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {signedIn ? (
            <button
              onClick={handleContinue}
              className="group inline-flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-wide text-black shadow-[0_15px_45px_rgba(212,175,55,0.3)] transition hover:scale-[1.02] active:scale-95"
            >
              {t("Zum Erkunden", "Start exploring")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="group inline-flex items-center gap-3 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-wide text-black shadow-[0_15px_45px_rgba(212,175,55,0.3)] transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              <GoogleG />
              {t("Mit Google starten", "Continue with Google")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
        <Link
          to="/auth"
          className="mt-6 inline-block text-xs underline underline-offset-4 transition hover:opacity-80"
          style={{ color: `${GOLD}99` }}
        >
          {t("Andere Anmeldeoptionen", "Other sign-in options")}
        </Link>
      </section>

      {/* Real "why?" examples row — moved to end */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: GOLD }}
            >
              {t("Beispiele", "Examples")}
            </p>
            <h2
              className="mt-2 text-2xl font-medium leading-tight sm:text-3xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
            >
              {t("Fragen, die Lumi liebt.", "Questions Lumi loves.")}
            </h2>
          </div>
          <div className="hidden h-px flex-1 sm:block" style={{ background: `${GOLD}33` }} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((ex) => (
            <figure
              key={ex.en}
              className="group relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-black transition hover:-translate-y-1 hover:border-[#D4AF37]/50"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={ex.src}
                  alt={ex.en}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <p
                  className="text-sm font-medium italic leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: GOLD_LIGHT }}
                >
                  {t(ex.de, ex.en)}
                </p>
                <div className="mt-2 h-px w-6" style={{ background: GOLD }} />
              </figcaption>
            </figure>
          ))}
        </div>
      </section>


      <footer
        className="relative z-10 border-t py-8 text-center text-[10px] uppercase tracking-[0.3em]"
        style={{ borderColor: `${GOLD}1F`, color: `${GOLD}66` }}
      >
        © {new Date().getFullYear()} Warum · {t("Mit Neugier gebaut", "Built with curiosity")}
      </footer>
    </main>
  );
}
