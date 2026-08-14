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
import stromnetzImg from "@/assets/topic-stromnetz.jpg";
import { useT } from "@/lib/i18n";

const TOPIC = "strom";

// Real photos
const BULB_ON =
  "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=1200&q=80";
const BULB_OFF =
  "https://images.unsplash.com/photo-1565636192335-c52d99c39e93?auto=format&fit=crop&w=1200&q=80";
const PLASMA =
  "https://images.unsplash.com/photo-1610337673044-720471f83677?auto=format&fit=crop&w=1200&q=80";
const LIGHTNING =
  "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80";
const CHIP =
  "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=1200&q=80";
const BATTERY =
  "https://images.unsplash.com/photo-1606293459286-c9e7d75f3a3a?auto=format&fit=crop&w=1200&q=80";

/* ---------- Ch 1: The switch — interactive bulb ---------- */

function TheSwitch() {
  const t = useT();
  const [on, setOn] = useState(false);
  return (
    <div className="overflow-hidden rounded-3xl bg-[#10101e]">
      <div className="relative aspect-[4/3] w-full">
        <img
          src={on ? BULB_ON : BULB_OFF}
          alt={t("Glühbirne", "Light bulb")}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
          style={{ filter: on ? "brightness(1.15)" : "brightness(0.4)" }}
          draggable={false}
        />
        {on && (
          <div className="pointer-events-none absolute inset-0 animate-[fade-in_0.5s] bg-amber-300/15 mix-blend-screen" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
            {on ? t("Strom fließt", "Current is flowing") : t("Kein Strom", "No current")}
          </p>
          <p className="mt-1 font-display text-base font-black leading-snug text-white">
            {on
              ? t("Im dünnen Draht da drin werden gerade Milliarden Elektronen geschoben.", "Right now, billions of electrons are being pushed through that thin wire.")
              : t("Drück den Schalter.", "Press the switch.")}
          </p>
        </div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-full py-4 font-display text-base font-black uppercase tracking-wide transition-colors ${
          on ? "bg-amber-300 text-[#0D0D1A]" : "bg-[#1a1a2e] text-white"
        }`}
      >
        {t("Schalter", "Switch")} {on ? t("AUS", "OFF") : t("EIN", "ON")}
      </button>
    </div>
  );
}

/* ---------- Ch 2: Stromkreis – series vs parallel ---------- */

function CircuitTypes() {
  const t = useT();
  const [mode, setMode] = useState<"reihe" | "parallel">("reihe");
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("reihe")}
          className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all ${mode === "reihe" ? "bg-amber-300 text-[#0D0D1A]" : "bg-white/5 text-white"}`}
        >
          {t("Reihenschaltung", "Series circuit")}
        </button>
        <button
          onClick={() => setMode("parallel")}
          className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all ${mode === "parallel" ? "bg-amber-300 text-[#0D0D1A]" : "bg-white/5 text-white"}`}
        >
          {t("Parallelschaltung", "Parallel circuit")}
        </button>
      </div>
      <svg viewBox="0 0 320 160" className="w-full">
        {mode === "reihe" ? (
          <>
            <rect x="20" y="120" width="40" height="24" rx="4" fill="#F59E0B" />
            <text x="40" y="138" textAnchor="middle" fontSize="14">🔋</text>
            <path d="M60 132 L290 132 L290 40 L20 40 L20 120" stroke="#F59E0B" strokeWidth="3" fill="none" className="flow-line" />
            {[100, 170, 240].map((x) => (
              <g key={x}>
                <circle cx={x} cy={40} r="14" fill="#FBBF24" style={{ filter: "drop-shadow(0 0 8px #FBBF24)" }} />
                <text x={x} y={46} textAnchor="middle" fontSize="14">💡</text>
              </g>
            ))}
            <text x="160" y="158" textAnchor="middle" fontSize="9" fill="#94a3b8">{t("Alle in einer Reihe – jede Lampe leuchtet nur schwach.", "All in a row – each lamp glows only dimly.")}</text>
          </>
        ) : (
          <>
            <rect x="20" y="120" width="40" height="24" rx="4" fill="#F59E0B" />
            <text x="40" y="138" textAnchor="middle" fontSize="14">🔋</text>
            <path d="M60 132 L290 132 L290 40 L20 40 L20 120" stroke="#F59E0B" strokeWidth="3" fill="none" className="flow-line" />
            {[100, 170, 240].map((x) => (
              <g key={x}>
                <path d={`M${x} 40 L${x} 132`} stroke="#F59E0B" strokeWidth="3" fill="none" className="flow-line" />
                <circle cx={x} cy={80} r="14" fill="#FBBF24" style={{ filter: "drop-shadow(0 0 12px #FBBF24)" }} />
                <text x={x} y={86} textAnchor="middle" fontSize="14">💡</text>
              </g>
            ))}
            <text x="160" y="158" textAnchor="middle" fontSize="9" fill="#94a3b8">{t("Jede Lampe hat ihren eigenen Draht – alle leuchten voll.", "Each lamp has its own wire – all glow at full brightness.")}</text>
          </>
        )}
      </svg>
      <p className="mt-3 text-xs text-slate-300">
        {mode === "reihe"
          ? t("Wenn EINE Lampe kaputt geht, gehen alle aus. Wie alte Lichterketten.", "If ONE lamp breaks, they all go out. Like old string lights.")
          : t("Wenn eine Lampe kaputt geht, leuchten die anderen weiter. So ist Strom zu Hause verkabelt.", "If one lamp breaks, the others keep glowing. That's how electricity is wired at home.")}
      </p>
    </div>
  );
}

/* ---------- Ch 4: Electronics components ---------- */

/* ---------- Stromnetz scene ---------- */

function StromnetzScene() {
  const t = useT();
  const steps = [
    { num: 1, title: t("Kraftwerk", "Power plant"), text: t("Wasser wird zu Dampf, der Dampf dreht einen Generator – fertig ist Strom.", "Water turns into steam, the steam spins a generator – and that makes electricity.") },
    { num: 2, title: t("Pylone", "Pylons"), text: t("Hohe Masten tragen die Leitungen mit 400 000 Volt. So bleibt unterwegs wenig Strom hängen.", "Tall masts carry the cables at 400,000 volts. This way very little energy is lost along the way.") },
    { num: 3, title: t("Umspannwerk", "Substation"), text: t("Hier wird der Strom heruntergerechnet auf 230 Volt – sicher genug für deine Steckdose.", "Here the electricity is stepped down to 230 volts – safe enough for your plug socket.") },
    { num: 4, title: t("Dein Haus", "Your house"), text: t("Vom Kraftwerk bis zur Steckdose: weniger als eine Sekunde.", "From the power plant to your socket: less than one second.") },
  ];
  return (
    <div className="overflow-hidden rounded-3xl bg-[#10101e]">
      <img
        src={stromnetzImg}
        alt={t("Stromnetz vom Kraftwerk bis zum Haus", "Power grid from plant to house")}
        loading="lazy"
        className="aspect-[3/2] w-full object-cover"
      />
      <ol className="space-y-2 p-4">
        {steps.map((s) => (
          <li key={s.num} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-display text-xs font-black text-[#0D0D1A]">
              {s.num}
            </span>
            <div>
              <p className="font-display text-sm font-black text-white">{s.title}</p>
              <p className="text-xs text-slate-300">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Main experience ---------- */

export function StromExperience() {
  const t = useT();
  const level = useTopicLevel(TOPIC);

  /* ---------- Module-scope arrays moved inside ---------- */

  const ELECTRONICS_CARDS = [
    {
      emoji: "➡️",
      title: t("Widerstand", "Resistor"),
      body: t("Bremst den Strom. Wie ein Verkehrsschild für Elektronen. Macht z. B. den Fernseher leiser.", "Slows down the current. Like a road sign for electrons. For example, it controls the TV volume."),
    },
    {
      emoji: "🥪",
      title: t("Kondensator", "Capacitor"),
      body: t("Speichert Strom für eine kurze Zeit – wie ein Mini-Stausee. Hilft beim Blitzen der Kamera.", "Stores electricity for a short time – like a mini reservoir. It helps the camera flash."),
    },
    {
      emoji: "↪️",
      title: t("Diode", "Diode"),
      body: t("Eine Einbahnstraße. Strom darf nur in eine Richtung. Wandelt z. B. Wechselstrom in Gleichstrom.", "A one-way street. Current can only flow in one direction. It converts AC to DC."),
    },
    {
      emoji: "🔁",
      title: t("Transistor", "Transistor"),
      body: t("Schaltet Strom ein und aus – Milliarden Mal pro Sekunde. Ein Computer-Chip hat 1 Milliarde davon.", "Switches current on and off – billions of times per second. A computer chip has 1 billion of them."),
    },
  ];

  const QUIZ: QuizLevel[] = [
    {
      title: t("Level 1 · Strom-Basics", "Level 1 · Electricity Basics"),
      reward: t("Schaltet frei: Reihen- und Parallelschaltungen.", "Unlocks: Series and parallel circuits."),
      questions: [
        { q: t("Wer fließt durch ein Kabel?", "What flows through a cable?"), options: [t("Wasser", "Water"), t("Elektronen", "Electrons"), t("Luft", "Air")], answer: 1, explain: t("Winzige Teilchen namens Elektronen.", "Tiny particles called electrons.") },
        { q: t("Was macht ein Schalter?", "What does a switch do?"), options: [t("Erhitzt den Strom", "Heats the current"), t("Öffnet oder schließt den Kreis", "Opens or closes the circuit"), t("Macht Licht heller", "Makes light brighter")], answer: 1, explain: t("Geschlossen = Strom fließt. Offen = Stopp.", "Closed = current flows. Open = stop.") },
        { q: t("Wie schnell verteilt sich Elektrizität?", "How fast does electricity travel?"), options: [t("100 km/h", "100 km/h"), t("Schallgeschwindigkeit", "Speed of sound"), t("Fast Lichtgeschwindigkeit", "Nearly the speed of light")], answer: 2, explain: t("Etwa 322 000 000 km/h in der Luft.", "About 322,000,000 km/h through a wire.") },
        { q: t("Was sammelt sich, wenn du den Pulli ausziehst?", "What builds up when you take off your jumper?"), options: [t("Wasser", "Water"), t("Statische Elektrizität", "Static electricity"), t("Rost", "Rust")], answer: 1, explain: t("Genau dieses Knistern!", "That's exactly that crackling feeling!") },
        { q: t("Welches Bauteil speichert Energie chemisch?", "Which part stores energy chemically?"), options: [t("Lampe", "Lamp"), t("Batterie", "Battery"), t("Schalter", "Switch")], answer: 1, explain: t("Batterien wandeln Chemie in Strom.", "Batteries convert chemical energy into electricity.") },
      ],
    },
    {
      title: t("Level 2 · Schaltkreise", "Level 2 · Circuits"),
      reward: t("Schaltet frei: Das Stromnetz vom Kraftwerk bis zum Haus.", "Unlocks: The power grid from plant to house."),
      questions: [
        { q: t("Was passiert in einer Reihenschaltung, wenn eine Lampe kaputt geht?", "What happens in a series circuit if one lamp breaks?"), options: [t("Alle gehen aus", "They all go out"), t("Nur diese eine", "Only that one"), t("Sie werden heller", "They get brighter")], answer: 0, explain: t("Der Kreis ist unterbrochen.", "The circuit is broken.") },
        { q: t("Wie sind Lampen zu Hause verkabelt?", "How are lamps wired at home?"), options: [t("Reihe", "Series"), t("Parallel", "Parallel"), t("Diagonal", "Diagonal")], answer: 1, explain: t("Jede Lampe hat ihren eigenen Weg zum Strom.", "Each lamp has its own path to the electricity.") },
        { q: t("Was muss geschlossen sein, damit Strom fließt?", "What must be closed for current to flow?"), options: [t("Tür", "Door"), t("Stromkreis", "Circuit"), t("Fenster", "Window")], answer: 1, explain: t("Ohne geschlossenen Kreis fließt nichts.", "Without a closed circuit, nothing flows.") },
        { q: t("Welche Pole hat eine Batterie?", "What poles does a battery have?"), options: [t("Heiß und kalt", "Hot and cold"), t("Plus und Minus", "Plus and minus"), t("Rot und blau", "Red and blue")], answer: 1, explain: t("+ und – am Ende.", "+ and – at the ends.") },
        { q: t("Was sind die zwei Hauptarten von Schaltungen?", "What are the two main types of circuits?"), options: [t("Heiß / Kalt", "Hot / Cold"), t("Reihe / Parallel", "Series / Parallel"), t("Groß / Klein", "Big / Small")], answer: 1, explain: t("Reihen- und Parallelschaltung.", "Series and parallel circuits.") },
      ],
    },
    {
      title: t("Level 3 · Stromnetz", "Level 3 · Power Grid"),
      reward: t("Schaltet frei: Elektronik – Widerstand, Diode, Transistor.", "Unlocks: Electronics – resistor, diode, transistor."),
      questions: [
        { q: t("Wo wird Strom erzeugt?", "Where is electricity generated?"), options: [t("Im Umspannwerk", "At the substation"), t("Im Kraftwerk", "At the power plant"), t("Im Haus", "At home")], answer: 1, explain: t("Generatoren drehen sich und erzeugen Strom.", "Generators spin and produce electricity.") },
        { q: t("Wozu sind hohe Pylonen-Spannungen gut?", "Why are high pylon voltages useful?"), options: [t("Schöner", "Looks nicer"), t("Weniger Verlust unterwegs", "Less energy lost along the way"), t("Wärmer", "Warmer")], answer: 1, explain: t("Hohe Spannung = wenig Energieverlust.", "High voltage = little energy loss.") },
        { q: t("Wie viel Volt kommen aus der Steckdose?", "How many volts come from a wall socket?"), options: ["12 V", "230 V", "10 000 V"], answer: 1, explain: t("In Deutschland: 230 Volt.", "In Germany: 230 volts.") },
        { q: t("Was macht ein Umspannwerk?", "What does a substation do?"), options: [t("Erzeugt Strom", "Generates electricity"), t("Senkt die Spannung", "Lowers the voltage"), t("Speichert Strom", "Stores electricity")], answer: 1, explain: t("Es wandelt hohe Spannung in niedrigere um.", "It converts high voltage into lower voltage.") },
        { q: t("Welche grüne Energiequelle ist global am größten?", "Which green energy source is the biggest globally?"), options: [t("Wind", "Wind"), t("Wasserkraft", "Hydropower"), t("Sonne", "Solar")], answer: 1, explain: t("Wasserkraftwerke liefern am meisten erneuerbare Energie.", "Hydropower plants supply the most renewable energy.") },
      ],
    },
    {
      title: t("Level 4 · Elektronik-Meister", "Level 4 · Electronics Master"),
      reward: t("Alles freigeschaltet.", "Everything unlocked."),
      questions: [
        { q: t("Was tut ein Widerstand?", "What does a resistor do?"), options: [t("Beschleunigt Strom", "Speeds up current"), t("Bremst Strom", "Slows down current"), t("Speichert Strom", "Stores current")], answer: 1, explain: t("Er reduziert die Stromstärke.", "It reduces the amount of current.") },
        { q: t("Welches Bauteil lässt Strom nur in eine Richtung?", "Which component lets current flow in only one direction?"), options: [t("Diode", "Diode"), t("Transistor", "Transistor"), t("Kondensator", "Capacitor")], answer: 0, explain: t("Eine elektronische Einbahnstraße.", "An electronic one-way street.") },
        { q: t("Wie viele Transistoren hat ein moderner Computer-Chip?", "How many transistors does a modern computer chip have?"), options: ["1 000", t("1 Million", "1 million"), t("Über 1 Milliarde", "Over 1 billion")], answer: 2, explain: t("Milliarden winzige Schalter.", "Billions of tiny switches.") },
        { q: t("Was speichert ein Kondensator?", "What does a capacitor store?"), options: [t("Wärme", "Heat"), t("Ladung", "Charge"), t("Daten", "Data")], answer: 1, explain: t("Elektrische Ladung – kurz und schnell.", "Electric charge – briefly and quickly.") },
        { q: t("Was ist Moores Gesetz?", "What is Moore's Law?"), options: [t("Chips werden teurer", "Chips get more expensive"), t("Transistorzahl verdoppelt sich alle 2 Jahre", "Transistor count doubles every 2 years"), t("Strom wird langsamer", "Electricity gets slower")], answer: 1, explain: t("Seit 1971 verdoppelt sich die Anzahl ungefähr alle 2 Jahre.", "Since 1971 the number roughly doubles every 2 years.") },
      ],
    },
  ];

  return (
    <TopicShell eyebrow={t("Strom & Schaltkreise", "Electricity & Circuits")} title={t("Drück den Schalter. Schau was passiert.", "Press the switch. See what happens.")}>
      <Chapter
        num={1}
        title={t("Was ist Elektrizität?", "What is electricity?")}
        intro={t("Strom besteht aus winzigen Teilchen – Elektronen. Sie sind so klein, dass du sie nie sehen wirst. Aber ohne sie läuft nichts.", "Electricity is made of tiny particles called electrons. They are so small you will never see them. But without them, nothing works.")}
      >
        <TheSwitch />
        <div className="grid grid-cols-2 gap-3">
          <ImageCard src={BATTERY} alt={t("Batterie", "Battery")} caption={t("Im Inneren: Chemie, die Elektronen schiebt.", "Inside: chemistry that pushes electrons.")} aspect="aspect-square" />
          <ImageCard src={PLASMA} alt={t("Plasmakugel", "Plasma ball")} caption={t("Eine Plasmakugel zeigt Strom als wilde Blitze.", "A plasma ball shows electricity as wild lightning bolts.")} aspect="aspect-square" />
        </div>
        <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Was leitet Strom – und was nicht?", "What conducts electricity – and what doesn't?")}</p>
        <TapCardGrid
          cards={[
            { emoji: "🥄", title: t("Metall", "Metal"), body: t("Kupfer, Eisen, Gold – Elektronen können sich frei bewegen. Leiten gut.", "Copper, iron, gold – electrons can move freely. They conduct well.") },
            { emoji: "💧", title: t("Wasser", "Water"), body: t("Reines Wasser nicht – aber Leitungswasser schon. Darum: Hände weg von Steckdosen!", "Pure water doesn't – but tap water does. So: keep your hands away from sockets!") },
            { emoji: "🪵", title: t("Holz & Plastik", "Wood & Plastic"), body: t("Halten Elektronen fest. Sie sind Isolatoren – sichere Hülle um Kabel.", "They hold electrons in place. They are insulators – the safe covering around cables.") },
            { emoji: "🧊", title: t("Luft", "Air"), body: t("Normalerweise Isolator. Aber bei Millionen Volt – Blitz! – wird sie zum Leiter.", "Normally an insulator. But at millions of volts – lightning! – it becomes a conductor.") },
          ]}
        />
        <ImageCard src={LIGHTNING} alt={t("Blitz", "Lightning")} caption={t("Ein Blitz ist Strom in der größten Form, die du je siehst.", "A lightning bolt is electricity in the biggest form you will ever see.")} />
        <AtlasNotes
          title={t("Elektrizität ist Bewegung", "Electricity is movement")}
          intro={t("Strom ist nicht einfach »gelbes Licht«. Er ist eine Kette von winzigen Ladungen, die sich durch Material bewegen. Wenn Kinder das verstehen, ergibt später jeder Schaltkreis Sinn.", "Electricity is not just 'yellow light'. It is a chain of tiny charges moving through a material. When children understand this, every circuit makes sense later on.")}
          points={[
            { label: t("Elektronen", "Electrons"), text: t("Elektronen sind winzige Teilchen außen am Atom. In Metallen können sie von Atom zu Atom hüpfen. Dieses gemeinsame Schieben nennen wir elektrischen Strom.", "Electrons are tiny particles on the outside of an atom. In metals they can jump from atom to atom. This pushing together is what we call electric current.") },
            { label: t("Spannung", "Voltage"), text: t("Spannung ist der Druck, der Elektronen anschiebt. Eine AA-Batterie hat 1,5 Volt, eine deutsche Steckdose 230 Volt. Mehr Spannung heißt: stärkerer elektrischer Druck.", "Voltage is the pressure that pushes electrons. An AA battery has 1.5 volts, a German wall socket has 230 volts. More voltage means stronger electrical pressure.") },
            { label: t("Stromstärke", "Current"), text: t("Stromstärke sagt, wie viele Elektronen pro Sekunde vorbeikommen. Das ist wie bei Wasser: ein dünner Bach und ein breiter Fluss können beide fließen, aber der Fluss transportiert viel mehr.", "Current tells us how many electrons pass per second. It is like water: a thin stream and a wide river can both flow, but the river carries much more.") },
            { label: t("Widerstand", "Resistance"), text: t("Manche Materialien bremsen Elektronen. Darum wird ein Toasterdraht heiß: Der Strom muss sich durch einen engen, bremsenden Weg quetschen.", "Some materials slow electrons down. That is why a toaster wire gets hot: the current has to squeeze through a tight, braking path.") },
            { label: t("Gefahr", "Danger"), text: t("Unser Körper leitet Strom, weil er Wasser und Salze enthält. Deshalb ist Strom aus der Steckdose kein Spielzeug. Experimente nur mit Batterien.", "Our body conducts electricity because it contains water and salts. That is why mains electricity is not a toy. Only experiment with batteries.") },
          ]}
        />
        <MiniFactTable
          rows={[
            { term: t("Teilchen", "Particle"), value: t("Elektron", "Electron"), note: t("Trägt negative Ladung und bewegt sich in Leitern wie Kupfer.", "Carries a negative charge and moves through conductors like copper.") },
            { term: t("Druck", "Pressure"), value: t("Volt", "Volt"), note: t("Je höher die Spannung, desto stärker werden die Ladungen angeschoben.", "The higher the voltage, the harder the charges are pushed.") },
            { term: t("Menge", "Amount"), value: t("Ampere", "Ampere"), note: t("Misst, wie viel Ladung pro Sekunde durch ein Kabel fließt.", "Measures how much charge flows through a cable per second.") },
            { term: t("Bremse", "Brake"), value: t("Ohm", "Ohm"), note: t("Großer Widerstand bedeutet: weniger Strom kommt hindurch.", "High resistance means less current gets through.") },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">322 Mio.</p>
            <p className="mt-1 text-[11px] text-slate-300">{t("km/h – fast Lichtgeschwindigkeit.", "km/h – nearly the speed of light.")}</p>
          </div>
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">100 Mio.</p>
            <p className="mt-1 text-[11px] text-slate-300">{t("Volt hat ein einziger Blitz.", "volts in a single lightning bolt.")}</p>
          </div>
        </div>
      </Chapter>

      {level >= 1 ? (
        <Chapter
          num={2}
          title={t("Der Stromkreis", "The Circuit")}
          intro={t("Strom fließt nur im Kreis. Unterbrich den Kreis – Strom stoppt. Schließ ihn wieder – Strom fließt sofort.", "Current only flows in a loop. Break the loop – current stops. Close it again – current flows instantly.")}
        >
          <CircuitTypes />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Die 3 Hauptdarsteller", "The 3 main players")}</p>
          <TapCardGrid
            cards={[
              { emoji: "🔋", title: t("Spannungs­quelle", "Power source"), body: t("Batterie oder Steckdose – sie drückt die Elektronen los.", "Battery or socket – it pushes the electrons off.") },
              { emoji: "💡", title: t("Verbraucher", "Consumer"), body: t("Lampe, Motor, Lautsprecher – verwandelt Strom in Licht, Bewegung, Klang.", "Lamp, motor, speaker – converts electricity into light, movement, or sound.") },
              { emoji: "🔘", title: t("Schalter", "Switch"), body: t("Macht den Kreis auf oder zu. Wie eine Brücke, die du heben kannst.", "Opens or closes the circuit. Like a bridge you can raise.") },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">Volt (V)</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Wie stark drückt die Quelle? 1,5 V Batterie, 230 V Steckdose.", "How hard does the source push? 1.5 V battery, 230 V socket.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">Ampere (A)</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Wie viele Elektronen fließen? Wie Wasser durch ein Rohr.", "How many electrons flow? Like water through a pipe.")}</p>
            </div>
          </div>
          <BigStat value="0,05 mm" caption={t("So lang ist die kleinste Batterie der Welt.", "That's how long the world's smallest battery is.")} />
          <AtlasNotes
            title={t("So baust du Denken wie ein Elektroingenieur auf", "How to think like an electrical engineer")}
            intro={t("Ein Stromkreis hat immer dieselbe Logik: Quelle, Weg, Verbraucher und Rückweg. Fehlt ein Teil, passiert nichts.", "A circuit always has the same logic: source, path, consumer, and return path. If one part is missing, nothing happens.")}
            points={[
              { label: t("1. Quelle", "1. Source"), text: t("Die Batterie hat einen Pluspol und einen Minuspol. In ihr steckt chemische Energie, die Elektronen anschiebt.", "The battery has a plus pole and a minus pole. Inside is chemical energy that pushes electrons.") },
              { label: t("2. Leiter", "2. Conductor"), text: t("Kupferdraht ist die Straße. Kunststoff außen herum ist der Zaun, damit der Strom nicht an falsche Stellen kommt.", "Copper wire is the road. The plastic around it is the fence, so current doesn't go to the wrong places.") },
              { label: t("3. Verbraucher", "3. Consumer"), text: t("Eine Lampe, ein Motor oder ein Lautsprecher nimmt elektrische Energie und verwandelt sie: in Licht, Bewegung, Wärme oder Ton.", "A lamp, motor, or speaker takes electrical energy and transforms it: into light, movement, heat, or sound.") },
              { label: t("4. Rückweg", "4. Return path"), text: t("Der Strom muss zurück zur Batterie. Darum sagt man Kreis: Es ist kein einzelner Weg, sondern eine geschlossene Runde.", "The current must return to the battery. That's why we say circuit: it's not a single path but a closed loop.") },
              { label: t("5. Fehler suchen", "5. Troubleshoot"), text: t("Wenn nichts leuchtet, frag wie ein Forscher: Ist die Batterie voll? Ist der Kreis geschlossen? Berühren die Kabel Metall? Ist die Lampe kaputt?", "If nothing lights up, ask like a scientist: Is the battery full? Is the circuit closed? Are the wires touching metal? Is the lamp broken?") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: t("Reihe", "Series"), value: t("ein Weg", "one path"), note: t("Alle Lampen teilen sich denselben Stromweg. Wird eine entfernt, ist der Kreis offen.", "All lamps share the same current path. Remove one and the circuit is open.") },
              { term: t("Parallel", "Parallel"), value: t("mehr Wege", "more paths"), note: t("Jede Lampe hat ihren eigenen Weg. Darum funktionieren andere Lampen weiter.", "Each lamp has its own path. So the other lamps keep working.") },
              { term: t("Kurzschluss", "Short circuit"), value: t("zu leicht", "too easy"), note: t("Strom findet einen Weg fast ohne Verbraucher. Dann kann es heiß und gefährlich werden.", "Current finds a path with almost no consumer. Then things can get hot and dangerous.") },
              { term: t("Sicherung", "Fuse"), value: t("Schutz", "Protection"), note: t("Sie unterbricht den Kreis, bevor Kabel zu heiß werden.", "It breaks the circuit before cables get too hot.") },
            ]}
          />
        </Chapter>
      ) : (
        <LockedGate level={level} required={1} hint={t("Schließ Level 1, um zu sehen, wie Reihen- und Parallelschaltungen funktionieren.", "Complete Level 1 to see how series and parallel circuits work.")} />
      )}

      {level >= 2 ? (
        <Chapter
          num={3}
          title={t("Vom Kraftwerk zu dir", "From the power plant to you")}
          intro={t("Jede Lampe, jedes Handy: der Strom kommt von weit weg. Manchmal von hunderten Kilometern.", "Every lamp, every phone: the electricity comes from far away. Sometimes hundreds of kilometres.")}
        >
          <StromnetzScene />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Woher kommt der Strom?", "Where does electricity come from?")}</p>
          <TapCardGrid
            cards={[
              { emoji: "💨", title: t("Wind", "Wind"), body: t("Windräder drehen sich – die Bewegung erzeugt Strom. Sauber und endlos.", "Wind turbines spin – the movement generates electricity. Clean and endless.") },
              { emoji: "☀️", title: t("Sonne", "Sun"), body: t("Solarzellen verwandeln Licht direkt in Strom. Kein Lärm, kein Rauch.", "Solar cells convert light directly into electricity. No noise, no smoke.") },
              { emoji: "💧", title: t("Wasser", "Water"), body: t("Wasser fällt durch Turbinen – größte saubere Stromquelle der Welt.", "Water falls through turbines – the world's biggest clean energy source.") },
              { emoji: "🔥", title: t("Kohle & Gas", "Coal & Gas"), body: t("Verbrennen, heizen Wasser zu Dampf – treibt Generator. Aber: schlecht fürs Klima.", "Burning heats water into steam – drives the generator. But: bad for the climate.") },
              { emoji: "☢️", title: t("Atom", "Nuclear"), body: t("Uran-Kerne werden gespalten – riesige Hitze. Kaum CO₂, aber gefährlicher Abfall.", "Uranium atoms are split – huge heat. Barely any CO₂, but dangerous waste.") },
              { emoji: "🌍", title: t("Erdwärme", "Geothermal"), body: t("Tief in der Erde ist es heiß – heißes Wasser hoch, Dampf, Strom.", "Deep underground it's hot – hot water rises, makes steam, makes electricity.") },
            ]}
          />
          <BigStat value="10 Billionen" caption={t("Toaster könntest du eine Stunde mit dem Strom betreiben, den die Welt in einem Jahr verbraucht.", "toasters you could run for one hour with the electricity the world uses in a year.")} />
          <AtlasNotes
            title={t("Die Reise vom Kraftwerk zur Steckdose", "The journey from power plant to socket")}
            intro={t("Strom wird nicht einfach »in die Steckdose gegossen«. Er wird erzeugt, sehr weit transportiert und kurz vor deinem Haus sicher gemacht.", "Electricity is not simply 'poured into the socket'. It is generated, transported very far, and made safe just before reaching your home.")}
            points={[
              { label: t("Generator", "Generator"), text: t("Fast jedes große Kraftwerk dreht einen Generator. Wind dreht ihn direkt, Wasser dreht Turbinen, Dampf aus Wärme dreht ebenfalls Turbinen.", "Almost every big power plant spins a generator. Wind spins it directly, water spins turbines, steam from heat also spins turbines.") },
              { label: t("Warum Hochspannung?", "Why high voltage?"), text: t("Über lange Strecken nutzt man sehr hohe Spannung. So geht weniger Energie als Wärme in den Leitungen verloren.", "Over long distances very high voltage is used. This way less energy is lost as heat in the cables.") },
              { label: t("Umspannwerk", "Substation"), text: t("Transformatoren verändern die Spannung: zuerst hoch für die Reise, später runter für Städte, Straßen und Wohnungen.", "Transformers change the voltage: first high for the journey, then lower for cities, streets, and homes.") },
              { label: t("Wechselstrom", "Alternating current"), text: t("Aus der Steckdose kommt Wechselstrom. Er wechselt seine Richtung 50-mal pro Sekunde. Das macht Umspannen besonders leicht.", "Wall sockets supply alternating current. It changes direction 50 times per second. This makes stepping voltage up or down especially easy.") },
              { label: t("Strommix", "Energy mix"), text: t("In einem Land kommen viele Quellen zusammen: Wind, Sonne, Wasser, Kohle, Gas, Atom oder Speicher. Das Netz hält alles im Gleichgewicht.", "In a country many sources come together: wind, sun, water, coal, gas, nuclear, or storage. The grid keeps everything in balance.") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: t("Haus", "House"), value: "230 V", note: t("Normale Steckdose in Deutschland. Für Menschen gefährlich.", "Normal socket in Germany. Dangerous for people.") },
              { term: t("Fernleitung", "Long-distance line"), value: t("bis 400 kV", "up to 400 kV"), note: t("Sehr hohe Spannung für den Transport über viele Kilometer.", "Very high voltage for transport over many kilometres.") },
              { term: t("Frequenz", "Frequency"), value: "50 Hz", note: t("Der Wechselstrom ändert 50-mal pro Sekunde seine Richtung.", "The alternating current changes direction 50 times per second.") },
              { term: t("Speicher", "Storage"), value: t("Akku/Pumpe", "Battery/Pump"), note: t("Speicher helfen, wenn Sonne oder Wind gerade fehlen.", "Storage helps when sun or wind is not available.") },
            ]}
          />
        </Chapter>
      ) : (
        <LockedGate level={level} required={2} hint={t("Schließ Level 2, um das Stromnetz zu sehen.", "Complete Level 2 to see the power grid.")} />
      )}

      {level >= 3 ? (
        <Chapter
          num={4}
          title={t("Elektronik", "Electronics")}
          intro={t("Wenn Strom genau gesteuert wird, entsteht etwas Magisches: Computer, Roboter, das Internet. Vier kleine Bauteile machen das möglich.", "When electricity is controlled precisely, something magical happens: computers, robots, the internet. Four tiny components make it possible.")}
        >
          <TapCardGrid cards={ELECTRONICS_CARDS} />
          <ImageCard src={CHIP} alt={t("Computerchip", "Computer chip")} caption={t("Auf so einem Chip sind über 1 Milliarde Transistoren.", "A chip like this has over 1 billion transistors.")} />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">{t("Wo Elektronik steckt", "Where electronics are found")}</p>
          <TapCardGrid
            cards={[
              { emoji: "📱", title: t("Smartphone", "Smartphone"), body: t("Ein Mini-Computer mit Kamera, Funk, GPS – Milliarden Transistoren in deiner Hand.", "A mini-computer with camera, radio, GPS – billions of transistors in your hand.") },
              { emoji: "🚗", title: t("Auto", "Car"), body: t("Modernes Auto hat 100+ kleine Computer – fürs Lenken, Bremsen, Musik.", "A modern car has 100+ small computers – for steering, braking, and music.") },
              { emoji: "🤖", title: t("Roboter", "Robot"), body: t("Sensoren spüren die Welt, Chips entscheiden, Motoren bewegen Arme.", "Sensors feel the world, chips decide, motors move the arms.") },
              { emoji: "⌚", title: t("Smartwatch", "Smartwatch"), body: t("Misst Puls, Schritte, GPS – auf der Fläche einer Briefmarke.", "Measures heart rate, steps, GPS – on the area of a postage stamp.") },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">1 Mrd.</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("Transistoren in einem Smartphone-Chip.", "transistors in a smartphone chip.")}</p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">5 nm</p>
              <p className="mt-1 text-[11px] text-slate-300">{t("groß ist ein Transistor heute – 10 000-mal dünner als ein Haar.", "is the size of a transistor today – 10,000 times thinner than a hair.")}</p>
            </div>
          </div>
          <AtlasNotes
            title={t("Aus Strom wird Denken", "From electricity comes thinking")}
            intro={t("Elektronik ist Strom mit Regeln. Winzige Bauteile entscheiden, ob Strom durch darf, gespeichert wird oder gebremst wird. So entstehen Computer.", "Electronics is electricity with rules. Tiny components decide whether current may pass, be stored, or be slowed. That's how computers are made.")}
            points={[
              { label: t("Widerstand", "Resistor"), text: t("Er schützt Bauteile. Ohne Widerstand könnte eine LED zu viel Strom bekommen und kaputtgehen.", "It protects components. Without a resistor an LED could get too much current and break.") },
              { label: t("Kondensator", "Capacitor"), text: t("Er lädt sich blitzschnell auf und gibt Energie wieder ab. In Kameras hilft er beim starken Blitz, in Geräten glättet er Strom.", "It charges up in a flash and releases energy again. In cameras it powers the strong flash; in devices it smooths the current.") },
              { label: t("Diode", "Diode"), text: t("Sie lässt Strom nur in eine Richtung. Eine LED ist eine besondere Diode, die dabei Licht abgibt.", "It lets current flow in only one direction. An LED is a special diode that gives off light.") },
              { label: t("Transistor", "Transistor"), text: t("Er ist ein winziger Schalter. Milliarden Transistoren zusammen rechnen, speichern Fotos und starten Spiele.", "It is a tiny switch. Billions of transistors together calculate, store photos, and launch games.") },
              { label: t("Sensor", "Sensor"), text: t("Sensoren verwandeln die Welt in elektrische Signale: Licht, Wärme, Druck, Bewegung oder Ton.", "Sensors convert the world into electrical signals: light, heat, pressure, movement, or sound.") },
              { label: t("Roboter", "Robot"), text: t("Ein Roboter braucht Sensoren zum Spüren, Chips zum Entscheiden und Motoren zum Bewegen. Alles wird von Strom verbunden.", "A robot needs sensors to feel, chips to decide, and motors to move. Electricity connects everything.") },
            ]}
          />
          <MiniFactTable
            rows={[
              { term: "LED", value: t("Licht", "Light"), note: t("Eine Diode, die leuchtet und wenig Energie verbraucht.", "A diode that glows and uses very little energy.") },
              { term: t("Motor", "Motor"), value: t("Bewegung", "Movement"), note: t("Magnete und Strom drehen eine Achse – so fährt ein Spielzeugauto.", "Magnets and current spin an axle – that's how a toy car drives.") },
              { term: t("Chip", "Chip"), value: t("Logik", "Logic"), note: t("Viele Transistoren beantworten Ja/Nein-Fragen in unfassbarer Geschwindigkeit.", "Many transistors answer yes/no questions at incredible speed.") },
              { term: t("Sensor", "Sensor"), value: t("Messung", "Measurement"), note: t("Macht aus Temperatur, Licht oder Bewegung eine Zahl für den Computer.", "Turns temperature, light, or movement into a number for the computer.") },
            ]}
          />
        </Chapter>
      ) : (
        <LockedGate level={level} required={3} hint={t("Schließ Level 3, um Elektronik-Bauteile zu entdecken.", "Complete Level 3 to discover electronics components.")} />
      )}


      <QuizLauncher topic={TOPIC} pools={QUIZ} />
    </TopicShell>
  );
}
