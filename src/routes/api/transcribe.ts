import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });

        const inForm = await request.formData().catch(() => null);
        if (!inForm) return new Response("Bad form", { status: 400 });
        const file = inForm.get("file");
        const lang = (inForm.get("lang") ?? "").toString();
        if (!(file instanceof Blob) || file.size < 512) return new Response("Empty audio", { status: 400 });
        if (file.size > 20 * 1024 * 1024) return new Response("Audio too large", { status: 413 });

        const mime = (file as File).type || "audio/webm";
        const ext = mime.includes("wav") ? "wav" : mime.includes("mp4") || mime.includes("m4a") ? "m4a" : mime.includes("mpeg") || mime.includes("mp3") ? "mp3" : mime.includes("ogg") ? "ogg" : "webm";
        const upstream = new FormData();
        upstream.append("model", process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe");
        upstream.append("file", file, `recording.${ext}`);
        if (lang === "de" || lang === "en") upstream.append("language", lang);

        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
          signal: request.signal,
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          return new Response(detail || "Transcription failed", { status: res.status });
        }
        const data = await res.json().catch(() => null);
        return Response.json({ text: (data?.text ?? "").toString().trim() });
      },
    },
  },
});
