// Curiosity Passport store: discoveries per topic, Lumi's Glow Collection (aura + badge).
// Persisted in localStorage; later syncable to Lovable Cloud.
import { useEffect, useSyncExternalStore } from "react";
import { discoveryTopics, findDiscovery, type DiscoveryCard } from "@/content/discoveries";
import { ADORNMENTS, type AdornmentId } from "@/content/adornments";

const KEY = "warum:passport:v2";
const EVENT = "warum:passport";

export type PassportState = {
  discoveries: Record<string, string[]>; // topic -> unlocked ids
  equippedAura: AdornmentId | null;
  equippedBadge: AdornmentId | null;
  unlockedAdornments: AdornmentId[];
};

const empty: PassportState = {
  discoveries: {},
  equippedAura: "warm-gold",
  equippedBadge: null,
  unlockedAdornments: ["warm-gold"],
};

function read(): PassportState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

function write(next: PassportState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

let cached: PassportState | null = null;
function getSnapshot(): PassportState {
  const next = read();
  // Preserve referential equality when unchanged to avoid infinite loops in useSyncExternalStore.
  if (
    cached &&
    JSON.stringify(cached) === JSON.stringify(next)
  ) {
    return cached;
  }
  cached = next;
  return next;
}

function getServerSnapshot(): PassportState {
  return empty;
}

export function usePassport(): PassportState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function totalDiscoveries(state: PassportState): number {
  return Object.values(state.discoveries).reduce((n, arr) => n + arr.length, 0);
}

export function topicProgress(state: PassportState, topicId: string) {
  const t = discoveryTopics.find((x) => x.id === topicId);
  const total = t?.cards.length ?? 0;
  const unlocked = state.discoveries[topicId]?.length ?? 0;
  return { total, unlocked };
}

export function isUnlocked(state: PassportState, topicId: string, cardId: string) {
  return !!state.discoveries[topicId]?.includes(cardId);
}

/**
 * Unlock a discovery. Returns the card if it was newly unlocked (for celebration), else null.
 */
export function unlockDiscovery(topicId: string, cardId: string): DiscoveryCard | null {
  const state = read();
  const existing = state.discoveries[topicId] ?? [];
  if (existing.includes(cardId)) return null;
  const card = findDiscovery(topicId, cardId);
  if (!card) return null;

  const nextState: PassportState = {
    ...state,
    discoveries: { ...state.discoveries, [topicId]: [...existing, cardId] },
  };

  // Auto-unlock adornments (auras + badges) when their threshold is passed.
  const total = totalDiscoveries(nextState);
  const newlyUnlocked = ADORNMENTS.filter(
    (a) => total >= a.atDiscoveries && !nextState.unlockedAdornments.includes(a.id),
  ).map((a) => a.id);
  if (newlyUnlocked.length) {
    nextState.unlockedAdornments = [...nextState.unlockedAdornments, ...newlyUnlocked];
    // Auto-equip the first newly unlocked badge if none is worn yet.
    if (!nextState.equippedBadge) {
      const firstBadge = newlyUnlocked.find(
        (id) => ADORNMENTS.find((a) => a.id === id)?.kind === "badge",
      );
      if (firstBadge) nextState.equippedBadge = firstBadge;
    }
  }

  write(nextState);
  return card;
}

export function setEquippedAura(id: AdornmentId | null) {
  const state = read();
  if (id && !state.unlockedAdornments.includes(id)) return;
  write({ ...state, equippedAura: id });
}

export function setEquippedBadge(id: AdornmentId | null) {
  const state = read();
  if (id && !state.unlockedAdornments.includes(id)) return;
  write({ ...state, equippedBadge: id });
}

/** Try to auto-detect topic + discovery from a free-text question. */
export function detectDiscoveryFromQuestion(question: string): { topicId: string; cardId: string } | null {
  const q = question.toLowerCase();
  let best: { topicId: string; cardId: string; score: number } | null = null;
  for (const topic of discoveryTopics) {
    for (const card of topic.cards) {
      const terms = [
        card.title.de.toLowerCase(),
        card.title.en.toLowerCase(),
        ...(card.keywords ?? []).map((k) => k.toLowerCase()),
      ];
      let score = 0;
      for (const t of terms) {
        if (!t) continue;
        if (q.includes(t)) score += t.length; // longer match wins
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { topicId: topic.id, cardId: card.id, score };
      }
    }
  }
  return best ? { topicId: best.topicId, cardId: best.cardId } : null;
}

/** Event bus for celebration overlay. */
export type CelebrationDetail = { topicId: string; card: DiscoveryCard; leveledUp?: { title: string; emoji: string } };

export function fireCelebration(detail: CelebrationDetail) {
  try {
    window.dispatchEvent(new CustomEvent<CelebrationDetail>("warum:celebrate", { detail }));
  } catch {
    /* ignore */
  }
}

export function useCelebration(handler: (d: CelebrationDetail) => void) {
  useEffect(() => {
    const h = (e: Event) => handler((e as CustomEvent<CelebrationDetail>).detail);
    window.addEventListener("warum:celebrate", h as EventListener);
    return () => window.removeEventListener("warum:celebrate", h as EventListener);
  }, [handler]);
}
