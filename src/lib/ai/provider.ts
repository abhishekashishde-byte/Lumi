export type AiProvider = "gemini" | "openai";

type GenerateJsonInput = {
  system: string;
  prompt: string;
};

function configuredProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  return raw === "openai" ? "openai" : "gemini";
}

function extractOpenAIText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  const parts = Array.isArray(data?.output) ? data.output : [];
  for (const item of parts) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string") return part.text;
    }
  }
  return "";
}

async function generateWithGemini({ system, prompt }: GenerateJsonInput): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");

  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.35,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini error ${response.status}: ${detail || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: any) => part?.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned no text");
  return JSON.parse(text);
}

async function generateWithOpenAI({ system, prompt }: GenerateJsonInput): Promise<unknown> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      instructions: system,
      input: prompt,
      text: { format: { type: "json_object" }, verbosity: "low" },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${detail || response.statusText}`);
  }

  const data = await response.json();
  const text = extractOpenAIText(data).trim();
  if (!text) throw new Error("OpenAI returned no text");
  return JSON.parse(text);
}

export async function generateStructuredJson(input: GenerateJsonInput): Promise<unknown> {
  return configuredProvider() === "openai"
    ? generateWithOpenAI(input)
    : generateWithGemini(input);
}

export function currentAiProvider(): AiProvider {
  return configuredProvider();
}
