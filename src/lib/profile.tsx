import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLang, useT, useUI } from "@/lib/i18n";
import { Sparkles } from "lucide-react";
import lumiLogo from "@/assets/lumi-logo.png";

type Profile = { id: string; age: number | null; display_name: string | null };
type ProfilePayload = { age?: number | null; display_name?: string | null };

type Ctx = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setAge: (age: number) => Promise<void>;
  signOut: () => Promise<void>;
};

const ProfileContext = createContext<Ctx>({
  session: null, profile: null, loading: true,
  setAge: async () => {}, signOut: async () => {},
});

function displayNameFor(session: Session): string | null {
  const meta = session.user.user_metadata ?? {};
  return (
    meta.full_name ??
    meta.name ??
    session.user.email?.split("@")[0] ??
    null
  );
}

function toProfile(uid: string, data: unknown, fallbackName: string | null): Profile {
  const payload = (data && typeof data === "object" ? data : {}) as ProfilePayload;
  const age = Number(payload.age);
  return {
    id: uid,
    age: Number.isFinite(age) ? age : null,
    display_name: typeof payload.display_name === "string" && payload.display_name.trim()
      ? payload.display_name
      : fallbackName,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setAuthLoading(false);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session?.user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const uid = session.user.id;
    const fallbackName = displayNameFor(session);
    setProfileLoading(true);

    (async () => {
      const { data, error } = await (supabase as any)
        .from("lumi_data")
        .select("data")
        .eq("user_id", uid)
        .eq("record_type", "profile")
        .eq("record_key", "main")
        .maybeSingle();

      if (cancelled) return;

      if (!error && data?.data) {
        setProfile(toProfile(uid, data.data, fallbackName));
        setProfileLoading(false);
        return;
      }

      const initial = { age: null, display_name: fallbackName };
      const { data: created, error: createError } = await (supabase as any)
        .from("lumi_data")
        .upsert(
          { user_id: uid, record_type: "profile", record_key: "main", data: initial },
          { onConflict: "user_id,record_type,record_key" },
        )
        .select("data")
        .maybeSingle();

      if (cancelled) return;
      if (createError) {
        console.error("[Lumi profile] load/create failed", createError);
        setProfile(toProfile(uid, initial, fallbackName));
      } else {
        setProfile(toProfile(uid, created?.data ?? initial, fallbackName));
      }
      setProfileLoading(false);
    })();

    return () => { cancelled = true; };
  }, [session?.user?.id]);

  const setAge = async (age: number) => {
    if (!session?.user) return;
    const uid = session.user.id;
    const safeAge = Math.min(99, Math.max(6, Math.round(age)));
    const next = {
      age: safeAge,
      display_name: profile?.display_name ?? displayNameFor(session),
    };

    const { data, error } = await (supabase as any)
      .from("lumi_data")
      .upsert(
        { user_id: uid, record_type: "profile", record_key: "main", data: next },
        { onConflict: "user_id,record_type,record_key" },
      )
      .select("data")
      .maybeSingle();

    if (error) {
      console.error("[Lumi profile] age save failed", error);
      return;
    }
    setProfile(toProfile(uid, data?.data ?? next, next.display_name));
  };

  const signOut = async () => { await supabase.auth.signOut(); };
  const loading = authLoading || (!!session?.user && profileLoading);

  return (
    <ProfileContext.Provider value={{ session, profile, loading, setAge, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() { return useContext(ProfileContext); }

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useProfile();
  const t = useT();

  if (loading) {
    return (
      <main className="starfield fixed inset-0 flex items-center justify-center bg-[#0D0D1A] text-white">
        <Sparkles className="h-10 w-10 animate-pulse text-amber-300" />
      </main>
    );
  }

  if (!session) return <SignInScreen />;
  if (!profile || profile.age == null) return <AgePicker />;
  return <>{children}</>;
}

function SignInScreen() {
  const t = useT();
  const ui = useUI();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function google() {
    setErr(null); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "https://lumi-five-beryl.vercel.app/welcome" },
      });
      if (error) { setErr(error.message ?? "Sign-in failed"); setBusy(false); return; }
    } catch (e: any) { setErr(e?.message ?? "Sign-in failed"); setBusy(false); }
  }

  return (
    <main className="starfield fixed inset-0 flex flex-col items-center justify-center bg-[#0D0D1A] px-6 text-center text-white">
      <LangToggle />
      <img
        src={lumiLogo}
        alt="Lumi"
        width={128}
        height={128}
        className="h-36 w-36 drop-shadow-[0_0_55px_rgba(255,200,80,0.5)]"
      />
      <p className="mt-5 max-w-xs text-sm font-medium text-amber-200/90">
        {ui("tagline")}
      </p>
      <p className="mt-8 max-w-sm text-sm text-slate-300">
        {t("Melde dich an, um zu starten. Wir merken uns dein Alter, damit Erklärungen genau passen.",
           "Sign in to start. We'll remember your age so explanations fit just right.")}
      </p>
      <button
        onClick={google}
        disabled={busy}
        className="mt-6 flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3.5 font-display text-sm font-bold text-black disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.9 39.3 16.4 43.5 24 43.5z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.1l6.2 5.2c-.4.4 6.6-4.8 6.6-14.3 0-1.2-.1-2.3-.4-3.5z" />
        </svg>
        {t("Mit Google anmelden", "Sign in with Google")}
      </button>
      {err && <p className="mt-3 text-sm text-rose-300">{err}</p>}
    </main>
  );
}

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

function AgePicker() {
  const { setAge, profile } = useProfile();
  const t = useT();
  const [busy, setBusy] = useState<number | null>(null);
  const ages = [7, 8, 9, 10, 12, 14, 16, 18];

  return (
    <main className="starfield fixed inset-0 flex flex-col items-center justify-center overflow-y-auto bg-[#0D0D1A] px-6 py-10 text-center text-white">
      <LangToggle />
      <div className="text-5xl">🎂</div>
      <h1 className="mt-4 font-display text-3xl font-black">
        {t(`Hallo ${profile?.display_name ?? "Forscher"}!`, `Hi ${profile?.display_name ?? "explorer"}!`)}
      </h1>
      <p className="mt-2 max-w-sm text-base text-slate-300">
        {t("Wie alt bist du? So passen wir die Erklärungen genau für dich an — von einfach für Kinder bis tief für Erwachsene.",
           "How old are you? We tune explanations from simple for kids to deep for grown-ups.")}
      </p>
      <div className="mt-8 grid grid-cols-4 gap-3">
        {ages.map((a) => (
          <button
            key={a}
            disabled={busy !== null}
            onClick={async () => { setBusy(a); await setAge(a); setBusy(null); }}
            className="min-h-[72px] min-w-[72px] rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3 py-3 font-display text-2xl font-black shadow-lg disabled:opacity-50"
          >
            {a === 18 ? "18+" : a}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">{t("Du kannst das später ändern.", "You can change this later.")}</p>
    </main>
  );
}
