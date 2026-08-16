import { supabase } from "@/integrations/supabase/client";

const PROTECTED_API_PATHS = new Set([
  "/api/ask",
  "/api/followup",
  "/api/transcribe",
  "/api/tts",
]);

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) return data.session.access_token;
  } catch {
    // Fall through to storage recovery below.
  }

  // Supabase Auth persists the session in localStorage in this app. Recover the
  // access token directly if getSession() is temporarily behind during hydration.
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) ?? "";
        if (!/^sb-.*-auth-token$/.test(key)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const token = parsed?.access_token ?? parsed?.currentSession?.access_token;
        if (typeof token === "string" && token.length > 20) return token;
      }
    } catch {
      // Restricted/private storage: caller will receive AUTH_REQUIRED.
    }
  }
  return null;
}

/** Same-origin fetch that attaches the current Supabase access token. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  headers.set("Authorization", `Bearer ${token}`);
  return nativeFetch(input, { ...init, headers });
}

let installed = false;
let restoreFetch: (() => void) | null = null;
let nativeFetch: typeof fetch = typeof globalThis.fetch === "function"
  ? globalThis.fetch.bind(globalThis)
  : (undefined as unknown as typeof fetch);

/**
 * Installs one browser-side fetch wrapper for Lumi's expensive API routes.
 * Existing feature code can keep using fetch(); the access token is attached centrally.
 */
export function installAuthenticatedApiFetch(): () => void {
  if (typeof window === "undefined") return () => {};
  if (installed && restoreFetch) return restoreFetch;

  const originalFetch = globalThis.fetch.bind(globalThis);
  nativeFetch = originalFetch;

  const wrappedFetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
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

    const token = await getAccessToken();
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));

    if (!token) {
      // Do not silently send an unauthenticated expensive request. Returning a
      // local 401 makes the failure deterministic instead of hitting the server.
      return Response.json({ error: "Authentication session not ready" }, { status: 401 });
    }

    headers.set("Authorization", `Bearer ${token}`);
    return originalFetch(input, { ...init, headers });
  }) as typeof fetch;

  // Assign both names explicitly. Some bundlers resolve global fetch through
  // globalThis rather than window, even in browser code.
  globalThis.fetch = wrappedFetch;
  window.fetch = wrappedFetch;

  installed = true;
  restoreFetch = () => {
    if (!installed) return;
    globalThis.fetch = originalFetch;
    window.fetch = originalFetch;
    installed = false;
    restoreFetch = null;
  };
  return restoreFetch;
}
