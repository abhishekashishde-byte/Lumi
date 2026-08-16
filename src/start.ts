import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { requireLumiApiAccess } from "@/lib/api/auth.server";

const API_LIMITS: Record<string, { bucket: string; limit: number; windowSeconds: number }> = {
  "/api/ask": { bucket: "ask", limit: 40, windowSeconds: 3600 },
  "/api/followup": { bucket: "followup", limit: 80, windowSeconds: 3600 },
  "/api/transcribe": { bucket: "transcribe", limit: 30, windowSeconds: 3600 },
  "/api/tts": { bucket: "tts", limit: 80, windowSeconds: 3600 },
};

const apiGuardMiddleware = createMiddleware().server(async ({ request, next }) => {
  if (request.method === "POST") {
    const pathname = new URL(request.url).pathname;
    const policy = API_LIMITS[pathname];
    if (policy) {
      const access = await requireLumiApiAccess(request, policy);
      if (!access.ok) return access.response;
    }
  }
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [apiGuardMiddleware, errorMiddleware],
}));
