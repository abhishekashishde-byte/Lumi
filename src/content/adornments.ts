// Lumi's Glow Collection — auras and side badges unlocked at discovery milestones.
// No gameplay advantage; purely cosmetic collectibles that fit a lightbulb mascot.
import compassImg from "@/assets/badges/compass.png";
import telescopeImg from "@/assets/badges/telescope.png";
import magnifierImg from "@/assets/badges/magnifier.png";
import rocketImg from "@/assets/badges/rocket.png";
import bookImg from "@/assets/badges/book.png";
import starImg from "@/assets/badges/star.png";

export type AdornmentKind = "aura" | "badge";
export type AdornmentId = string;

export type Adornment = {
  id: AdornmentId;
  kind: AdornmentKind;
  de: string;
  en: string;
  atDiscoveries: number;
  // For auras: two rgba colors used in a radial gradient behind Lumi.
  auraFrom?: string;
  auraTo?: string;
  // For badges: realistic enamel-pin image (PNG with transparent background).
  image?: string;
};

export const ADORNMENTS: Adornment[] = [
  // Auras — the glow around Lumi
  {
    id: "warm-gold",
    kind: "aura",
    de: "Goldener Schein",
    en: "Warm Gold",
    atDiscoveries: 0,
    auraFrom: "rgba(255,200,80,0.55)",
    auraTo: "rgba(255,200,80,0)",
  },
  {
    id: "curious-blue",
    kind: "aura",
    de: "Neugier-Blau",
    en: "Curious Blue",
    atDiscoveries: 3,
    auraFrom: "rgba(96,165,250,0.55)",
    auraTo: "rgba(96,165,250,0)",
  },
  {
    id: "explorer-green",
    kind: "aura",
    de: "Entdecker-Grün",
    en: "Explorer Green",
    atDiscoveries: 8,
    auraFrom: "rgba(52,211,153,0.55)",
    auraTo: "rgba(52,211,153,0)",
  },
  {
    id: "mystic-purple",
    kind: "aura",
    de: "Mystisches Lila",
    en: "Mystic Purple",
    atDiscoveries: 20,
    auraFrom: "rgba(167,139,250,0.6)",
    auraTo: "rgba(167,139,250,0)",
  },
  {
    id: "rainbow-shimmer",
    kind: "aura",
    de: "Regenbogenschimmer",
    en: "Rainbow Shimmer",
    atDiscoveries: 50,
    auraFrom: "rgba(244,114,182,0.55)",
    auraTo: "rgba(129,140,248,0)",
  },

  // Badges — floating pins next to Lumi
  { id: "compass",   kind: "badge", image: compassImg,   de: "Kompass",           en: "Compass",         atDiscoveries: 1  },
  { id: "telescope", kind: "badge", image: telescopeImg, de: "Teleskop",          en: "Telescope",       atDiscoveries: 5  },
  { id: "magnifier", kind: "badge", image: magnifierImg, de: "Lupe",              en: "Magnifier",       atDiscoveries: 10 },
  { id: "rocket",    kind: "badge", image: rocketImg,    de: "Rakete",            en: "Rocket",          atDiscoveries: 25 },
  { id: "book",      kind: "badge", image: bookImg,      de: "Buch der Weisheit", en: "Book of Wisdom",  atDiscoveries: 40 },
  { id: "star",      kind: "badge", image: starImg,      de: "Meisterstern",      en: "Master Star",     atDiscoveries: 75 },
];

export const AURAS = ADORNMENTS.filter((a) => a.kind === "aura");
export const BADGES = ADORNMENTS.filter((a) => a.kind === "badge");

export function findAdornment(id: AdornmentId | null | undefined): Adornment | null {
  if (!id) return null;
  return ADORNMENTS.find((a) => a.id === id) ?? null;
}
