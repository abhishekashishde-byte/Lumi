import { createFileRoute } from "@tanstack/react-router";
import { requireLumiApiAccess } from "@/lib/api/auth.server";

const KID_INSTRUCTIONS_EN =
  "You are Lumi, a warm and playful storyteller for children aged 5 to 10. " +
  "Speak SLOWLY and clearly, like reading a bedtime story. Use a gentle, curious, " +
  "cheerful tone with lots of expression — light up on surprising words, pause a beat " +
  "after questions, and let wonder come through. Never sound flat or robotic.";

const KID_INSTRUCTIONS_DE =
  "Du bist Lumi, eine warme und verspielte Erzählerin für Kinder von 5 bis 10 Jahren. " +
  "Sprich LANGSAM und deutlich, wie bei einer Gute-Nacht-Geschichte. Nutze einen sanften, " +
  "neugierigen, fröhlichen Ton mit viel Ausdruck — betone überraschende Wörter, mach eine " +
  "kleine Pause nach Fragen und lass Staunen mitschwingen. Klinge niemals flach oder roboterhaft.";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const access = await requireLumiApiAccess(request, { bucket: "tts", limit: 80 });
        if (!access.ok) return access.response;

        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });

        let body: { text?: string; lang?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const text = (body.text ?? "").toString().slice(0, 3500).trim();
        if (!text) return new Response("Empty text", { status: 400 });
        const lang = body.lang === "en" ? "en" : "de";

        try {
          const res = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
              input: text,
              voice: process.env.OPENAI_TTS_VOICE ?? "shimmer",
              response_format: "mp3",
              speed: 0.9,
              instructions: lang === "en" ? KID_INSTRUCTIONS_EN : KID_INSTRUCTIONS_DE,
            }),
            signal: request.signal,
          });

          if (!res.ok) {
            const msg = await res.text().catch(() => "");
            return new Response(msg || "TTS error", { status: res.status });
          }

          return new Response(res.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "private, max-age=300",
            },
          });
        } catch (err) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw err;
        }
      },
    },
  },
});
