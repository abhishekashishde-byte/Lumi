export type AiProvider = "gemini" | "openai";
export type AiMessage = { role: "user" | "assistant"; content: string };

type GenerateJsonInput = {
  system: string;
  prompt: string;
};

type GenerateTextInput = {
  system: string;
  messages: AiMessage[];
};

function configuredProvider(): AiProvider {
  return (process.env.AI_PROVIDER ?? "gemini").toLowerCase() === "openai" ? "openai" : "gemini";
}

function extractOpenAIText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  for (const item of Array.isArray(data?.output) ? data.output : []) {
    for (const part of Array.isArray(item?.content) ? item.content : []) {
      if (typeof part?.text === "string") return part.text;
    }
  }
  return "";
}

async function openAIRequest(body: Record<string, unknown>): Promise<any> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${detail || res.statusText}`);
  }
  return res.json();
}

async function generateJsonWithOpenAI({ system, prompt }: GenerateJsonInput): Promise<unknown> {
  const data = await openAIRequest({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
    instructions: system,
    input: prompt,
    text: { format: { type: "json_object" }, verbosity: "low" },
  });
  const text = extractOpenAIText(data).trim();
  if (!text) throw new Error("OpenAI returned no text");
  return JSON.parse(text);
}

async function generateTextWithOpenAI({ system, messages }: GenerateTextInput): Promise<string> {
  const data = await openAIRequest({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
    instructions: system,
    input: messages.map((m) => ({ role: m.role, content: m.content })),
    text: { verbosity: "low" },
  });
  const text = extractOpenAIText(data).trim();
  if (!text) throw new Error("OpenAI returned no text");
  return text;
}

function geminiKeyAndModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return { key, model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash" };
}

async function geminiRequest(system: string, contents: any[], json = false): Promise<any> {
  const { key, model } = geminiKeyAndModel();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: json ? { responseMimeType: "application/json", temperature: 0.35 } : { temperature: 0.35 },
      }),
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${detail || res.statusText}`);
  }
  return res.json();
}

function extractGeminiText(data: any): string {
  return (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p?.text ?? "").join("").trim();
}

async function generateJsonWithGemini({ system, prompt }: GenerateJsonInput): Promise<unknown> {
  const data = await geminiRequest(system, [{ role: "user", parts: [{ text: prompt }] }], true);
  const text = extractGeminiText(data);
  if (!text) throw new Error("Gemini returned no text");
  return JSON.parse(text);
}

async function generateTextWithGemini({ system, messages }: GenerateTextInput): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const data = await geminiRequest(system, contents, false);
  const text = extractGeminiText(data);
  if (!text) throw new Error("Gemini returned no text");
  return text;
}

export async function generateStructuredJson(input: GenerateJsonInput): Promise<unknown> {
  return configuredProvider() === "openai" ? generateJsonWithOpenAI(input) : generateJsonWithGemini(input);
}

export async function generateText(input: GenerateTextInput): Promise<string> {
  return configuredProvider() === "openai" ? generateTextWithOpenAI(input) : generateTextWithGemini(input);
}

export function currentAiProvider(): AiProvider {
  return configuredProvider();
}
