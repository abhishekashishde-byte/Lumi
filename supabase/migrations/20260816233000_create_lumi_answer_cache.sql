CREATE TABLE IF NOT EXISTS public.lumi_answer_cache (
  cache_key TEXT PRIMARY KEY,
  prompt_version TEXT NOT NULL,
  question TEXT NOT NULL,
  lang TEXT NOT NULL,
  age_band INTEGER NOT NULL,
  response JSONB NOT NULL,
  hits INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS lumi_answer_cache_last_used_idx
  ON public.lumi_answer_cache(last_used_at DESC);
CREATE INDEX IF NOT EXISTS lumi_answer_cache_expires_idx
  ON public.lumi_answer_cache(expires_at);

ALTER TABLE public.lumi_answer_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lumi_answer_cache FROM anon, authenticated;
GRANT ALL ON public.lumi_answer_cache TO service_role;
