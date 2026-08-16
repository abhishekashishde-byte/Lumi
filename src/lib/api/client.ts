import { supabase } from "@/integrations/supabase/client";

/** Same-origin fetch that attaches the current Supabase access token. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (error || !token) {
    throw new Error("AUTH_REQUIRED");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}
