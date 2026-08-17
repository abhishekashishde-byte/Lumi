const SUPABASE_URL = 'https://xvlflsdanfzytxlwpthr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LO1kiVwvx5PZpgVxRG_s7A_A2Y4hns6';

function ageSpec(age: number, lang: 'de' | 'en') {
  const de = lang === 'de';
  if (age <= 8) return de
    ? `Alter ${age} (sehr jung): SEHR KURZ. 2 Absätze × 1-2 kurze Sätze, max 8 Wörter/Satz. Bilderbuchwörter. KEINE Fachwörter. key_points: GENAU 3. analogy: 1 kurzer Satz. fun_fact: 1 einfacher Satz.`
    : `Age ${age} (very young): VERY SHORT. 2 paragraphs × 1-2 short sentences, max 8 words/sentence. Picture-book words. NO jargon. key_points: EXACTLY 3. analogy: 1 short sentence. fun_fact: 1 simple sentence.`;
  if (age <= 10) return de
    ? `Alter ${age} (Grundschule): KOMPAKT. 2 Absätze × 2 Sätze, ≤12 Wörter. Max 1 Fachwort, im vocab erklärt. key_points: 3.`
    : `Age ${age} (primary school): COMPACT. 2 paragraphs × 2 sentences, ≤12 words. Max 1 specialist word, explained in vocab. key_points: 3.`;
  if (age <= 13) return de
    ? `Alter ${age} (Mittelstufe): KOMPAKT. 2-3 Absätze × 2-3 Sätze, ≤16 Wörter. Bis 2 Fachwörter im vocab. key_points: 4.`
    : `Age ${age} (middle school): COMPACT. 2-3 paragraphs × 2-3 sentences, ≤16 words. Up to 2 specialist words in vocab. key_points: 4.`;
  if (age <= 16) return de
    ? `Alter ${age} (Jugendlich): 3 Absätze × 3-4 Sätze, bis 20 Wörter. Ursache → Mechanismus → Folge. Fachbegriffe im vocab (3-5). key_points: 4-5.`
    : `Age ${age} (teenager): 3 paragraphs × 3-4 sentences, up to 20 words. Cause → mechanism → consequence. Specialist terms in vocab (3-5). key_points: 4-5.`;
  return de
    ? `Alter ${age}+ (Erwachsen): 3-4 Absätze × 3-5 Sätze, populärwissenschaftlich. Mechanismen erklären. vocab 4-6. key_points: 5.`
    : `Age ${age}+ (adult): 3-4 paragraphs × 3-5 sentences, popular-science. Explain mechanisms. vocab 4-6. key_points: 5.`;
}

function systemPrompt(age: number, lang: 'de' | 'en') {
  const de = lang === 'de';
  const intro = de
    ? `Du bist Lumi, ein begeisterter Erklär-Freund. Antworte IMMER auf Deutsch. Lebendig, präzise, altersgerecht, nie herablassend.`
    : `You are Lumi, an enthusiastic explainer-friend. ALWAYS answer in English. Vivid, precise, age-appropriate, never condescending.`;

  return `${intro}\n\n${ageSpec(age, lang)}\n\nReturn EXACTLY this JSON, no markdown:\n{\n  "headline": "short title",\n  "image_search_term": "english photo term 3-5 words",\n  "image_search_term_2": "different english photo term 3-5 words",\n  "youtube_search_terms": ["search 1", "search 2"],\n  "analogy": "short analogy",\n  "paragraphs": ["...", "..."],\n  "key_points": [{"icon":"emoji","title":"short","text":"fact"}],\n  "interaction_type": "collision" | "drag" | "timeline" | "slider" | "tap",\n  "interaction_label": "short hint",\n  "interaction_data": {},\n  "fun_fact": "one surprising fact",\n  "vocab": [{"word":"...","meaning":"..."}]\n}`;
}

async function verifySupabaseUser(token: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

async function callGemini(question: string, age: number, lang: 'de' | 'en') {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Missing GEMINI_API_KEY');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt(age, lang) }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.35 },
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Gemini error ${response.status}: ${detail || response.statusText}`);
  }
  const data = await response.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? []).map((part: any) => part?.text ?? '').join('').trim();
  if (!text) throw new Error('Gemini returned no text');
  return JSON.parse(text);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const user = await verifySupabaseUser(token).catch(() => null);
  if (!user?.id) return res.status(401).json({ error: 'Invalid or expired session' });

  const question = String(req.body?.question || '').trim().slice(0, 300);
  if (!question) return res.status(400).json({ error: 'Empty question' });
  const lang: 'de' | 'en' = req.body?.lang === 'en' ? 'en' : 'de';
  const ageRaw = Number(req.body?.age);
  const age = Number.isFinite(ageRaw) ? Math.min(99, Math.max(6, Math.round(ageRaw))) : 9;

  try {
    const answer = await callGemini(question, age, lang);
    return res.status(200).json(answer);
  } catch (error: any) {
    console.error('[api/ask native] failed', error);
    return res.status(502).json({ error: error?.message || 'AI error' });
  }
}
