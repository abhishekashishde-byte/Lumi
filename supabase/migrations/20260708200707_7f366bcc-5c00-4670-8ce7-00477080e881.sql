CREATE TABLE public.ask_cache (
  cache_key TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  lang TEXT NOT NULL,
  age INTEGER NOT NULL,
  response JSONB NOT NULL,
  hits INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ask_cache_last_used_idx ON public.ask_cache (last_used_at DESC);

GRANT ALL ON public.ask_cache TO service_role;

ALTER TABLE public.ask_cache ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: only the service role (server-side) reads/writes this cache.