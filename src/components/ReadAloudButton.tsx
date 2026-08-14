import { useEffect, useRef, useState } from "react";
import { Pause, Play, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

/**
 * Lumi's read-aloud button. Fetches MP3 from /api/tts and plays it.
 * Cancels in-flight requests and stops audio on unmount / re-click.
 */
export function ReadAloudButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { lang } = useLang();
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  useEffect(() => () => cleanup(), []);

  const stop = () => {
    cleanup();
    setState("idle");
  };

  const play = async () => {
    if (state !== "idle") {
      stop();
      return;
    }
    setState("loading");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "TTS failed"));
      const blob = await res.blob();
      if (ctrl.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => stop();
      audio.onerror = () => stop();
      await audio.play();
      setState("playing");
    } catch (err) {
      if (!ctrl.signal.aborted) {
        console.error("[ReadAloud]", err);
      }
      stop();
    }
  };

  const busy = state !== "idle";
  const aria =
    state === "playing"
      ? lang === "en" ? "Stop reading" : "Vorlesen stoppen"
      : state === "loading"
        ? lang === "en" ? "Loading Lumi's voice" : "Lumi wird geladen"
        : label ?? (lang === "en" ? "Listen with Lumi" : "Mit Lumi anhören");

  return (
    <button
      type="button"
      onClick={play}
      aria-label={aria}
      className={
        "inline-flex items-center gap-1.5 rounded-full bg-amber-300/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-amber-300 ring-1 ring-amber-300/40 transition hover:bg-amber-300/25 active:scale-95 " +
        (busy ? "animate-pulse " : "") +
        className
      }
    >
      {state === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : state === "playing" ? (
        <Pause className="h-3.5 w-3.5" />
      ) : (
        <Play className="h-3.5 w-3.5" />
      )}
      <span>
        {state === "playing"
          ? lang === "en" ? "Stop" : "Stopp"
          : label ?? (lang === "en" ? "Listen" : "Anhören")}
      </span>
    </button>
  );
}
