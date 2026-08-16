import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BottomNav } from "../components/BottomNav";
import { TopBar } from "../components/TopBar";
import { LangProvider } from "../lib/i18n";
import { SettingsProvider } from "../lib/settings";
import { ProfileProvider, AuthGate } from "../lib/profile";
import { DiscoveryCelebration } from "../components/DiscoveryCelebration";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0D0D1A" },
      { title: "Lumi – Jede Frage öffnet eine neue Welt." },
      { name: "description", content: "Lumi verwandelt jede Warum-Frage in ein visuelles, interaktives Abenteuer – auf Deutsch und Englisch." },
      { property: "og:title", content: "Lumi – Turning Curiosity into Discovery" },
      { property: "og:description", content: "Lumi turns every 'why' question into a visual, interactive adventure – in German and English." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Lumi – Turning Curiosity into Discovery" },
      { name: "twitter:description", content: "Lumi turns every 'why' question into a visual, interactive adventure." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/lumi-logo.png" },
      { rel: "apple-touch-icon", href: "/lumi-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

type PublicConfig = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

function getPublicConfig(): PublicConfig {
  if (typeof window !== "undefined") {
    return (window as any).__LUMI_PUBLIC_CONFIG__ ?? {
      supabaseUrl: "",
      supabasePublishableKey: "",
    };
  }

  return {
    supabaseUrl:
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "",
    supabasePublishableKey:
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "",
  };
}

function RootShell({ children }: { children: ReactNode }) {
  const publicConfig = getPublicConfig();
  const publicConfigScript = `window.__LUMI_PUBLIC_CONFIG__=${JSON.stringify(publicConfig).replace(/</g, "\\u003c")};`;

  return (
    <html lang="de">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: publicConfigScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isPublicRoute = pathname === "/welcome" || pathname === "/auth";

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <SettingsProvider>
          <ProfileProvider>
            {isPublicRoute ? (
              <Outlet />
            ) : (
              <AuthGate>
                <div className="min-h-screen pb-24">
                  <TopBar />
                  <Outlet />
                  <BottomNav />
                  <DiscoveryCelebration />
                </div>
              </AuthGate>
            )}
          </ProfileProvider>
        </SettingsProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}
