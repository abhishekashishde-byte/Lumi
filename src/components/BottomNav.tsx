import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Sparkles, BookHeart } from "lucide-react";
import { useLang } from "@/lib/i18n";

type Item = {
  to: "/erkunden" | "/entdecken" | "/passport";
  de: string;
  en: string;
  icon: typeof Compass;
  match: (p: string) => boolean;
};

const items: Item[] = [
  { to: "/erkunden", de: "Erkunden", en: "Explore", icon: Compass, match: (p) => p === "/erkunden" || p.startsWith("/topic") },
  { to: "/entdecken", de: "Entdecken", en: "Discover", icon: Sparkles, match: (p) => p.startsWith("/entdecken") },
  { to: "/passport", de: "Pass", en: "Passport", icon: BookHeart, match: (p) => p.startsWith("/passport") },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { lang } = useLang();
  return (
    <nav
      aria-label={lang === "en" ? "Main" : "Hauptnavigation"}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0D0D1A]/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-2">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          const label = lang === "en" ? it.en : it.de;
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="flex min-h-16 min-w-20 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Icon
                className={`h-7 w-7 transition-colors ${active ? "text-[#F59E0B]" : "text-slate-400"}`}
                strokeWidth={active ? 2.5 : 2}
                aria-hidden="true"
              />
              <span className={`font-display text-[12px] font-bold ${active ? "text-white" : "text-slate-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
