import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "@/lib/ai/provider";

type Msg = { role: "user" | "assistant"; content: string };

function systemPrompt(age: number, lang: "de" | "en", context: string) {
  const de = lang === "de";
  const tone = age <= 8
    ? (de ? "sehr einfach, wie einem 6-Jährigen erklären, kurze Sätze, max 2 Sätze pro Antwort." : "very simple, like to a 6-year-old, short sentences, max 2 sentences per reply.")
    : age <= 10
      ? (de ? "einfach und lebendig, konkrete Beispiele, 2-3 kurze Sätze." : "simple and vivid, concrete examples, 2-3 short sentences.")
      : age <= 13
        ? (de ? "klar und neugierig, 2-4 Sätze." : "clear and curious, 2-4 sentences.")
        : (de ? "präzise, populärwissenschaftlich, 3-5 Sätze." : "precise, popular-science tone, 3-5 sentences.");

  const offTopic = de
    ? `Bitte stell eine Frage zum ursprünglichen Thema.`
    : `Please ask a question related to the original topic.`;

  return (de
    ? `Du bist Lumi, ein warmer, freundlicher Erklär-Freund. Antworte IMMER auf Deutsch, muttersprachlich fehlerfrei (Grammatik, Kasus, Artikel, Umlaute). Ton: ${tone} Keine Markdown-Formatierung, keine Listen, nur natürliche Sätze.

WICHTIG — Themenbezug: Prüfe zuerst, ob die Frage inhaltlich mit dem KONTEXT (ursprüngliche Frage und Antwort) zu tun hat. Wenn NICHT (z. B. völlig anderes Thema, Smalltalk, Spiele, andere Wissenschaftsbereiche), antworte NUR mit genau diesem Satz und nichts anderem: "Hm, das gehört nicht zu unserer Frage. ${offTopic}" Führe niemals off-topic aus, auch nicht "kurz". Nur wenn die Frage klar zum Thema gehört, erkläre sie im Ton oben.`
    : `You are Lumi, a warm and friendly explainer-friend. ALWAYS answer in English. Tone: ${tone} No markdown, no lists, just natural sentences.

IMPORTANT — topic guard: First check if the question is genuinely related to the CONTEXT (the original question and its answer). If it is NOT (a totally different topic, small talk, games, unrelated field), reply with ONLY this exact sentence and nothing else: "Hmm, that's not about our question. ${offTopic}" Never answer off-topic content, not even briefly. Only when the question clearly belongs to the topic, explain in the tone above.`)
    + `\n\n${de ? "Kontext (die ursprüngliche Frage und Antwort, auf die sich das Kind bezieht):" : "Context (the original question and answer the child is following up on):"}\n${context}`;
}

export const Route = createFileRoute("/api/followup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: Msg[]; lang?: string; age?: number; context?: string };
        try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }

        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        if (messages.length === 0) return new Response("Empty", { status: 400 });
        const lang = body.lang === "en" ? "en" : "de";
        const ageRaw = Number(body.age);
        const age = Number.isFinite(ageRaw) ? Math.min(99, Math.max(6, Math.round(ageRaw))) : 9;
        const context = (body.context ?? "").toString().slice(0, 3000);

        try {
          const reply = await generateText({
            system: systemPrompt(age, lang, context),
            messages: messages.map((m) => ({
              role: m.role,
              content: (m.content ?? "").toString().slice(0, 1000),
            })),
          });
          return Response.json({ reply });
        } catch (error: any) {
          console.error("[followup] AI provider failed", error);
          return new Response(error?.message ?? "AI error", { status: 502 });
        }
      },
    },
  },
});
