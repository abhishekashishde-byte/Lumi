import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Vercel exposes project environment variables during the build. Nitro can
  // occasionally lose selected runtime vars after bundling, so we explicitly
  // substitute the server-only references into the server bundle as well.
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const env = { ...fileEnv, ...process.env };

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || "";
  const supabasePublishableKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    "";

  const serverEnvNames = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "AI_PROVIDER",
    "GEMINI_API_KEY",
    "GEMINI_MODEL",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "OPENAI_TRANSCRIBE_MODEL",
    "OPENAI_TTS_MODEL",
    "OPENAI_TTS_VOICE",
    "YOUTUBE_API_KEY",
  ] as const;

  const define: Record<string, string> = {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
      supabasePublishableKey,
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      supabasePublishableKey,
    ),
    "import.meta.env.VITE_SUPABASE_KEY": JSON.stringify(supabasePublishableKey),
  };

  for (const name of serverEnvNames) {
    define[`process.env.${name}`] = JSON.stringify(env[name] ?? "");
  }

  return {
    plugins: [tanstackStart(), nitro(), react(), tailwindcss(), tsconfigPaths()],
    define,
  };
});
