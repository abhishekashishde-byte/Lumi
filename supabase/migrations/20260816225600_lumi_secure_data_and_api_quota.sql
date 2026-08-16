DROP POLICY IF EXISTS "lumi_users_read_own_data" ON public.lumi_data;
DROP POLICY IF EXISTS "lumi_users_insert_own_data" ON public.lumi_data;
DROP POLICY IF EXISTS "lumi_users_update_own_data" ON public.lumi_data;
DROP POLICY IF EXISTS "lumi_users_delete_own_data" ON public.lumi_data;

CREATE POLICY "lumi_users_read_own_data"
ON public.lumi_data FOR SELECT TO authenticated
USING (auth.uid() = user_id AND record_type <> 'rate_limit');

CREATE POLICY "lumi_users_insert_own_data"
ON public.lumi_data FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND record_type <> 'rate_limit');

CREATE POLICY "lumi_users_update_own_data"
ON public.lumi_data FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND record_type <> 'rate_limit')
WITH CHECK (auth.uid() = user_id AND record_type <> 'rate_limit');

CREATE POLICY "lumi_users_delete_own_data"
ON public.lumi_data FOR DELETE TO authenticated
USING (auth.uid() = user_id AND record_type <> 'rate_limit');

CREATE OR REPLACE FUNCTION public.consume_lumi_quota(
  p_user_id uuid,
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS TABLE(allowed boolean, remaining integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start timestamptz;
  v_record_key text;
  v_count integer;
BEGIN
  IF p_user_id IS NULL OR p_bucket IS NULL OR length(trim(p_bucket)) = 0 THEN
    RAISE EXCEPTION 'invalid quota request';
  END IF;
  IF p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'invalid quota configuration';
  END IF;

  v_window_start := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );
  v_record_key := p_bucket || ':' || extract(epoch FROM v_window_start)::bigint::text;

  INSERT INTO public.lumi_data (user_id, record_type, record_key, data)
  VALUES (
    p_user_id,
    'rate_limit',
    v_record_key,
    jsonb_build_object('count', 1, 'window_start', v_window_start)
  )
  ON CONFLICT (user_id, record_type, record_key)
  DO UPDATE SET
    data = jsonb_set(
      public.lumi_data.data,
      '{count}',
      to_jsonb(COALESCE((public.lumi_data.data->>'count')::integer, 0) + 1),
      true
    ),
    updated_at = now()
  RETURNING COALESCE((public.lumi_data.data->>'count')::integer, 1)
  INTO v_count;

  RETURN QUERY SELECT
    v_count <= p_limit,
    GREATEST(p_limit - v_count, 0),
    v_window_start + make_interval(secs => p_window_seconds);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_lumi_quota(uuid, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_lumi_quota(uuid, text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.consume_lumi_quota(uuid, text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_lumi_quota(uuid, text, integer, integer) TO service_role;
