type AccessOptions = {
  bucket: string;
  limit: number;
  windowSeconds?: number;
};

type AccessResult =
  | { ok: true; userId: string; remaining: number; resetAt: string | null }
  | { ok: false; response: Response };

const SUPABASE_URL = "https://xvlflsdanfzytxlwpthr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LO1kiVwvx5PZpgVxRG_s7A_A2Y4hns6";

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

async function verifyUser(token: string): Promise<string | null> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  const user = await response.json().catch(() => null);
  return typeof user?.id === "string" ? user.id : null;
}

async function consumeQuota(
  token: string,
  userId: string,
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: string | null } | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/consume_lumi_quota`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_user_id: userId,
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.warn("[Lumi quota] limiter unavailable; allowing authenticated request", response.status, detail);
    return null;
  }

  const payload = await response.json().catch(() => null);
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row) return null;

  return {
    allowed: Boolean(row.allowed),
    remaining: Number(row.remaining ?? 0),
    resetAt: row.reset_at ? String(row.reset_at) : null,
  };
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

  let userId: string | null = null;
  try {
    userId = await verifyUser(token);
  } catch (error) {
    console.error("[Lumi auth] session verification failed", error);
    return { ok: false, response: jsonError(401, "Unable to verify session") };
  }

  if (!userId) {
    return { ok: false, response: jsonError(401, "Invalid or expired session") };
  }

  // Authentication is mandatory. Quota enforcement is fail-open so a temporary
  // database/RPC issue never blocks a valid Lumi question.
  try {
    const quota = await consumeQuota(token, userId, bucket, limit, windowSeconds);
    if (!quota) {
      return { ok: true, userId, remaining: -1, resetAt: null };
    }

    if (!quota.allowed) {
      const retryAfter = quota.resetAt
        ? Math.max(1, Math.ceil((new Date(quota.resetAt).getTime() - Date.now()) / 1000))
        : windowSeconds;
      return {
        ok: false,
        response: jsonError(429, "Too many requests. Please try again later.", {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
        }),
      };
    }

    return {
      ok: true,
      userId,
      remaining: quota.remaining,
      resetAt: quota.resetAt,
    };
  } catch (error) {
    console.warn("[Lumi quota] limiter crashed; allowing authenticated request", error);
    return { ok: true, userId, remaining: -1, resetAt: null };
  }
}
