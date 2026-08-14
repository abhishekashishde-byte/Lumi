import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUI, useLang } from "@/lib/i18n";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/50 p-1 ring-1 ring-white/10 backdrop-blur-md">
      <button
        onClick={() => setLang("de")}
        className={`rounded-full px-3 py-1 text-xs font-bold ${lang === "de" ? "bg-white text-black" : "text-white/70"}`}
        aria-label="Deutsch"
      >DE</button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-xs font-bold ${lang === "en" ? "bg-white text-black" : "text-white/70"}`}
        aria-label="English"
      >EN</button>
    </div>
  );
}

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Warum – Sign in" }] }),
  component: AuthPage,
});

function AuthPage() {
  const t = useUI();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/erkunden" });
    });
  }, [navigate]);

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        setError(error.message ?? "Sign-in failed");
        setBusy(false);
        return;
      }
    } catch (e: any) {
      setError(e?.message ?? "Sign-in failed");
      setBusy(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/erkunden" });
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="starfield min-h-screen bg-[#0D0D1A] px-5 pb-24 pt-16 text-white">
      <LangToggle />
      <Link to="/welcome" className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles className="h-5 w-5" />
          <span className="font-display text-xs font-black uppercase tracking-widest">Warum</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-black leading-tight">
          {lang === "en" ? "Welcome back, curious mind." : "Willkommen zurück, neugieriger Kopf."}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {lang === "en"
            ? "Sign in to save your progress across devices."
            : "Melde dich an, um deinen Fortschritt zu speichern."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3.5 font-display text-sm font-bold text-black disabled:opacity-60"
        >
          <GoogleG />
          {t("signInGoogle")}
        </button>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-slate-500">
          <div className="h-px flex-1 bg-white/10" />
          {lang === "en" ? "or" : "oder"}
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            className="w-full rounded-2xl bg-[#10101e] px-4 py-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")}
            className="w-full rounded-2xl bg-[#10101e] px-4 py-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-[#7C3AED] py-3 font-display text-sm font-black uppercase tracking-wide disabled:opacity-60"
          >
            {mode === "signup" ? t("createAccount") : t("signIn")}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-4 w-full text-center text-xs text-slate-400 underline"
        >
          {mode === "signup" ? t("haveAccount") : t("noAccount")}
        </button>

        <Link to="/erkunden" className="mt-6 block text-center text-xs text-slate-500">
          {t("continueAsGuest")}
        </Link>
      </div>
    </main>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.9 39.3 16.4 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.1l6.2 5.2c-.4.4 6.6-4.8 6.6-14.3 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
