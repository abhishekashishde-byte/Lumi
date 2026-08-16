import { createFileRoute } from "@tanstack/react-router";
import { generateStructuredJson } from "@/lib/ai/provider";
import { requireLumiApiAccess } from "@/lib/api/auth.server";

const PROMPT_VERSION = "lumi-ask-2026-08-16-v2";

function ageSpec(age: number, lang: "de" | "en") {
  const de = lang === "de";
  if (age <= 8) return de
    ? `Alter ${age} (sehr jung): SEHR KURZ. 2 Absätze × 1-2 kurze Sätze, max 8 Wörter/Satz. Bilderbuchwörter. KEINE Fachwörter. key_points: GENAU 3, Titel ≤2 Wörter, Text ≤8 Wörter. analogy: 1 "Stell dir vor…"-Satz. fun_fact: 1 Satz mit einfacher Zahl. vocab: max 1. Bevorzuge "drag"/"slider"/"collision"/"timeline" statt "tap".`
    : `Age ${age} (very young): VERY SHORT. 2 paragraphs × 1-2 short sentences, max 8 words/sentence. Picture-book words. NO jargon. key_points: EXACTLY 3, titles ≤2 words, text ≤8 words. analogy: 1 "Imagine…" sentence. fun_fact: 1 sentence with a simple number. vocab: max 1. Prefer "drag"/"slider"/"collision"/"timeline" over "tap".`;
  if (age <= 10) return de
    ? `Alter ${age} (Grundschule): KOMPAKT. 2 Absätze × 2 Sätze, ≤12 Wörter. Max 1 Fachwort, im vocab erklärt. key_points: 3, kurz und knackig. Bevorzuge interaktive interaction_type. Lebendig, konkret.`
    : `Age ${age} (primary school): COMPACT. 2 paragraphs × 2 sentences, ≤12 words. Max 1 specialist word, explained in vocab. key_points: 3, short and punchy. Prefer interactive interaction_type. Vivid, concrete.`;
  if (age <= 13) return de
    ? `Alter ${age} (Mittelstufe): KOMPAKT. 2-3 Absätze × 2-3 Sätze, ≤16 Wörter. Bis 2 Fachwörter im vocab. key_points: 4, jeder mit einem überraschenden Detail. analogy: 2 Sätze. interaction_type passend wählen.`
    : `Age ${age} (middle school): COMPACT. 2-3 paragraphs × 2-3 sentences, ≤16 words. Up to 2 specialist words in vocab. key_points: 4, each with a surprising detail. analogy: 2 sentences. Pick interaction_type that fits.`;
  if (age <= 16) return de
    ? `Alter ${age} (Jugendlich): 3 Absätze × 3-4 Sätze, bis 20 Wörter. Ursache → Mechanismus → Folge. Fachbegriffe im vocab (3-5). key_points: 4-5 mit Zahlen. analogy: 2-3 Sätze.`
    : `Age ${age} (teenager): 3 paragraphs × 3-4 sentences, up to 20 words. Cause → mechanism → consequence. Specialist terms in vocab (3-5). key_points: 4-5 with numbers. analogy: 2-3 sentences.`;
  return de
    ? `Alter ${age}+ (Erwachsen): 3-4 Absätze × 3-5 Sätze, populärwissenschaftlich. Mechanismen erklären. vocab 4-6. key_points: 5 mit Zahlen. analogy: 3 Sätze.`
    : `Age ${age}+ (adult): 3-4 paragraphs × 3-5 sentences, popular-science. Explain mechanisms. vocab 4-6. key_points: 5 with numbers. analogy: 3 sentences.`;
}

const IMAGE_RULES = `IMAGES (image_search_term, image_search_term_2):
- English, 3-5 words, unambiguous Wikimedia Commons photo query. NEVER a single word.
- Always add a disambiguating nature/science word: storm, photograph, planet, animal, eruption, atom, cell, galaxy, telescope, microscope.
- Avoid brand/person collisions. Examples of the fix: Lightning→"cloud to ground lightning storm photograph"; Mercury→"planet mercury surface nasa"; Amazon→"amazon rainforest canopy"; Apple→"apple fruit tree orchard".
- Good: "Thunderstorm lightning photograph", "Volcanic eruption lava flow", "Honey bee on flower", "Andromeda galaxy telescope image".
- image_search_term_2 MUST show a different subject from the same question.`;

const INTERACTION_RULES = `INTERACTION — pick the ONE that matches the question. Do NOT default to "tap".
- "collision" → things that press, crash, collide, build pressure: earthquakes, plate tectonics, mountain formation, volcanoes, meteor impact.
- "drag" → things where an angle or path changes an outcome: rainbows, prisms, refraction, magnets, lenses, telescopes, planet orbits.
- "timeline" → ordered moments: dinosaurs, evolution, universe history, life of a star, ice ages, day-night cycle. interaction_data = [{label:"230M years ago", text:"…"}, …] × 4-5 chronological.
- "slider" → any quantity/scale question ("how much/fast/big/many/hot/far/loud"): bee honey per day, cheetah speed, elephant weight, sun temperature, distance to moon, heartbeats per minute. interaction_data MUST have slider_min, slider_max (round kid-reachable numbers), slider_unit ("g","km/h","°C","km","years"), slider_facts: 3-5 {at, text} INCLUDING the real answer.
- "tap" → ONLY if none of the above fit (e.g. "why is blood red", "why do we dream").
- interaction_label: short, topic-specific hint (e.g. "Schiebe zur Menge Honig pro Tag" / "Slide to how much honey one bee makes per day").`;

const LANG_QUALITY_DE = `SPRACHQUALITÄT (kritisch):
- Muttersprachliches, fehlerfreies Deutsch. Kein einziger Grammatik-, Rechtschreib- oder Kongruenzfehler.
- Verben (Konjugation, Zeit, Modus) und Präpositionen mit korrektem Kasus (Dativ/Akkusativ/Genitiv) prüfen.
- Genus/Artikel müssen stimmen (der/die/das, dem/den/des). Zusammensetzungen zusammenschreiben (Sonnensystem, Regenbogen, Erdbeben).
- Umlaute (ä, ö, ü) und ß korrekt — niemals "ae/oe/ue/ss" als Ersatz.
- Keine Anglizismen, kein Denglisch, keine wörtlichen Übersetzungen ("realize" ist NICHT "realisieren" für "erkennen").
- Lies deinen Text vor der Ausgabe still Korrektur. Ein einziger Fehler ruiniert die Antwort.`;

function systemPrompt(age: number, lang: "de" | "en") {
  const de = lang === "de";
  const audience = de
    ? (age <= 10 ? "deutsche Grundschulkinder" : age <= 13 ? "neugierige Schüler:innen der Mittelstufe" : age <= 16 ? "interessierte Jugendliche" : "Erwachsene mit echtem Interesse")
    : (age <= 10 ? "primary-school children" : age <= 13 ? "curious middle-schoolers" : age <= 16 ? "engaged teenagers" : "adults with real intellectual curiosity");
  const intro = de
    ? `Du bist ein begeisterter Erklär-Freund für ${audience}. Antworte IMMER auf Deutsch. ${age <= 10 ? "Kindgerecht, aber wie ein gutes Sachbuch." : age <= 16 ? "Lebendig, präzise, nie herablassend." : "Anspruchsvoll, präzise, populärwissenschaftlich."}`
    : `You are an enthusiastic explainer-friend for ${audience}. ALWAYS answer in English. ${age <= 10 ? "Kid-friendly but structured like a great science book." : age <= 16 ? "Vivid, precise, never condescending." : "Substantial, precise, popular-science."}`;

  return `${intro}

${ageSpec(age, lang)}

${de ? LANG_QUALITY_DE + "\n\n" : ""}${IMAGE_RULES}

${INTERACTION_RULES}

Return EXACTLY this JSON (no markdown, nothing else):
{
  "headline": "${de ? "max. 10 Wörter" : "max 10 words"}",
  "image_search_term": "english photo term (3-5 words)",
  "image_search_term_2": "english photo term (different subject, 3-5 words)",
  "youtube_search_terms": ${de ? `["2-3 YouTube-Suchen zum WISSENSCHAFTLICHEN 'WARUM'. NIEMALS 'wie funktioniert', 'Aufbau', 'Schaltung', 'Bauen'. Fokus auf das PHYSIKALISCHE/BIOLOGISCHE Konzept, NIE auf Alltagsobjekte/Technik-Aufbau."]` : `["2-3 YouTube searches for the SCIENTIFIC 'WHY'. NEVER 'how it works', 'circuit', 'wiring', 'build'. Focus on the physics/biology concept, NEVER on everyday-object/tech-assembly drift."]`},
  "analogy": "${de ? "Stell dir vor… 2-3 Sätze" : "Imagine… 2-3 sentences"}",
  "paragraphs": ["…", "…", "…"],
  "key_points": [ { "icon": "emoji", "title": "${de ? "kurz" : "short"}", "text": "${de ? "Fakt" : "fact"}" } ],
  "interaction_type": "collision" | "drag" | "timeline" | "slider" | "tap",
  "interaction_label": "${de ? "kurzer, themenspezifischer Hinweis" : "short topic-specific hint"}",
  "interaction_data": { },
  "fun_fact": "${de ? "ein überraschender Satz mit Zahl" : "surprising fact with a number"}",
  "vocab": [ { "word": "…", "meaning": "…" } ]
}`;
}

export const Route = createFileRoute("/api/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const access = await requireLumiApiAccess(request, { bucket: "ask", limit: 60 });
        if (!access.ok) return access.response;

        let body: { question?: string; lang?: string; age?: number };
        try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
        const question = (body.question ?? "").toString().slice(0, 300).trim();
        if (!question) return new Response("Empty question", { status: 400 });
        const lang = body.lang === "en" ? "en" : "de";
        const ageRaw = Number(body.age);
        const age = Number.isFinite(ageRaw) ? Math.min(99, Math.max(6, Math.round(ageRaw))) : 9;

        const normalized = question
          .toLowerCase()
          .replace(/\s+/g, " ")
          .replace(/[.!?…]+$/u, "")
          .trim();
        const ageBand = age <= 8 ? 8 : age <= 10 ? 10 : age <= 13 ? 13 : age <= 16 ? 16 : 99;

        const encoder = new TextEncoder();
        const hashBuf = await crypto.subtle.digest(
          "SHA-256",
          encoder.encode(`${PROMPT_VERSION}|${lang}|${ageBand}|${normalized}`),
        );
        const cacheKey = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: cached } = await (supabaseAdmin as any)
            .from("lumi_answer_cache")
            .select("response,hits")
            .eq("cache_key", cacheKey)
            .eq("prompt_version", PROMPT_VERSION)
            .gt("expires_at", new Date().toISOString())
            .maybeSingle();
          if (cached?.response) {
            (supabaseAdmin as any)
              .from("lumi_answer_cache")
              .update({ hits: Number(cached.hits ?? 1) + 1, last_used_at: new Date().toISOString() })
              .eq("cache_key", cacheKey)
              .then(() => {}, () => {});
            return Response.json(cached.response, { headers: { "X-Lumi-Cache": "HIT" } });
          }
        } catch (e) {
          console.warn("[ask] cache read failed", e);
        }

        let parsed: any;
        try {
          parsed = await generateStructuredJson({
            system: systemPrompt(age, lang),
            prompt: question,
          });
        } catch (error: any) {
          console.error("[ask] AI provider failed", error);
          return new Response(error?.message ?? "AI error", { status: 502 });
        }
        if (!parsed) return new Response("Parse error", { status: 502 });

        if (!Array.isArray(parsed.paragraphs) && typeof parsed.explanation === "string") {
          parsed.paragraphs = parsed.explanation
            .split(/\n\n+|(?<=[.!?])\s{2,}/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        const AMBIGUOUS: Record<string, string> = {
          lightning: "cloud to ground lightning storm photograph",
          mercury: "planet mercury surface nasa",
          amazon: "amazon rainforest canopy",
          apple: "apple fruit tree orchard",
          jupiter: "planet jupiter nasa photograph",
          mars: "planet mars surface nasa",
          venus: "planet venus surface nasa",
          saturn: "planet saturn rings nasa",
          jaguar: "jaguar animal rainforest",
          tiger: "tiger animal wild",
          jordan: "jordan river landscape",
          galaxy: "spiral galaxy telescope image",
        };
        const fixTerm = (t: unknown): string | undefined => {
          if (typeof t !== "string") return undefined;
          const trimmed = t.trim();
          if (!trimmed) return undefined;
          const k = trimmed.toLowerCase();
          if (AMBIGUOUS[k]) return AMBIGUOUS[k];
          if (!/\s/.test(trimmed)) return `${trimmed} photograph nature`;
          return trimmed;
        };
        parsed.image_search_term = fixTerm(parsed.image_search_term);
        parsed.image_search_term_2 = fixTerm(parsed.image_search_term_2);

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await (supabaseAdmin as any)
            .from("lumi_answer_cache")
            .upsert(
              {
                cache_key: cacheKey,
                prompt_version: PROMPT_VERSION,
                question,
                lang,
                age_band: ageBand,
                response: parsed,
                hits: 1,
                last_used_at: new Date().toISOString(),
                expires_at: expiresAt,
              },
              { onConflict: "cache_key" },
            );
        } catch (e) {
          console.warn("[ask] cache write failed", e);
        }

        return Response.json(parsed, { headers: { "X-Lumi-Cache": "MISS" } });
      },
    },
  },
});
