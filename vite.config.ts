import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";

// Vite 8 replaces process.env with an empty object in bundled environments unless
// keepProcessEnv is enabled. Vercel injects secrets at function runtime, so every
// server environment must preserve process.env instead of compiling it away.
const preserveRuntimeEnv: Plugin = {
  name: "lumi-preserve-runtime-env",
  configEnvironment(name, config) {
    if (name !== "client") {
      return {
        ...config,
        keepProcessEnv: true,
      };
    }
  },
};

export default defineConfig({
  plugins: [
    preserveRuntimeEnv,
    tanstackStart(),
    nitro(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  // TanStack Start uses the SSR environment name in normal builds. Keep this
  // explicit as well so the setting survives framework/plugin config merging.
  environments: {
    ssr: {
      keepProcessEnv: true,
    },
  },
});
