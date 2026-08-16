import { supabaseAdmin } from "@/integrations/supabase/client.server";

type AccessOptions = {
  bucket: string;
  limit: number;
  windowSeconds?: number;
};

type AccessResult =
  | { ok: true; userId: string; remaining: number; resetAt: string | null }
  | { ok: false; response: Response };

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function requireLumiApiAccess(
  request: Request,
  { bucket, limit, windowSeconds = 3600 }: AccessOptions,
): Promise<AccessResult> {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return { ok: false, response: jsonError(401, "Authentication required") };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const user = data.user;
  if (error || !user) {
    return { ok: false, response: jsonError(401, "Invalid or expired session") };
  }

  const { data: quotaRows, error: quotaError } = await (supabaseAdmin as any).rpc(
    "consume_lumi_quota",
    {
      p_user_id: user.id,
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    },
  );

  if (quotaError) {
    console.error("[Lumi quota]", quotaError);
    return { ok: false, response: jsonError(503, "Usage guard unavailable") };
  }

  const row = Array.isArray(quotaRows) ? quotaRows[0] : quotaRows;
  const allowed = Boolean(row?.allowed);
  const remaining = Number(row?.remaining ?? 0);
  const resetAt = row?.reset_at ? String(row.reset_at) : null;

  if (!allowed) {
    const retryAfter = resetAt
      ? Math.max(1, Math.ceil((new Date(resetAt).getTime() - Date.now()) / 1000))
      : windowSeconds;
    return {
      ok: false,
      response: jsonError(429, "Too many requests. Please try again later.", {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": "0",
      }),
    };
  }

  return { ok: true, userId: user.id, remaining, resetAt };
}
