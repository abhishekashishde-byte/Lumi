import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "de" | "en";
const KEY = "warum:lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "de", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Lang | null;
      if (stored === "en" || stored === "de") setLangState(stored);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Pick the right string per language. */
export function useT() {
  const { lang } = useLang();
  return <T,>(de: T, en: T): T => (lang === "en" ? en : de);
}

/** Pure helper for non-hook contexts. */
export function tr(lang: Lang, de: string, en: string) {
  return lang === "en" ? en : de;
}

/** Common UI strings used across the app. */
export const UI = {
  nav: { explore: { de: "Erkunden", en: "Explore" }, practice: { de: "Üben", en: "Practice" }, discover: { de: "Entdecken", en: "Discover" } },
  back: { de: "Zurück", en: "Back" },
  signIn: { de: "Anmelden", en: "Sign in" },
  signOut: { de: "Abmelden", en: "Sign out" },
  signInGoogle: { de: "Mit Google anmelden", en: "Sign in with Google" },
  loading: { de: "Lädt…", en: "Loading…" },
  thinking: { de: "Ich denke nach…", en: "Thinking…" },
  comingAnswer: { de: "Gleich gibt's eine Antwort.", en: "An answer is coming." },
  whatToKnow: { de: "Was möchtest du wissen?", en: "What do you want to know?" },
  askPrompt: { de: "Stell jede Warum-Frage. Wir erklären sie dir.", en: "Ask any 'why' question. We'll explain it." },
  tryThese: { de: "Probier mal", en: "Try one" },
  recentlyAsked: { de: "Zuletzt gefragt", en: "Recently asked" },
  newQuestion: { de: "Neue Frage stellen", en: "Ask a new question" },
  imagine: { de: "Stell dir vor", en: "Imagine" },
  howItWorks: { de: "So funktioniert's", en: "How it works" },
  tryIt: { de: "Probier es aus", en: "Try it" },
  wordsYouKnow: { de: "Wörter, die du jetzt kennst", en: "Words you now know" },
  didYouKnow: { de: "Wusstest du?", en: "Did you know?" },
  watchVideo: { de: "Video ansehen", en: "Watch a video" },
  openYouTube: { de: "Auf YouTube öffnen", en: "Open on YouTube" },
  oops: { de: "Ups! Versuch es nochmal.", en: "Oops! Try again." },
  voiceUnsupported: { de: "Spracheingabe geht auf diesem Gerät nicht.", en: "Voice input isn't supported on this device." },
  voiceListening: { de: "Ich höre zu… sprich einfach.", en: "Listening… go ahead." },
  voiceTranscribing: { de: "Ich verstehe deine Frage…", en: "Understanding your question…" },
  voiceStop: { de: "Fertig", en: "Done" },
  voiceMicDenied: { de: "Bitte Mikrofon erlauben, dann klappt's.", en: "Please allow the microphone." },
  voiceTryAgain: { de: "Nichts gehört – versuch es nochmal.", en: "I didn't catch that – try again." },
  level: { de: "Level", en: "Level" },
  locked: { de: "Gesperrt", en: "Locked" },
  quiz: { de: "Quiz", en: "Quiz" },
  startQuiz: { de: "Quiz starten", en: "Start quiz" },
  closeQuiz: { de: "Quiz schließen", en: "Close quiz" },
  next: { de: "Weiter", en: "Next" },
  correct: { de: "Richtig!", en: "Correct!" },
  wrong: { de: "Nicht ganz.", en: "Not quite." },
  perfect: { de: "Perfekt! Neues Level frei!", en: "Perfect! New level unlocked!" },
  needPerfect: { de: "Du brauchst 100 % für das nächste Level.", en: "You need 100% to reach the next level." },
  again: { de: "Nochmal", en: "Try again" },
  score: { de: "Punkte", en: "Score" },
  done: { de: "Fertig", en: "Done" },
  email: { de: "E-Mail", en: "Email" },
  password: { de: "Passwort", en: "Password" },
  createAccount: { de: "Konto erstellen", en: "Create account" },
  haveAccount: { de: "Schon ein Konto? Anmelden", en: "Have an account? Sign in" },
  noAccount: { de: "Noch kein Konto? Registrieren", en: "No account? Sign up" },
  continueAsGuest: { de: "Ohne Anmeldung weiter", en: "Continue without signing in" },
  hello: { de: "Hallo", en: "Hello" },

  // index page
  brand: { de: "Lumi", en: "Lumi" },
  tagline: { de: "Jede Frage öffnet eine neue Welt.", en: "Turning Curiosity into Discovery." },
  tapTopic: { de: "Tippe ein Thema an. Schau, staune, verstehe.", en: "Tap a topic. Look, wonder, understand." },
  ageNote: { de: "Für neugierige Kinder ab 7 Jahren.", en: "For curious children aged 7 and up." },
  chipNatur: { de: "Natur", en: "Nature" },
  chipKi: { de: "KI", en: "AI" },
  chipPlaneten: { de: "Weltall", en: "Space" },
  chipStrom: { de: "Strom", en: "Electricity" },
  chipInternet: { de: "Internet", en: "Internet" },

  // topic-kit chrome
  knowledgeToKeep: { de: "Wissen zum Behalten", en: "Knowledge to keep" },
  researcherLevel: { de: "Forscher-Stufe", en: "Researcher level" },
  maxLevel: { de: "Du bist auf der höchsten Stufe.", en: "You're at the highest level." },
  maxLevelSub: { de: "Du hast alle Geheimnisse entdeckt.", en: "You've uncovered every secret." },
  levelReached: { de: "Stufe", en: "Level" },
  toNextLevel: { de: "Quiz lösen → Stufe", en: "Solve the quiz → Level" },
  startQuizCh: { de: "Quiz starten", en: "Start quiz" },
  close: { de: "Schließen", en: "Close" },
  weiter: { de: "Weiter", en: "Next" },
  perfectShort: { de: "Perfekt! Neue Stufe freigeschaltet.", en: "Perfect! New level unlocked." },
  almost: { de: "Fast – für die nächste Stufe brauchst du 100 %.", en: "Almost — you need 100% for the next level." },
  openLevel: { de: "Stufe öffnen", en: "Open level" },
  stage: { de: "Stufe", en: "Stage" },

  // a11y labels
  backAria: { de: "Zurück", en: "Back" },
  voiceAria: { de: "Spracheingabe starten", en: "Start voice input" },
  sendAria: { de: "Frage senden", en: "Send question" },
  closeAria: { de: "Schließen", en: "Close" },
  exampleQuestionAria: { de: "Beispielfrage verwenden", en: "Use example question" },
  recentQuestionAria: { de: "Letzte Frage erneut stellen", en: "Ask this recent question again" },
  topicCardAria: { de: "Thema öffnen", en: "Open topic" },
} as const;

export type UIKey = keyof typeof UI;

export function useUI() {
  const { lang } = useLang();
  return (k: UIKey) => (UI[k] as Record<Lang, string>)[lang];
}
