import { useState } from "react";
import {
  AtlasNotes,
  BigStat,
  Chapter,
  ImageCard,
  LockedGate,
  MiniFactTable,
  QuizLauncher,
  TapCardGrid,
  TopicShell,
  useTopicLevel,
  type QuizLevel,
} from "@/components/topic-kit";
import neuralImg from "@/assets/topic-neural.jpg";
import { useT } from "@/lib/i18n";

const TOPIC = "ki";

const ROBOT =
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80";
const CAT =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80";
const DOG =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80";
const DATA =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
const ART =
  "https://images.unsplash.com/photo-1547954575-855750c57bd3?auto=format&fit=crop&w=1200&q=80";

/* ---------- Ch 2: Train classifier ---------- */

type Item = { id: number; emoji: string; label: "katze" | "hund"; sorted: boolean };

function CatDogTrainer() {
  const t = useT();
  const [items, setItems] = useState<Item[]>(() => {
    const base: Array<{ emoji: string; label: "katze" | "hund" }> = [
      { emoji: "🐱", label: "katze" },
      { emoji: "🐶", label: "hund" },
      { emoji: "😺", label: "katze" },
      { emoji: "🐕", label: "hund" },
      { emoji: "🐈", label: "katze" },
      { emoji: "🦮", label: "hund" },
    ];
    return base.map((b, i) => ({ ...b, id: i, sorted: false }));
  });
  const [picked, setPicked] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [wrongs, setWrongs] = useState(0);

  const place = (target: "katze" | "hund") => {
    if (!picked) return;
    if (picked.label === target) {
      setItems((arr) => arr.map((i) => (i.id === picked.id ? { ...i, sorted: true } : i)));
      setScore((s) => s + 1);
    } else {
      setWrongs((w) => w + 1);
    }
    setPicked(null);
  };
  const remaining = items.filter((i) => !i.sorted);
  const accuracy = score + wrongs > 0 ? Math.round((score / (score + wrongs)) * 100) : 0;

  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Trainiere die KI", "Train the AI")}
      </p>
      <p className="mt-1 font-display text-base font-black text-white">
        {t(
          "Sortiere die Tiere. Genau das macht ein Mensch, der eine KI trainiert.",
          "Sort the animals. That's exactly what a person does when training an AI."
        )}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => place("katze")}
          className="rounded-2xl border-2 border-dashed border-amber-300/40 bg-amber-500/5 p-4 transition-all active:scale-95"
        >
          <p className="text-3xl">🐱</p>
          <p className="mt-2 font-display text-sm font-black text-amber-300">{t("Katze", "Cat")}</p>
        </button>
        <button
          onClick={() => place("hund")}
          className="rounded-2xl border-2 border-dashed border-purple-300/40 bg-purple-500/5 p-4 transition-all active:scale-95"
        >
          <p className="text-3xl">🐶</p>
          <p className="mt-2 font-display text-sm font-black text-purple-300">{t("Hund", "Dog")}</p>
        </button>
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {t("Tippe ein Tier, dann den Eimer", "Tap an animal, then a bucket")}
      </p>
      <div className="mt-2 flex min-h-[60px] flex-wrap gap-2">
        {remaining.map((it) => (
          <button
            key={it.id}
            onClick={() => setPicked(it)}
            className={`text-3xl transition-all ${picked?.id === it.id ? "scale-125 drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" : ""}`}
          >
            {it.emoji}
          </button>
        ))}
        {remaining.length === 0 && (
          <p className="text-sm text-emerald-300">✓ {t("Fertig trainiert!", "Training complete!")}</p>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-black/30 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("Genauigkeit der KI", "AI Accuracy")}
        </p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-400 transition-all duration-500"
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-white tabular-nums">
          {accuracy}% &middot; {score} {t("richtig", "correct")} / {wrongs} {t("falsch", "wrong")}
        </p>
      </div>
    </div>
  );
}

export function KiExperience() {
  const t = useT();
  const level = useTopicLevel(TOPIC);

  const KI_USES = [
    { emoji: "🗣️", title: t("Sprache verstehen", "Understanding Language"), body: t("Siri und Alexa hören dir zu und antworten.", "Siri and Alexa listen to you and answer back.") },
    { emoji: "📸", title: t("Bilder erkennen", "Recognising Pictures"), body: t("Dein Handy weiß, welche Fotos Katzen zeigen.", "Your phone knows which photos have cats in them.") },
    { emoji: "🌐", title: t("Übersetzen", "Translating"), body: t("In Sekunden vom Deutschen ins Japanische.", "From German to Japanese in seconds.") },
    { emoji: "🎨", title: t("Bilder malen", "Painting Pictures"), body: t('Schreibe „Drache im Weltraum" – die KI malt es.', 'Type "Dragon in space" – the AI paints it.') },
    { emoji: "🚗", title: t("Autos lenken", "Steering Cars"), body: t("Selbstfahrende Autos sehen Straße, Schilder, Fußgänger.", "Self-driving cars see the road, signs, and people.") },
    { emoji: "🩺", title: t("Ärzten helfen", "Helping Doctors"), body: t("KI findet auf Röntgenbildern Dinge, die Menschen übersehen.", "AI spots things on X-rays that humans might miss.") },
    { emoji: "♟️", title: t("Spiele gewinnen", "Winning Games"), body: t("Eine KI schlägt heute jeden Schach- und Go-Weltmeister.", "An AI can beat every chess and Go world champion today.") },
    { emoji: "✉️", title: t("Spam filtern", "Filtering Spam"), body: t("99 % aller Werbe-Mails siehst du nie – die KI fängt sie.", "99% of junk mail never reaches you – the AI catches it.") },
  ];

  const FAMOUS_AI = [
    { emoji: "💬", title: "ChatGPT", body: t("Schreibt Antworten, Gedichte, Code – wie ein superschneller Schüler.", "Writes answers, poems, and code – like a super-fast student.") },
    { emoji: "🖼️", title: "DALL·E / Midjourney", body: t('Malen aus Worten. Aus „Roboter im Regen" wird ein Bild.', 'Painting from words. "Robot in the rain" becomes a real picture.') },
    { emoji: "🎵", title: "Suno / Udio", body: t("Komponieren ganze Lieder aus einer Idee.", "Composes whole songs from just one idea.") },
    { emoji: "🚙", title: "Tesla Autopilot", body: t("Fährt teilweise allein – sieht 360° um das Auto.", "Drives partly on its own – sees 360° around the car.") },
  ];

  const AI_RISKS = [
    { emoji: "🤥", title: t("Sie lügt manchmal", "It sometimes makes things up"), body: t("Wenn die KI etwas nicht weiß, erfindet sie es – sicher klingend. Immer prüfen.", "When the AI doesn't know something, it invents it – and sounds confident. Always check!") },
    { emoji: "⚖️", title: t("Sie ist nicht fair", "It isn't always fair"), body: t("Lernt aus alten Daten – mit alten Vorurteilen.", "It learns from old data – including old unfair ideas.") },
    { emoji: "🔒", title: t("Sie sammelt viel", "It collects a lot"), body: t("Was du tippst, könnte zum Training gehören.", "What you type might be used for training.") },
    { emoji: "🧑‍⚖️", title: t("Menschen entscheiden", "People decide"), body: t("Bei wichtigen Sachen prüft immer ein Mensch nach.", "For important things, a person always checks the result.") },
  ];

  const QUIZ: QuizLevel[] = [
    {
      title: t("Level 1 · Was KI tut", "Level 1 · What AI Does"),
      reward: t("Schaltet frei: Wie KI aus Beispielen lernt.", "Unlocks: How AI learns from examples."),
      questions: [
        {
          q: t("Was bedeutet KI?", "What does AI stand for?"),
          options: [t("Kette und Inhalt", "Chain and Content"), t("Künstliche Intelligenz", "Artificial Intelligence"), t("Kalter Internet-Server", "Cold Internet Server")],
          answer: 1,
          explain: t("Computer, die clever wirken.", "Computers that seem clever."),
        },
        {
          q: t("Welches Gerät ist heute meist eine KI?", "Which device is usually an AI today?"),
          options: [t("Taschenrechner", "Calculator"), t("Sprachassistent (Alexa, Siri)", "Voice assistant (Alexa, Siri)"), t("Tafel", "Blackboard")],
          answer: 1,
          explain: t("Sie versteht gesprochene Sprache.", "It understands spoken language."),
        },
        {
          q: t("Kann KI ohne Daten lernen?", "Can AI learn without data?"),
          options: [t("Ja", "Yes"), t("Nein", "No"), t("Manchmal", "Sometimes")],
          answer: 1,
          explain: t("Daten sind das Futter jeder KI.", "Data is the food every AI needs."),
        },
        {
          q: t("Ist KI dasselbe wie ein Roboter?", "Is AI the same as a robot?"),
          options: [t("Ja", "Yes"), t("Nein", "No"), t("Immer", "Always")],
          answer: 1,
          explain: t("Roboter haben Körper – KI ist nur Software.", "Robots have bodies – AI is just software."),
        },
      ],
    },
    {
      title: t("Level 2 · Daten", "Level 2 · Data"),
      reward: t("Schaltet frei: Maschinelles Lernen.", "Unlocks: Machine Learning."),
      questions: [
        {
          q: t("Wie viele Bilder braucht eine KI, um Katzen zu erkennen?", "How many pictures does an AI need to recognise cats?"),
          options: ["10", "100", t("Millionen", "Millions")],
          answer: 2,
          explain: t("Je mehr Beispiele, desto besser.", "The more examples, the better."),
        },
        {
          q: t("Was tut ein Mensch beim Trainieren?", "What does a person do when training an AI?"),
          options: [t("Er sortiert Daten und sagt: das ist Katze, das ist Hund", "They sort data and say: this is a cat, this is a dog"), t("Er repariert den Computer", "They repair the computer"), t("Er schreibt Code", "They write code")],
          answer: 0,
          explain: t('„Labeln" heißt das.', 'That\'s called "labelling".'),
        },
        {
          q: t("Was passiert, wenn die Daten falsch sind?", "What happens if the data is wrong?"),
          options: [t("Die KI wird besser", "The AI gets better"), t("Die KI lernt falsche Dinge", "The AI learns wrong things"), t("Nichts", "Nothing")],
          answer: 1,
          explain: t("Müll rein = Müll raus.", "Garbage in = garbage out."),
        },
        {
          q: t('Was sind „Big Data"?', 'What is "Big Data"?'),
          options: [t("Große Buchstaben", "Big letters"), t("Sehr viele Daten", "A huge amount of data"), t("Schwere Festplatten", "Heavy hard drives")],
          answer: 1,
          explain: t("Daten in riesigen Mengen.", "Data in enormous amounts."),
        },
      ],
    },
    {
      title: t("Level 3 · Maschinelles Lernen", "Level 3 · Machine Learning"),
      reward: t("Schaltet frei: Wie eine KI Bilder selbst malt.", "Unlocks: How an AI paints pictures by itself."),
      questions: [
        {
          q: t("Was ist ein neuronales Netz?", "What is a neural network?"),
          options: [t("Ein Fischernetz", "A fishing net"), t("Knoten, die Daten weiterreichen", "Nodes that pass data along"), t("Ein Spinnennetz", "A spider's web")],
          answer: 1,
          explain: t("Inspiration kam vom Gehirn.", "The idea came from the brain."),
        },
        {
          q: t("Wie viele Schichten hat ein typisches Netz?", "How many layers does a typical network have?"),
          options: ["1", t("Mehrere", "Several"), t("Keine", "None")],
          answer: 1,
          explain: t("Eingabe → versteckte Schichten → Ausgabe.", "Input → hidden layers → output."),
        },
        {
          q: t("Was passiert bei Fehlern?", "What happens when there are mistakes?"),
          options: [t("Die KI lernt aus dem Fehler", "The AI learns from the mistake"), t("Sie schaltet sich aus", "It switches itself off"), t("Nichts", "Nothing")],
          answer: 0,
          explain: t("Sie justiert ihre Verbindungen.", "It adjusts its connections."),
        },
        {
          q: t("Wie heißt das auf Englisch?", "What is it called in English?"),
          options: ["Hard Learning", "Machine Learning", "Animal Learning"],
          answer: 1,
          explain: t("ML – Maschinelles Lernen.", "ML – Machine Learning."),
        },
      ],
    },
    {
      title: t("Level 4 · Generative KI", "Level 4 · Generative AI"),
      reward: t("Alles freigeschaltet.", "Everything unlocked."),
      questions: [
        {
          q: t("Was tut ChatGPT?", "What does ChatGPT do?"),
          options: [t("Brot backen", "Bake bread"), t("Text schreiben", "Write text"), t("Lampen reparieren", "Fix lamps")],
          answer: 1,
          explain: t("Es schreibt Antworten basierend auf Mustern.", "It writes answers based on patterns."),
        },
        {
          q: t("Wie macht eine KI Bilder?", "How does an AI make pictures?"),
          options: [t("Sie zeichnet mit Stift", "It draws with a pencil"), t("Sie würfelt Pixel und korrigiert sich", "It guesses pixels and corrects itself"), t("Sie kopiert aus dem Internet", "It copies from the internet")],
          answer: 1,
          explain: t("Schritt für Schritt vom Rauschen zum Bild.", "Step by step from noise to picture."),
        },
        {
          q: t("Kann KI Musik komponieren?", "Can AI compose music?"),
          options: [t("Nein", "No"), t("Ja", "Yes"), t("Nur Klavier", "Only piano")],
          answer: 1,
          explain: t("Mit den gleichen Methoden wie Text und Bild.", "Using the same methods as text and pictures."),
        },
        {
          q: t("Was sollte KI NICHT entscheiden?", "What should AI NOT decide?"),
          options: [t("Wichtige Dinge ohne Menschen", "Important things without people"), t("Mein Lieblingseis", "My favourite ice cream"), t("Welches Lied du hörst", "Which song you listen to")],
          answer: 0,
          explain: t("Wichtige Sachen brauchen Menschen-Augen.", "Important things need human eyes."),
        },
      ],
    },
  ];

  return (
    <TopicShell eyebrow={t("Künstliche Intelligenz", "Artificial Intelligence")} title={t("Wie lernt ein Computer?", "How Does a Computer Learn?")}>
      <Chapter
        num={1}
        title={t("Was tut eine KI eigentlich?", "What Does an AI Actually Do?")}
        intro={t(
          "Eine KI ist kein Roboter mit Augen. Es ist Code, der Muster erkennt. Mehr nicht. Und trotzdem kann sie unglaubliche Dinge.",
          "An AI isn't a robot with eyes. It's code that spots patterns. That's it. And yet it can do amazing things."
        )}
      >
        <ImageCard src={ROBOT} alt={t("Roboter", "Robot")} caption={t("Die meiste KI hat keinen Körper. Sie wohnt in Computern.", "Most AI has no body. It lives inside computers.")} />
        <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("KI im Alltag", "AI in Everyday Life")}</p>
        <TapCardGrid cards={KI_USES.slice(0, 4)} />
        <TapCardGrid cards={KI_USES.slice(4)} />
        <AtlasNotes
          title={t("KI ist Muster-Erkennen, nicht Zauberei", "AI is Pattern Spotting, Not Magic")}
          intro={t(
            "Eine KI wirkt manchmal schlau. Aber sie hat kein Bauchgefühl, keine Augen wie ein Mensch und keine eigene Wahrheit. Sie rechnet mit Mustern aus Daten.",
            "An AI can seem clever sometimes. But it has no gut feeling, no human eyes, and no truth of its own. It calculates with patterns from data."
          )}
          points={[
            { label: t("Algorithmus", "Algorithm"), text: t("Ein Algorithmus ist eine genaue Schritt-für-Schritt-Regel. Zum Beispiel: Sortiere zuerst nach Farbe, dann nach Größe.", "An algorithm is a precise step-by-step rule. For example: sort by colour first, then by size.") },
            { label: t("Modell", "Model"), text: t("Das Modell ist das gelernte Ergebnis. Nach dem Training kann es neue Beispiele einschätzen, etwa: Katze oder Hund?", "The model is the learned result. After training it can judge new examples, like: cat or dog?") },
            { label: t("Daten", "Data"), text: t("Daten sind Beispiele: Bilder, Texte, Geräusche, Messwerte. Ohne gute Daten kann eine KI nichts Sinnvolles lernen.", "Data is examples: pictures, texts, sounds, measurements. Without good data an AI can't learn anything useful.") },
            { label: t("Muster", "Patterns"), text: t("KI sucht Dinge, die oft zusammen vorkommen: spitze Ohren + Schnurrhaare + Fell = wahrscheinlich Katze.", "AI looks for things that often appear together: pointy ears + whiskers + fur = probably a cat.") },
            { label: t("Grenze", "Limits"), text: t("KI versteht die Welt nicht wie ein Kind. Sie kann richtig klingen und trotzdem falsch liegen.", "AI doesn't understand the world like a child does. It can sound right and still be wrong.") },
          ]}
        />
        <MiniFactTable
          rows={[
            { term: "KI", value: t("Software", "Software"), note: t("Meist kein Roboterkörper, sondern ein Programm auf Computern.", "Usually no robot body – just a programme on computers.") },
            { term: t("Daten", "Data"), value: t("Futter", "Food"), note: t("Je besser die Beispiele, desto besser kann das Modell lernen.", "The better the examples, the better the model can learn.") },
            { term: "Prompt", value: t("Auftrag", "Task"), note: t("Das ist die Frage oder Anweisung, die du der KI gibst.", "That's the question or instruction you give the AI.") },
            { term: t("Fehler", "Mistakes"), value: t("prüfen", "check"), note: t("KI-Antworten müssen bei wichtigen Dingen kontrolliert werden.", "AI answers must be checked for anything important.") },
          ]}
        />
        <BigStat value={t("über 100x", "over 100x")} caption={t("So oft am Tag triffst du KI, ohne es zu merken – Karten, Suche, Spam-Filter, Foto-Sortierung.", "That's how many times a day you use AI without noticing – maps, search, spam filters, photo sorting.")} />
      </Chapter>

      {level >= 1 ? (
        <Chapter
          num={2}
          title={t("KI lernt aus Beispielen", "AI Learns from Examples")}
          intro={t(
            'Niemand programmiert „so sieht eine Katze aus". Stattdessen zeigt man der KI 1 Million Katzen. Irgendwann erkennt sie das Muster selbst.',
            'Nobody programmes "this is what a cat looks like". Instead you show the AI 1 million cats. Eventually it spots the pattern itself.'
          )}
        >
          <div className="grid grid-cols-2 gap-3">
            <ImageCard src={CAT} alt={t("Katze", "Cat")} caption={t("Katze", "Cat")} aspect="aspect-square" />
            <ImageCard src={DOG} alt={t("Hund", "Dog")} caption={t("Hund", "Dog")} aspect="aspect-square" />
          </div>
          <CatDogTrainer />
          <div className="rounded-3xl bg-[#10101e] p-5">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Die 3 Lern-Arten", "The 3 Ways of Learning")}</p>
            <ol className="mt-3 space-y-3 text-sm text-slate-300">
              <li><strong className="text-white">{t("1. Mit Lehrer:", "1. With a teacher:")}</strong> {t('Mensch sagt „Katze" oder „Hund". KI lernt aus den Antworten.', 'A person says "cat" or "dog". The AI learns from the answers.')}</li>
              <li><strong className="text-white">{t("2. Ohne Lehrer:", "2. Without a teacher:")}</strong> {t("KI bekommt viele Bilder und sortiert sie selbst in Gruppen.", "The AI gets lots of pictures and sorts them into groups by itself.")}</li>
              <li><strong className="text-white">{t("3. Durch Belohnung:", "3. By rewards:")}</strong> {t("Wie Hundetraining – richtig = Punkt, falsch = nichts. So lernt KI Spiele.", "Like dog training – correct = point, wrong = nothing. That's how AI learns games.")}</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">1 Mio +</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Beispiele für eine gute Bild-KI.", "Examples for a good image AI.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">{t("Wochen", "Weeks")}</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("trainiert ein großes Modell, Tag und Nacht.", "a big model trains, day and night.")}</p>
            </div>
          </div>
          <AtlasNotes
            title={t("Training: So wird aus Beispielen Können", "Training: How Examples Become Skills")}
            intro={t(
              "Beim Lernen wird die KI nicht angeschrien oder gelobt wie ein Mensch. Sie bekommt Zahlen, macht Vorhersagen und verbessert winzige Stellschrauben.",
              "When learning, the AI isn't shouted at or praised like a person. It gets numbers, makes predictions, and tweaks tiny dials."
            )}
            points={[
              { label: "Label", text: t("Ein Label ist ein Namensschild: Dieses Foto zeigt eine Katze. Dieses Foto zeigt einen Hund. Solche Schilder helfen beim Lernen.", "A label is a name tag: this photo shows a cat. This photo shows a dog. These tags help with learning.") },
              { label: t("Vorhersage", "Prediction"), text: t("Die KI schaut ein Bild an und sagt vielleicht: 62 % Katze, 38 % Hund. Am Anfang liegt sie oft falsch.", "The AI looks at a picture and might say: 62% cat, 38% dog. At the start it's often wrong.") },
              { label: t("Fehler messen", "Measuring mistakes"), text: t("Der Computer vergleicht Antwort und echtes Label. Je größer der Unterschied, desto größer der Fehler.", "The computer compares the answer and the real label. The bigger the difference, the bigger the mistake.") },
              { label: t("Gewichte ändern", "Changing weights"), text: t("Im Modell stecken Millionen oder Milliarden Zahlen. Nach jedem Fehler werden sie ein kleines bisschen verändert.", "The model contains millions or billions of numbers. After each mistake they are changed a tiny bit.") },
              { label: t("Testdaten", "Test data"), text: t("Nach dem Training bekommt die KI neue Beispiele, die sie noch nie gesehen hat. Erst dann weiß man, ob sie wirklich gelernt hat.", "After training the AI gets new examples it has never seen. Only then do we know if it really learned.") },
              { label: t("Schlechte Daten", "Bad data"), text: t("Wenn Trainingsdaten unfair, falsch oder einseitig sind, lernt die KI diese Fehler mit.", "If training data is unfair, wrong, or one-sided, the AI learns those mistakes too.") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: "Label", value: t("Name", "Name"), note: t("Sagt dem Modell, was auf einem Beispiel wirklich zu sehen ist.", "Tells the model what is really shown in an example.") },
              { term: t("Training", "Training"), value: t("üben", "practise"), note: t("Viele Beispiele werden immer wieder durchgerechnet.", "Many examples are calculated through again and again.") },
              { term: "Test", value: t("Kontrolle", "Check"), note: t("Neue Beispiele zeigen, ob die KI nur auswendig gelernt hat.", "New examples show whether the AI just memorised things.") },
              { term: "Bias", value: t("Schieflage", "Unfairness"), note: t("Wenn Daten unfair sind, kann auch die KI unfair entscheiden.", "If data is unfair, the AI can make unfair decisions too.") },
            ]}
          />
        </Chapter>
      ) : (
        <LockedGate level={level} required={1} hint={t("Schließ Level 1, um zu sehen, wie KI lernt.", "Finish Level 1 to see how AI learns.")} />
      )}

      {level >= 2 ? (
        <Chapter
          num={3}
          title={t("Neuronale Netze", "Neural Networks")}
          intro={t(
            'Im Inneren der KI: Tausende winzige „Neuronen", die Daten weiterreichen. Jedes Mal, wenn die KI falsch liegt, justiert sie ihre Verbindungen ein winziges bisschen.',
            'Inside the AI: thousands of tiny "neurons" that pass data along. Every time the AI gets it wrong, it adjusts its connections a tiny bit.'
          )}
        >
          <ImageCard src={neuralImg} alt={t("Neuronales Netz", "Neural Network")} caption={t("Eingabe links, Ausgabe rechts. Dazwischen: das Gehirn der KI.", "Input on the left, output on the right. In between: the AI's brain.")} />
          <div className="rounded-3xl bg-[#10101e] p-5">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t('Wie ein Netz „Katze" erkennt', 'How a Network Spots "Cat"')}</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li><strong className="text-white">{t("Schicht 1:", "Layer 1:")}</strong> {t("sieht nur Punkte und Kanten.", "sees only dots and edges.")}</li>
              <li><strong className="text-white">{t("Schicht 2:", "Layer 2:")}</strong> {t("erkennt Formen – rund, spitz, gestreift.", "recognises shapes – round, pointy, striped.")}</li>
              <li><strong className="text-white">{t("Schicht 3:", "Layer 3:")}</strong> {t("findet Augen, Ohren, Schnurrhaare.", "finds eyes, ears, and whiskers.")}</li>
              <li><strong className="text-white">{t("Schicht 4:", "Layer 4:")}</strong> {t('entscheidet: „Das ist eine Katze."', 'decides: "That\'s a cat."')}</li>
            </ol>
          </div>
          <ImageCard src={DATA} alt={t("Daten", "Data")} caption={t("Diese Netze trainieren Tage oder Wochen lang auf riesigen Computern.", "These networks train for days or weeks on enormous computers.")} />
          <AtlasNotes
            title={t("Im neuronalen Netz reisen Zahlen durch Schichten", "In a Neural Network Numbers Travel Through Layers")}
            intro={t(
              "Ein neuronales Netz ist wie eine riesige Fabrik aus kleinen Rechenknoten. Jeder Knoten sagt: Ist dieses Signal wichtig genug, um weitergegeben zu werden?",
              "A neural network is like a giant factory of tiny calculation nodes. Each node asks: is this signal important enough to pass on?"
            )}
            points={[
              { label: t("Eingabe", "Input"), text: t("Bei einem Bild sind die Eingaben Pixel. Jeder Pixel hat Zahlen für Farbe und Helligkeit.", "For a picture, the inputs are pixels. Each pixel has numbers for colour and brightness.") },
              { label: t("Versteckte Schichten", "Hidden Layers"), text: t("Diese Schichten finden Muster, die Menschen nicht einzeln einprogrammieren: Kanten, Formen, Ohren, Augen, dann ganze Tiere.", "These layers find patterns that humans don't programme one by one: edges, shapes, ears, eyes, then whole animals.") },
              { label: t("Gewichte", "Weights"), text: t("Eine Verbindung kann wichtig oder unwichtig sein. Diese Stärke nennt man Gewicht. Training verändert Gewichte.", "A connection can be important or unimportant. This strength is called a weight. Training changes weights.") },
              { label: t("Aktivierung", "Activation"), text: t("Ein Knoten wird nur aktiv, wenn genug Signal ankommt. So werden unwichtige Informationen herausgefiltert.", "A node only activates when enough signal arrives. That way unimportant information is filtered out.") },
              { label: t("Ausgabe", "Output"), text: t("Am Ende stehen Wahrscheinlichkeiten: 91 % Katze, 7 % Hund, 2 % Fuchs. Die höchste Zahl gewinnt oft.", "At the end are probabilities: 91% cat, 7% dog, 2% fox. The highest number usually wins.") },
              { label: t("Warum viele Computer?", "Why so many computers?"), text: t("Sehr große Modelle rechnen mit unfassbar vielen Zahlen. Darum brauchen sie starke Grafikkarten und viel Strom.", "Very large models crunch an unbelievable number of numbers. That's why they need powerful graphics cards and lots of power.") },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">175 Mrd.</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Verbindungen in einem modernen Sprach-Modell.", "Connections in a modern language model.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">86 Mrd.</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("echte Neuronen hat dein Gehirn – immer noch mehr.", "real neurons your brain has – still more than AI.")}</p>
            </div>
          </div>
          <BigStat value="10 000+" caption={t("Grafikkarten arbeiten gleichzeitig, um eine große KI zu trainieren.", "Graphics cards work at the same time to train a big AI.")} />
        </Chapter>
      ) : (
        <LockedGate level={level} required={2} hint={t("Schließ Level 2, um neuronale Netze zu entdecken.", "Finish Level 2 to discover neural networks.")} />
      )}

      {level >= 3 ? (
        <Chapter
          num={4}
          title={t("Generative KI", "Generative AI")}
          intro={t(
            "Wenn die KI nicht nur erkennt, sondern selbst etwas erschafft – Texte, Bilder, Musik – nennt man das Generative KI. Sie würfelt Pixel und korrigiert sich, bis ein Bild entsteht.",
            "When AI doesn't just recognise things but creates something new – texts, pictures, music – that's called Generative AI. It guesses pixels and corrects itself until a picture appears."
          )}
        >
          <ImageCard src={ART} alt={t("KI-Kunst", "AI Art")} caption={t('„Drache, der ein Eis isst" – die KI malt es in Sekunden.', '"Dragon eating an ice cream" – the AI paints it in seconds.')} />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Berühmte KIs heute", "Famous AIs Today")}</p>
          <TapCardGrid cards={FAMOUS_AI} />
          <div className="rounded-3xl bg-[#10101e] p-5">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Wie malt eine KI ein Bild?", "How Does an AI Paint a Picture?")}</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li><strong className="text-white">1.</strong> {t("Sie startet mit reinem Rauschen – wie Schnee im alten Fernseher.", "It starts with pure noise – like snow on an old TV.")}</li>
              <li><strong className="text-white">2.</strong> {t('Sie liest deinen Text: „Drache im Regen".', 'It reads your text: "Dragon in the rain".')}</li>
              <li><strong className="text-white">3.</strong> {t("Schritt für Schritt entfernt sie das Rauschen, das nicht zum Text passt.", "Step by step it removes the noise that doesn't match the text.")}</li>
              <li><strong className="text-white">4.</strong> {t("Nach 30 Schritten ist da ein Bild.", "After 30 steps there is a picture.")}</li>
            </ol>
          </div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Wo Vorsicht hilft", "Where to Be Careful")}</p>
          <TapCardGrid cards={AI_RISKS} />
          <AtlasNotes
            title={t("Generative KI: Sie baut Neues aus gelernten Mustern", "Generative AI: It Builds New Things from Learned Patterns")}
            intro={t(
              "Eine generative KI kann Text, Bilder oder Musik erzeugen. Sie kopiert nicht einfach einen einzigen Text, sondern setzt gelernte Muster neu zusammen. Trotzdem kann sie Fehler machen.",
              "A generative AI can create text, pictures, or music. It doesn't just copy one text – it puts learned patterns together in new ways. But it can still make mistakes."
            )}
            points={[
              { label: t("Sprachmodell", "Language Model"), text: t("Ein Sprachmodell sagt Wort für Wort voraus, was wahrscheinlich als Nächstes passt. So entstehen Antworten, Geschichten oder Erklärungen.", "A language model predicts word by word what probably comes next. That's how answers, stories, and explanations are made.") },
              { label: t("Bildmodell", "Image Model"), text: t("Viele Bild-KIs starten mit Rauschen und entfernen Schritt für Schritt alles, was nicht zum Prompt passt.", "Many image AIs start with noise and remove step by step everything that doesn't match the prompt.") },
              { label: t("Halluzination", "Hallucination"), text: t("Wenn die KI etwas erfindet, das nicht stimmt, nennt man das Halluzination. Es klingt oft überzeugend, ist aber falsch.", "When the AI invents something that isn't true, it's called a hallucination. It often sounds convincing but is wrong.") },
              { label: t("Urheber", "Authorship"), text: t("Bei KI-Bildern und Texten ist wichtig: Wer hatte die Idee? Welche Daten wurden gelernt? Darf man es benutzen?", "With AI pictures and texts it's important to ask: who had the idea? What data was learned? Is it allowed to use?") },
              { label: t("Gute Nutzung", "Good Use"), text: t("KI ist stark als Helfer: Ideen sammeln, erklären, übersetzen, üben. Entscheidungen über Menschen sollen Menschen prüfen.", "AI is great as a helper: gathering ideas, explaining, translating, practising. Decisions about people should be checked by people.") },
            ]}
          />
          <div className="rounded-3xl bg-[#10101e] p-5">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Wichtig zu wissen", "Important to Know")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t(
                "KI ist sehr gut bei Mustern. Aber sie versteht NICHT, was sie tut. Sie kennt keine Wahrheit. Sie kann sich irren. Deshalb: Wichtige Entscheidungen treffen Menschen.",
                "AI is really good at patterns. But it does NOT understand what it is doing. It has no truth. It can be wrong. That's why: people make important decisions."
              )}
            </p>
          </div>
        </Chapter>
      ) : (
        <LockedGate level={level} required={3} hint={t("Schließ Level 3, um generative KI zu entdecken.", "Finish Level 3 to discover generative AI.")} />
      )}


      <QuizLauncher topic={TOPIC} pools={QUIZ} />
    </TopicShell>
  );
}
