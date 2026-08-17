import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Keep server-side environment variables dynamic.
// Vercel injects process.env into the server function at runtime, and TanStack
// Start expects secrets such as SUPABASE_SERVICE_ROLE_KEY / GEMINI_API_KEY to be
// read inside request handlers. Do NOT replace process.env.* at build time.
export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
