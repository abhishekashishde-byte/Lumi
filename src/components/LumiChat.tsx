import { useEffect, useRef, useState } from "react";
import { Mic, Send, X, Loader2, Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LumiAvatar } from "@/components/LumiAvatar";
import { usePassport } from "@/lib/passport";

type Msg = { role: "user" | "assistant"; content: string };

export function LumiChat({
  context,
  age,
}: {
  /** Original question + assembled answer text used as system context. */
  context: string;
  age: number;
}) {
  const { lang } = useLang();
  const de = lang === "de";
  const passport = usePassport();
  const equipped = { aura: passport.equippedAura, badge: passport.equippedBadge };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Media-recorder fallback (Safari/iOS)
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // Native SpeechRecognition (Chrome/Edge/Android)
  const recRef = useRef<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => stopAudio(), []);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }

  async function speak(text: string) {
    if (!autoSpeak) return;
    stopAudio();
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = stopAudio;
      audio.onerror = stopAudio;
      await audio.play().catch(() => {});
    } catch {
      /* ignore */
    }
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang, age, context }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "error"));
      const data = await res.json();
      const reply = (data?.reply ?? "").toString().trim() ||
        (de ? "Ich bin mir nicht ganz sicher – frag mich anders?" : "I'm not quite sure — can you ask another way?");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: de ? "Ups, das hat nicht geklappt. Versuch es nochmal." : "Oops, that didn't work. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function startNative(): boolean {
    if (typeof window === "undefined") return false;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return false;
    try {
      const rec = new SR();
      rec.lang = lang === "en" ? "en-US" : "de-DE";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      let finalText = "";
      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interim += r[0].transcript;
        }
        setInput((finalText + " " + interim).trim());
      };
      rec.onerror = () => { setListening(false); };
      rec.onend = () => {
        setListening(false);
        recRef.current = null;
        const v = (finalText || input).trim();
        if (v) send(v);
      };
      rec.start();
      recRef.current = rec;
      setListening(true);
      return true;
    } catch {
      return false;
    }
  }

  async function startRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime =
        (window as any).MediaRecorder?.isTypeSupported?.("audio/webm") ? "audio/webm" :
        (window as any).MediaRecorder?.isTypeSupported?.("audio/mp4") ? "audio/mp4" :
        "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        chunksRef.current = [];
        if (blob.size < 512) { setListening(false); return; }
        setListening(false);
        setTranscribing(true);
        try {
          const fd = new FormData();
          fd.append("file", blob, `recording.${(rec.mimeType || "webm").includes("mp4") ? "m4a" : "webm"}`);
          fd.append("lang", lang);
          const res = await fetch("/api/transcribe", { method: "POST", body: fd });
          if (!res.ok) throw new Error("transcribe failed");
          const data = await res.json();
          const text = (data?.text ?? "").toString().trim();
          if (text) send(text);
        } catch {
          /* ignore */
        } finally {
          setTranscribing(false);
        }
      };
      rec.start();
      mediaRef.current = rec;
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  function toggleMic() {
    if (busy || transcribing) return;
    if (listening) {
      if (recRef.current) { try { recRef.current.stop(); } catch {} }
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        try { mediaRef.current.stop(); } catch {}
      }
      setListening(false);
      return;
    }
    if (!startNative()) startRecorder();
  }

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-40 flex flex-col items-center gap-1 focus:outline-none"
          aria-label={de ? "Frag Lumi" : "Ask Lumi"}
        >
          <span className="rounded-full bg-black/60 p-1 ring-2 ring-amber-300/60 shadow-[0_0_24px_rgba(255,193,7,0.35)] backdrop-blur transition active:scale-95">
            <LumiAvatar size={64} aura={equipped.aura} badge={equipped.badge} />
          </span>
          <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200 ring-1 ring-amber-300/30 backdrop-blur">
            {de ? "Nicht klar? Frag mich" : "Not clear? Ask me"}
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[#0F0F1F] ring-1 ring-white/10 sm:h-[70vh] sm:rounded-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-b from-[#1a1230] to-transparent px-4 py-3">
              <LumiAvatar size={40} aura={equipped.aura} badge={equipped.badge} />
              <div className="flex-1">
                <p className="font-display text-sm font-black text-white">Lumi</p>
                <p className="text-[11px] text-amber-200/80">
                  {de ? "Frag mich alles zur Antwort" : "Ask me anything about the answer"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoSpeak((v) => !v)}
                className="rounded-full p-2 text-amber-200/80 ring-1 ring-white/10 hover:bg-white/5"
                aria-label={autoSpeak ? (de ? "Vorlesen aus" : "Read-aloud off") : (de ? "Vorlesen an" : "Read-aloud on")}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => { stopAudio(); setOpen(false); }}
                className="rounded-full p-2 text-white/70 ring-1 ring-white/10 hover:bg-white/5"
                aria-label={de ? "Schließen" : "Close"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-200 ring-1 ring-white/10">
                  {de
                    ? "Hi! Wenn dir etwas noch nicht klar ist, frag mich einfach. Du kannst tippen oder auf das Mikrofon drücken."
                    : "Hi! If anything is still unclear, just ask. You can type or tap the microphone."}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start gap-2"}>
                  {m.role === "assistant" && (
                    <div className="mt-1 flex-shrink-0">
                      <LumiAvatar size={28} aura={equipped.aura} />
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-[#7C3AED] px-4 py-2.5 text-sm leading-relaxed text-white"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white/[0.06] px-4 py-2.5 text-sm leading-relaxed text-slate-100 ring-1 ring-white/10"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-amber-200/80">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {de ? "Lumi denkt nach…" : "Lumi is thinking…"}
                </div>
              )}
              {transcribing && (
                <div className="flex items-center gap-2 text-xs text-amber-200/80">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {de ? "Ich verstehe deine Frage…" : "Understanding your question…"}
                </div>
              )}
              {listening && (
                <div className="text-xs text-amber-300">
                  {de ? "Ich höre zu… sprich einfach." : "Listening… go ahead."}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-white/10 bg-black/40 px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 140) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder={de ? "Frag Lumi…" : "Ask Lumi…"}
                  className="max-h-[140px] flex-1 resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-amber-300/40"
                />
                <button
                  type="button"
                  onClick={toggleMic}
                  className={
                    "flex h-11 w-11 items-center justify-center rounded-full ring-1 transition active:scale-95 " +
                    (listening
                      ? "bg-red-500/90 text-white ring-red-300 animate-pulse"
                      : "bg-white/5 text-amber-300 ring-white/10 hover:bg-white/10")
                  }
                  aria-label={de ? "Mikrofon" : "Microphone"}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={!input.trim() || busy}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7C3AED] text-white ring-1 ring-white/10 transition active:scale-95 disabled:opacity-40"
                  aria-label={de ? "Senden" : "Send"}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
