import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SOUND_KEY = "warum:sound";
const HAPTIC_KEY = "warum:haptic";
const READ_ALOUD_KEY = "warum:readAloud";

type Ctx = {
  sound: boolean;
  haptic: boolean;
  readAloud: boolean;
  setSound: (v: boolean) => void;
  setHaptic: (v: boolean) => void;
  setReadAloud: (v: boolean) => void;
};
const SettingsContext = createContext<Ctx>({
  sound: true,
  haptic: true,
  readAloud: false,
  setSound: () => {},
  setHaptic: () => {},
  setReadAloud: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [sound, setSoundState] = useState(true);
  const [haptic, setHapticState] = useState(true);
  const [readAloud, setReadAloudState] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SOUND_KEY);
      const h = localStorage.getItem(HAPTIC_KEY);
      const r = localStorage.getItem(READ_ALOUD_KEY);
      if (s !== null) setSoundState(s === "1");
      if (h !== null) setHapticState(h === "1");
      if (r !== null) setReadAloudState(r === "1");
    } catch {}
  }, []);

  const setSound = (v: boolean) => {
    setSoundState(v);
    try { localStorage.setItem(SOUND_KEY, v ? "1" : "0"); } catch {}
  };
  const setHaptic = (v: boolean) => {
    setHapticState(v);
    try { localStorage.setItem(HAPTIC_KEY, v ? "1" : "0"); } catch {}
  };
  const setReadAloud = (v: boolean) => {
    setReadAloudState(v);
    try { localStorage.setItem(READ_ALOUD_KEY, v ? "1" : "0"); } catch {}
  };

  return (
    <SettingsContext.Provider value={{ sound, haptic, readAloud, setSound, setHaptic, setReadAloud }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function isSoundOn() {
  if (typeof window === "undefined") return true;
  try { return localStorage.getItem(SOUND_KEY) !== "0"; } catch { return true; }
}
export function isHapticOn() {
  if (typeof window === "undefined") return true;
  try { return localStorage.getItem(HAPTIC_KEY) !== "0"; } catch { return true; }
}
export function isReadAloudOn() {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(READ_ALOUD_KEY) === "1"; } catch { return false; }
}
