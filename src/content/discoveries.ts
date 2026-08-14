// Curiosity Passport — Discovery catalog.
// Each topic has a set of cards. Unlock happens when a related question is asked.
// `keywords` are lowercase substrings matched against the question.

export type DiscoveryCard = {
  id: string;
  emoji: string;
  title: { de: string; en: string };
  fact: { de: string; en: string };
  keywords?: string[]; // lowercased strings to match in the user's question
};

export type DiscoveryTopic = {
  id: string;
  emoji: string;
  title: { de: string; en: string };
  gradient: string; // tailwind gradient classes
  cards: DiscoveryCard[];
};

export const discoveryTopics: DiscoveryTopic[] = [
  {
    id: "space",
    emoji: "🌌",
    title: { de: "Weltall", en: "Space" },
    gradient: "from-indigo-600 to-purple-700",
    cards: [
      { id: "moon",       emoji: "🌙", title: { de: "Mond",       en: "Moon" },        fact: { de: "Der Mond ist ~384.000 km von der Erde entfernt.", en: "The Moon is about 384,000 km from Earth." }, keywords: ["mond", "moon"] },
      { id: "sun",        emoji: "☀️", title: { de: "Sonne",      en: "Sun" },         fact: { de: "Die Sonne wiegt 333.000 Erden.", en: "The Sun weighs 333,000 Earths." }, keywords: ["sonne", "sun "] },
      { id: "saturn",     emoji: "🪐", title: { de: "Saturn",     en: "Saturn" },      fact: { de: "Saturns Ringe sind fast reines Eis.", en: "Saturn's rings are almost pure ice." }, keywords: ["saturn"] },
      { id: "mars",       emoji: "🔴", title: { de: "Mars",       en: "Mars" },        fact: { de: "Auf dem Mars steht der höchste Vulkan im Sonnensystem.", en: "Mars has the tallest volcano in the Solar System." }, keywords: ["mars"] },
      { id: "jupiter",    emoji: "🟠", title: { de: "Jupiter",    en: "Jupiter" },     fact: { de: "Jupiter hat 95 bekannte Monde.", en: "Jupiter has 95 known moons." }, keywords: ["jupiter"] },
      { id: "blackhole",  emoji: "🕳️", title: { de: "Schwarzes Loch", en: "Black Hole" }, fact: { de: "Nicht einmal Licht kann entkommen.", en: "Not even light can escape." }, keywords: ["schwarzes loch", "black hole", "blackhole"] },
      { id: "rocket",     emoji: "🚀", title: { de: "Rakete",     en: "Rocket" },      fact: { de: "Raketen brauchen 28.000 km/h, um im Orbit zu bleiben.", en: "Rockets need 28,000 km/h to stay in orbit." }, keywords: ["rakete", "rocket"] },
      { id: "astronaut",  emoji: "👩‍🚀", title: { de: "Astronaut", en: "Astronaut" },   fact: { de: "Im Weltraum wächst man 2 cm.", en: "Astronauts grow 2 cm in space." }, keywords: ["astronaut"] },
      { id: "galaxy",     emoji: "🌠", title: { de: "Galaxie",    en: "Galaxy" },      fact: { de: "Unsere Milchstraße hat ~100 Milliarden Sterne.", en: "Our Milky Way has ~100 billion stars." }, keywords: ["galax", "milchstraße", "milky way"] },
      { id: "planet",     emoji: "🌍", title: { de: "Planet",     en: "Planet" },      fact: { de: "Es gibt 8 Planeten in unserem Sonnensystem.", en: "There are 8 planets in our Solar System." }, keywords: ["planet"] },
    ],
  },
  {
    id: "bees",
    emoji: "🐝",
    title: { de: "Bienen", en: "Bees" },
    gradient: "from-amber-500 to-orange-600",
    cards: [
      { id: "honey",       emoji: "🍯", title: { de: "Honig",       en: "Honey" },       fact: { de: "Eine Biene macht in ihrem Leben 1/12 Teelöffel Honig.", en: "One bee makes 1/12 of a teaspoon of honey in her life." }, keywords: ["honig", "honey"] },
      { id: "hive",        emoji: "🏠", title: { de: "Bienenstock", en: "Bee Hive" },    fact: { de: "Bis zu 80.000 Bienen leben in einem Stock.", en: "Up to 80,000 bees live in one hive." }, keywords: ["bienenstock", "hive", "beehive"] },
      { id: "queen",       emoji: "👑", title: { de: "Bienenkönigin", en: "Queen Bee" }, fact: { de: "Die Königin legt bis zu 2000 Eier am Tag.", en: "The queen lays up to 2000 eggs a day." }, keywords: ["königin", "queen"] },
      { id: "pollen",      emoji: "🌸", title: { de: "Bestäubung",  en: "Pollination" }, fact: { de: "Jede dritte Nahrung braucht Bienen.", en: "1 in 3 foods depends on bees." }, keywords: ["bestäub", "pollen", "pollinat"] },
      { id: "honeycomb",   emoji: "🔶", title: { de: "Wabe",        en: "Honeycomb" },   fact: { de: "Sechsecke sparen am meisten Wachs.", en: "Hexagons use the least wax." }, keywords: ["wabe", "honeycomb"] },
      { id: "beedance",    emoji: "💃", title: { de: "Bienentanz",  en: "Bee Dance" },   fact: { de: "Bienen tanzen, um Blumen zu zeigen.", en: "Bees dance to point to flowers." }, keywords: ["tanz", "dance"] },
      { id: "bee",         emoji: "🐝", title: { de: "Biene",       en: "Bee" },         fact: { de: "Eine Biene fliegt bis zu 25 km/h.", en: "A bee flies up to 25 km/h." }, keywords: ["biene", "bee ", "bees"] },
    ],
  },
  {
    id: "dinos",
    emoji: "🦖",
    title: { de: "Dinosaurier", en: "Dinosaurs" },
    gradient: "from-emerald-600 to-teal-700",
    cards: [
      { id: "trex",        emoji: "🦖", title: { de: "T-Rex",       en: "T-Rex" },       fact: { de: "T-Rex hatte Zähne so lang wie Bananen.", en: "T-Rex had teeth the size of bananas." }, keywords: ["t-rex", "trex", "tyrannosaurus"] },
      { id: "triceratops", emoji: "🦕", title: { de: "Triceratops", en: "Triceratops" }, fact: { de: "Er hatte drei Hörner und ein Nackenschild.", en: "It had three horns and a neck shield." }, keywords: ["triceratops"] },
      { id: "fossil",      emoji: "🦴", title: { de: "Fossil",      en: "Fossil" },      fact: { de: "Fossilien brauchen 10.000+ Jahre zum Bilden.", en: "Fossils take 10,000+ years to form." }, keywords: ["fossil"] },
      { id: "meteor",      emoji: "☄️", title: { de: "Meteorit",   en: "Meteor" },      fact: { de: "Ein 10-km-Meteorit tötete die Dinos.", en: "A 10-km meteor killed the dinos." }, keywords: ["meteor", "asteroid"] },
      { id: "extinction",  emoji: "💥", title: { de: "Aussterben",  en: "Extinction" },  fact: { de: "75 % aller Arten starben aus.", en: "75% of all species went extinct." }, keywords: ["ausst", "extinct", "starben aus", "die out"] },
      { id: "dinosaur",    emoji: "🦕", title: { de: "Dinosaurier", en: "Dinosaur" },    fact: { de: "Dinos lebten 165 Millionen Jahre lang.", en: "Dinos lived for 165 million years." }, keywords: ["dinosaurier", "dinosaur", "dino"] },
      { id: "raptor",      emoji: "🐊", title: { de: "Raptor",      en: "Raptor" },      fact: { de: "Velociraptoren waren hühnergroß und gefiedert.", en: "Velociraptors were chicken-sized and feathered." }, keywords: ["raptor", "velocirap"] },
    ],
  },
  {
    id: "electricity",
    emoji: "⚡",
    title: { de: "Strom", en: "Electricity" },
    gradient: "from-yellow-500 to-amber-600",
    cards: [
      { id: "battery",   emoji: "🔋", title: { de: "Batterie",  en: "Battery" },  fact: { de: "In einer Batterie stecken Chemikalien, die Elektronen liefern.", en: "A battery holds chemicals that push electrons." }, keywords: ["batterie", "battery"] },
      { id: "circuit",   emoji: "🔌", title: { de: "Schaltkreis", en: "Circuit" }, fact: { de: "Strom fließt nur im geschlossenen Kreis.", en: "Current only flows in a closed loop." }, keywords: ["schaltkreis", "circuit", "kreislauf"] },
      { id: "magnet",    emoji: "🧲", title: { de: "Magnet",    en: "Magnet" },   fact: { de: "Bewegte Magnete erzeugen Strom.", en: "Moving magnets create electricity." }, keywords: ["magnet"] },
      { id: "lightning", emoji: "⚡", title: { de: "Blitz",     en: "Lightning" }, fact: { de: "Ein Blitz ist 5x heißer als die Sonne.", en: "Lightning is 5× hotter than the Sun." }, keywords: ["blitz", "lightning"] },
      { id: "generator", emoji: "⚙️", title: { de: "Generator", en: "Generator" }, fact: { de: "Ein Generator dreht Bewegung in Strom um.", en: "A generator turns motion into electricity." }, keywords: ["generator"] },
      { id: "bulb",      emoji: "💡", title: { de: "Glühbirne", en: "Light Bulb" }, fact: { de: "Ein dünner Draht glüht, wenn Strom fließt.", en: "A thin wire glows when current flows." }, keywords: ["lampe", "glühbirne", "bulb", "lamp", "light"] },
      { id: "electron",  emoji: "🔵", title: { de: "Elektron",  en: "Electron" }, fact: { de: "Elektronen sind winzige Ladungsträger.", en: "Electrons are tiny bits of charge." }, keywords: ["elektron", "electron"] },
    ],
  },
  {
    id: "nature",
    emoji: "🌿",
    title: { de: "Natur", en: "Nature" },
    gradient: "from-green-600 to-emerald-700",
    cards: [
      { id: "rainbow",    emoji: "🌈", title: { de: "Regenbogen", en: "Rainbow" },    fact: { de: "Ein Regenbogen ist ein Kreis — wir sehen nur den Bogen.", en: "A rainbow is a full circle — we only see the arc." }, keywords: ["regenbogen", "rainbow"] },
      { id: "volcano",    emoji: "🌋", title: { de: "Vulkan",     en: "Volcano" },    fact: { de: "Lava ist 1000 °C heiß.", en: "Lava is 1000 °C hot." }, keywords: ["vulkan", "volcano"] },
      { id: "earthquake", emoji: "🌐", title: { de: "Erdbeben",   en: "Earthquake" }, fact: { de: "Erdbeben entstehen, wenn Platten aneinander reiben.", en: "Quakes happen when plates rub together." }, keywords: ["erdbeben", "earthquake"] },
      { id: "cloud",      emoji: "☁️", title: { de: "Wolke",      en: "Cloud" },      fact: { de: "Eine Wolke wiegt bis zu 500 Tonnen.", en: "A cloud can weigh up to 500 tons." }, keywords: ["wolke", "cloud"] },
      { id: "ocean",      emoji: "🌊", title: { de: "Meer",       en: "Ocean" },      fact: { de: "97 % des Wassers der Erde ist im Meer.", en: "97% of Earth's water is in the ocean." }, keywords: ["meer", "ocean", "sea"] },
      { id: "tree",       emoji: "🌳", title: { de: "Baum",       en: "Tree" },       fact: { de: "Bäume atmen CO₂ ein und geben Sauerstoff ab.", en: "Trees breathe in CO₂ and breathe out oxygen." }, keywords: ["baum", "tree"] },
      { id: "blood",      emoji: "🩸", title: { de: "Blut",       en: "Blood" },      fact: { de: "Eisen im Blut macht es rot.", en: "Iron in blood makes it red." }, keywords: ["blut", "blood"] },
      { id: "sleep",      emoji: "😴", title: { de: "Schlaf",     en: "Sleep" },      fact: { de: "Im Schlaf ordnet dein Gehirn Erinnerungen.", en: "Your brain sorts memories while you sleep." }, keywords: ["schlaf", "sleep"] },
      { id: "fire",       emoji: "🔥", title: { de: "Feuer",      en: "Fire" },       fact: { de: "Feuer braucht Wärme, Brennstoff und Sauerstoff.", en: "Fire needs heat, fuel, and oxygen." }, keywords: ["feuer", "fire"] },
    ],
  },
  {
    id: "internet",
    emoji: "🌐",
    title: { de: "Internet", en: "Internet" },
    gradient: "from-sky-600 to-blue-700",
    cards: [
      { id: "router",  emoji: "📡", title: { de: "Router",  en: "Router" },  fact: { de: "Ein Router leitet Datenpakete weiter.", en: "A router forwards data packets." }, keywords: ["router"] },
      { id: "cable",   emoji: "🧵", title: { de: "Kabel",   en: "Cable" },   fact: { de: "99 % des Internets läuft durch Kabel im Meer.", en: "99% of the internet runs through undersea cables." }, keywords: ["kabel", "cable"] },
      { id: "server",  emoji: "🗄️", title: { de: "Server",  en: "Server" },  fact: { de: "Server sind Computer, die Webseiten liefern.", en: "Servers are computers that serve websites." }, keywords: ["server"] },
      { id: "wifi",    emoji: "📶", title: { de: "WLAN",    en: "Wi-Fi" },   fact: { de: "WLAN sendet mit Radiowellen.", en: "Wi-Fi sends data using radio waves." }, keywords: ["wlan", "wifi", "wi-fi"] },
      { id: "packet",  emoji: "📦", title: { de: "Datenpaket", en: "Packet" }, fact: { de: "Nachrichten reisen in kleinen Paketen.", en: "Messages travel in tiny packets." }, keywords: ["paket", "packet"] },
      { id: "internet", emoji: "🌐", title: { de: "Internet", en: "Internet" }, fact: { de: "Das Internet verbindet ~5 Milliarden Menschen.", en: "The internet connects ~5 billion people." }, keywords: ["internet"] },
    ],
  },
];

export function findDiscovery(topicId: string, cardId: string): DiscoveryCard | null {
  const t = discoveryTopics.find((x) => x.id === topicId);
  return t?.cards.find((c) => c.id === cardId) ?? null;
}

export function findTopic(topicId: string) {
  return discoveryTopics.find((x) => x.id === topicId) ?? null;
}
