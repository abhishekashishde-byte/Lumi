import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, Send, Sparkles } from "lucide-react";
import { useLang, useUI } from "@/lib/i18n";
import { isSoundOn, isHapticOn } from "@/lib/settings";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { LumiChat } from "@/components/LumiChat";
import { useProfile } from "@/lib/profile";
import { detectDiscoveryFromQuestion, unlockDiscovery, fireCelebration } from "@/lib/passport";
import { getLevel } from "@/lib/levels";

export const Route = createFileRoute("/entdecken")({
  head: () => ({ meta: [{ title: "Entdecken – Warum" }] }),
  component: Entdecken,
});

type KeyPoint = { icon: string; title: string; text: string };
type Vocab = { word: string; meaning: string };
type TimelineEvent = { label: string; text: string };
type SliderFact = { at: number; text: string };
type InteractionData = {
  timeline?: TimelineEvent[];
  slider_unit?: string;
  slider_min?: number;
  slider_max?: number;
  slider_facts?: SliderFact[];
};
type Answer = {
  headline: string;
  image_search_term: string;
  image_search_term_2?: string;
  youtube_search_term?: string;
  youtube_search_terms?: string[];
  analogy: string;
  paragraphs?: string[];
  explanation?: string;
  key_points: KeyPoint[];
  interaction_type: "collision" | "drag" | "timeline" | "slider" | "tap";
  interaction_label: string;
  interaction_data?: InteractionData;
  fun_fact: string;
  vocab?: Vocab[];
};
type YTVideo = { videoId: string; title: string; channel?: string };

const EXAMPLES_DE = [
  { emoji: "🌋", q: "Warum gibt es Erdbeben?" },
  { emoji: "🦕", q: "Warum starben die Dinosaurier aus?" },
  { emoji: "🌈", q: "Wie entsteht ein Regenbogen?" },
  { emoji: "🩸", q: "Warum ist Blut rot?" },
  { emoji: "🌙", q: "Warum sehen wir den Mond?" },
  { emoji: "⚡", q: "Warum gibt es Blitze?" },
  { emoji: "🐝", q: "Warum machen Bienen Honig?" },
  { emoji: "🌊", q: "Warum ist das Meer salzig?" },
  { emoji: "😴", q: "Warum müssen wir schlafen?" },
  { emoji: "🦒", q: "Warum hat die Giraffe einen langen Hals?" },
  { emoji: "🔥", q: "Warum brennt Feuer?" },
  { emoji: "☁️", q: "Warum sind Wolken weiß?" },
];
const EXAMPLES_EN = [
  { emoji: "🌋", q: "Why do earthquakes happen?" },
  { emoji: "🦕", q: "Why did the dinosaurs die out?" },
  { emoji: "🌈", q: "How does a rainbow form?" },
  { emoji: "🩸", q: "Why is blood red?" },
  { emoji: "🌙", q: "Why can we see the moon?" },
  { emoji: "⚡", q: "Why does lightning happen?" },
  { emoji: "🐝", q: "Why do bees make honey?" },
  { emoji: "🌊", q: "Why is the sea salty?" },
  { emoji: "😴", q: "Why do we need to sleep?" },
  { emoji: "🦒", q: "Why does a giraffe have a long neck?" },
  { emoji: "🔥", q: "Why does fire burn?" },
  { emoji: "☁️", q: "Why are clouds white?" },
];

const CACHE_KEY = "warum_entdecken_cache_v4";
const RECENT_KEY = "warum_entdecken_recent_v2";
const IMG_CACHE_KEY = "warum_entdecken_img_v3";
const RECENT_META_KEY = "warum_entdecken_recent_meta_v1";
export const PENDING_ASK_KEY = "warum_entdecken_pending_ask";

export type RecentMeta = { image?: string; headline?: string; lang?: string };

function loadCache(): Record<string, Answer> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}"); } catch { return {}; }
}
function saveCache(c: Record<string, Answer>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}
function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}
function pushRecent(q: string) {
  const list = [q, ...loadRecent().filter((x) => x !== q)].slice(0, 6);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch {}
  try { window.dispatchEvent(new Event("warum:recent")); } catch {}
  return list;
}
function loadImgCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(IMG_CACHE_KEY) ?? "{}"); } catch { return {}; }
}
function saveImgCache(c: Record<string, string>) {
  try { localStorage.setItem(IMG_CACHE_KEY, JSON.stringify(c)); } catch {}
}
export function loadRecentMeta(): Record<string, RecentMeta> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(RECENT_META_KEY) ?? "{}"); } catch { return {}; }
}
function saveRecentMeta(q: string, meta: RecentMeta) {
  if (typeof window === "undefined") return;
  try {
    const cur = loadRecentMeta();
    cur[q] = { ...cur[q], ...meta };
    localStorage.setItem(RECENT_META_KEY, JSON.stringify(cur));
    window.dispatchEvent(new Event("warum:recent"));
  } catch {}
}

// Fetch a real, in-context photo for a search term.
// Strategy: Openverse (real photos, license-clean) → Wikimedia Commons (bitmap only, skip SVG/diagrams) → Wikipedia page image.
async function fetchWikimediaImage(term: string): Promise<string | null> {
  if (!term) return null;
  const cache = loadImgCache();
  if (cache[term]) return cache[term];

  // Reject diagrams, logos, and — importantly — commercial/product/ad photos
  // (the bacteria "Tramontina / Microban / Professional knives" ad is the canonical
  // failure this catches).
  const badRe = /(logo|diagram|chart|map|coat[_ ]of[_ ]arms|flag|schematic|icon|symbol|portrait|painting|drawing|sketch|cartoon|clipart|advert|advertisement|billboard|poster|packaging|package|product[_ ]?shot|packshot|watermark|stock[_ ]?photo|shutterstock|getty|alamy|adobe[_ ]?stock|istock|dreamstime|tramontina|microban|brochure|catalog|catalogue|banner|marketing|promo)/i;
  const goodMime = (m: string) => m === "image/jpeg" || m === "image/png" || m === "image/webp";

  // Restrict Openverse to educational / photo-community sources — blocks ad-heavy
  // providers that were returning branded product photos.
  const OV_SOURCES = "flickr,wikimedia,nasa,smithsonian_institution,science_museum,museums_victoria,brooklynmuseum,rijksmuseum,stocksnap";

  // 1) Openverse — real photos, works well for natural-science topics.
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(term)}&source=${OV_SOURCES}&license_type=all&mature=false&page_size=20&aspect_ratio=wide,square`;
    const r = await fetch(url);
    if (r.ok) {
      const d = await r.json();
      const results: any[] = d?.results ?? [];
      const pick = results.find((x) => {
        if (!x?.url) return false;
        const blob = `${x.title ?? ""} ${x.foreign_landing_url ?? ""} ${x.url ?? ""} ${(x.tags ?? []).map((t: any) => t?.name ?? "").join(" ")}`;
        return !badRe.test(blob);
      });
      const src = pick?.url ?? null;
      if (src) { cache[term] = src; saveImgCache(cache); return src; }
    }
  } catch {}

  // 2) Wikimedia Commons — file search, bitmap only, skip drawings/diagrams.
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=15&gsrsearch=${encodeURIComponent(term + " filetype:bitmap")}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=1000&origin=*`;
    const r = await fetch(commonsUrl);
    const d = await r.json();
    const pages = Object.values(d?.query?.pages ?? {}) as any[];
    pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    for (const p of pages) {
      const info = p?.imageinfo?.[0];
      const src = info?.thumburl ?? info?.url;
      const mime: string = info?.mime ?? "";
      const title: string = p?.title ?? "";
      if (src && goodMime(mime) && !badRe.test(title) && !badRe.test(src)) {
        cache[term] = src; saveImgCache(cache);
        return src;
      }
    }
  } catch {}

  // 3) Wikipedia page thumbnail as last fallback.
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=900&generator=search&gsrlimit=1&gsrsearch=${encodeURIComponent(term)}&origin=*`;
    const r = await fetch(url);
    const d = await r.json();
    const pages = d?.query?.pages ?? {};
    const first = Object.values(pages)[0] as { thumbnail?: { source?: string } } | undefined;
    const src = first?.thumbnail?.source ?? null;
    if (src) { cache[term] = src; saveImgCache(cache); }
    return src;
  } catch { return null; }
}

function Entdecken() {
  const { lang } = useLang();
  const t = useUI();
  const { profile } = useProfile();
  const age = profile?.age ?? 9;
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [video, setVideo] = useState<YTVideo | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const autoStopRef = useRef<number | null>(null);
  const finalizedRef = useRef(false);

  // Auto-grow the textarea as the question gets longer (typed or spoken).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);


  useEffect(() => { setRecent(loadRecent()); }, []);

  // Auto-ask when a question is passed in via sessionStorage (from home widgets).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const pending = sessionStorage.getItem(PENDING_ASK_KEY);
      if (pending) {
        sessionStorage.removeItem(PENDING_ASK_KEY);
        setValue(pending);
        ask(pending);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || loading) return;
    setError(null);
    setAskedQuestion(question);
    setLoading(true);
    setImage(null);
    setImage2(null);
    setVideo(null);
    try {
      const cache = loadCache();
      const cacheKey = `${lang}:${age}:${question.toLowerCase()}`;
      let data: Answer | undefined = cache[cacheKey];
      if (!data) {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lang, age }),
        });
        if (!res.ok) throw new Error(await res.text());
        data = (await res.json()) as Answer;
        cache[cacheKey] = data;
        saveCache(cache);
      }
      setAnswer(data);
      setRecent(pushRecent(question));

      // Curiosity Passport: try to unlock a related discovery.
      try {
        const hit = detectDiscoveryFromQuestion(question);
        if (hit) {
          const readTotal = () => {
            try {
              const raw = JSON.parse(localStorage.getItem("warum:passport:v1") ?? "{}");
              return Object.values(raw.discoveries ?? {}).reduce(
                (s: number, arr: any) => s + (Array.isArray(arr) ? arr.length : 0),
                0,
              );
            } catch { return 0; }
          };
          const beforeLevel = getLevel(readTotal());
          const card = unlockDiscovery(hit.topicId, hit.cardId);
          if (card) {
            const afterLevel = getLevel(readTotal());
            const leveledUp = afterLevel.min > beforeLevel.min
              ? { title: lang === "en" ? afterLevel.en : afterLevel.de, emoji: afterLevel.emoji }
              : undefined;
            window.setTimeout(() => fireCelebration({ topicId: hit.topicId, card, leveledUp }), 400);
          }
        }
      } catch (e) { console.warn("passport unlock failed", e); }

      // YouTube: only use AI's concept-focused queries (targets the WHY, not literal wording).
      // Drop headline/raw-question fallbacks — they drift to "how it works / wiring / circuit" videos.
      const ytQueries: string[] = [];
      const suffix = lang === "de" ? " für Kinder erklärt" : " for kids explained";
      const rawTerms = Array.isArray(data.youtube_search_terms)
        ? data.youtube_search_terms
        : data.youtube_search_term
          ? [data.youtube_search_term]
          : [];
      for (const raw of rawTerms) {
        const t = (raw ?? "").toString().trim();
        if (!t) continue;
        ytQueries.push(/kinder|kids|erklärt|explained|for children/i.test(t) ? t : t + suffix);
      }

      // Reject titles that drift into how-it-works / assembly / mechanics territory
      // when the user asked "why". This filters out "Wie funktioniert eine Ampelschaltung"
      // for "Warum ist Ampel-Stop rot?" etc.
      const isWhy = /^(why|warum|wieso|weshalb)\b/i.test(question.trim());
      const DRIFT = /(how it works|wie funktioniert|schaltung|verkabel|wiring|circuit|aufbau|bauen wir|build a|assembly|zusammenbau)/i;
      const looksRelevant = (title: string) => !(isWhy && DRIFT.test(title));

      const tryYt = async () => {
        for (const q of ytQueries) {
          try {
            const r = await fetch("/api/youtube", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: q, lang }),
            });
            if (!r.ok) continue;
            const j = await r.json();
            if (j && j.found && looksRelevant(j.title ?? "")) return j;
          } catch { /* keep trying */ }
        }
        return null;
      };


      const [a, b, v] = await Promise.all([
        fetchWikimediaImage(data.image_search_term),
        data.image_search_term_2 ? fetchWikimediaImage(data.image_search_term_2) : Promise.resolve(null),
        tryYt(),
      ]);
      setImage(a);
      setImage2(b);
      if (a) saveRecentMeta(question, { image: a, headline: data.headline, lang });
      if (v && v.found) setVideo({ videoId: v.videoId, title: v.title, channel: v.channel });
    } catch (e) {
      setError(t("oops"));
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function cleanupMic() {
    if (autoStopRef.current) { window.clearTimeout(autoStopRef.current); autoStopRef.current = null; }
    try { recognitionRef.current?.stop?.(); } catch {}
    recognitionRef.current = null;
    try { mediaRecRef.current?.state === "recording" && mediaRecRef.current.stop(); } catch {}
    mediaRecRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
    mediaStreamRef.current = null;
  }

  useEffect(() => () => cleanupMic(), []);

  function submitTranscript(text: string) {
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (!trimmed) { setError(t("voiceTryAgain")); return; }
    setValue(trimmed);
    // Small delay so the user sees the recognized text land in the input.
    window.setTimeout(() => ask(trimmed), 250);
  }

  async function startFallbackRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      mediaStreamRef.current = stream;
      const mimeCandidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"];
      const mimeType = mimeCandidates.find((m) => (window as any).MediaRecorder?.isTypeSupported?.(m)) || "";
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
        mediaStreamRef.current = null;
        setListening(false);
        if (blob.size < 2048) { setError(t("voiceTryAgain")); return; }
        setTranscribing(true);
        try {
          const form = new FormData();
          form.append("file", blob, "recording." + ((rec.mimeType || "").includes("mp4") ? "m4a" : "webm"));
          form.append("lang", lang);
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          if (!res.ok) throw new Error(await res.text());
          const { text } = await res.json();
          submitTranscript(text || "");
        } catch (e) {
          console.error(e);
          setError(t("oops"));
        } finally {
          setTranscribing(false);
        }
      };
      setListening(true);
      rec.start();
      // Auto-stop after 15 s as a safety.
      autoStopRef.current = window.setTimeout(() => { try { rec.stop(); } catch {} }, 15000);
    } catch (e: any) {
      setListening(false);
      const denied = e?.name === "NotAllowedError" || e?.name === "SecurityError";
      setError(denied ? t("voiceMicDenied") : t("voiceUnsupported"));
    }
  }

  async function startVoice() {
    setError(null);
    if (listening || transcribing) { cleanupMic(); setListening(false); return; }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // Prefer native SpeechRecognition for instant interim results (Chrome/Edge/Android).
    // Safari and Firefox have no working impl → fall back to MediaRecorder + server STT.
    const uaSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (SR && !uaSafari) {
      try {
        const rec = new SR();
        recognitionRef.current = rec;
        rec.lang = lang === "en" ? "en-US" : "de-DE";
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 1;
        finalizedRef.current = false;

        rec.onresult = (e: any) => {
          let interim = "";
          let final = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) final += r[0].transcript;
            else interim += r[0].transcript;
          }
          const text = (final || interim).trim();
          if (text) setValue(text);
          if (final) {
            finalizedRef.current = true;
            setListening(false);
            try { rec.stop(); } catch {}
            submitTranscript(final);
          }
        };
        rec.onerror = (ev: any) => {
          setListening(false);
          recognitionRef.current = null;
          if (ev?.error === "not-allowed" || ev?.error === "service-not-allowed") {
            setError(t("voiceMicDenied"));
          } else if (ev?.error === "no-speech") {
            setError(t("voiceTryAgain"));
          } else if (ev?.error === "network" || ev?.error === "audio-capture") {
            // Fall back to server STT.
            startFallbackRecorder();
          }
        };
        rec.onend = () => {
          setListening(false);
          recognitionRef.current = null;
          if (!finalizedRef.current && !error) {
            // Nothing recognized — try server STT as a backup on next tap.
          }
        };
        setListening(true);
        rec.start();
        // Safety auto-stop
        autoStopRef.current = window.setTimeout(() => { try { rec.stop(); } catch {} }, 12000);
        return;
      } catch {
        recognitionRef.current = null;
      }
    }
    await startFallbackRecorder();
  }


  if (loading) {
    return (
      <main className="starfield fixed inset-0 flex flex-col items-center justify-center bg-[#0D0D1A] px-6 text-center">
        <div className="relative">
          <Sparkles className="h-20 w-20 animate-pulse text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-300/20" />
        </div>
        <p className="mt-6 font-display text-2xl font-black text-white">{t("thinking")}</p>
        {askedQuestion && (
          <p className="mt-4 max-w-md font-display text-lg font-bold leading-snug text-amber-200">
            „{askedQuestion}"
          </p>
        )}
        <p className="mt-2 text-sm text-slate-400">{t("comingAnswer")}</p>
      </main>
    );
  }

  if (answer) {
    return (
      <AnswerCard
        answer={answer}
        question={askedQuestion}
        image={image}
        image2={image2}
        video={video}
        age={age}
        onBack={() => { setAnswer(null); setImage(null); setImage2(null); setVideo(null); setValue(""); setAskedQuestion(""); }}
      />

    );
  }


  const examples = lang === "en" ? EXAMPLES_EN : EXAMPLES_DE;

  return (
    <main className="starfield mx-auto flex min-h-[85vh] max-w-2xl flex-col px-5 pt-20">
      <h1 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
        {t("whatToKnow")}
      </h1>
      <p className="mt-2 text-sm text-slate-400">{t("askPrompt")}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(value); }}
        className="mt-6 flex items-end gap-2 rounded-3xl bg-[#10101e] p-2 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#7C3AED]"
      >
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim()) ask(value);
            }
          }}
          placeholder={listening ? t("voiceListening") : transcribing ? t("voiceTranscribing") : (lang === "en" ? "Why…?" : "Warum…?")}
          disabled={transcribing}
          className="flex-1 resize-none overflow-hidden bg-transparent px-3 py-3.5 font-display text-base text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-70"
        />
        <button
          type="button"
          onClick={startVoice}
          aria-label={listening ? t("voiceStop") : t("voiceAria")}
          aria-pressed={listening}
          disabled={transcribing}
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition disabled:opacity-60 ${listening ? "bg-rose-500" : transcribing ? "bg-amber-500" : "bg-white/10"}`}
        >
          {listening && <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/50" />}
          {transcribing ? <Sparkles className="h-6 w-6 animate-pulse" /> : <Mic className="h-6 w-6" />}
        </button>
        <button
          type="submit"
          aria-label={t("sendAria")}
          disabled={!value.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white disabled:opacity-40"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

      <p className="mt-8 font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("tryThese")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.q}
            onClick={() => { setValue(ex.q); inputRef.current?.focus(); }}
            aria-label={`${t("exampleQuestionAria")}: ${ex.q}`}
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-[#7C3AED]/15 px-4 py-3 text-sm font-bold text-white ring-1 ring-[#7C3AED]/40 transition active:scale-95"
          >
            <span className="text-lg" aria-hidden="true">{ex.emoji}</span>
            <span>{ex.q}</span>
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <p className="mt-8 font-display text-xs font-bold uppercase tracking-widest text-slate-400">
            {t("recentlyAsked")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recent.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                aria-label={`${t("recentQuestionAria")}: ${q}`}
                className="min-h-[44px] rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10 active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function AnswerCard({
  answer, question, image, image2, video, age, onBack,
}: { answer: Answer; question?: string; image: string | null; image2: string | null; video: YTVideo | null; age: number; onBack: () => void }) {
  const young = age <= 8;
  const mature = age >= 14;
  const headlineCls = young
    ? "font-display text-3xl font-black leading-tight text-white sm:text-4xl"
    : mature
      ? "font-display text-2xl font-black leading-tight text-white sm:text-3xl"
      : "font-display text-2xl font-black leading-tight text-white sm:text-3xl";
  const analogyCls = young ? "mt-1 text-xl leading-relaxed text-white" : mature ? "mt-1 text-[15px] leading-relaxed text-white" : "mt-1 text-base leading-relaxed text-white";
  const paraCls = young ? "text-[19px] leading-relaxed text-slate-100" : mature ? "text-[15px] leading-[1.7] text-slate-100" : "text-[15px] leading-relaxed text-slate-100";
  const keyTitleCls = young ? "mt-1 font-display text-base font-black text-white" : "mt-1 font-display text-sm font-black text-white";
  const keyTextCls = young ? "mt-1 text-sm leading-snug text-slate-200" : "mt-1 text-xs leading-snug text-slate-300";
  const keyIconCls = young ? "text-4xl" : "text-2xl";
  const funCls = young ? "mt-1 text-lg leading-relaxed text-white" : "mt-1 text-sm leading-relaxed text-white";

  const t = useUI();
  
  const paragraphs =
    Array.isArray(answer.paragraphs) && answer.paragraphs.length > 0
      ? answer.paragraphs
      : (answer.explanation ? [answer.explanation] : []);

  // Pick a split index so we can embed the second image between paragraphs
  const splitAt = paragraphs.length >= 3 ? Math.ceil(paragraphs.length / 2) : Math.min(1, paragraphs.length);
  const firstPart = paragraphs.slice(0, splitAt);
  const secondPart = paragraphs.slice(splitAt);

  return (
    <main className="min-h-screen bg-[#0D0D1A] pb-24">
      <button
        onClick={onBack}
        className="fixed left-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md"
        aria-label={t("backAria")}
      >
        <ArrowLeft className="h-6 w-6 text-white" />
      </button>

      <div className="mx-auto mt-16 max-w-2xl space-y-5 px-5">
        {question && (
          <div className="rounded-2xl bg-[#7C3AED]/15 px-4 py-3 ring-1 ring-[#7C3AED]/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("whatToKnow")}</p>
            <p className="mt-1 font-display text-base font-bold text-white">„{question}"</p>
          </div>
        )}
        <article className="overflow-hidden rounded-3xl bg-[#10101e] ring-1 ring-white/10">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#0D0D1A]">
            {image ? (
              <img src={image} alt={answer.image_search_term} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-amber-300/60" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10101e] via-[#10101e]/85 to-transparent p-5 pt-16">
              <h1 className={headlineCls}>
                {answer.headline}
              </h1>
            </div>
          </div>


          <div className="space-y-5 p-5">
            {/* Analogy */}
            <div className="rounded-2xl bg-gradient-to-br from-[#7C3AED]/25 to-[#F59E0B]/10 p-4 ring-1 ring-[#7C3AED]/40">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("imagine")}</p>
                <ReadAloudButton text={answer.analogy} />
              </div>
              <p className={analogyCls}>{answer.analogy}</p>
            </div>

            {/* First paragraph block */}
            {firstPart.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("howItWorks")}</p>
                  <ReadAloudButton text={paragraphs.join(" ")} />
                </div>
                <div className={`mt-2 space-y-3 ${paraCls}`}>
                  {firstPart.map((p, i) => (
                    <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:font-black first-letter:leading-[0.9] first-letter:text-amber-300" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Inline second image between paragraph blocks */}
            {image2 && (
              <figure className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <img src={image2} alt={answer.image_search_term_2 ?? ""} className="aspect-[16/10] w-full object-cover" />
                {answer.image_search_term_2 && (
                  <figcaption className="bg-[#0D0D1A] px-3 py-2 text-[11px] uppercase tracking-widest text-slate-400">
                    {answer.image_search_term_2}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Second paragraph block */}
            {secondPart.length > 0 && (
              <section className={`space-y-3 ${paraCls}`}>
                {secondPart.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            )}

            {/* Key points grid */}
            {answer.key_points?.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {answer.key_points.map((p, i) => (
                  <div key={i} className="rounded-2xl bg-[#0D0D1A] p-3 ring-1 ring-white/10">
                    <div className={keyIconCls}>{p.icon}</div>
                    <p className={keyTitleCls}>{p.title}</p>
                    <p className={keyTextCls}>{p.text}</p>
                  </div>

                ))}
              </div>
            )}

            {/* Interactive */}
            <InteractiveElement
              type={answer.interaction_type}
              label={answer.interaction_label}
              data={answer.interaction_data}
              keyPoints={answer.key_points}
            />

            {/* Vocab */}
            {answer.vocab && answer.vocab.length > 0 && (
              <div className="rounded-2xl bg-[#0D0D1A] p-4 ring-1 ring-white/10">
                <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("wordsYouKnow")}</p>
                <dl className="mt-2 space-y-2">
                  {answer.vocab.map((v) => (
                    <div key={v.word} className="border-l-2 border-[#7C3AED] pl-3">
                      <dt className="font-display text-sm font-black text-white">{v.word}</dt>
                      <dd className="text-xs leading-snug text-slate-300">{v.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* YouTube video */}
            {video && (
              <section className="overflow-hidden rounded-2xl bg-[#0D0D1A] ring-1 ring-white/10">
                <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-[11px] font-black text-white">▶</span>
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("watchVideo")}</p>
                </div>
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&modestbranding=1`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="font-display text-sm font-black leading-snug text-white">{video.title}</p>
                  {video.channel && <p className="mt-0.5 text-[11px] text-slate-400">{video.channel}</p>}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[11px] font-bold uppercase tracking-widest text-amber-300 underline-offset-4 hover:underline"
                  >
                    {t("openYouTube")}
                  </a>
                </div>
              </section>
            )}

            {/* Fun fact */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/5 p-4 ring-1 ring-amber-300/40">
              <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("didYouKnow")}</p>
              <p className={funCls}>{answer.fun_fact}</p>
            </div>
          </div>
        </article>

        <button
          onClick={onBack}
          className="w-full rounded-full bg-[#7C3AED] py-4 font-display text-sm font-black uppercase tracking-wide text-white active:scale-[0.98]"
        >
          {t("newQuestion")}
        </button>
      </div>

      <LumiChat
        age={age}
        context={[
          question ? `Q: ${question}` : "",
          answer.headline ? `Headline: ${answer.headline}` : "",
          answer.analogy ? `Analogy: ${answer.analogy}` : "",
          paragraphs.length ? `Explanation: ${paragraphs.join(" ")}` : "",
          answer.fun_fact ? `Fun fact: ${answer.fun_fact}` : "",
        ].filter(Boolean).join("\n")}
      />
    </main>
  );
}


/* ===================================================================
   Interactive elements — guided multi-step, smooth motion, sound cues.
   Zero decorative emoji. Each widget walks the kid through it.
   =================================================================== */

import { useCallback, useMemo } from "react";
import { useLang as useLangForWidgets } from "@/lib/i18n";

/* ---------- Web Audio cues (no deps) ---------- */
type ToneOpts = { freq: number; dur?: number; type?: OscillatorType; gain?: number; sweepTo?: number };

function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);
  const tone = useCallback(({ freq, dur = 0.12, type = "sine", gain = 0.08, sweepTo }: ToneOpts) => {
    if (!isSoundOn()) return;
    const ctx = getCtx(); if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (sweepTo) o.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + dur);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }, [getCtx]);
  const noise = useCallback((dur = 0.2, gain = 0.08) => {
    if (!isSoundOn()) return;
    const ctx = getCtx(); if (!ctx) return;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = gain;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start();
  }, [getCtx]);
  return { tone, noise };
}

/* ---------- Haptic helper ---------- */
function buzz(ms: number | number[] = 12) {
  if (!isHapticOn()) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { (navigator as any).vibrate(ms); } catch {}
  }
}

/* ---------- Step coach ---------- */
function StepCoach({
  steps, current, done, deLabel, enLabel,
}: { steps: { de: string; en: string }[]; current: number; done: boolean; deLabel?: string; enLabel?: string }) {
  const { lang } = useLangForWidgets();
  const i = Math.min(current, steps.length - 1);
  const last = done || current >= steps.length;
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx < current || last ? "bg-amber-300" : idx === current ? "bg-amber-300/40" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-start gap-2">
        <span className="mt-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7C3AED] px-1.5 text-[10px] font-black text-white">
          {last ? "✓" : i + 1}
        </span>
        <p key={`${i}-${last}`} className="animate-[fadeUp_0.4s_ease-out] text-sm font-medium leading-snug text-white">
          {last
            ? (lang === "en" ? (enLabel ?? "Nice — you did it!") : (deLabel ?? "Super gemacht!"))
            : (lang === "en" ? steps[i].en : steps[i].de)}
        </p>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* =========== Wrapper =========== */

function InteractiveElement({
  type, label, data, keyPoints,
}: { type: Answer["interaction_type"]; label: string; data?: InteractionData; keyPoints?: KeyPoint[] }) {
  const t = useUI();
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#11112a] to-[#0D0D1A] p-4 ring-1 ring-white/10">
      <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">{t("tryIt")}</p>
      <p className="mt-1 text-sm text-white">{label}</p>
      <div className="mt-4">
        {type === "collision" && <CollisionPlates />}
        {type === "drag" && <PrismDrag />}
        {type === "timeline" && <TimelineScroll events={data?.timeline} />}
        {type === "slider" && (
          <DiscoverySlider
            min={data?.slider_min ?? 0}
            max={data?.slider_max ?? 100}
            unit={data?.slider_unit ?? ""}
            facts={data?.slider_facts ?? []}
          />
        )}
        {type === "tap" && <TapReveal keyPoints={keyPoints} />}
      </div>
    </div>
  );
}

/* =========== 1. CollisionPlates — push BOTH plates, feel the quake =========== */

function CollisionPlates() {
  const { lang } = useLangForWidgets();
  const { tone, noise } = useAudio();
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const overlap = Math.max(0, left + right - 70);
  const shake = overlap > 8;
  const erupting = overlap > 30;

  // step gating
  const step = useMemo(() => {
    if (left < 30) return 0;
    if (right < 30) return 1;
    if (overlap < 15) return 2;
    return 3;
  }, [left, right, overlap]);

  // sound cues on threshold crosses
  const prevStep = useRef(step);
  useEffect(() => {
    if (step !== prevStep.current) {
      if (step === 1) tone({ freq: 440, type: "triangle", dur: 0.15 });
      if (step === 2) tone({ freq: 220, type: "sawtooth", dur: 0.2, sweepTo: 110 });
      if (step === 3) { noise(0.5, 0.12); buzz([20, 30, 20]); }
      prevStep.current = step;
    }
  }, [step, tone, noise]);

  const steps = [
    { de: "Schieb die linke Platte nach rechts →", en: "Push the left plate right →" },
    { de: "Jetzt die rechte Platte nach links ←", en: "Now push the right plate left ←" },
    { de: "Drück sie zusammen — der Druck steigt!", en: "Press them together — pressure rises!" },
  ];

  return (
    <div>
      <StepCoach
        steps={steps}
        current={step}
        done={step >= 3}
        deLabel="Ein Erdbeben! Gebirge wachsen."
        enLabel="An earthquake! Mountains rise."
      />
      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-b from-slate-800 via-slate-900 to-black ring-1 ring-white/5">
        {/* stars */}
        <svg viewBox="0 0 300 60" className="absolute inset-x-0 top-0 h-12 w-full opacity-40">
          {Array.from({ length: 22 }).map((_, i) => (
            <circle key={i} cx={(i * 17) % 300} cy={(i * 13) % 50 + 5} r={0.6} fill="white" />
          ))}
        </svg>

        <svg
          viewBox="0 0 300 180"
          className="absolute inset-0 h-full w-full"
          style={{ animation: shake ? `quake ${0.16 - Math.min(0.08, overlap / 1000)}s infinite` : undefined }}
        >
          <defs>
            <linearGradient id="plateL" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="plateR" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#9f1239" /><stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
            <radialGradient id="magma" cx="0.5" cy="0.3">
              <stop offset="0%" stopColor="#fde047" /><stop offset="60%" stopColor="#ea580c" /><stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>

          {/* magma core glow when erupting */}
          <rect x="0" y="148" width="300" height="32" fill="url(#magma)" opacity={erupting ? 0.9 : 0.5} style={{ transition: "opacity 0.4s" }} />

          {/* left plate */}
          <g style={{ transition: "transform 0.15s ease-out" }} transform={`translate(${left}, 0)`}>
            <polygon points="0,80 130,80 140,150 0,150" fill="url(#plateL)" />
            {overlap > 0 && (
              <polygon
                style={{ transition: "all 0.25s ease-out" }}
                points={`${130 - overlap * 0.5},80 ${140},${80 - overlap * 0.8} ${140 + overlap * 0.3},80`}
                fill="#fbbf24"
              />
            )}
          </g>
          {/* right plate */}
          <g style={{ transition: "transform 0.15s ease-out" }} transform={`translate(${-right}, 0)`}>
            <polygon points="300,80 170,80 160,150 300,150" fill="url(#plateR)" />
            {overlap > 0 && (
              <polygon
                style={{ transition: "all 0.25s ease-out" }}
                points={`${170 + overlap * 0.5},80 ${160},${80 - overlap * 0.8} ${160 - overlap * 0.3},80`}
                fill="#fbbf24"
              />
            )}
          </g>

          {/* shockwaves */}
          {overlap > 10 && (
            <g style={{ transformOrigin: "150px 115px" }}>
              <circle cx="150" cy="115" r={overlap} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6">
                <animate attributeName="r" from={overlap} to={overlap + 30} dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="150" cy="115" r={overlap * 1.4} fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3">
                <animate attributeName="r" from={overlap * 1.4} to={overlap * 1.4 + 40} dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* ash sparks during eruption */}
          {erupting && Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={150 + (i - 4) * 6} cy={70} r="1.5" fill="#fde047">
              <animate attributeName="cy" from="80" to={20 + (i % 3) * 10} dur={`${0.8 + (i % 3) * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PlateSlider
          label={lang === "en" ? "Left plate" : "Linke Platte"}
          color="#fbbf24"
          value={left}
          onChange={(v) => { setLeft(v); if (v % 10 === 0) tone({ freq: 200 + v * 4, type: "sine", dur: 0.04, gain: 0.04 }); }}
        />
        <PlateSlider
          label={lang === "en" ? "Right plate" : "Rechte Platte"}
          color="#fb7185"
          value={right}
          onChange={(v) => { setRight(v); if (v % 10 === 0) tone({ freq: 200 + v * 4, type: "sine", dur: 0.04, gain: 0.04 }); }}
        />
      </div>

      <style>{`@keyframes quake{0%,100%{transform:translate(0,0)}25%{transform:translate(-2px,1px)}50%{transform:translate(2px,-1px)}75%{transform:translate(-1px,-2px)}}`}</style>
    </div>
  );
}

function PlateSlider({ label, color, value, onChange }: { label: string; color: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-slate-400">{label}</span>
      <div className="relative mt-1 h-2 rounded-full bg-white/10">
        <div className="absolute left-0 top-0 h-2 rounded-full transition-[width] duration-150" style={{ width: `${(value / 80) * 100}%`, background: color }} />
      </div>
      <input
        type="range" min={0} max={80} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="mt-1 w-full"
        style={{ accentColor: color }}
      />
    </label>
  );
}

/* =========== 2. PrismDrag — drag the prism through stages =========== */

function PrismDrag() {
  const { lang } = useLangForWidgets();
  const { tone } = useAudio();
  const [angle, setAngle] = useState(0);
  const split = angle > 18;
  const fullRainbow = angle > 42;

  const step = !split ? 0 : !fullRainbow ? 1 : 2;
  const prevStep = useRef(step);
  useEffect(() => {
    if (step !== prevStep.current) {
      const freqs = [261, 392, 523]; // C E G
      tone({ freq: freqs[step], dur: 0.18, type: "triangle", gain: 0.07 });
      buzz(8);
      prevStep.current = step;
    }
  }, [step, tone]);

  const steps = [
    { de: "Dreh den Prismawinkel langsam hoch.", en: "Slowly turn up the prism angle." },
    { de: "Siehst du es? Das Licht bricht.", en: "See it? The light is bending." },
    { de: "Voller Regenbogen — alle Farben sichtbar!", en: "Full rainbow — all colors visible!" },
  ];

  const colors = [
    { c: "#ef4444", o: -28 },
    { c: "#f97316", o: -18 },
    { c: "#eab308", o: -8 },
    { c: "#22c55e", o: 2 },
    { c: "#06b6d4", o: 12 },
    { c: "#3b82f6", o: 22 },
    { c: "#8b5cf6", o: 32 },
  ];

  return (
    <div>
      <StepCoach steps={steps} current={step} done={step >= 2} deLabel="Du hast den Regenbogen gemacht!" enLabel="You made the rainbow!" />

      <div className="relative h-52 overflow-hidden rounded-xl bg-[#05050d] ring-1 ring-white/5">
        <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full">
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="2" /></filter>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* sun source */}
          <circle cx="14" cy="100" r="10" fill="#fde047" filter="url(#glow)">
            <animate attributeName="r" values="10;11;10" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* incoming white beam (glowing) */}
          <rect x="24" y="98" width="106" height="4" fill="url(#beam)" filter="url(#glow)" opacity="0.9" />
          <line x1="24" y1="100" x2="130" y2="100" stroke="white" strokeWidth="2" />

          {/* prism */}
          <g style={{ transformOrigin: "150px 100px", transition: "transform 0.4s ease-out", transform: `rotate(${angle * 0.4}deg)` }}>
            <polygon points="130,55 175,55 152.5,140" fill="rgba(255,255,255,0.12)" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" />
            <polygon points="130,55 175,55 152.5,140" fill="url(#beam)" opacity="0.2" />
          </g>

          {/* spectrum out */}
          {split ? (
            <g>
              {colors.map((b, i) => {
                const visibleAt = i * 6;
                const visible = angle > visibleAt;
                return (
                  <line
                    key={i}
                    x1="170" y1="100"
                    x2="300" y2={100 + b.o + (angle - 30) * 0.4}
                    stroke={b.c}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity={visible ? Math.min(1, (angle - visibleAt) / 12) : 0}
                    filter="url(#glow)"
                    style={{ transition: "opacity 0.3s, y2 0.3s" }}
                  />
                );
              })}
            </g>
          ) : (
            <line x1="170" y1="100" x2="300" y2="100" stroke="white" strokeWidth="2.5" opacity={0.35} />
          )}

          {/* sparkle particles when full rainbow */}
          {fullRainbow && Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={220 + i * 12} cy={100 + (i - 3) * 8} r="1.4" fill="white">
              <animate attributeName="opacity" values="0;1;0" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      <label className="mt-4 block">
        <span className="text-[11px] uppercase tracking-wider text-slate-400">
          {lang === "en" ? "Prism angle" : "Prismawinkel"}
        </span>
        <input
          type="range" min={0} max={60} value={angle}
          onChange={(e) => setAngle(+e.target.value)}
          className="mt-1 w-full accent-[#7C3AED]"
        />
      </label>
    </div>
  );
}

/* =========== 3. Timeline — tap dots in order =========== */

function TimelineScroll({ events }: { events?: TimelineEvent[] }) {
  const { lang } = useLangForWidgets();
  const { tone } = useAudio();
  const fallback: TimelineEvent[] = lang === "en" ? [
    { label: "230M years ago", text: "The first dinosaurs walk the Earth." },
    { label: "150M years ago", text: "Giant dinos like Brachiosaurus rule." },
    { label: "66M years ago", text: "An asteroid strikes near Mexico." },
    { label: "Today", text: "Birds are the last living dinosaurs." },
  ] : [
    { label: "Vor 230 Mio. Jahren", text: "Die ersten Dinosaurier laufen auf der Erde." },
    { label: "Vor 150 Mio. Jahren", text: "Riesen-Dinos wie Brachiosaurus herrschen." },
    { label: "Vor 66 Mio. Jahren", text: "Ein Asteroid schlägt in Mexiko ein." },
    { label: "Heute", text: "Vögel sind die letzten lebenden Dinosaurier." },
  ];
  const list = events && events.length > 0 ? events : fallback;
  const [revealed, setRevealed] = useState<number[]>([]);
  const next = revealed.length;
  const done = next >= list.length;

  function reveal(i: number) {
    if (i !== next || revealed.includes(i)) return;
    setRevealed((r) => [...r, i]);
    tone({ freq: 330 + i * 80, dur: 0.12, type: "triangle", gain: 0.06 });
    buzz(10);
  }

  const stepStrings = list.map((_, i) => ({
    de: `Tippe auf Punkt ${i + 1}.`,
    en: `Tap dot ${i + 1}.`,
  }));

  return (
    <div>
      <StepCoach
        steps={stepStrings}
        current={next}
        done={done}
        deLabel="Alle Momente entdeckt!"
        enLabel="All moments uncovered!"
      />

      <div className="relative">
        <div className="absolute left-2 right-2 top-7 h-0.5 bg-gradient-to-r from-[#7C3AED] via-amber-400 to-rose-500" />
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
          {list.map((e, i) => {
            const isRevealed = revealed.includes(i);
            const isNext = i === next && !done;
            return (
              <button
                key={i}
                onClick={() => reveal(i)}
                disabled={i > next}
                className={`relative min-w-[180px] pt-10 text-left transition-all duration-300 ${i > next ? "opacity-30" : ""}`}
              >
                <div
                  className={`absolute left-4 top-5 h-4 w-4 rounded-full ring-4 ring-[#0D0D1A] transition-all duration-300 ${
                    isRevealed ? "scale-110 bg-amber-300" : isNext ? "bg-[#7C3AED]" : "bg-white/20"
                  }`}
                >
                  {isNext && <span className="absolute -inset-2 animate-ping rounded-full bg-[#7C3AED]/40" />}
                </div>
                <div
                  className={`overflow-hidden rounded-xl bg-[#1A1A2E] ring-1 ring-white/10 transition-all duration-500 ${
                    isRevealed ? "p-3 opacity-100" : "max-h-12 p-3 opacity-60"
                  }`}
                >
                  <p className="font-display text-[10px] font-bold uppercase tracking-wider text-amber-300">{e.label}</p>
                  <p
                    className={`mt-1 text-xs leading-snug text-white transition-all duration-500 ${
                      isRevealed ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {e.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========== 4. DiscoverySlider — guided target hits =========== */

function DiscoverySlider({
  min, max, unit, facts,
}: { min: number; max: number; unit: string; facts: SliderFact[] }) {
  const { lang } = useLangForWidgets();
  const { tone } = useAudio();
  const sortedFacts = useMemo(() => {
    const normalized = (facts as unknown[])
      .map((f): SliderFact | null => {
        if (Array.isArray(f)) {
          const at = Number(f[0]);
          return Number.isFinite(at) ? { at, text: String(f[1] ?? "") } : null;
        }
        if (f && typeof f === "object") {
          const obj = f as { at?: unknown; text?: unknown; value?: unknown; label?: unknown };
          const at = Number(obj.at ?? obj.value);
          return Number.isFinite(at) ? { at, text: String(obj.text ?? obj.label ?? "") } : null;
        }
        return null;
      })
      .filter((f): f is SliderFact => f !== null);
    return normalized.sort((a, b) => a.at - b.at);
  }, [facts]);
  const targets = sortedFacts.length > 0 ? sortedFacts : [
    { at: min, text: "" },
    { at: Math.round((min + max) / 2), text: "" },
    { at: max, text: "" },
  ];
  const [v, setV] = useState(min);
  const [hit, setHit] = useState<Set<number>>(new Set());
  const targetIdx = hit.size;
  const target = targets[Math.min(targetIdx, targets.length - 1)];
  const done = hit.size >= targets.length;

  // tolerance ~5% of range
  const tol = Math.max(1, Math.round((max - min) * 0.04));

  useEffect(() => {
    if (done) return;
    if (Math.abs(v - target.at) <= tol && !hit.has(target.at)) {
      const next = new Set(hit); next.add(target.at);
      setHit(next);
      tone({ freq: 523 + hit.size * 100, dur: 0.18, type: "triangle", gain: 0.08, sweepTo: 700 });
      buzz([15, 40, 15]);
    }
  }, [v, target, hit, tol, done, tone]);

  const pct = max === min ? 50 : ((v - min) / (max - min)) * 100;
  const nearestFact = sortedFacts.length > 0
    ? sortedFacts.reduce((b, f) => Math.abs(f.at - v) < Math.abs(b.at - v) ? f : b, sortedFacts[0])
    : null;

  const steps = targets.map((tg, i) => ({
    de: `Schieb auf ${tg.at}${unit ? ` ${unit}` : ""}.`,
    en: `Slide to ${tg.at}${unit ? ` ${unit}` : ""}.`,
  }));

  return (
    <div>
      <StepCoach steps={steps} current={hit.size} done={done} deLabel="Alle Werte gefunden!" enLabel="All values found!" />

      <div className="rounded-xl bg-[#1A1A2E] p-4 ring-1 ring-white/10">
        <div className="flex items-baseline gap-2">
          <p className="font-display text-4xl font-black tabular-nums text-amber-300 transition-colors">{v}</p>
          {unit && <p className="font-display text-sm font-bold text-slate-400">{unit}</p>}
          {!done && (
            <p className="ml-auto text-xs text-slate-400">
              {lang === "en" ? "Target" : "Ziel"}: <span className="font-bold text-white">{target.at}{unit ? ` ${unit}` : ""}</span>
            </p>
          )}
        </div>

        {/* track with markers */}
        <div className="relative mt-3 h-3 rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-amber-400 transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
          {targets.map((tg, i) => {
            const tpct = ((tg.at - min) / (max - min)) * 100;
            const got = hit.has(tg.at);
            const isActive = !done && i === hit.size;
            return (
              <div
                key={tg.at + "-" + i}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${tpct}%` }}
              >
                <div className={`h-4 w-4 rounded-full ring-2 ring-[#1A1A2E] transition-all ${
                  got ? "scale-110 bg-amber-300" : isActive ? "bg-white" : "bg-white/30"
                }`}>
                  {isActive && <span className="absolute -inset-1 animate-ping rounded-full bg-white/40" />}
                </div>
              </div>
            );
          })}
        </div>

        <input
          type="range" min={min} max={max} value={v}
          onChange={(e) => setV(+e.target.value)}
          className="mt-3 w-full accent-[#7C3AED]"
        />

        {nearestFact && nearestFact.text && (
          <p key={nearestFact.at} className="mt-3 animate-[fadeUp_0.4s_ease-out] rounded-lg bg-[#0D0D1A] p-3 text-xs leading-snug text-white ring-1 ring-white/10">
            {nearestFact.text}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========== 5. TapReveal — three pulse rings, tap each in turn =========== */

function TapReveal({ keyPoints }: { keyPoints?: KeyPoint[] }) {
  const { lang } = useLangForWidgets();
  const { tone } = useAudio();

  // Use the answer's key points so each question gets its own reveals
  const points = (keyPoints && keyPoints.length > 0 ? keyPoints : []).slice(0, 4);
  const hasPoints = points.length > 0;
  const count = hasPoints ? points.length : 3;

  const [tapped, setTapped] = useState<number[]>([]);
  const next = tapped.length;
  const done = next >= count;

  function handleTap(i: number) {
    if (i !== next || tapped.includes(i)) return;
    setTapped((t) => [...t, i]);
    tone({ freq: 392 + i * 110, dur: 0.18, type: "triangle", gain: 0.07, sweepTo: 880 });
    buzz(12);
  }

  const stepStrings = hasPoints
    ? points.map((p, i) => ({
        de: `Tippe Karte ${i + 1}: ${p.title}`,
        en: `Tap card ${i + 1}: ${p.title}`,
      }))
    : [
        { de: "Tippe die erste Karte.", en: "Tap the first card." },
        { de: "Jetzt die zweite.", en: "Now the second." },
        { de: "Und die letzte!", en: "And the last!" },
      ];

  const palette = ["#7C3AED", "#F59E0B", "#EF4444", "#10B981"];

  return (
    <div>
      <StepCoach
        steps={stepStrings}
        current={next}
        done={done}
        deLabel={hasPoints ? "Alle Fakten entdeckt!" : "Alles entdeckt!"}
        enLabel={hasPoints ? "All facts revealed!" : "All revealed!"}
      />

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: count }).map((_, i) => {
          const isTapped = tapped.includes(i);
          const isNext = i === next && !done;
          const isLocked = i > next;
          const color = palette[i % palette.length];
          const p = hasPoints ? points[i] : null;
          return (
            <button
              key={i}
              onClick={() => handleTap(i)}
              disabled={isLocked}
              className={`relative overflow-hidden rounded-xl p-3 text-left ring-1 transition-all duration-500 ${
                isTapped
                  ? "bg-[#1A1A2E] ring-white/15"
                  : isNext
                  ? "bg-[#11112a] ring-white/20"
                  : "bg-[#0D0D1A] ring-white/10 opacity-40"
              }`}
              style={{ minHeight: 96 }}
              aria-label={p ? p.title : `Card ${i + 1}`}
            >
              {/* pulsing dot when next */}
              <div className="flex items-center gap-2">
                <span
                  className="relative inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white"
                  style={{ background: isTapped || isNext ? color : "rgba(255,255,255,0.15)" }}
                >
                  {isTapped ? "✓" : i + 1}
                  {isNext && (
                    <span
                      className="absolute -inset-1 animate-ping rounded-full"
                      style={{ background: `${color}55` }}
                    />
                  )}
                </span>
                {p && (
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    {p.icon}
                  </span>
                )}
              </div>

              {p ? (
                <>
                  <p
                    className={`mt-2 text-sm font-bold leading-snug transition-colors ${
                      isTapped ? "text-white" : isNext ? "text-white/80" : "text-white/40"
                    }`}
                  >
                    {p.title}
                  </p>
                  <p
                    className={`mt-1 text-xs leading-snug text-slate-300 transition-all duration-500 ${
                      isTapped ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    }`}
                    style={{ overflow: "hidden" }}
                  >
                    {p.text}
                  </p>
                  {!isTapped && !isLocked && (
                    <p className="mt-2 text-[11px] italic text-slate-500">
                      {lang === "en" ? "Tap to reveal" : "Tippen zum Aufdecken"}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-white/70">
                  {isTapped ? (lang === "en" ? "Revealed!" : "Aufgedeckt!") : ""}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        {done
          ? (lang === "en" ? "All done!" : "Alles fertig!")
          : (lang === "en" ? `${next}/${count} revealed` : `${next}/${count} aufgedeckt`)}
      </p>
    </div>
  );
}


