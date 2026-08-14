// Explorer levels — no XP bar, just titles.

export type ExplorerLevel = {
  min: number;
  emoji: string;
  de: string;
  en: string;
};

export const LEVELS: ExplorerLevel[] = [
  { min: 0,   emoji: "🌱", de: "Neugieriger Keimling", en: "Curious Seed" },
  { min: 5,   emoji: "🔦", de: "Erkunder",             en: "Explorer" },
  { min: 15,  emoji: "🔭", de: "Entdecker",            en: "Discoverer" },
  { min: 30,  emoji: "🚀", de: "Abenteurer",           en: "Adventurer" },
  { min: 50,  emoji: "🌎", de: "Weltreisender",        en: "World Traveler" },
  { min: 75,  emoji: "🧠", de: "Wissenschaftler",      en: "Scientist" },
  { min: 100, emoji: "⭐", de: "Meister-Erkunder",     en: "Master Explorer" },
];

export function getLevel(total: number): ExplorerLevel {
  let current = LEVELS[0];
  for (const lvl of LEVELS) if (total >= lvl.min) current = lvl;
  return current;
}

export function getNextLevel(total: number): ExplorerLevel | null {
  for (const lvl of LEVELS) if (lvl.min > total) return lvl;
  return null;
}

export function getLevelIndex(total: number): number {
  return LEVELS.findIndex((l) => l === getLevel(total));
}
