import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { installAuthenticatedApiFetch } from "@/lib/api/client";

// Install the protected-API fetch wrapper as soon as the browser module loads.
// This must happen before child useEffects run, because /entdecken can auto-submit
// a pending question immediately after mount. Relying only on LumiRuntime's effect
// created a race where /api/ask could be sent without the Authorization header.
if (typeof window !== "undefined") {
  installAuthenticatedApiFetch();
}

const PASSPORT_KEY = "warum:passport:v2";
const RECENT_KEY = "warum_entdecken_recent_v2";
const RECENT_META_KEY = "warum_entdecken_recent_meta_v1";
const PASSPORT_EVENT = "warum:passport";
const RECENT_EVENT = "warum:recent";

type JsonRecord = Record<string, any>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private/restricted browser modes.
  }
}

function mergePassport(local: JsonRecord, remote: JsonRecord, hadLocal: boolean) {
  const discoveries: Record<string, string[]> = {};
  const topicIds = new Set([
    ...Object.keys(remote?.discoveries ?? {}),
    ...Object.keys(local?.discoveries ?? {}),
  ]);
  for (const topicId of topicIds) {
    discoveries[topicId] = Array.from(new Set([
      ...((remote?.discoveries?.[topicId] ?? []) as string[]),
      ...((local?.discoveries?.[topicId] ?? []) as string[]),
    ]));
  }

  const unlockedAdornments = Array.from(new Set([
    ...((remote?.unlockedAdornments ?? []) as string[]),
    ...((local?.unlockedAdornments ?? []) as string[]),
    "warm-gold",
  ]));

  return {
    discoveries,
    equippedAura: hadLocal ? (local?.equippedAura ?? remote?.equippedAura ?? "warm-gold") : (remote?.equippedAura ?? "warm-gold"),
    equippedBadge: hadLocal ? (local?.equippedBadge ?? remote?.equippedBadge ?? null) : (remote?.equippedBadge ?? null),
    unlockedAdornments,
  };
}

function mergeHistory(localRecent: string[], localMeta: JsonRecord, remote: JsonRecord) {
  const remoteRecent = Array.isArray(remote?.recent) ? remote.recent.filter((x: unknown) => typeof x === "string") : [];
  const recent = Array.from(new Set([...localRecent, ...remoteRecent])).slice(0, 20);
  return {
    recent,
    meta: { ...(remote?.meta ?? {}), ...localMeta },
  };
}

async function getCloudRecord(userId: string, recordType: string, recordKey: string) {
  const { data, error } = await (supabase as any)
    .from("lumi_data")
    .select("data")
    .eq("user_id", userId)
    .eq("record_type", recordType)
    .eq("record_key", recordKey)
    .maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

async function putCloudRecord(userId: string, recordType: string, recordKey: string, data: unknown) {
  const { error } = await (supabase as any)
    .from("lumi_data")
    .upsert(
      {
        user_id: userId,
        record_type: recordType,
        record_key: recordKey,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,record_type,record_key" },
    );
  if (error) throw error;
}

/**
 * Global Lumi runtime:
 * - adds the logged-in access token to expensive API calls
 * - syncs Passport + recent-question history through lumi_data
 * - keeps localStorage as an offline/instant cache
 */
export function LumiRuntime() {
  const userIdRef = useRef<string | null>(null);
  const passportTimer = useRef<number | null>(null);
  const historyTimer = useRef<number | null>(null);
  const hydratingRef = useRef(false);

  useEffect(() => {
    // The wrapper is already installed at module load. Calling again is intentionally
    // idempotent and gives us the restore callback for unmount cleanup.
    const restoreFetch = installAuthenticatedApiFetch();

    const hydrate = async (userId: string) => {
      hydratingRef.current = true;
      try {
        const hadLocalPassport = localStorage.getItem(PASSPORT_KEY) !== null;
        const localPassport = readJson<JsonRecord>(PASSPORT_KEY, {});
        const localRecent = readJson<string[]>(RECENT_KEY, []);
        const localMeta = readJson<JsonRecord>(RECENT_META_KEY, {});

        const [remotePassport, remoteHistory] = await Promise.all([
          getCloudRecord(userId, "passport", "main").catch(() => null),
          getCloudRecord(userId, "history", "recent").catch(() => null),
        ]);

        const mergedPassport = mergePassport(localPassport, remotePassport ?? {}, hadLocalPassport);
        const mergedHistory = mergeHistory(localRecent, localMeta, remoteHistory ?? {});

        writeJson(PASSPORT_KEY, mergedPassport);
        writeJson(RECENT_KEY, mergedHistory.recent);
        writeJson(RECENT_META_KEY, mergedHistory.meta);

        window.dispatchEvent(new Event(PASSPORT_EVENT));
        window.dispatchEvent(new Event(RECENT_EVENT));

        await Promise.all([
          putCloudRecord(userId, "passport", "main", mergedPassport),
          putCloudRecord(userId, "history", "recent", mergedHistory),
        ]);
      } catch (error) {
        console.warn("[Lumi cloud sync] hydrate failed", error);
      } finally {
        hydratingRef.current = false;
      }
    };

    const schedulePassportSave = () => {
      const userId = userIdRef.current;
      if (!userId || hydratingRef.current) return;
      if (passportTimer.current) window.clearTimeout(passportTimer.current);
      passportTimer.current = window.setTimeout(() => {
        const state = readJson<JsonRecord>(PASSPORT_KEY, {});
        putCloudRecord(userId, "passport", "main", state).catch((error) =>
          console.warn("[Lumi cloud sync] passport save failed", error),
        );
      }, 450);
    };

    const scheduleHistorySave = () => {
      const userId = userIdRef.current;
      if (!userId || hydratingRef.current) return;
      if (historyTimer.current) window.clearTimeout(historyTimer.current);
      historyTimer.current = window.setTimeout(() => {
        const history = {
          recent: readJson<string[]>(RECENT_KEY, []),
          meta: readJson<JsonRecord>(RECENT_META_KEY, {}),
        };
        putCloudRecord(userId, "history", "recent", history).catch((error) =>
          console.warn("[Lumi cloud sync] history save failed", error),
        );
      }, 450);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === PASSPORT_KEY) schedulePassportSave();
      if (event.key === RECENT_KEY || event.key === RECENT_META_KEY) scheduleHistorySave();
    };

    window.addEventListener(PASSPORT_EVENT, schedulePassportSave);
    window.addEventListener(RECENT_EVENT, scheduleHistorySave);
    window.addEventListener("storage", onStorage);

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const uid = data.session?.user.id ?? null;
      userIdRef.current = uid;
      if (uid) hydrate(uid);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      const changed = uid !== userIdRef.current;
      userIdRef.current = uid;
      if (uid && changed) hydrate(uid);
    });

    return () => {
      active = false;
      restoreFetch();
      subscription.subscription.unsubscribe();
      window.removeEventListener(PASSPORT_EVENT, schedulePassportSave);
      window.removeEventListener(RECENT_EVENT, scheduleHistorySave);
      window.removeEventListener("storage", onStorage);
      if (passportTimer.current) window.clearTimeout(passportTimer.current);
      if (historyTimer.current) window.clearTimeout(historyTimer.current);
    };
  }, []);

  return null;
}
