import { supabase } from "@/integrations/supabase/client";

const PROTECTED_API_PATHS = new Set([
  "/api/ask",
  "/api/followup",
  "/api/transcribe",
  "/api/tts",
]);

/** Same-origin fetch that attaches the current Supabase access token. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (error || !token) throw new Error("AUTH_REQUIRED");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

let installed = false;
let restoreFetch: (() => void) | null = null;

/**
 * Installs one browser-side fetch wrapper for Lumi's expensive API routes.
 * Existing feature code can keep using fetch(); the access token is attached centrally.
 */
export function installAuthenticatedApiFetch(): () => void {
  if (typeof window === "undefined") return () => {};
  if (installed && restoreFetch) return restoreFetch;

  const originalFetch = window.fetch.bind(window);
  window.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    let url: URL;
    try {
      const raw = input instanceof Request ? input.url : String(input);
      url = new URL(raw, window.location.href);
    } catch {
      return originalFetch(input, init);
    }

    if (url.origin !== window.location.origin || !PROTECTED_API_PATHS.has(url.pathname)) {
      return originalFetch(input, init);
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return originalFetch(input, { ...init, headers });
  }) as typeof window.fetch;

  installed = true;
  restoreFetch = () => {
    if (!installed) return;
    window.fetch = originalFetch;
    installed = false;
    restoreFetch = null;
  };
  return restoreFetch;
}
