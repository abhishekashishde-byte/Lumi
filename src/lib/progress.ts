// Tracks which topics have been explored (unlocks games).
const KEY = "warum:explored";

export function markExplored(id: string) {
  if (typeof window === "undefined") return;
  try {
    const cur = new Set<string>(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    cur.add(id);
    localStorage.setItem(KEY, JSON.stringify([...cur]));
    window.dispatchEvent(new Event("warum:progress"));
  } catch {}
}

export function getExplored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

import { useEffect, useState } from "react";
export function useExplored() {
  const [set, setSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    setSet(getExplored());
    const h = () => setSet(getExplored());
    window.addEventListener("warum:progress", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("warum:progress", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return set;
}
