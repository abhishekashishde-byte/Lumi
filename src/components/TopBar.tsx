import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Settings, User as UserIcon, Volume2, VolumeX, Vibrate, X, Cake, Headphones } from "lucide-react";
import { useLang, useUI } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/profile";

export function TopBar() {
  const { lang, setLang } = useLang();
  const t = useUI();
  const { sound, haptic, readAloud, setSound, setHaptic, setReadAloud } = useSettings();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-end gap-2 px-3 pt-3"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0.75rem)" }}
      >
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/50 p-1 ring-1 ring-white/10 backdrop-blur-md">
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
        <button
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/10 backdrop-blur-md"
          aria-label={lang === "en" ? "Settings" : "Einstellungen"}
        >
          <Settings className="h-4 w-4" />
        </button>
        {email ? (
          <button
            onClick={() => supabase.auth.signOut()}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/10 backdrop-blur-md"
            title={email}
          >
            <UserIcon className="h-3.5 w-3.5 text-amber-300" />
            <span className="max-w-[100px] truncate">{email.split("@")[0]}</span>
            <LogOut className="h-3.5 w-3.5 opacity-60" />
          </button>
        ) : (
          <Link
            to="/auth"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-[#7C3AED] px-3 py-1.5 text-xs font-bold text-white ring-1 ring-[#7C3AED]/50 backdrop-blur-md"
          >
            <LogIn className="h-3.5 w-3.5" />
            {t("signIn")}
          </Link>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-[#13131f] p-6 ring-1 ring-white/10 sm:rounded-3xl animate-in slide-in-from-bottom"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1.5rem)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-white">
                {lang === "en" ? "Settings" : "Einstellungen"}
              </h2>
              <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <ToggleRow
              icon={sound ? <Volume2 className="h-5 w-5 text-amber-300" /> : <VolumeX className="h-5 w-5 text-slate-400" />}
              title={lang === "en" ? "Sound effects" : "Soundeffekte"}
              subtitle={lang === "en" ? "Play tones during activities" : "Töne in den Aktivitäten abspielen"}
              on={sound}
              onChange={setSound}
            />
            <ToggleRow
              icon={<Headphones className={`h-5 w-5 ${readAloud ? "text-amber-300" : "text-slate-400"}`} />}
              title={lang === "en" ? "Lumi reads aloud" : "Lumi liest vor"}
              subtitle={lang === "en" ? "Slow, warm, kid-friendly narration for Imagine & How it works" : "Langsam, warm, kindgerecht für Stell dir vor und So funktioniert es"}
              on={readAloud}
              onChange={setReadAloud}
            />
            <ToggleRow
              icon={<Vibrate className={`h-5 w-5 ${haptic ? "text-amber-300" : "text-slate-400"}`} />}
              title={lang === "en" ? "Haptic feedback" : "Vibration"}
              subtitle={lang === "en" ? "Buzz on taps and milestones" : "Vibrieren bei Aktionen"}
              on={haptic}
              onChange={setHaptic}
            />
            <AgeRow />
          </div>
        </div>
      )}
    </>
  );
}

function AgeRow() {
  const { profile, setAge } = useProfile();
  const { lang } = useLang();
  const ages = [7, 8, 9, 10, 12, 14, 16, 18];
  return (
    <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/40">
          <Cake className="h-5 w-5 text-amber-300" />
        </div>
        <div className="flex-1">
          <p className="font-display text-base font-bold text-white">
            {lang === "en" ? "Reading level (age)" : "Lesestufe (Alter)"}
          </p>
          <p className="text-xs text-slate-400">
            {lang === "en" ? "From simple for kids to deep for grown-ups." : "Von einfach für Kinder bis tief für Erwachsene."}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {ages.map((a) => (
          <button
            key={a}
            onClick={() => setAge(a)}
            className={`min-h-[44px] rounded-xl font-display text-base font-black ${profile?.age === a ? "bg-[#7C3AED] text-white" : "bg-white/5 text-slate-200 ring-1 ring-white/10"}`}
          >{a === 18 ? "18+" : a}</button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({
  icon, title, subtitle, on, onChange,
}: { icon: React.ReactNode; title: string; subtitle: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="mt-4 flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10 active:scale-[0.99]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/40">{icon}</div>
      <div className="flex-1">
        <p className="font-display text-base font-bold text-white">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      <span className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${on ? "bg-[#7C3AED]" : "bg-white/15"}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}
