# Lumi

Lumi is a curiosity-driven, visual learning companion. It turns a learner's "why?" questions into age-adapted explanations, interactive experiences, real imagery, follow-up conversation, read-aloud audio, and a Curiosity Passport.

## Architecture

- **Frontend / full stack:** React 19 + TanStack Start + Vite + Nitro
- **Hosting target:** Vercel
- **Data and authentication:** Supabase
- **Text AI:** provider-independent (`AI_PROVIDER=gemini` or `AI_PROVIDER=openai`)
- **Voice:** direct OpenAI transcription and text-to-speech endpoints
- **Learning state:** current Curiosity Passport implementation plus Supabase-backed profile/cache

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in Supabase credentials and at least one text AI provider key.
3. Add `OPENAI_API_KEY` to enable microphone transcription and read-aloud voice.
4. Install dependencies with `npm install` or `bun install`.
5. Run `npm run dev`.

## AI provider switching

For Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

For OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
```

The UI and `/api/ask` route do not need to change when switching providers.

## Deployment

The repository is configured for TanStack Start + Nitro on Vercel. Add the variables from `.env.example` to the Vercel project environment before deploying.

Never commit real `.env` files or secret/service-role keys.
