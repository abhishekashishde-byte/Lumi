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
import hurricaneImg from "@/assets/topic-hurricane.jpg";
import { useT } from "@/lib/i18n";

const TOPIC = "natur";

const SUN =
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1200&q=80";
const LEAF =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80";
const GRASS =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";
const RABBIT =
  "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&w=1200&q=80";
const FOX =
  "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80";
const EAGLE =
  "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1200&q=80";
const RAIN =
  "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80";
const OCEAN =
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80";

/* ---------- Ch 1: Photosynthesis ---------- */

function Photosynthesis() {
  const t = useT();
  const [on, setOn] = useState(false);
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Pflanzen essen Licht", "Plants eat light")}
      </p>
      <p className="mt-1 font-display text-base font-black text-white">
        {t("Tippe die Sonne. Schau, was im Blatt passiert.", "Tap the sun. See what happens inside the leaf.")}
      </p>
      <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-700 to-emerald-900">
        <button
          onClick={() => setOn(true)}
          className="absolute left-1/2 top-6 -translate-x-1/2 text-6xl transition-all active:scale-95"
          aria-label={t("Sonne", "Sun")}
        >
          ☀️
        </button>
        {on &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-20 h-1 w-1 -translate-x-1/2 animate-[fade-in_1s_ease-out] rounded-full bg-amber-300 shadow-[0_0_20px_rgba(252,211,77,0.9)]"
              style={{
                transform: `translate(-50%, ${80 + i * 40}px)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-8xl transition-all duration-700 ${on ? "drop-shadow-[0_0_30px_rgba(74,222,128,0.7)]" : "opacity-70"}`}
        >
          🌱
        </div>
        {on && (
          <div className="absolute right-3 top-3 animate-[fade-in_1s_ease-out] rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
            CO₂ + {t("Wasser", "Water")} + {t("Licht", "Light")} = {t("Zucker", "Sugar")} + O₂
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-300">
        {on
          ? t(
              "Die Pflanze nimmt Sonnenlicht, CO₂ aus der Luft und Wasser aus der Erde. Sie macht daraus Zucker (ihr Essen) und Sauerstoff (deine Luft).",
              "The plant takes sunlight, CO₂ from the air, and water from the soil. It turns these into sugar (its food) and oxygen (your air)."
            )
          : t(
              "Ohne Licht kann eine Pflanze nichts essen. Sie ist wie ein Solar-Panel mit Wurzeln.",
              "Without light a plant can't eat anything. It's like a solar panel with roots."
            )}
      </p>
    </div>
  );
}

/* ---------- Ch 2: Food chain ---------- */

function FoodChain() {
  const t = useT();
  const chain = [
    { emoji: "🌱", label: t("Gras", "Grass"), text: t("Macht Zucker aus Sonnenlicht.", "Makes sugar from sunlight."), img: GRASS },
    { emoji: "🐰", label: t("Hase", "Rabbit"), text: t("Frisst Gras.", "Eats grass."), img: RABBIT },
    { emoji: "🦊", label: t("Fuchs", "Fox"), text: t("Frisst Hasen.", "Eats rabbits."), img: FOX },
    { emoji: "🦅", label: t("Adler", "Eagle"), text: t("Frisst auch mal einen Fuchs.", "Sometimes eats a fox too."), img: EAGLE },
  ];
  const [step, setStep] = useState(0);
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Nahrungskette", "Food Chain")}
      </p>
      <p className="mt-1 font-display text-base font-black text-white">
        {t("Tippe weiter. Folg der Energie.", "Keep tapping. Follow the energy.")}
      </p>
      <div className="mt-4 flex justify-center gap-3 text-4xl">
        {chain.map((c, i) => (
          <span
            key={i}
            className={`transition-all ${i === step ? "scale-125" : i < step ? "opacity-50" : "opacity-25 grayscale"}`}
          >
            {c.emoji}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <ImageCard src={chain[step].img} alt={chain[step].label} aspect="aspect-[4/3]" />
        <div className="mt-3 text-center">
          <p className="font-display text-lg font-black text-white">{chain[step].label}</p>
          <p className="mt-1 text-sm text-slate-300">{chain[step].text}</p>
        </div>
      </div>
      <button
        onClick={() => setStep((s) => (s + 1) % chain.length)}
        className="mt-4 w-full rounded-full bg-amber-300 py-3 font-display text-sm font-black uppercase tracking-wide text-[#0D0D1A]"
      >
        {step === chain.length - 1
          ? t("Von vorn", "Start again")
          : t("Wer frisst das? →", "Who eats that? →")}
      </button>
    </div>
  );
}

/* ---------- Ch 3: Hurricane cutaway ---------- */

function HurricaneTour() {
  const t = useT();
  const parts = [
    {
      id: "eye",
      label: t("Das Auge", "The Eye"),
      text: t(
        "Hier ist es ruhig. Kein Wind, kaum Wolken. Manchmal sieht man sogar die Sonne.",
        "It's calm here. No wind, hardly any clouds. Sometimes you can even see the sun."
      ),
    },
    {
      id: "wall",
      label: t("Augenwall", "Eyewall"),
      text: t(
        "Direkt um das Auge: hier sind die Winde am schlimmsten. Bis 300 km/h.",
        "Right around the eye: this is where the winds are worst. Up to 300 km/h."
      ),
    },
    {
      id: "bands",
      label: t("Regenbänder", "Rain Bands"),
      text: t(
        "Spiralarme aus Gewittern. Sie schütten Wasser massenweise herunter.",
        "Spiral arms of thunderstorms. They dump huge amounts of water."
      ),
    },
    {
      id: "warm",
      label: t("Warme Luft", "Warm Air"),
      text: t(
        "Warmes Meer heizt feuchte Luft auf. Sie steigt – das treibt den Hurrikan.",
        "Warm ocean heats moist air. It rises – that's what powers the hurricane."
      ),
    },
  ];
  const [pick, setPick] = useState(0);
  const cur = parts[pick];
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <ImageCard src={hurricaneImg} alt={t("Hurricane Cutaway", "Hurricane Cutaway")} aspect="aspect-[3/2]" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {parts.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setPick(i)}
            className={`rounded-full py-2 text-xs font-bold transition-all ${pick === i ? "bg-amber-300 text-[#0D0D1A]" : "bg-white/5 text-white"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-display text-sm font-black text-white">{cur.label}</p>
      <p className="mt-1 text-sm text-slate-300">{cur.text}</p>
    </div>
  );
}

/* ---------- Ch 4: Water cycle ---------- */

function WaterCycle() {
  const t = useT();
  const stages = [
    {
      emoji: "☀️",
      title: t("Verdunstung", "Evaporation"),
      text: t(
        "Sonne erwärmt Meere und Seen. Wasser wird zu unsichtbarem Dampf.",
        "The sun warms oceans and lakes. Water turns into invisible vapour."
      ),
    },
    {
      emoji: "☁️",
      title: t("Kondensation", "Condensation"),
      text: t(
        "Hoch oben kühlt der Dampf ab und wird zu winzigen Tropfen – Wolken.",
        "High up the vapour cools and turns into tiny droplets – clouds."
      ),
    },
    {
      emoji: "🌧️",
      title: t("Niederschlag", "Precipitation"),
      text: t(
        "Wenn die Tropfen schwer genug sind, fallen sie als Regen, Schnee oder Hagel.",
        "When the droplets are heavy enough, they fall as rain, snow or hail."
      ),
    },
    {
      emoji: "🌊",
      title: t("Rückfluss", "Runoff"),
      text: t(
        "Flüsse tragen das Wasser zurück ins Meer. Und es geht von vorn los.",
        "Rivers carry the water back to the sea. And it all starts again."
      ),
    },
  ];
  const [i, setI] = useState(0);
  return (
    <div className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Der ewige Kreislauf", "The endless cycle")}
      </p>
      <div className="mt-3 flex justify-around text-4xl">
        {stages.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`transition-all ${idx === i ? "scale-125" : "opacity-40"}`}
          >
            {s.emoji}
          </button>
        ))}
      </div>
      <p className="mt-4 font-display text-base font-black text-white">{stages[i].title}</p>
      <p className="mt-1 text-sm text-slate-300">{stages[i].text}</p>
    </div>
  );
}

export function NaturExperience() {
  const t = useT();
  const level = useTopicLevel(TOPIC);

  const QUIZ: QuizLevel[] = [
    {
      title: t("Level 1 · Sonne & Pflanzen", "Level 1 · Sun & Plants"),
      reward: t("Schaltet frei: Die Nahrungskette.", "Unlocks: The Food Chain."),
      questions: [
        {
          q: t('Was brauchen Pflanzen zum „Essen"?', "What do plants need to make their food?"),
          options: [
            t("Erde und Steine", "Soil and stones"),
            t("Licht, CO₂ und Wasser", "Light, CO₂ and water"),
            t("Nur Wasser", "Only water"),
          ],
          answer: 1,
          explain: t("Das ist Photosynthese.", "That's photosynthesis."),
        },
        {
          q: t("Was geben Pflanzen ab, das wir atmen?", "What do plants give off that we breathe?"),
          options: [t("CO₂", "CO₂"), t("Sauerstoff (O₂)", "Oxygen (O₂)"), t("Stickstoff", "Nitrogen")],
          answer: 1,
          explain: t("Pflanzen produzieren unsere Luft.", "Plants make our air."),
        },
        {
          q: t("Woher kommt die Energie für (fast) alles Leben?", "Where does the energy for (almost) all life come from?"),
          options: [t("Vom Mond", "From the moon"), t("Von der Sonne", "From the sun"), t("Vom Wind", "From the wind")],
          answer: 1,
          explain: t("Sonne → Pflanze → Tier → du.", "Sun → plant → animal → you."),
        },
        {
          q: t("Was passiert ohne Sonne?", "What happens without the sun?"),
          options: [
            t("Nichts", "Nothing"),
            t("Pflanzen sterben, dann Tiere", "Plants die, then animals"),
            t("Wird wärmer", "Gets warmer"),
          ],
          answer: 1,
          explain: t("Ohne Sonne keine Pflanzen, ohne Pflanzen kein Leben.", "No sun means no plants, no plants means no life."),
        },
      ],
    },
    {
      title: t("Level 2 · Nahrungsketten", "Level 2 · Food Chains"),
      reward: t("Schaltet frei: Wetter und Hurrikane.", "Unlocks: Weather and Hurricanes."),
      questions: [
        {
          q: t("Wer steht am Anfang jeder Nahrungskette?", "Who is at the start of every food chain?"),
          options: [t("Mensch", "Human"), t("Pflanze", "Plant"), t("Löwe", "Lion")],
          answer: 1,
          explain: t("Pflanzen sind die Erzeuger.", "Plants are the producers."),
        },
        {
          q: t("Was ist ein Pflanzenfresser?", "What is a herbivore?"),
          options: [
            t("Tier, das Pflanzen frisst", "Animal that eats plants"),
            t("Tier, das Pflanzen pflanzt", "Animal that plants plants"),
            t("Pflanze, die isst", "Plant that eats"),
          ],
          answer: 0,
          explain: t("Hase, Kuh, Reh – alle Pflanzenfresser.", "Rabbit, cow, deer – all herbivores."),
        },
        {
          q: t("Wer ist ein Top-Räuber?", "Who is a top predator?"),
          options: [t("Hase", "Rabbit"), t("Adler", "Eagle"), t("Schmetterling", "Butterfly")],
          answer: 1,
          explain: t("Niemand jagt den Adler.", "Nobody hunts the eagle."),
        },
        {
          q: t("Was passiert, wenn alle Hasen verschwinden?", "What happens if all rabbits disappear?"),
          options: [
            t("Nichts", "Nothing"),
            t("Füchse haben Hunger", "Foxes go hungry"),
            t("Mehr Gras", "More grass"),
          ],
          answer: 1,
          explain: t("Räuber finden weniger Beute.", "Predators find less prey."),
        },
      ],
    },
    {
      title: t("Level 3 · Wetter", "Level 3 · Weather"),
      reward: t("Schaltet frei: Den Wasserkreislauf.", "Unlocks: The Water Cycle."),
      questions: [
        {
          q: t("Wo entstehen Hurrikane?", "Where do hurricanes form?"),
          options: [
            t("Über kalten Gebirgen", "Over cold mountains"),
            t("Über warmen Meeren", "Over warm oceans"),
            t("Im Schnee", "In the snow"),
          ],
          answer: 1,
          explain: t("Sie brauchen Wasser über 26 °C.", "They need water above 26 °C."),
        },
        {
          q: t("Wie heißt das Zentrum eines Hurrikans?", "What is the centre of a hurricane called?"),
          options: [t("Mund", "Mouth"), t("Auge", "Eye"), t("Herz", "Heart")],
          answer: 1,
          explain: t("Im Auge ist es ruhig.", "The eye is calm."),
        },
        {
          q: t("Wie schnell kann der Wind werden?", "How fast can the wind get?"),
          options: [t("50 km/h", "50 km/h"), t("über 250 km/h", "over 250 km/h"), t("1000 km/h", "1000 km/h")],
          answer: 1,
          explain: t("Stark genug, um Häuser zu zerstören.", "Strong enough to destroy houses."),
        },
        {
          q: t("Was treibt den Sturm an?", "What powers the storm?"),
          options: [
            t("Kälte", "Cold"),
            t("Warme, feuchte Luft, die aufsteigt", "Warm, moist air rising up"),
            t("Wind aus der Wüste", "Wind from the desert"),
          ],
          answer: 1,
          explain: t("Sie steigt und kühlt → Regen → Energie.", "It rises and cools → rain → energy."),
        },
      ],
    },
    {
      title: t("Level 4 · Erde-Meister", "Level 4 · Earth Master"),
      reward: t("Alles freigeschaltet.", "Everything unlocked."),
      questions: [
        {
          q: t("Was startet den Wasserkreislauf?", "What starts the water cycle?"),
          options: [t("Regen", "Rain"), t("Sonne", "Sun"), t("Wind", "Wind")],
          answer: 1,
          explain: t("Sie heizt das Wasser zum Verdunsten auf.", "It heats the water so it evaporates."),
        },
        {
          q: t("Wozu wird Wasserdampf in der Luft?", "What does water vapour in the air become?"),
          options: [t("Wolken", "Clouds"), t("Eis", "Ice"), t("Steine", "Stones")],
          answer: 0,
          explain: t("Winzige Tröpfchen bilden Wolken.", "Tiny droplets form clouds."),
        },
        {
          q: t("Was fällt als Niederschlag?", "What falls as precipitation?"),
          options: [
            t("Nur Regen", "Only rain"),
            t("Regen, Schnee, Hagel", "Rain, snow, hail"),
            t("Nur Schnee", "Only snow"),
          ],
          answer: 1,
          explain: t("Je nach Temperatur.", "Depends on the temperature."),
        },
        {
          q: t("Warum gibt es Wetter überhaupt?", "Why does weather exist at all?"),
          options: [
            t(
              "Weil die Erde sich dreht und die Sonne unterschiedlich erwärmt",
              "Because Earth spins and the sun heats it unevenly"
            ),
            t("Weil Tiere atmen", "Because animals breathe"),
            t("Weil Pflanzen wachsen", "Because plants grow"),
          ],
          answer: 0,
          explain: t(
            "Temperaturunterschiede + Erdrotation = Wetter.",
            "Temperature differences + Earth's spin = weather."
          ),
        },
      ],
    },
  ];

  return (
    <TopicShell
      eyebrow={t("Natur & Erde", "Nature & Earth")}
      title={t("Wie hängt alles zusammen?", "How does everything connect?")}
    >
      <Chapter
        num={1}
        title={t("Die Sonne füttert alles", "The sun feeds everything")}
        intro={t(
          "Jedes Steak, jeder Salat, jeder Atemzug – alles begann mit Sonnenlicht und einem grünen Blatt.",
          "Every steak, every salad, every breath – it all started with sunlight and a green leaf."
        )}
      >
        <ImageCard
          src={SUN}
          alt={t("Sonne", "Sun")}
          caption={t("Unser Stern. Liefert Energie für die gesamte Erde.", "Our star. Delivers energy for the whole Earth.")}
        />
        <Photosynthesis />
        <ImageCard
          src={LEAF}
          alt={t("Blätter", "Leaves")}
          caption={t("Jedes Blatt ist eine kleine Solarfabrik.", "Every leaf is a tiny solar factory.")}
        />
        <TapCardGrid
          cards={[
            {
              emoji: "🌳",
              title: t("Baum", "Tree"),
              body: t(
                "Ein großer Baum erzeugt am Tag Sauerstoff für 10 Menschen.",
                "A big tree makes enough oxygen for 10 people every day."
              ),
            },
            {
              emoji: "🌾",
              title: t("Gras", "Grass"),
              body: t(
                "Bedeckt 1/4 der Erde – die größte Solarfabrik überhaupt.",
                "Covers 1/4 of Earth – the biggest solar factory of all."
              ),
            },
            {
              emoji: "🌊",
              title: t("Algen", "Algae"),
              body: t(
                "Im Meer machen sie über die Hälfte des Sauerstoffs der Erde.",
                "In the ocean they make over half of Earth's oxygen."
              ),
            },
            {
              emoji: "🌵",
              title: t("Kaktus", "Cactus"),
              body: t(
                "Spart Wasser, sammelt Sonne in der Wüste – jahrelang ohne Regen.",
                "Saves water, soaks up sun in the desert – years without rain."
              ),
            },
          ]}
        />
        <AtlasNotes
          title={t("Photosynthese: die wichtigste Maschine der Erde", "Photosynthesis: Earth's most important machine")}
          intro={t(
            "Pflanzen bauen aus drei einfachen Zutaten ihr eigenes Essen. Dabei entsteht fast der ganze Sauerstoff, den Tiere und Menschen atmen.",
            "Plants build their own food from three simple ingredients. Almost all the oxygen animals and people breathe is made this way."
          )}
          points={[
            {
              label: t("1. Licht fangen", "1. Catching light"),
              text: t(
                "Das grüne Chlorophyll im Blatt fängt Sonnenlicht ein. Darum sind die meisten Blätter grün.",
                "The green chlorophyll in the leaf catches sunlight. That's why most leaves are green."
              ),
            },
            {
              label: t("2. Wasser holen", "2. Collecting water"),
              text: t(
                "Wurzeln nehmen Wasser aus der Erde auf. Durch dünne Röhrchen steigt es bis in die Blätter.",
                "Roots take up water from the soil. It travels up through tiny tubes into the leaves."
              ),
            },
            {
              label: t("3. CO₂ einatmen", "3. Breathing in CO₂"),
              text: t(
                "Auf der Blattunterseite sind winzige Öffnungen. Dort nimmt die Pflanze Kohlendioxid aus der Luft auf.",
                "On the underside of the leaf are tiny openings. The plant takes in carbon dioxide from the air there."
              ),
            },
            {
              label: t("4. Zucker bauen", "4. Building sugar"),
              text: t(
                "Mit Lichtenergie baut die Pflanze Traubenzucker. Das ist Nahrung für Wachstum, Blüten, Früchte und Holz.",
                "Using light energy the plant builds glucose sugar. That's food for growth, flowers, fruit and wood."
              ),
            },
            {
              label: t("5. Sauerstoff abgeben", "5. Releasing oxygen"),
              text: t(
                "Sauerstoff ist für die Pflanze Abfall – für uns ist er lebenswichtig. Jeder Atemzug hängt an Pflanzen und Algen.",
                "Oxygen is waste for the plant – but vital for us. Every breath depends on plants and algae."
              ),
            },
          ]}
        />
        <MiniFactTable
          rows={[
            {
              term: t("Zutat", "Ingredient"),
              value: t("Licht", "Light"),
              note: t("Liefert die Energie, damit die Pflanze Zucker bauen kann.", "Provides the energy for the plant to build sugar."),
            },
            {
              term: t("Zutat", "Ingredient"),
              value: t("Wasser", "Water"),
              note: t("Kommt über Wurzeln und Leitbahnen ins Blatt.", "Arrives in the leaf via roots and tubes."),
            },
            {
              term: t("Zutat", "Ingredient"),
              value: "CO₂",
              note: t("Kommt aus der Luft durch winzige Blattöffnungen.", "Comes from the air through tiny leaf pores."),
            },
            {
              term: t("Produkt", "Product"),
              value: "O₂",
              note: t("Sauerstoff wird abgegeben und von Tieren geatmet.", "Oxygen is released and breathed by animals."),
            },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">100 %</p>
            <p className="mt-1 text-[11px] text-slate-300">
              {t("Allen Lebens stammt von der Sonne.", "of all life comes from the sun.")}
            </p>
          </div>
          <div className="rounded-2xl bg-[#10101e] p-4">
            <p className="font-display text-3xl font-black text-amber-300">21 %</p>
            <p className="mt-1 text-[11px] text-slate-300">
              {t("der Luft ist Sauerstoff – alles aus Pflanzen.", "of the air is oxygen – all made by plants.")}
            </p>
          </div>
        </div>
      </Chapter>

      {level >= 1 ? (
        <Chapter
          num={2}
          title={t("Nahrungskette", "Food Chain")}
          intro={t(
            "Energie wandert. Vom Gras zum Hasen, vom Hasen zum Fuchs. Wer am Ende steht, isst die Energie aller davor.",
            "Energy travels. From grass to rabbit, from rabbit to fox. Whoever is at the end eats the energy of everyone before."
          )}
        >
          <FoodChain />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
            {t("Die Rollen im Netz", "Roles in the web")}
          </p>
          <TapCardGrid
            cards={[
              {
                emoji: "🌱",
                title: t("Erzeuger", "Producers"),
                body: t("Pflanzen. Sie machen Energie aus Licht – ganz allein.", "Plants. They make energy from light – all on their own."),
              },
              {
                emoji: "🐰",
                title: t("Pflanzenfresser", "Herbivores"),
                body: t("Hase, Reh, Kuh – essen nur Pflanzen.", "Rabbit, deer, cow – eat only plants."),
              },
              {
                emoji: "🦊",
                title: t("Fleischfresser", "Carnivores"),
                body: t("Fuchs, Wolf, Löwe – jagen andere Tiere.", "Fox, wolf, lion – hunt other animals."),
              },
              {
                emoji: "🍄",
                title: t("Zersetzer", "Decomposers"),
                body: t("Pilze und Bakterien. Sie machen Toten wieder zu Erde.", "Fungi and bacteria. They turn dead things back into soil."),
              },
            ]}
          />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
            {t("Drei Welten – drei Ketten", "Three worlds – three chains")}
          </p>
          <TapCardGrid
            cards={[
              {
                emoji: "🌊",
                title: t("Im Meer", "In the ocean"),
                body: t("Plankton → kleine Fische → große Fische → Hai.", "Plankton → small fish → big fish → shark."),
              },
              {
                emoji: "🏜️",
                title: t("Wüste", "Desert"),
                body: t("Kaktus → Heuschrecke → Eidechse → Adler.", "Cactus → grasshopper → lizard → eagle."),
              },
              {
                emoji: "❄️",
                title: t("Arktis", "Arctic"),
                body: t("Algen → Krill → Robbe → Eisbär.", "Algae → krill → seal → polar bear."),
              },
              {
                emoji: "🌳",
                title: t("Wald", "Forest"),
                body: t("Blatt → Raupe → Vogel → Fuchs.", "Leaf → caterpillar → bird → fox."),
              },
            ]}
          />
          <AtlasNotes
            title={t("Eigentlich ist es kein Kette, sondern ein Netz", "It's not really a chain – it's a web")}
            intro={t(
              "In der Natur frisst nicht jedes Tier nur eine Sache. Viele Nahrungsketten sind miteinander verwoben. Wenn ein Teil fehlt, spüren es viele andere.",
              "In nature, animals don't just eat one thing. Many food chains are woven together. When one part is missing, many others feel it."
            )}
            points={[
              {
                label: t("Erzeuger", "Producers"),
                text: t(
                  "Pflanzen und Algen stehen am Anfang. Sie machen aus Sonnenlicht Energie, die alle anderen später nutzen.",
                  "Plants and algae are at the start. They turn sunlight into energy that everyone else uses later."
                ),
              },
              {
                label: t("Erstverbraucher", "First consumers"),
                text: t(
                  "Pflanzenfresser wie Raupen, Hasen, Kühe oder Krill nehmen diese Energie direkt auf.",
                  "Herbivores like caterpillars, rabbits, cows or krill take up this energy directly."
                ),
              },
              {
                label: t("Zweitverbraucher", "Second consumers"),
                text: t(
                  "Fleischfresser wie Füchse, Fische oder Vögel bekommen die Energie, indem sie andere Tiere fressen.",
                  "Carnivores like foxes, fish or birds get the energy by eating other animals."
                ),
              },
              {
                label: t("Top-Räuber", "Top predators"),
                text: t(
                  "Adler, Orcas, Haie oder Wölfe stehen oft weit oben. Sie halten Bestände im Gleichgewicht.",
                  "Eagles, orcas, sharks or wolves are often near the top. They keep populations in balance."
                ),
              },
              {
                label: t("Zersetzer", "Decomposers"),
                text: t(
                  "Pilze, Würmer und Bakterien räumen tote Pflanzen und Tiere auf. Aus ihnen werden Nährstoffe für neue Pflanzen.",
                  "Fungi, worms and bacteria clean up dead plants and animals. They become nutrients for new plants."
                ),
              },
              {
                label: t("Warum nur 10 %?", "Why only 10 %?"),
                text: t(
                  "Bei jeder Stufe wird viel Energie für Wärme, Bewegung und Leben verbraucht. Darum gibt es viel mehr Pflanzen als große Räuber.",
                  "At every step, lots of energy is used up for heat, movement and living. That's why there are far more plants than big predators."
                ),
              },
            ]}
          />
          <MiniFactTable
            rows={[
              {
                term: t("Start", "Start"),
                value: t("Pflanze", "Plant"),
                note: t("Macht Energie aus Licht und versorgt das ganze Netz.", "Makes energy from light and feeds the whole web."),
              },
              {
                term: t("Mitte", "Middle"),
                value: t("Beute", "Prey"),
                note: t("Pflanzenfresser und kleine Fleischfresser verbinden viele Arten.", "Herbivores and small carnivores connect many species."),
              },
              {
                term: t("Oben", "Top"),
                value: t("Räuber", "Predator"),
                note: t("Hält Tiergruppen im Gleichgewicht, braucht aber viel Nahrung.", "Keeps animal groups in balance but needs lots of food."),
              },
              {
                term: t("Ende", "End"),
                value: t("Pilze", "Fungi"),
                note: t("Machen aus Resten wieder Erde und Nährstoffe.", "Turn leftovers back into soil and nutrients."),
              },
            ]}
          />
          <BigStat
            value="10 %"
            caption={t(
              "Nur so viel Energie kommt von einer Stufe zur nächsten. Der Rest wird Wärme.",
              "Only this much energy passes from one level to the next. The rest becomes heat."
            )}
          />
        </Chapter>
      ) : (
        <LockedGate
          level={level}
          required={1}
          hint={t("Schließ Level 1, um die Nahrungskette zu erleben.", "Finish Level 1 to explore the food chain.")}
        />
      )}

      {level >= 2 ? (
        <Chapter
          num={3}
          title={t("Wetter & Stürme", "Weather & Storms")}
          intro={t(
            "Wetter entsteht, wenn warme und kalte Luft aufeinandertreffen. Hurrikane, Tornados, Gewitter – alle haben den gleichen Motor: die Sonne.",
            "Weather happens when warm and cold air meet. Hurricanes, tornadoes, thunderstorms – they all run on the same engine: the sun."
          )}
        >
          <HurricaneTour />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
            {t("Wilde Wetter-Familie", "The wild weather family")}
          </p>
          <TapCardGrid
            cards={[
              {
                emoji: "🌪️",
                title: t("Tornado", "Tornado"),
                body: t(
                  "Schmaler Rüssel aus Wind. Bis 500 km/h schnell – aber meist nur wenige Minuten.",
                  "A narrow funnel of wind. Up to 500 km/h – but usually only lasts a few minutes."
                ),
              },
              {
                emoji: "🌩️",
                title: t("Gewitter", "Thunderstorm"),
                body: t(
                  "Wolken reiben sich – Funken sind Blitze. Donner ist die platzende Luft.",
                  "Clouds rub together – sparks are lightning. Thunder is the air bursting."
                ),
              },
              {
                emoji: "🌫️",
                title: t("Nebel", "Fog"),
                body: t(
                  "Eine Wolke direkt am Boden. Sicht plötzlich nur noch 10 m.",
                  "A cloud right on the ground. Visibility suddenly only 10 m."
                ),
              },
              {
                emoji: "🌈",
                title: t("Regenbogen", "Rainbow"),
                body: t(
                  "Sonne hinter dir, Regen vor dir – Tropfen brechen das Licht in 7 Farben.",
                  "Sun behind you, rain in front – droplets split the light into 7 colours."
                ),
              },
            ]}
          />
          <ImageCard
            src={RAIN}
            alt={t("Regen", "Rain")}
            caption={t("50 mm Regen pro Stunde kann ein Hurrikan abladen.", "A hurricane can dump 50 mm of rain per hour.")}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">1600 km</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {t("So breit kann ein Hurrikan werden.", "A hurricane can grow this wide.")}
              </p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">30 000 °C</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {t(
                  "heiß ist ein Blitz – fünfmal so heiß wie die Sonnenoberfläche.",
                  "a lightning bolt is this hot – five times hotter than the sun's surface."
                )}
              </p>
            </div>
          </div>
          <AtlasNotes
            title={t("Wetter ist bewegte Luft", "Weather is moving air")}
            intro={t(
              "Die Sonne erwärmt die Erde ungleich. Dadurch entstehen Druckunterschiede. Luft beginnt zu wandern – und daraus wird Wind, Wolke, Regen oder Sturm.",
              "The sun heats the Earth unevenly. This creates pressure differences. Air starts moving – and that becomes wind, cloud, rain or storm."
            )}
            points={[
              {
                label: t("Warme Luft steigt", "Warm air rises"),
                text: t(
                  "Warme Luft ist leichter als kalte. Sie steigt auf, kühlt ab und kann Wolken bilden.",
                  "Warm air is lighter than cold. It rises, cools down and can form clouds."
                ),
              },
              {
                label: t("Kalte Luft sinkt", "Cold air sinks"),
                text: t(
                  "Kalte Luft ist schwerer. Sie sinkt und schiebt andere Luft weg. So entstehen Winde.",
                  "Cold air is heavier. It sinks and pushes other air away. That's how winds form."
                ),
              },
              {
                label: t("Wolken", "Clouds"),
                text: t(
                  "Wolken bestehen aus winzigen Wassertröpfchen oder Eiskristallen, nicht aus Rauch oder Watte.",
                  "Clouds are made of tiny water droplets or ice crystals, not smoke or cotton wool."
                ),
              },
              {
                label: t("Gewitter", "Thunderstorms"),
                text: t(
                  "In Gewitterwolken wirbeln Eis und Wasser. Ladungen trennen sich. Der Blitz gleicht sie wieder aus.",
                  "In storm clouds ice and water swirl around. Charges separate. Lightning balances them out again."
                ),
              },
              {
                label: t("Hurrikan", "Hurricane"),
                text: t(
                  "Über warmem Meer steigt feuchte Luft auf. Durch die Erdrotation beginnt das System zu drehen.",
                  "Over warm ocean, moist air rises. Earth's spin makes the whole system start rotating."
                ),
              },
              {
                label: t("Tornado", "Tornado"),
                text: t(
                  "Ein Tornado ist viel kleiner als ein Hurrikan, aber seine Windspitze kann noch stärker sein.",
                  "A tornado is much smaller than a hurricane, but its peak wind can be even stronger."
                ),
              },
            ]}
          />
          <MiniFactTable
            rows={[
              {
                term: t("Motor", "Engine"),
                value: t("Sonne", "Sun"),
                note: t("Erwärmt Boden, Meer und Luft unterschiedlich stark.", "Heats ground, ocean and air at different strengths."),
              },
              {
                term: t("Wolke", "Cloud"),
                value: t("Tropfen", "Droplets"),
                note: t("Wasserdampf kühlt ab und wird wieder flüssig oder eisig.", "Water vapour cools and turns liquid or icy again."),
              },
              {
                term: t("Blitz", "Lightning"),
                value: t("Ladung", "Charge"),
                note: t("Ein elektrischer Ausgleich zwischen Wolke und Erde oder in der Wolke.", "An electrical balance between cloud and ground or inside the cloud."),
              },
              {
                term: t("Sturm", "Storm"),
                value: t("Druck", "Pressure"),
                note: t("Luft bewegt sich von hohem zu niedrigem Druck.", "Air moves from high to low pressure."),
              },
            ]}
          />
        </Chapter>
      ) : (
        <LockedGate
          level={level}
          required={2}
          hint={t("Schließ Level 2, um Hurrikane zu erkunden.", "Finish Level 2 to explore hurricanes.")}
        />
      )}

      {level >= 3 ? (
        <Chapter
          num={4}
          title={t("Der Wasserkreislauf", "The Water Cycle")}
          intro={t(
            "Das Wasser, das du trinkst, ist Milliarden Jahre alt. Es war schon Wolke, Fluss, Eisberg, Dinosaurier-Tränen. Und es geht immer im Kreis.",
            "The water you drink is billions of years old. It has already been a cloud, a river, an iceberg, dinosaur tears. And it always goes around in a circle."
          )}
        >
          <ImageCard
            src={OCEAN}
            alt={t("Meer", "Ocean")}
            caption={t("Das Meer ist der größte Wasserspeicher der Erde.", "The ocean is Earth's biggest water store.")}
          />
          <WaterCycle />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
            {t("Wo das Wasser steckt", "Where the water is")}
          </p>
          <TapCardGrid
            cards={[
              {
                emoji: "🌊",
                title: t("Ozeane", "Oceans"),
                body: t("97 % allen Wassers – aber salzig. Nichts zum Trinken.", "97 % of all water – but salty. Not for drinking."),
              },
              {
                emoji: "🏔️",
                title: t("Eis", "Ice"),
                body: t("2 % als Gletscher und Polkappen gefroren.", "2 % frozen as glaciers and ice caps."),
              },
              {
                emoji: "🏞️",
                title: t("Flüsse & Seen", "Rivers & Lakes"),
                body: t("Weniger als 1 % – aber genau hier trinkt der Mensch.", "Less than 1 % – but this is exactly where humans drink."),
              },
              {
                emoji: "☁️",
                title: t("Wolken", "Clouds"),
                body: t("Nur 0,001 % – und doch fällt daraus aller Regen der Welt.", "Only 0.001 % – and yet all the world's rain falls from here."),
              },
            ]}
          />
          <AtlasNotes
            title={t("Wasser verschwindet nie – es wechselt nur den Ort", "Water never disappears – it just moves around")}
            intro={t(
              "Ein Wassermolekül kann im Meer schwimmen, als Wolke fliegen, als Schnee liegen, durch eine Pflanze wandern und später wieder in deinem Glas landen.",
              "A water molecule can swim in the ocean, fly as a cloud, lie as snow, travel through a plant and later end up in your glass."
            )}
            points={[
              {
                label: t("Verdunstung", "Evaporation"),
                text: t(
                  "Sonne gibt Wasserteilchen genug Energie, um als unsichtbarer Dampf in die Luft zu steigen.",
                  "The sun gives water particles enough energy to rise into the air as invisible vapour."
                ),
              },
              {
                label: t("Transpiration", "Transpiration"),
                text: t(
                  "Pflanzen geben Wasser über Blätter ab. Wälder machen dadurch ihre eigene feuchte Luft.",
                  "Plants release water through their leaves. Forests create their own moist air this way."
                ),
              },
              {
                label: t("Kondensation", "Condensation"),
                text: t(
                  "Oben ist es kälter. Wasserdampf sammelt sich an Staubteilchen und wird zu Tropfen: eine Wolke entsteht.",
                  "Higher up it's colder. Water vapour gathers on dust particles and becomes droplets: a cloud forms."
                ),
              },
              {
                label: t("Niederschlag", "Precipitation"),
                text: t(
                  "Werden Tropfen oder Eiskristalle schwer genug, fallen sie als Regen, Schnee, Graupel oder Hagel.",
                  "When droplets or ice crystals are heavy enough, they fall as rain, snow, sleet or hail."
                ),
              },
              {
                label: t("Grundwasser", "Groundwater"),
                text: t(
                  "Ein Teil sickert tief in den Boden. Dort kann Wasser Jahre, Jahrhunderte oder länger gespeichert bleiben.",
                  "Some seeps deep into the ground. Water can be stored there for years, centuries or even longer."
                ),
              },
              {
                label: t("Warum Trinkwasser kostbar ist", "Why fresh water is precious"),
                text: t(
                  "Fast alles Wasser ist salzig oder gefroren. Nur ein sehr kleiner Teil ist leicht erreichbares Süßwasser.",
                  "Almost all water is salty or frozen. Only a very small part is easily reachable fresh water."
                ),
              },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">3 {t("Wochen", "Weeks")}</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {t("bleibt Wasser im Schnitt in der Luft.", "is how long water stays in the air on average.")}
              </p>
            </div>
            <div className="rounded-2xl bg-[#10101e] p-4">
              <p className="font-display text-3xl font-black text-amber-300">60 %</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {t("deines Körpers ist Wasser.", "of your body is water.")}
              </p>
            </div>
          </div>
          <BigStat
            value="3,8 Mrd. Jahre"
            caption={t(
              "So alt ist das Wasser auf der Erde. Du trinkst dieselben Moleküle, die Dinosaurier tranken.",
              "That's how old Earth's water is. You drink the same molecules that dinosaurs drank."
            )}
          />
        </Chapter>
      ) : (
        <LockedGate
          level={level}
          required={3}
          hint={t("Schließ Level 3, um den Wasserkreislauf zu entdecken.", "Finish Level 3 to discover the water cycle.")}
        />
      )}

      <QuizLauncher topic={TOPIC} pools={QUIZ} />
    </TopicShell>
  );
}
