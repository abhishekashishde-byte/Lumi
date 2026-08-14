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
import { useT } from "@/lib/i18n";
import gpsImg from "@/assets/topic-gps.jpg";

const TOPIC = "internet";

const PHONE =
  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80";
const ROUTER =
  "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1200&q=80";
const FIBER =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80";
const SERVER =
  "https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&w=1200&q=80";
const SERVER_ROOM =
  "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80";
const TOWER =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
const SATELLITE =
  "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1200&q=80";
const EARTH_NIGHT =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
const KEYBOARD =
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80";

/* ---------- Ch 1: Message journey ---------- */

function MessageJourney() {
  const t = useT();
  const [step, setStep] = useState(0);
  const stops = [
    { emoji: "📱", title: t("Dein Handy", "Your Phone"), text: t("Du tippst »Hallo«. Buchstaben werden zu 0 und 1.", "You type 'Hello'. Letters turn into 0s and 1s.") },
    { emoji: "📡", title: t("Funkmast", "Cell Tower"), text: t("Funkwellen tragen die Bits zum nächsten Mast.", "Radio waves carry the bits to the next tower.") },
    { emoji: "🏛️", title: t("Vermittlung", "Router"), text: t("Ein Router schaut: Wo soll das hin? Und gibt es weiter.", "A router checks: Where does this go? Then passes it on.") },
    { emoji: "🌊", title: t("Tiefseekabel", "Undersea Cable"), text: t("Unter dem Meer liegen 1,4 Mio. km Glasfaser.", "Under the ocean lie 1.4 million km of fiber-optic cable.") },
    { emoji: "🏢", title: t("Datenzentrum", "Data Center"), text: t("Ein Server wacht auf und schickt eine Antwort zurück.", "A server wakes up and sends a reply back.") },
    { emoji: "📱", title: t("Dein Freund", "Your Friend"), text: t("0,1 Sekunden später ist »Hallo« da.", "0.1 seconds later, 'Hello' has arrived.") },
  ];
  const cur = stops[step];
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <div className="flex flex-wrap items-center justify-center gap-2 text-2xl">
        {stops.map((s, i) => (
          <span key={i} className={`transition-all ${i === step ? "scale-125" : i < step ? "opacity-60" : "opacity-25 grayscale"}`}>
            {s.emoji}
          </span>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Schritt", "Step")} {step + 1} / {stops.length}</p>
        <p className="mt-1 font-display text-lg font-black text-white">{cur.title}</p>
        <p className="mt-1 text-sm text-slate-300">{cur.text}</p>
      </div>
      <button
        onClick={() => setStep((s) => (s + 1) % stops.length)}
        className="mt-4 w-full rounded-full bg-amber-300 py-3 font-display text-sm font-black uppercase tracking-wide text-[#0D0D1A]"
      >
        {step === stops.length - 1 ? t("Nochmal", "Again") : t("Nächster Sprung →", "Next Hop →")}
      </button>
    </div>
  );
}

/* ---------- Ch 1: Bits & Bytes converter ---------- */

function BitsConverter() {
  const t = useT();
  const [text, setText] = useState("Hi");
  const bits = Array.from(text)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Buchstaben → Zahlen", "Letters → Numbers")}</p>
      <p className="mt-1 font-display text-base font-black text-white">{t("So sieht dein Text für den Computer aus.", "This is how your text looks to a computer.")}</p>
      <input
        value={text}
        maxLength={6}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 w-full rounded-2xl border-2 border-white/10 bg-black/30 px-4 py-3 font-display text-lg text-white outline-none focus:border-amber-300"
      />
      <p className="mt-3 break-all rounded-2xl bg-black/40 p-3 font-mono text-xs leading-relaxed text-emerald-300">
        {bits || "00000000"}
      </p>
      <p className="mt-2 text-[11px] text-slate-400">{t("8 Nullen oder Einsen = 1 Byte = 1 Buchstabe.", "8 zeros or ones = 1 byte = 1 letter.")}</p>
    </div>
  );
}

/* ---------- Ch 2: Frequency slider ---------- */

function FrequencyShow() {
  const t = useT();
  const [hz, setHz] = useState(2);
  const bands = [
    { name: t("AM-Radio", "AM Radio"), freq: "1 MHz", uses: t("Alte Radiosender, reichen 1000 km weit.", "Old radio stations — they reach up to 1,000 km away.") },
    { name: t("FM-Radio", "FM Radio"), freq: "100 MHz", uses: t("Musik im Auto – knapp 100 km Reichweite.", "Music in the car — about 100 km range.") },
    { name: t("WLAN 2.4", "WiFi 2.4"), freq: "2 400 MHz", uses: t("Dein Heim-WLAN. Geht durch Wände.", "Your home WiFi. Goes through walls.") },
    { name: t("WLAN 5", "WiFi 5"), freq: "5 000 MHz", uses: t("Schneller, aber kürzer. Bleibt im Raum.", "Faster, but shorter range. Stays in the room.") },
    { name: "5G", freq: "28 000 MHz", uses: t("Mega schnell. Aber jeder Baum stört das Signal.", "Super fast. But trees and walls can block the signal.") },
  ];
  const b = bands[hz];
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Frequenz", "Frequency")}</p>
      <p className="mt-1 font-display text-2xl font-black text-white">{b.name}</p>
      <p className="font-mono text-sm text-emerald-300">{b.freq}</p>
      <p className="mt-2 text-sm text-slate-300">{b.uses}</p>
      <input
        type="range"
        min={0}
        max={4}
        value={hz}
        onChange={(e) => setHz(Number(e.target.value))}
        className="mt-4 w-full accent-amber-300"
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>{t("langsam, weit", "slow, far")}</span>
        <span>{t("schnell, kurz", "fast, short")}</span>
      </div>
    </div>
  );
}

/* ---------- Ch 3: GPS triangulation ---------- */

function GpsTriangulate() {
  const t = useT();
  const [sats, setSats] = useState(0);
  const positions = [
    { x: 80, y: 60 },
    { x: 200, y: 80 },
    { x: 130, y: 180 },
  ];
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Wo bin ich?", "Where am I?")}</p>
      <p className="mt-1 font-display text-base font-black text-white">{t("Tippe Satelliten an. Schau, wie dein Ort gefunden wird.", "Tap the satellites. Watch how your location gets found.")}</p>
      <svg viewBox="0 0 280 240" className="mt-4 w-full">
        <rect x="0" y="0" width="280" height="240" rx="16" fill="#0a0a14" />
        {positions.slice(0, sats).map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={70} fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <circle cx={p.x} cy={p.y} r="6" fill="#FBBF24" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10" fill="#FBBF24" fontWeight="700">SAT {i + 1}</text>
          </g>
        ))}
        {sats === 3 && (
          <g>
            <circle cx="140" cy="115" r="10" fill="#F87171" className="animate-pulse" />
            <text x="140" y="145" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">{t("📍 Du bist hier!", "📍 You are here!")}</text>
          </g>
        )}
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => setSats(n)} className={`rounded-full py-2 text-xs font-bold transition-all ${sats >= n ? "bg-amber-300 text-[#0D0D1A]" : "bg-white/5 text-white"}`}>
            {n} {t("Sat", "Sat")}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-300">
        {sats === 0 && t("Ein einzelner Satellit weiß nur: du bist irgendwo auf einer Kugel.", "One satellite only knows: you're somewhere on a huge sphere.")}
        {sats === 1 && t("Mit einem: du bist auf einem riesigen Kreis.", "With one: you're somewhere on a giant circle.")}
        {sats === 2 && t("Mit zwei: du bist auf einer Linie. Schon näher.", "With two: you're on a line. Getting closer.")}
        {sats === 3 && t("Mit drei: alle Kreise schneiden sich an EINEM Punkt. Das ist dein Standort.", "With three: all circles meet at ONE point. That's your location.")}
      </p>
    </div>
  );
}

/* ---------- Ch 4: HTTPS lock interactive ---------- */

function HttpsLock() {
  const t = useT();
  const [secure, setSecure] = useState(true);
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">{t("Das Schloss in der Adresszeile", "The Lock in the Address Bar")}</p>
      <div className={`mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 font-mono text-sm ${secure ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
        <span className="text-xl">{secure ? "🔒" : "🔓"}</span>
        <span className="break-all">{secure ? "https://" : "http://"}warum.app</span>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {secure
          ? t("Mit 🔒 wird alles verschlüsselt. Selbst wenn jemand mitliest, sieht er nur Müll.", "With 🔒 everything is encrypted. Even if someone snoops, they just see gibberish.")
          : t("Ohne Schloss ist deine Nachricht offen. Wie eine Postkarte – jeder kann mitlesen.", "Without the lock, your message is open. Like a postcard — anyone can read it.")}
      </p>
      <button
        onClick={() => setSecure((v) => !v)}
        className="mt-3 w-full rounded-full bg-white/10 py-2 font-display text-xs font-black uppercase tracking-wider text-white"
      >
        {t("Umschalten", "Switch")}
      </button>
    </div>
  );
}

/* ---------- Main ---------- */

export function InternetExperience() {
  const t = useT();
  const level = useTopicLevel(TOPIC);

  /* ---------- Ch 2: Signal types comparison ---------- */
  const SIGNAL_CARDS = [
    { emoji: "📶", title: t("WLAN", "WiFi"), body: t("Funkt im ganzen Haus. Reichweite ca. 30 m. Schnell, aber kurz.", "Works all around your home. Range about 30 m. Fast, but short.") },
    { emoji: "📡", title: t("Mobilfunk", "Mobile Network"), body: t("5G-Masten erreichen mehrere Kilometer weit. Auch unterwegs.", "5G towers reach several kilometers. Works on the go too.") },
    { emoji: "🔵", title: "Bluetooth", body: t("Nur ein paar Meter. Für Kopfhörer, Maus, Smartwatch.", "Just a few meters. Great for headphones, mice, and smartwatches.") },
    { emoji: "🛰️", title: t("Satellit", "Satellite"), body: t("Funkt aus dem Weltraum. Auch dort, wo es keine Masten gibt – Wüste, Meer, Berge.", "Signals from space. Even where there are no towers — deserts, oceans, mountains.") },
  ];

  /* ---------- Ch 3: GPS uses ---------- */
  const GPS_USES: { emoji: string; title: string; body: string }[] = [
    { emoji: "🚗", title: t("Navi im Auto", "Car Navigation"), body: t("Sagt dir Sekunde für Sekunde, wo du abbiegen sollst.", "Tells you second by second where to turn.") },
    { emoji: "✈️", title: t("Flugzeuge", "Airplanes"), body: t("Piloten finden so jeden Flughafen auf der Welt.", "Pilots can find every airport in the world.") },
    { emoji: "🚢", title: t("Schiffe", "Ships"), body: t("Auf offenem Meer gibt's keine Straßen – nur GPS.", "On the open ocean there are no roads — only GPS.") },
    { emoji: "⌚", title: "Smartwatch", body: t("Misst, wie weit du gerannt bist – auf den Meter genau.", "Measures how far you ran — down to the meter.") },
    { emoji: "🐾", title: t("Tier-Tracker", "Animal Tracker"), body: t("Forscher verfolgen Wale, Wölfe und Vögel rund um die Erde.", "Researchers track whales, wolves, and birds around the world.") },
    { emoji: "🚜", title: t("Trecker", "Tractor"), body: t("Bauern lassen Trecker per GPS ganz allein über das Feld fahren.", "Farmers let tractors drive across fields all by themselves using GPS.") },
  ];

  /* ---------- Ch 4: Datacenter facts ---------- */
  const DC_CARDS = [
    { emoji: "❄️", title: t("Eiskalt", "Ice Cold"), body: t("Server werden glühend heiß. Hallen werden auf 18 °C runtergekühlt – Tag und Nacht.", "Servers get burning hot. The halls are cooled to 18 °C — day and night.") },
    { emoji: "⚡", title: t("Hungrig", "Power Hungry"), body: t("Ein einziges Datenzentrum verbraucht so viel Strom wie eine Kleinstadt.", "A single data center uses as much electricity as a small city.") },
    { emoji: "💧", title: t("Untersee", "Undersea"), body: t("Manche Server liegen IM Meer – das Wasser kühlt sie kostenlos.", "Some servers sit IN the ocean — the water cools them for free.") },
    { emoji: "🔒", title: t("Streng bewacht", "Strictly Guarded"), body: t("Türen mit Fingerabdruck, kein Handy erlaubt – deine Daten sollen sicher sein.", "Fingerprint doors, no phones allowed — your data is kept safe.") },
  ];

  /* ---------- Quiz ---------- */
  const QUIZ: QuizLevel[] = [
    {
      title: t("Level 1 · Wie Nachrichten reisen", "Level 1 · How Messages Travel"),
      reward: t("Schaltet frei: Funk, WLAN und Bluetooth.", "Unlocks: Radio, WiFi, and Bluetooth."),
      questions: [
        { q: t("Womit funkt dein Handy zum Mast?", "How does your phone communicate with the tower?"), options: [t("Mit Licht", "With light"), t("Mit Funkwellen", "With radio waves"), t("Mit Schall", "With sound")], answer: 1, explain: t("Unsichtbare Funkwellen tragen die Daten.", "Invisible radio waves carry the data.") },
        { q: t("Wie schnell sind diese Wellen?", "How fast are these waves?"), options: ["100 km/h", t("Schallgeschwindigkeit", "Speed of sound"), t("Lichtgeschwindigkeit", "Speed of light")], answer: 2, explain: t("Fast 300 000 km/s.", "Almost 300,000 km/s.") },
        { q: t("Wie viele Bits sind 1 Byte?", "How many bits are in 1 byte?"), options: ["2", "8", "100"], answer: 1, explain: t("Genau 8 – ergibt einen Buchstaben.", "Exactly 8 — that makes one letter.") },
        { q: t("Was wird aus »A« für den Computer?", "What does 'A' become for a computer?"), options: [t("Ein Bild", "A picture"), t("Eine Zahl", "A number"), t("Ein Ton", "A sound")], answer: 1, explain: t("Die Zahl 65, als 01000001 in Bits.", "The number 65, written as 01000001 in bits.") },
        { q: t("Was macht ein Router?", "What does a router do?"), options: [t("Erzeugt Strom", "Makes electricity"), t("Verteilt Pakete weiter", "Passes packets along"), t("Kühlt das Handy", "Cools your phone")], answer: 1, explain: t("Er ist die Vermittlung im Internet.", "It's the traffic director of the internet.") },
      ],
    },
    {
      title: t("Level 2 · Funk, WLAN, Bluetooth", "Level 2 · Radio, WiFi, Bluetooth"),
      reward: t("Schaltet frei: GPS, Satelliten und Triangulation.", "Unlocks: GPS, satellites, and triangulation."),
      questions: [
        { q: t("Wie weit reicht typisches WLAN?", "How far does typical WiFi reach?"), options: ["3 m", t("ca. 30 m", "about 30 m"), "30 km"], answer: 1, explain: t("Genug für eine Wohnung.", "Enough for a home.") },
        { q: t("Welche Funkverbindung ist die kürzeste?", "Which wireless connection has the shortest range?"), options: ["Bluetooth", t("Mobilfunk", "Mobile network"), t("Satellit", "Satellite")], answer: 0, explain: t("Bluetooth: nur ein paar Meter.", "Bluetooth: just a few meters.") },
        { q: t("Was heißt 5G?", "What does 5G mean?"), options: [t("5. Generation Mobilfunk", "5th generation mobile network"), t("5 Gigabyte", "5 gigabytes"), t("5 Geräte", "5 devices")], answer: 0, explain: t("Die fünfte Generation Mobilfunktechnik.", "The fifth generation of mobile network technology.") },
        { q: t("Welches Signal geht durch Wände?", "Which signal goes through walls?"), options: [t("WLAN 2.4 GHz", "WiFi 2.4 GHz"), t("5G im Hochband", "5G high band"), t("Beide gleich", "Both the same")], answer: 0, explain: t("Niedrige Frequenz dringt besser durch.", "Lower frequency passes through better.") },
        { q: t("Was steht oben auf hohen Gebäuden?", "What sits on top of tall buildings?"), options: [t("Solarzellen", "Solar panels"), t("Funkmasten", "Radio antennas"), t("Wassertanks", "Water tanks")], answer: 1, explain: t("Mobilfunk-Antennen.", "Mobile network antennas.") },
      ],
    },
    {
      title: t("Level 3 · GPS & Satelliten", "Level 3 · GPS & Satellites"),
      reward: t("Schaltet frei: Datenzentren – wo das Internet wirklich wohnt.", "Unlocks: Data centers — where the internet really lives."),
      questions: [
        { q: t("Wie viele Satelliten braucht GPS für eine genaue Position?", "How many satellites does GPS need for an accurate position?"), options: ["1", "3", "4"], answer: 2, explain: t("Mit 4 wird's exakt – auch die Höhe.", "With 4 it's exact — including height.") },
        { q: t("Wie hoch fliegen GPS-Satelliten?", "How high do GPS satellites fly?"), options: ["100 km", "20 200 km", t("Mond-Entfernung", "Moon distance")], answer: 1, explain: t("Etwa 20 200 km über der Erde.", "About 20,200 km above Earth.") },
        { q: t("Wer hat GPS erfunden?", "Who invented GPS?"), options: [t("Deutschland", "Germany"), t("USA", "USA"), t("Japan", "Japan")], answer: 1, explain: t("Ursprünglich US-Militär, heute für alle.", "Originally the US military, now for everyone.") },
        { q: t("Was misst der GPS-Empfänger?", "What does the GPS receiver measure?"), options: [t("Wetter", "Weather"), t("Wie lange das Signal braucht", "How long the signal takes"), t("Höhe der Wolken", "Cloud height")], answer: 1, explain: t("Aus der Laufzeit folgt die Entfernung.", "From the travel time, the distance is calculated.") },
        { q: t("Wozu nutzen Bauern GPS?", "How do farmers use GPS?"), options: [t("Wetter", "Weather"), t("Trecker fährt selbst", "Tractor drives itself"), t("Eier zählen", "Counting eggs")], answer: 1, explain: t("Trecker fahren auf den Zentimeter genau.", "Tractors drive with centimeter precision.") },
        { q: t("Wie viele Satelliten umkreisen die Erde fürs GPS-System?", "How many satellites orbit Earth for the GPS system?"), options: ["3", t("ca. 24", "about 24"), "1000"], answer: 1, explain: t("24 Hauptsatelliten – plus einige Reservesatelliten.", "24 main satellites — plus a few spares.") },
      ],
    },
    {
      title: t("Level 4 · Internet-Meister", "Level 4 · Internet Master"),
      reward: t("Alles freigeschaltet.", "Everything unlocked."),
      questions: [
        { q: t("Wo speichert YouTube deine Videos?", "Where does YouTube store your videos?"), options: [t("Auf deinem Handy", "On your phone"), t("In Datenzentren", "In data centers"), t("Im Mond", "On the moon")], answer: 1, explain: t("Riesige Hallen voller Computer.", "Huge halls full of computers.") },
        { q: t("Wie schnell ist Licht in Glasfaser?", "How fast is light in fiber-optic cable?"), options: [t("Schallgeschwindigkeit", "Speed of sound"), t("ca. 200 000 km/s", "about 200,000 km/s"), "10 km/h"], answer: 1, explain: t("Etwas langsamer als im Vakuum – trotzdem extrem schnell.", "Slightly slower than in a vacuum — still incredibly fast.") },
        { q: t("Was bedeutet das Schloss 🔒 in der Adresszeile?", "What does the 🔒 lock in the address bar mean?"), options: [t("Webseite ist hübsch", "Website looks nice"), t("Verbindung ist verschlüsselt", "Connection is encrypted"), t("Nichts", "Nothing")], answer: 1, explain: t("Niemand kann zwischen dir und der Seite mitlesen.", "Nobody can snoop between you and the website.") },
        { q: t("Wie kühlen sich Datenzentren oft?", "How do data centers often cool themselves?"), options: [t("Sonne", "Sun"), t("Kalte Luft oder Meerwasser", "Cold air or seawater"), t("Heizung", "Heating")], answer: 1, explain: t("Server werden glühend heiß – Kühlung ist Pflicht.", "Servers get burning hot — cooling is a must.") },
        { q: t("Wie viel Daten fließen pro Sekunde durchs Internet?", "How much data flows through the internet every second?"), options: ["1 GB", "10 TB", t("Über 150 TB", "Over 150 TB")], answer: 2, explain: t("Mehr als ein menschliches Gehirn aufnehmen kann.", "More than a human brain can take in.") },
        { q: t("Wo liegen die meisten Internet-Kabel zwischen Kontinenten?", "Where do most internet cables between continents run?"), options: [t("In der Luft", "In the air"), t("Unter dem Meer", "Under the ocean"), t("Im Weltraum", "In space")], answer: 1, explain: t("1,4 Mio. km Glasfaser auf dem Meeresgrund.", "1.4 million km of fiber-optic cable on the ocean floor.") },
      ],
    },
  ];

  return (
    <TopicShell eyebrow={t("Internet & Signale", "Internet & Signals")} title={t("Wie kommt eine Nachricht in 0,1 Sek um die Welt?", "How does a message travel around the world in 0.1 seconds?")}>
      <Chapter
        num={1}
        title={t("Deine Nachricht reist", "Your Message Travels")}
        intro={t("Du tippst »Hallo« – und Sekundenbruchteile später ist es da. Aber wo war es zwischendrin? An mehr Orten, als du denkst.", "You type 'Hello' — and fractions of a second later it arrives. But where did it go in between? More places than you'd think.")}
      >
        <ImageCard src={KEYBOARD} alt={t("Tastatur", "Keyboard")} caption={t("Alles beginnt mit einem Buchstaben.", "Everything starts with a single letter.")} />
        <BitsConverter />
        <MessageJourney />
        <AtlasNotes
          title={t("Eine Nachricht wird in viele Mini-Pakete zerlegt", "A Message Gets Split into Many Mini-Packets")}
          intro={t("Das Internet sendet nicht »Hallo« als ein magisches Ganzes. Es zerlegt alles in Zahlen, verpackt sie und schickt sie über viele Stationen.", "The internet doesn't send 'Hello' as one magic whole. It breaks everything into numbers, packages them, and sends them through many stations.")}
          points={[
            { label: t("Buchstaben werden Zahlen", "Letters Become Numbers"), text: t("Computer kennen keine Buchstaben wie Menschen. Für sie ist A zum Beispiel eine Zahl, und diese Zahl wird als Nullen und Einsen gespeichert.", "Computers don't know letters the way we do. For them, A is a number, and that number is stored as zeros and ones.") },
            { label: t("Bits und Bytes", "Bits and Bytes"), text: t("Ein Bit ist 0 oder 1. Acht Bits sind ein Byte. Ein Text, ein Foto und ein Video bestehen alle aus sehr vielen Bytes.", "A bit is 0 or 1. Eight bits make a byte. Text, photos, and videos are all made of lots and lots of bytes.") },
            { label: t("Pakete", "Packets"), text: t("Große Daten werden in kleine Pakete geschnitten. Jedes Paket bekommt eine Zieladresse, ähnlich wie ein Briefumschlag.", "Big data is cut into small packets. Each packet gets a destination address, just like an envelope.") },
            { label: t("Router", "Router"), text: t("Router lesen die Adresse und entscheiden den nächsten Weg. Das Paket kann über Kabel, Funk, Glasfaser oder Unterseekabel reisen.", "Routers read the address and decide the next step. The packet can travel by cable, radio, fiber, or undersea cable.") },
            { label: t("Wieder zusammensetzen", "Reassembled"), text: t("Beim Empfänger werden alle Pakete sortiert. Fehlt eins, wird es erneut angefordert. Deshalb kann ein Video trotz langer Reise sauber ankommen.", "At the receiver, all packets are sorted. If one is missing, it's requested again. That's why a video can arrive perfectly after a long trip.") },
          ]}
        />
        <MiniFactTable
          rows={[
            { term: "Bit", value: "0/1", note: t("Die kleinste Information: aus oder an, nein oder ja.", "The smallest piece of info: off or on, no or yes.") },
            { term: "Byte", value: "8 Bits", note: t("Genug Platz für einen einfachen Buchstaben.", "Enough space for a single letter.") },
            { term: t("Paket", "Packet"), value: t("Datenstück", "Data chunk"), note: t("Ein kleiner Teil einer Nachricht mit Adresse und Reihenfolge.", "A small piece of a message with an address and order number.") },
            { term: "Router", value: t("Wegfinder", "Pathfinder"), note: t("Sucht für jedes Paket den nächsten passenden Internet-Weg.", "Finds the next best internet path for every packet.") },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">8</p>
            <p className="mt-1 font-display text-sm font-black text-white">{t("Bits = 1 Byte", "Bits = 1 Byte")}</p>
            <p className="text-[11px] text-slate-400">{t("Ein einzelner Buchstabe.", "A single letter.")}</p>
          </div>
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">1 Mrd.</p>
            <p className="mt-1 font-display text-sm font-black text-white">{t("Bytes = 1 GB", "Bytes = 1 GB")}</p>
            <p className="text-[11px] text-slate-400">{t("Ein langes Video.", "A long video.")}</p>
          </div>
        </div>
        <BigStat value="0,1 Sek" caption={t("So lange braucht eine Nachricht um die halbe Welt.", "That's how long a message takes to travel halfway around the world.")} />
      </Chapter>

      {level >= 1 ? (
        <Chapter
          num={2}
          title={t("Funk, WLAN & Bluetooth", "Radio, WiFi & Bluetooth")}
          intro={t("Unsichtbare Wellen sind überall um dich. Manche reichen nur einen Meter, andere bis zum Mond. Welche Welle für welche Aufgabe?", "Invisible waves are all around you. Some reach only one meter, others all the way to the moon. Which wave does which job?")}
        >
          <TapCardGrid cards={SIGNAL_CARDS} />
          <ImageCard src={TOWER} alt={t("Funkmast", "Cell tower")} caption={t("Ein einziger 5G-Mast versorgt tausende Handys gleichzeitig.", "A single 5G tower serves thousands of phones at the same time.")} />
          <ImageCard src={ROUTER} alt={t("WLAN-Router", "WiFi router")} caption={t("Der Router zu Hause: Mini-Funkmast für deine Wohnung.", "Your home router: a mini cell tower for your home.")} />
          <FrequencyShow />
          <AtlasNotes
            title={t("Unsichtbare Wellen tragen deine Daten", "Invisible Waves Carry Your Data")}
            intro={t("Funk ist kein Zauber: Es sind elektromagnetische Wellen. Je nach Aufgabe nutzt man andere Wellenlängen und Frequenzen.", "Radio isn't magic: it's electromagnetic waves. Different tasks use different wavelengths and frequencies.")}
            points={[
              { label: "WLAN", text: t("Gut für Zuhause. 2,4 GHz kommt besser durch Wände, 5 GHz ist oft schneller, reicht aber nicht so weit.", "Great for home. 2.4 GHz passes through walls better; 5 GHz is often faster but doesn't reach as far.") },
              { label: "Bluetooth", text: t("Sehr kurze Strecke, wenig Energie. Perfekt für Kopfhörer, Tastaturen, Uhren oder Controller.", "Very short range, low energy. Perfect for headphones, keyboards, watches, or controllers.") },
              { label: t("Mobilfunk", "Mobile Network"), text: t("Dein Handy spricht mit Funkmasten. Wenn du dich bewegst, übergibt ein Mast dein Gespräch an den nächsten.", "Your phone talks to cell towers. As you move, one tower hands your call to the next.") },
              { label: "5G", text: t("5G kann sehr schnell sein und viele Geräte gleichzeitig versorgen. Hohe Frequenzen brauchen aber mehr Antennen, weil sie schlechter durch Hindernisse kommen.", "5G can be very fast and serve many devices at once. But high frequencies need more antennas because they don't pass through obstacles as well.") },
              { label: t("Satellit", "Satellite"), text: t("Satelliteninternet hilft auf Schiffen, in Bergen oder Wüsten. Der Weg ins All ist länger, darum kann die Antwort etwas später kommen.", "Satellite internet helps on ships, in mountains, or deserts. The trip to space is longer, so responses can take a little more time.") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: "WLAN", value: "30 m", note: t("Typische Reichweite in einer Wohnung, je nach Wänden weniger.", "Typical range in a home — less if there are thick walls.") },
              { term: "Bluetooth", value: "1–10 m", note: t("Kurz, sparsam und gut für Zubehör.", "Short, power-saving, and great for accessories.") },
              { term: t("Mobilfunk", "Mobile network"), value: "km", note: t("Funkmasten versorgen Straßen, Dörfer und Städte.", "Cell towers serve roads, villages, and cities.") },
              { term: t("Satellit", "Satellite"), value: t("All", "Space"), note: t("Hilft dort, wo keine Kabel und Masten stehen.", "Helps where there are no cables or towers.") },
            ]}
          />
          <BigStat value="300 000 km/s" caption={t("So schnell rasen Funkwellen durch die Luft.", "That's how fast radio waves race through the air.")} />
        </Chapter>
      ) : (
        <LockedGate level={level} required={1} hint={t("Schließ Level 1, um Funk, WLAN und Bluetooth zu entdecken.", "Finish Level 1 to discover radio, WiFi, and Bluetooth.")} />
      )}

      {level >= 2 ? (
        <Chapter
          num={3}
          title={t("GPS – wie weiß dein Handy, wo du bist?", "GPS – How Does Your Phone Know Where You Are?")}
          intro={t("24 Satelliten kreisen um die Erde. Sie senden ständig: »Ich bin hier, es ist genau jetzt.« Aus den Signalen rechnet dein Handy deinen Ort aus – auf den Meter genau.", "24 satellites circle Earth. They constantly broadcast: 'I'm here, and it's exactly now.' From those signals your phone calculates your position — down to the meter.")}
        >
          <ImageCard src={gpsImg} alt={t("GPS-Satelliten", "GPS satellites")} caption={t("Vier Satelliten genügen, um dich zu finden.", "Four satellites are enough to find you.")} />
          <GpsTriangulate />
          <ImageCard src={SATELLITE} alt={t("Satellit", "Satellite")} caption={t("Ein GPS-Satellit ist so groß wie ein Auto und wiegt eine Tonne.", "A GPS satellite is as big as a car and weighs one tonne.")} />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("GPS überall im Alltag", "GPS Everywhere in Daily Life")}</p>
          <TapCardGrid cards={GPS_USES.slice(0, 4)} />
          <TapCardGrid cards={GPS_USES.slice(4)} />
          <AtlasNotes
            title={t("GPS ist eine Uhr im Weltraum", "GPS Is a Clock in Space")}
            intro={t("GPS findet dich nicht, indem ein Satellit dich anschaut. Dein Handy misst, wie lange Funksignale unterwegs waren.", "GPS doesn't find you by looking at you. Your phone measures how long radio signals were traveling.")}
            points={[
              { label: t("Atomuhren", "Atomic Clocks"), text: t("GPS-Satelliten haben extrem genaue Uhren. Schon ein winziger Zeitfehler würde deine Position um viele Meter verschieben.", "GPS satellites have incredibly precise clocks. Even a tiny time error would shift your position by many meters.") },
              { label: t("Entfernung messen", "Measuring Distance"), text: t("Das Signal sagt: Ich wurde genau jetzt gesendet. Dein Handy rechnet aus, wie lange es gebraucht hat. Daraus wird Entfernung.", "The signal says: I was sent at exactly this moment. Your phone figures out how long it took. From that, it calculates distance.") },
              { label: t("Drei oder vier Satelliten", "Three or Four Satellites"), text: t("Mit drei Satelliten findet man eine Fläche. Mit vier wird es genauer, auch Höhe und Uhrfehler werden korrigiert.", "With three satellites you find a surface area. With four it's more precise — height and clock errors are also corrected.") },
              { label: t("Karten-App", "Maps App"), text: t("GPS sagt nur: Hier bist du. Die App legt diese Position auf eine Karte und berechnet Straßen, Tempo und Abbiegen.", "GPS just says: here you are. The app places that position on a map and figures out roads, speed, and turns.") },
              { label: t("Andere Systeme", "Other Systems"), text: t("Neben GPS gibt es Galileo aus Europa, GLONASS und BeiDou. Viele Handys nutzen mehrere Systeme gleichzeitig.", "Besides GPS there's Galileo from Europe, GLONASS, and BeiDou. Many phones use several systems at once.") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: t("Höhe", "Height"), value: "20 200 km", note: t("So weit über der Erde fliegen GPS-Satelliten ungefähr.", "That's roughly how high GPS satellites fly above Earth.") },
              { term: t("Zeit", "Time"), value: "12 Std.", note: t("Ein Satellit braucht etwa einen halben Tag für eine Runde um die Erde.", "A satellite takes about half a day for one trip around Earth.") },
              { term: t("Genau", "Accuracy"), value: t("Meter", "Meters"), note: t("Handys finden dich oft auf wenige Meter genau.", "Phones can often find you within a few meters.") },
              { term: t("Uhr", "Clock"), value: t("Atom", "Atomic"), note: t("Sehr genaue Uhren machen die Entfernungsmessung möglich.", "Very precise clocks make the distance measurement possible.") },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">20 200 km</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("So hoch kreisen GPS-Satelliten.", "That's how high GPS satellites orbit.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">12 Std.</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Eine Erdumrundung dauert genau einen halben Tag.", "One orbit around Earth takes exactly half a day.")}</p>
            </div>
          </div>
        </Chapter>
      ) : (
        <LockedGate level={level} required={2} hint={t("Schließ Level 2, um GPS zu entdecken.", "Finish Level 2 to discover GPS.")} />
      )}

      {level >= 3 ? (
        <Chapter
          num={4}
          title={t("Datenzentren – wo das Internet wohnt", "Data Centers – Where the Internet Lives")}
          intro={t("Die »Cloud« ist kein Himmel. Es sind riesige Hallen voller Computer, die nie schlafen. Manche so groß wie 30 Fußballfelder.", "The 'cloud' isn't the sky. It's huge halls full of computers that never sleep — some as big as 30 soccer fields.")}
        >
          <ImageCard src={SERVER_ROOM} alt={t("Serverraum", "Server room")} caption={t("Reihe um Reihe blinkender Computer – jeder beantwortet tausende Anfragen pro Sekunde.", "Row after row of blinking computers — each one answers thousands of requests per second.")} />
          <TapCardGrid cards={DC_CARDS} />
          <ImageCard src={SERVER} alt={t("Server", "Server")} caption={t("Ein einzelner Server-Schrank kann mehr Filme speichern, als du in 100 Leben sehen kannst.", "A single server rack can store more movies than you could watch in 100 lifetimes.")} />
          <ImageCard src={FIBER} alt={t("Glasfaser", "Fiber-optic cable")} caption={t("Glasfaserkabel transportieren Licht statt Strom – tausendmal schneller als alte Kupferkabel.", "Fiber-optic cables carry light instead of electricity — a thousand times faster than old copper cables.")} />
          <ImageCard src={EARTH_NIGHT} alt={t("Erde bei Nacht", "Earth at night")} caption={t("Jeder helle Punkt auf der Erde ist auch ein Internet-Knoten.", "Every bright point on Earth is also an internet hub.")} />
          <HttpsLock />
          <AtlasNotes
            title={t("Die Cloud ist eine echte Fabrik für Daten", "The Cloud Is a Real Data Factory")}
            intro={t("Wenn du ein Video schaust, arbeiten viele echte Maschinen für dich: Server, Kühlung, Kabel, Stromversorgung und Sicherheitssysteme.", "When you watch a video, many real machines work for you: servers, cooling, cables, power, and security systems.")}
            points={[
              { label: t("Server", "Server"), text: t("Ein Server ist ein Computer, der nicht für einen Menschen am Schreibtisch da ist. Er beantwortet Anfragen von vielen Menschen gleichzeitig.", "A server is a computer not meant for one person at a desk. It answers requests from many people at the same time.") },
              { label: t("Datenbank", "Database"), text: t("Datenbanken sind geordnete Regale im Computer. Sie merken sich Nutzer, Kommentare, Spielstände, Fotos und Suchergebnisse.", "Databases are organized shelves inside a computer. They remember users, comments, game scores, photos, and search results.") },
              { label: t("Glasfaser", "Fiber Optics"), text: t("In Glasfaser reisen Lichtblitze. Jede Farbe kann Daten tragen. Darum passen riesige Datenmengen durch ein dünnes Kabel.", "Light pulses travel through fiber-optic cable. Each color can carry data. That's why huge amounts of data fit through a thin cable.") },
              { label: t("Unterseekabel", "Undersea Cables"), text: t("Kontinente sind über Kabel am Meeresboden verbunden. Satelliten sind wichtig, aber die meisten Daten laufen wirklich durchs Meer.", "Continents are connected by cables on the ocean floor. Satellites matter, but most data really does travel through the sea.") },
              { label: t("Verschlüsselung", "Encryption"), text: t("HTTPS verschlüsselt deine Daten. Unterwegs sieht jemand dann nicht deinen Text, sondern nur scheinbares Durcheinander.", "HTTPS encrypts your data. Along the way, anyone who intercepts it sees only scrambled gibberish instead of your text.") },
              { label: t("Kühlung", "Cooling"), text: t("Server erzeugen viel Wärme. Ohne Kühlung würden sie langsamer werden oder kaputtgehen.", "Servers produce a lot of heat. Without cooling they would slow down or break.") },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">1,4 Mio km</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Tiefseekabel – 35 Erdumrundungen.", "Undersea cables — 35 trips around Earth.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">99 %</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("aller Daten fließen durchs Meer, nicht durch Satelliten.", "of all data flows through the ocean, not satellites.")}</p>
            </div>
          </div>
          <BigStat value="über 150 TB/s" caption={t("So viele Daten fließen jede Sekunde durchs Internet. Mehr als ein Gehirn aufnehmen kann.", "That's how much data flows through the internet every second. More than any brain can take in.")} />
        </Chapter>
      ) : (
        <LockedGate level={level} required={3} hint={t("Schließ Level 3, um Datenzentren zu entdecken.", "Finish Level 3 to discover data centers.")} />
      )}

      <QuizLauncher topic={TOPIC} pools={QUIZ} />
    </TopicShell>
  );
}
