import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useT, useLang } from "@/lib/i18n";

// Real NASA photographs, self-hosted from /public/planets (sourced from NASA's
// public-domain Image Library: images.nasa.gov).
const SUN_IMG = "/planets/sun.jpg";

type Bi = [string, string]; // [de, en]

interface Planet {
  id: string;
  name: Bi;
  img: string;
  /** relative diameter, Earth = 1 */
  rel: number;
  /** distance from sun in million km */
  distMkm: number;
  /** surface gravity relative to Earth (Earth = 1) */
  g: number;
  /** number of known moons */
  moons: number;
  /** day length in Earth hours (rotation) */
  dayHours: number;
  /** year length in Earth days */
  yearDays: number;
  /** average temperature, °C */
  tempC: number;
  /** three things to discover, revealed one tap at a time */
  reveals: Bi[];
  /** named surface/atmosphere features, plotted on the photo */
  callouts: { x: number; y: number; label: Bi; note: Bi }[];
  /** internal cutaway layers, outer → inner */
  layers: { name: Bi; color: string; note: Bi }[];
  /** poetic one-liner shown across the atlas spread */
  tagline: Bi;
}

const PLANETS: Planet[] = [
  {
    id: "merkur",
    name: ["Merkur", "Mercury"],
    img: "/planets/mercury.jpg",
    rel: 0.38,
    distMkm: 58,
    g: 0.38,
    moons: 0,
    dayHours: 4222,
    yearDays: 88,
    tempC: 167,
    tagline: [
      "Ein verbrannter Stein, der zu nah an der Sonne wohnt.",
      "A scorched rock living too close to the Sun.",
    ],
    reveals: [
      ["Ein Tag dauert hier länger als ein ganzes Jahr.", "A day here lasts longer than a whole year."],
      ["Tagsüber 430 °C. Nachts –180 °C.", "Daytime 430 °C. Night-time –180 °C."],
      ["Diese Krater sind seit Milliarden Jahren genauso da.", "These craters have looked exactly the same for billions of years."],
    ],
    callouts: [
      { x: 28, y: 38, label: ["Caloris-Becken", "Caloris Basin"], note: ["Ein Krater größer als Deutschland.", "A crater larger than Germany."] },
      { x: 70, y: 60, label: ["Steile Klippen", "Steep Cliffs"], note: ["Hier ist der Planet beim Abkühlen geschrumpft.", "The planet shrank as it cooled."] },
      { x: 50, y: 18, label: ["Keine Luft", "No Air"], note: ["Nichts hält die Hitze. Nichts schützt vor Kälte.", "Nothing holds the heat. Nothing blocks the cold."] },
    ],
    layers: [
      { name: ["Kruste", "Crust"], color: "#a8a29e", note: ["Dünn, grau, voller Krater.", "Thin, grey, covered in craters."] },
      { name: ["Mantel", "Mantle"], color: "#78716c", note: ["Festes Gestein.", "Solid rock."] },
      { name: ["Eisenkern", "Iron Core"], color: "#f59e0b", note: ["Riesig – fast der ganze Planet ist Kern.", "Huge — almost the entire planet is core."] },
    ],
  },
  {
    id: "venus",
    name: ["Venus", "Venus"],
    img: "/planets/venus.jpg",
    rel: 0.95,
    distMkm: 108,
    g: 0.91,
    moons: 0,
    dayHours: 5832,
    yearDays: 225,
    tempC: 464,
    tagline: ["Schön von weitem. Tödlich von nah.", "Beautiful from afar. Deadly up close."],
    reveals: [
      ["Heißer als jeder Backofen, den du kennst.", "Hotter than any oven you know."],
      ["Es regnet hier Schwefelsäure – nicht Wasser.", "It rains sulfuric acid here — not water."],
      ["Die Wolken sehen schön aus. Sie würden dich auflösen.", "The clouds look lovely. They would dissolve you."],
    ],
    callouts: [
      { x: 50, y: 30, label: ["Dichte Wolkendecke", "Dense Cloud Cover"], note: ["Schwefelsäure. Niemand sieht hindurch.", "Sulfuric acid. Nobody can see through."] },
      { x: 30, y: 65, label: ["Maxwell Montes", "Maxwell Montes"], note: ["Höchster Berg – höher als der Mount Everest.", "Highest mountain — taller than Mount Everest."] },
      { x: 72, y: 55, label: ["Vulkanebenen", "Volcanic Plains"], note: ["Zähe Lava bedeckt fast den ganzen Planeten.", "Thick lava covers almost the entire planet."] },
    ],
    layers: [
      { name: ["Atmosphäre", "Atmosphere"], color: "#fcd34d", note: ["Drückt so stark wie 900 m unter Wasser.", "Pressing down like 900 m underwater."] },
      { name: ["Kruste", "Crust"], color: "#d97706", note: ["Glühend heißer Fels.", "Glowing hot rock."] },
      { name: ["Mantel", "Mantle"], color: "#b45309", note: ["Geschmolzenes Gestein.", "Molten rock."] },
      { name: ["Kern", "Core"], color: "#7c2d12", note: ["Eisen, fest und flüssig.", "Iron, solid and liquid."] },
    ],
  },
  {
    id: "erde",
    name: ["Erde", "Earth"],
    img: "/planets/earth.jpg",
    rel: 1,
    distMkm: 150,
    g: 1,
    moons: 1,
    dayHours: 24,
    yearDays: 365,
    tempC: 15,
    tagline: ["Ein blauer Punkt. Dein ganzes Zuhause.", "A blue dot. Your whole home."],
    reveals: [
      ["Das hier ist dein Zuhause. Von oben gesehen.", "This is your home. Seen from above."],
      ["Der einzige Ort, an dem Wasser flüssig auf dem Boden liegt.", "The only place where water lies liquid on the ground."],
      ["Alles, was du je geliebt hast, ist auf diesem blauen Punkt.", "Everything you've ever loved is on this blue dot."],
    ],
    callouts: [
      { x: 38, y: 42, label: ["Ozeane", "Oceans"], note: ["Bedecken 70 % der Oberfläche.", "Cover 70% of the surface."] },
      { x: 65, y: 30, label: ["Wolken", "Clouds"], note: ["Wasser, das gerade unterwegs ist.", "Water that is travelling right now."] },
      { x: 55, y: 70, label: ["Kontinente", "Continents"], note: ["Sie schwimmen ganz langsam.", "They drift very slowly."] },
    ],
    layers: [
      { name: ["Kruste", "Crust"], color: "#84cc16", note: ["Boden, Berge, Meere – alles, was du kennst.", "Ground, mountains, seas — everything you know."] },
      { name: ["Mantel", "Mantle"], color: "#b45309", note: ["Heißer Fels, der ganz langsam fließt.", "Hot rock that flows very slowly."] },
      { name: ["Äußerer Kern", "Outer Core"], color: "#f97316", note: ["Flüssiges Eisen – macht das Magnetfeld.", "Liquid iron — creates the magnetic field."] },
      { name: ["Innerer Kern", "Inner Core"], color: "#fbbf24", note: ["Fest. So heiß wie die Sonnenoberfläche.", "Solid. As hot as the surface of the Sun."] },
    ],
  },
  {
    id: "mars",
    name: ["Mars", "Mars"],
    img: "/planets/mars.jpg",
    rel: 0.53,
    distMkm: 228,
    g: 0.38,
    moons: 2,
    dayHours: 24.6,
    yearDays: 687,
    tempC: -63,
    tagline: ["Der rostige Planet. Hier könnten wir mal landen.", "The rusty planet. We might land here one day."],
    reveals: [
      ["Rot, weil der Boden rostet – wie ein altes Fahrrad.", "Red because the ground is rusting — like an old bicycle."],
      ["Hier steht der größte Vulkan im ganzen Sonnensystem.", "Home to the biggest volcano in the entire solar system."],
      ["Roboter rollen gerade jetzt über diesen Sand.", "Robots are rolling across this sand right now."],
    ],
    callouts: [
      { x: 28, y: 45, label: ["Olympus Mons", "Olympus Mons"], note: ["Größter Vulkan – 22 km hoch.", "Biggest volcano — 22 km tall."] },
      { x: 60, y: 55, label: ["Valles Marineris", "Valles Marineris"], note: ["Eine Schlucht so lang wie Europa.", "A canyon as long as Europe."] },
      { x: 50, y: 18, label: ["Polare Eiskappe", "Polar Ice Cap"], note: ["Gefrorenes Wasser und Trockeneis.", "Frozen water and dry ice."] },
    ],
    layers: [
      { name: ["Kruste", "Crust"], color: "#dc2626", note: ["Rost im Sand – darum so rot.", "Rust in the sand — that's why it's so red."] },
      { name: ["Mantel", "Mantle"], color: "#991b1b", note: ["Kühler als bei der Erde.", "Cooler than Earth's."] },
      { name: ["Kern", "Core"], color: "#fb923c", note: ["Kleiner Eisenkern in der Mitte.", "Small iron core in the centre."] },
    ],
  },
  {
    id: "jupiter",
    name: ["Jupiter", "Jupiter"],
    img: "/planets/jupiter.jpg",
    rel: 11,
    distMkm: 778,
    g: 2.53,
    moons: 95,
    dayHours: 9.9,
    yearDays: 4333,
    tempC: -108,
    tagline: ["Ein Riese aus Gas. Kein Boden, nirgends.", "A gas giant. No ground, anywhere."],
    reveals: [
      ["Der rote Fleck ist ein Sturm. Größer als die Erde.", "The red spot is a storm. Bigger than Earth."],
      ["Du könntest hier nicht landen. Es gibt keinen Boden.", "You couldn't land here. There's no ground."],
      ["1.300 Erden würden in Jupiter hineinpassen.", "1,300 Earths would fit inside Jupiter."],
    ],
    callouts: [
      { x: 62, y: 60, label: ["Großer Roter Fleck", "Great Red Spot"], note: ["Ein Sturm, der seit 350 Jahren tobt.", "A storm that has raged for 350 years."] },
      { x: 30, y: 35, label: ["Wolkenbänder", "Cloud Bands"], note: ["Streifen aus Wind, gegenläufig.", "Strips of wind, blowing in opposite directions."] },
      { x: 78, y: 30, label: ["Polarlichter", "Auroras"], note: ["Größer und heller als auf der Erde.", "Bigger and brighter than on Earth."] },
    ],
    layers: [
      { name: ["Wolken", "Clouds"], color: "#fde68a", note: ["Ammoniak und Wasser. Bunt gestreift.", "Ammonia and water. Colourfully striped."] },
      { name: ["Flüssiger Wasserstoff", "Liquid Hydrogen"], color: "#fbbf24", note: ["Ein Ozean ohne Wasser.", "An ocean without water."] },
      { name: ["Metallischer Wasserstoff", "Metallic Hydrogen"], color: "#a16207", note: ["So gepresst, dass er Strom leitet.", "So compressed it conducts electricity."] },
      { name: ["Kern", "Core"], color: "#7c2d12", note: ["Vielleicht fest, vielleicht zerquetscht.", "Maybe solid, maybe crushed."] },
    ],
  },
  {
    id: "saturn",
    name: ["Saturn", "Saturn"],
    img: "/planets/saturn.jpg",
    rel: 9.45,
    distMkm: 1430,
    g: 1.07,
    moons: 146,
    dayHours: 10.7,
    yearDays: 10759,
    tempC: -139,
    tagline: ["Der Planet mit den schönsten Ringen.", "The planet with the most beautiful rings."],
    reveals: [
      ["Die Ringe sind aus Eis. Manche Stücke so groß wie ein Haus.", "The rings are made of ice. Some chunks as big as a house."],
      ["Saturn ist so leicht, er würde im Wasser schwimmen.", "Saturn is so light it would float on water."],
      ["Er hat 146 Monde. Niemand hat alle Namen behalten.", "It has 146 moons. Nobody can remember all the names."],
    ],
    callouts: [
      { x: 50, y: 50, label: ["Ringe", "Rings"], note: ["Milliarden Eisbrocken in einer dünnen Scheibe.", "Billions of ice chunks in a thin disc."] },
      { x: 30, y: 40, label: ["Cassini-Teilung", "Cassini Division"], note: ["Eine Lücke zwischen den Ringen.", "A gap between the rings."] },
      { x: 70, y: 35, label: ["Sechseck am Pol", "Hexagon at the Pole"], note: ["Ein Sturm in Form eines Sechsecks.", "A storm in the shape of a hexagon."] },
    ],
    layers: [
      { name: ["Wolken", "Clouds"], color: "#fef3c7", note: ["Hellgelb, weicher als bei Jupiter.", "Light yellow, softer than Jupiter's."] },
      { name: ["Flüssiger Wasserstoff", "Liquid Hydrogen"], color: "#fde68a", note: ["Tief und sehr kalt.", "Deep and very cold."] },
      { name: ["Metallischer Wasserstoff", "Metallic Hydrogen"], color: "#ca8a04", note: ["Gepresst wie bei Jupiter.", "Compressed like Jupiter's."] },
      { name: ["Kern", "Core"], color: "#78350f", note: ["Klein, aus Gestein und Eis.", "Small, made of rock and ice."] },
    ],
  },
  {
    id: "uranus",
    name: ["Uranus", "Uranus"],
    img: "/planets/uranus.jpg",
    rel: 4,
    distMkm: 2870,
    g: 0.89,
    moons: 28,
    dayHours: 17.2,
    yearDays: 30687,
    tempC: -197,
    tagline: ["Der Planet, der auf der Seite liegt.", "The planet that lies on its side."],
    reveals: [
      ["Uranus liegt auf der Seite. Er rollt durchs Weltall.", "Uranus lies on its side. It rolls through space."],
      ["Hier ist es –224 °C. Kälter geht kaum.", "It's –224 °C here. Hardly gets colder."],
      ["Es regnet Diamanten. Echte Diamanten.", "It rains diamonds. Real diamonds."],
    ],
    callouts: [
      { x: 50, y: 50, label: ["Methanwolken", "Methane Clouds"], note: ["Methan färbt den Planeten türkis.", "Methane turns the planet turquoise."] },
      { x: 30, y: 30, label: ["Gekippte Achse", "Tilted Axis"], note: ["Er rollt seitlich um die Sonne.", "It rolls sideways around the Sun."] },
      { x: 70, y: 60, label: ["Dünne Ringe", "Thin Rings"], note: ["Dunkel und schmal – kaum zu sehen.", "Dark and narrow — barely visible."] },
    ],
    layers: [
      { name: ["Atmosphäre", "Atmosphere"], color: "#67e8f9", note: ["Wasserstoff, Helium, Methan.", "Hydrogen, helium, methane."] },
      { name: ["Eis-Mantel", "Ice Mantle"], color: "#22d3ee", note: ["Wasser, Ammoniak, Methan – matschig kalt.", "Water, ammonia, methane — slushy cold."] },
      { name: ["Kern", "Core"], color: "#0e7490", note: ["Felsig, klein, sehr kalt.", "Rocky, small, very cold."] },
    ],
  },
  {
    id: "neptun",
    name: ["Neptun", "Neptune"],
    img: "/planets/neptune.jpg",
    rel: 3.88,
    distMkm: 4500,
    g: 1.14,
    moons: 16,
    dayHours: 16.1,
    yearDays: 60190,
    tempC: -201,
    tagline: ["Tiefblau. Stürmisch. Ganz am Rand.", "Deep blue. Stormy. Right at the edge."],
    reveals: [
      ["Hier wehen die schnellsten Winde – 2.000 km/h.", "Home to the fastest winds — 2,000 km/h."],
      ["So weit weg, dass die Sonne nur ein heller Stern ist.", "So far away the Sun looks like just a bright star."],
      ["Ein Jahr auf Neptun dauert 165 Erdenjahre.", "One year on Neptune lasts 165 Earth years."],
    ],
    callouts: [
      { x: 40, y: 55, label: ["Großer Dunkler Fleck", "Great Dark Spot"], note: ["Ein Sturm, so groß wie die Erde.", "A storm as big as Earth."] },
      { x: 65, y: 35, label: ["Scooter-Wolken", "Scooter Clouds"], note: ["Weiße Wolken rasen um den Planeten.", "White clouds racing around the planet."] },
      { x: 25, y: 30, label: ["Schnellste Winde", "Fastest Winds"], note: ["Bis 2.000 km/h – Überschallgeschwindigkeit.", "Up to 2,000 km/h — supersonic speed."] },
    ],
    layers: [
      { name: ["Atmosphäre", "Atmosphere"], color: "#3b82f6", note: ["Methan färbt sie tiefblau.", "Methane colours it deep blue."] },
      { name: ["Eis-Mantel", "Ice Mantle"], color: "#1d4ed8", note: ["Wasser und Ammoniak unter Druck.", "Water and ammonia under pressure."] },
      { name: ["Kern", "Core"], color: "#1e3a8a", note: ["Felsig, etwa so groß wie die Erde.", "Rocky, about the size of Earth."] },
    ],
  },
];

/* ---------- Deep dive content — unlocked after the quiz ---------- */

interface DeepDive {
  surface: Bi;
  elements: { symbol: string; name: Bi; use: Bi }[];
  treasure: Bi;
  weird: Bi;
}

const DEEP_DIVES: Record<string, DeepDive> = {
  merkur: {
    surface: [
      "Staub und Stein. Der Boden ist grau wie Mondsand, voller Krater und kleiner Glaskügelchen, die entstanden, als Meteoriten einschlugen.",
      "Dust and stone. The ground is grey like moon sand, full of craters and tiny glass beads formed when meteorites struck.",
    ],
    elements: [
      { symbol: "Fe", name: ["Eisen", "Iron"], use: ["Steckt in fast jeder Brücke und in jedem Auto.", "Found in almost every bridge and every car."] },
      { symbol: "Si", name: ["Silizium", "Silicon"], use: ["Daraus machen wir Computer-Chips und Glas.", "We use it to make computer chips and glass."] },
      { symbol: "S", name: ["Schwefel", "Sulphur"], use: ["Wird für Streichhölzer und Reifen gebraucht.", "Used for matches and tyres."] },
    ],
    treasure: [
      "Tief in den Polkratern liegt Eis – obwohl Merkur der Sonne am nächsten ist. In den Schatten dort wird es nie warm.",
      "Deep in the polar craters lies ice — even though Mercury is closest to the Sun. The shadows there never warm up.",
    ],
    weird: [
      "Merkur schrumpft. Er ist seit seiner Entstehung etwa 7 km kleiner geworden – wie ein Apfel, der vertrocknet.",
      "Mercury is shrinking. It has become about 7 km smaller since it formed — like an apple drying out.",
    ],
  },
  venus: {
    surface: [
      "Dunkler Basalt-Fels, glühend heiß, überall Lavafelder. Kein Sand, kein Wasser – nur Stein und alte Vulkane.",
      "Dark basalt rock, glowing hot, lava fields everywhere. No sand, no water — just stone and ancient volcanoes.",
    ],
    elements: [
      { symbol: "C", name: ["Kohlenstoff", "Carbon"], use: ["Steckt in jedem Lebewesen und in Bleistiften.", "Found in every living thing and in pencils."] },
      { symbol: "S", name: ["Schwefel", "Sulphur"], use: ["Macht die gelben Wolken – und stinkt nach faulem Ei.", "Makes the yellow clouds — and smells like rotten eggs."] },
      { symbol: "Fe", name: ["Eisen", "Iron"], use: ["Auf der Erde unser wichtigstes Metall.", "Our most important metal on Earth."] },
    ],
    treasure: [
      "Auf den höchsten Bergen liegt eine glänzende Schicht – Forscher glauben, es ist eine Art metallischer Schnee aus Blei und Wismut.",
      "On the highest mountains there is a shiny layer — researchers think it is a kind of metallic snow made of lead and bismuth.",
    ],
    weird: [
      "Ein Tag auf Venus dauert länger als ein Jahr. Und sie dreht sich rückwärts – die Sonne geht im Westen auf.",
      "A day on Venus lasts longer than a year. And it rotates backwards — the Sun rises in the west.",
    ],
  },
  erde: {
    surface: [
      "Boden aus Mineralien, Wasser und Leben. Pflanzen, Tiere, Pilze – nirgendwo sonst im Sonnensystem gibt es das.",
      "Ground made of minerals, water and life. Plants, animals, fungi — nowhere else in the solar system does this exist.",
    ],
    elements: [
      { symbol: "O", name: ["Sauerstoff", "Oxygen"], use: ["Atmest du gerade ein. Hält dich am Leben.", "You're breathing it right now. Keeps you alive."] },
      { symbol: "Si", name: ["Silizium", "Silicon"], use: ["Sand, Glas, Handy-Bildschirme.", "Sand, glass, phone screens."] },
      { symbol: "Al", name: ["Aluminium", "Aluminium"], use: ["Cola-Dosen, Flugzeuge, Folie.", "Cola cans, aeroplanes, foil."] },
      { symbol: "Au", name: ["Gold", "Gold"], use: ["Schmuck, Münzen, in jedem Handy.", "Jewellery, coins, in every phone."] },
    ],
    treasure: [
      "Trinkwasser. Es klingt langweilig – aber auf keinem anderen Planeten gibt es flüssiges Wasser an der Oberfläche.",
      "Drinking water. It sounds boring — but no other planet has liquid water on its surface.",
    ],
    weird: [
      "Die Erde brummt. Sie schwingt ständig leise wie eine riesige Glocke – zu tief, um es zu hören.",
      "Earth hums. It constantly vibrates gently like a giant bell — too low to hear.",
    ],
  },
  mars: {
    surface: [
      "Rostroter Sand mit feinem Staub. Der Wind weht ihn zu Dünen – und manchmal in Stürme, die den ganzen Planeten verschlucken.",
      "Rust-red sand with fine dust. The wind sweeps it into dunes — and sometimes into storms that swallow the whole planet.",
    ],
    elements: [
      { symbol: "Fe", name: ["Eisen", "Iron"], use: ["Der Rost im Sand macht Mars rot.", "The rust in the sand makes Mars red."] },
      { symbol: "Mg", name: ["Magnesium", "Magnesium"], use: ["Brennt hell – steckt in Feuerwerk.", "Burns brightly — found in fireworks."] },
      { symbol: "Si", name: ["Silizium", "Silicon"], use: ["Genau wie auf der Erde: Sand und Stein.", "Just like on Earth: sand and stone."] },
    ],
    treasure: [
      "Unter der Oberfläche liegt gefrorenes Wasser. Wenn Menschen je hier wohnen wollen, brauchen sie genau das.",
      "Frozen water lies beneath the surface. If humans ever want to live here, they will need exactly that.",
    ],
    weird: [
      "Marsstaub ist so fein wie Mehl. Er klebt an allem – Roboter müssen sich regelmäßig schütteln.",
      "Mars dust is as fine as flour. It sticks to everything — robots have to shake themselves regularly.",
    ],
  },
  jupiter: {
    surface: [
      "Es gibt keinen Boden. Wenn du fallen würdest, würdest du tiefer und tiefer ins Gas sinken, bis du zerquetscht wärst.",
      "There is no ground. If you fell, you would sink deeper and deeper into the gas until you were crushed.",
    ],
    elements: [
      { symbol: "H", name: ["Wasserstoff", "Hydrogen"], use: ["Leichtestes Gas – treibt Raketen an.", "Lightest gas — powers rockets."] },
      { symbol: "He", name: ["Helium", "Helium"], use: ["Macht Luftballons schweben und Stimmen quietschig.", "Makes balloons float and voices squeak."] },
      { symbol: "NH₃", name: ["Ammoniak", "Ammonia"], use: ["Macht die bunten Wolkenstreifen.", "Makes the colourful cloud stripes."] },
    ],
    treasure: [
      "Ganz tief drinnen ist Wasserstoff so gepresst, dass er wie Metall wirkt und Strom leitet. Das gibt Jupiter sein riesiges Magnetfeld.",
      "Deep inside, hydrogen is so compressed it acts like metal and conducts electricity. That gives Jupiter its giant magnetic field.",
    ],
    weird: [
      "Der Große Rote Fleck wird kleiner. Vor 100 Jahren war er drei Erden breit – heute nur noch eine.",
      "The Great Red Spot is shrinking. 100 years ago it was three Earths wide — today just one.",
    ],
  },
  saturn: {
    surface: [
      "Auch kein Boden. Nur Wolken aus Ammoniak und Wasser, in goldgelben Streifen.",
      "Also no ground. Just clouds of ammonia and water in golden yellow stripes.",
    ],
    elements: [
      { symbol: "H", name: ["Wasserstoff", "Hydrogen"], use: ["Wie bei Jupiter – fast der ganze Planet.", "Like Jupiter — almost the whole planet."] },
      { symbol: "He", name: ["Helium", "Helium"], use: ["Regnet hier sogar – flüssige Tropfen tief drinnen.", "Even rains here — liquid drops deep inside."] },
      { symbol: "H₂O", name: ["Wassereis", "Water Ice"], use: ["Die Ringe sind zu 99 % aus Wassereis.", "The rings are 99% water ice."] },
    ],
    treasure: [
      "Die Ringe. Niemand weiß genau, wie sie entstanden sind – vielleicht aus einem zerbrochenen Mond.",
      "The rings. Nobody knows exactly how they formed — perhaps from a shattered moon.",
    ],
    weird: [
      "Auf Saturn regnet es vermutlich Helium-Tropfen. Echter flüssiger Helium-Regen, tief im Inneren.",
      "On Saturn it probably rains helium droplets. Real liquid helium rain, deep inside.",
    ],
  },
  uranus: {
    surface: [
      "Kein fester Boden – ein matschiger Ozean aus Wasser, Ammoniak und Methan unter dicker Atmosphäre.",
      "No solid ground — a slushy ocean of water, ammonia and methane beneath a thick atmosphere.",
    ],
    elements: [
      { symbol: "CH₄", name: ["Methan", "Methane"], use: ["Färbt Uranus türkis – und brennt als Gas zum Kochen.", "Colours Uranus turquoise — and burns as cooking gas."] },
      { symbol: "H₂O", name: ["Wasser", "Water"], use: ["Tief drinnen als heißes, gepresstes Eis.", "Deep inside as hot, compressed ice."] },
      { symbol: "C", name: ["Kohlenstoff", "Carbon"], use: ["Wird hier zu echten Diamanten zerquetscht.", "Gets crushed into real diamonds here."] },
    ],
    treasure: [
      "Diamantenregen. Tief im Inneren wird Methan so gepresst, dass Diamanten herausfallen und nach unten regnen.",
      "Diamond rain. Deep inside, methane is so compressed that diamonds fall out and rain downward.",
    ],
    weird: [
      "Uranus liegt komplett auf der Seite – sein Nordpol zeigt für 42 Jahre direkt zur Sonne, dann 42 Jahre weg.",
      "Uranus lies completely on its side — its north pole points directly at the Sun for 42 years, then away for 42 years.",
    ],
  },
  neptun: {
    surface: [
      "Ein eisiger Ozean unter rasenden Sturmwolken. Tiefblau, weil Methan rotes Licht schluckt.",
      "An icy ocean beneath racing storm clouds. Deep blue because methane absorbs red light.",
    ],
    elements: [
      { symbol: "CH₄", name: ["Methan", "Methane"], use: ["Macht das tiefe Blau – wie bei Uranus, nur dunkler.", "Makes the deep blue — like Uranus, but darker."] },
      { symbol: "H₂O", name: ["Wasser", "Water"], use: ["Heißes Eis unter riesigem Druck.", "Hot ice under immense pressure."] },
      { symbol: "C", name: ["Kohlenstoff", "Carbon"], use: ["Auch hier vermutet man Diamantenregen.", "Diamond rain is suspected here too."] },
    ],
    treasure: [
      "Vielleicht ein Ozean aus Diamanten – winzige Edelsteine, die durch heißes Eis schwimmen.",
      "Perhaps an ocean of diamonds — tiny gems swimming through hot ice.",
    ],
    weird: [
      "Die Winde sind schneller als jeder Düsenjet – 2.000 km/h, obwohl es kaum Sonnenwärme gibt, die sie antreiben könnte.",
      "The winds are faster than any jet aircraft — 2,000 km/h, even though there is barely any solar heat to drive them.",
    ],
  },
};

/* ---------- helpers ---------- */

function formatDay(hours: number, isEn: boolean) {
  if (hours < 48) return `${hours.toFixed(hours < 10 ? 1 : 0)} h`;
  return `${Math.round(hours / 24)} ${isEn ? "Earth days" : "Erdtage"}`;
}
function formatYear(days: number, isEn: boolean) {
  if (days < 800) return `${days} ${isEn ? "days" : "Tage"}`;
  return `${(days / 365).toFixed(days / 365 < 10 ? 1 : 0)} ${isEn ? "Earth years" : "Erdjahre"}`;
}

/* ---------- 1. The picker — tap a planet ---------- */

function PlanetPicker({
  activeId,
  setActiveId,
}: {
  activeId: string;
  setActiveId: (id: string) => void;
}) {
  const t = useT();
  const [revealIdx, setRevealIdx] = useState(0);
  const active = PLANETS.find((p) => p.id === activeId)!;

  const handlePick = (id: string) => {
    if (id === activeId) {
      setRevealIdx((i) => (i + 1) % active.reveals.length);
    } else {
      setActiveId(id);
      setRevealIdx(0);
    }
  };

  return (
    <section>
      {/* Big stage */}
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-black starfield">
        <div
          key={active.id}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={active.img}
            alt={t(active.name[0], active.name[1])}
            className="h-[82%] w-[82%] animate-[spin_60s_linear_infinite] rounded-full object-cover shadow-[0_0_80px_20px_rgba(124,58,237,0.25)]"
            draggable={false}
          />
        </div>

        {/* Reveal text */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
            {t(active.name[0], active.name[1])}
          </p>
          <p
            key={active.id + revealIdx}
            className="mt-1 animate-[fade-in_0.4s_ease-out] font-display text-xl font-black leading-snug text-white"
          >
            {t(active.reveals[revealIdx][0], active.reveals[revealIdx][1])}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            {t(
              `Tippe nochmal auf ${active.name[0]}, um mehr zu entdecken · ${revealIdx + 1}/${active.reveals.length}`,
              `Tap ${active.name[1]} again to discover more · ${revealIdx + 1}/${active.reveals.length}`
            )}
          </p>
        </div>
      </div>

      {/* The strip — actual relative sizes (capped) */}
      <div className="mt-4 -mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-end gap-3">
          {PLANETS.map((p) => {
            const size = Math.max(36, Math.min(96, 28 + p.rel * 6));
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => handlePick(p.id)}
                className={`relative flex-shrink-0 overflow-hidden rounded-full transition-all duration-300 active:scale-90 ${
                  isActive
                    ? "ring-4 ring-amber-300 shadow-[0_0_30px_rgba(252,211,77,0.5)]"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{ width: size, height: size }}
                aria-label={t(p.name[0], p.name[1])}
              >
                <img
                  src={p.img}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Atlas spread — full-bleed photo with labeled callouts + cutaway ---------- */

function AtlasSpread({ planet }: { planet: Planet }) {
  const t = useT();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [layerIdx, setLayerIdx] = useState(0);
  const layer = planet.layers[layerIdx];

  return (
    <section
      key={planet.id}
      className="overflow-hidden rounded-3xl bg-black animate-[fade-in_0.5s_ease-out]"
    >
      {/* Header above the photo so it never overlaps callout chips */}
      <div className="px-5 pb-3 pt-5">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
          Atlas · {t(planet.name[0], planet.name[1])}
        </p>
        <p className="mt-1 font-display text-lg font-black leading-tight text-white">
          {t(planet.tagline[0], planet.tagline[1])}
        </p>
      </div>

      {/* Full-bleed planet plate */}
      <div className="relative aspect-square w-full starfield">
        <img
          src={planet.img}
          alt={t(planet.name[0], planet.name[1])}
          draggable={false}
          className="absolute inset-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] rounded-full object-cover shadow-[0_0_120px_30px_rgba(124,58,237,0.25)]"
        />

        {/* Callout connector lines */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {planet.callouts.map((c, i) => {
            const tx = i === 0 ? 14 : i === 1 ? 86 : 50;
            const ty = i === 0 ? 8 : i === 1 ? 8 : 95;
            const active = openIdx === null || openIdx === i;
            return (
              <line
                key={i}
                x1={c.x}
                y1={c.y}
                x2={tx}
                y2={ty}
                stroke="#fcd34d"
                strokeWidth="0.25"
                strokeDasharray="1 1"
                opacity={active ? 0.8 : 0.2}
              />
            );
          })}
        </svg>

        {/* Hotspots with always-visible label chips */}
        {planet.callouts.map((c, i) => {
          const isOpen = openIdx === i;
          const chipPos =
            i === 0
              ? "left-2 top-2 items-start text-left"
              : i === 1
                ? "right-2 top-2 items-end text-right"
                : "left-1/2 -translate-x-1/2 bottom-3 items-center text-center";
          const panelId = `callout-${planet.id}-${i}`;
          return (
            <div key={i}>
              {/* Hit-target — 44x44 invisible tap area, visible pulsing dot inside */}
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && isOpen) setOpenIdx(null);
                }}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                aria-label={`${t(c.label[0], c.label[1])}: ${t(c.note[0], c.note[1])}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span
                  className={`block rounded-full bg-amber-300 ring-2 ring-white/40 shadow-[0_0_14px_rgba(252,211,77,0.95)] transition-all ${
                    isOpen ? "h-4 w-4" : "h-3 w-3 animate-pulse"
                  }`}
                />
              </button>

              {/* Label chip — always visible, expands with note when open */}
              <div
                id={panelId}
                className={`pointer-events-none absolute flex flex-col ${chipPos} max-w-[45%]`}
              >
                <span className="pointer-events-auto rounded-full bg-black/70 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm ring-1 ring-amber-300/40">
                  {t(c.label[0], c.label[1])}
                </span>
                {isOpen && (
                  <p className="pointer-events-auto mt-1.5 animate-[fade-in_0.3s_ease-out] rounded-lg bg-black/80 p-2 text-[11px] leading-snug text-white backdrop-blur-sm ring-1 ring-white/10">
                    {t(c.note[0], c.note[1])}
                  </p>
                )}
              </div>
            </div>
          );
        })}


        <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[10px] text-slate-400">
          {t("Tippe einen leuchtenden Punkt.", "Tap a glowing dot.")}
        </p>
      </div>

      {/* Cutaway */}
      <div className="border-t border-white/5 p-5">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
          {t("Was steckt drin?", "What's inside?")}
        </p>
        <p className="mt-1 font-display text-base font-black text-white">
          {t(`Schneide ${planet.name[0]} auf.`, `Cut ${planet.name[1]} open.`)}
        </p>

        <div className="mt-4 grid grid-cols-[140px_1fr] items-center gap-4">
          {/* Concentric cutaway */}
          <div className="relative mx-auto h-[140px] w-[140px]">
            {planet.layers.map((l, i) => {
              const total = planet.layers.length;
              const size = 140 - i * (110 / total);
              const isActive = i === layerIdx;
              return (
                <button
                  key={l.name[0]}
                  onClick={() => setLayerIdx(i)}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform active:scale-95"
                  style={{
                    width: size,
                    height: size,
                    background: l.color,
                    boxShadow: isActive
                      ? `0 0 0 2px #fcd34d, 0 0 20px ${l.color}`
                      : `inset 0 0 12px rgba(0,0,0,0.3)`,
                  }}
                  aria-label={t(l.name[0], l.name[1])}
                />
              );
            })}
          </div>
          {/* Active layer caption */}
          <div key={layer.name[0]} className="animate-[fade-in_0.3s_ease-out]">
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("Schicht", "Layer")} {layerIdx + 1} / {planet.layers.length}
            </p>
            <p className="mt-1 font-display text-base font-black text-white">
              {t(layer.name[0], layer.name[1])}
            </p>
            <p className="mt-1 text-sm leading-snug text-slate-200">{t(layer.note[0], layer.note[1])}</p>
          </div>
        </div>

        {/* Layer dots */}
        <div className="mt-4 flex justify-center gap-2">
          {planet.layers.map((l, i) => (
            <button
              key={l.name[0]}
              onClick={() => setLayerIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === layerIdx ? "w-6 bg-amber-300" : "w-2 bg-white/30"
              }`}
              aria-label={t(`Schicht ${l.name[0]}`, `Layer ${l.name[1]}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. Steckbrief — facts that change with the active planet ---------- */

function PlanetFactSheet({ planet }: { planet: Planet }) {
  const t = useT();
  const { lang } = useLang();
  const isEn = lang === "en";

  const stats: { label: string; value: string; emoji: string }[] = [
    {
      emoji: "🌙",
      label: t("Monde", "Moons"),
      value: planet.moons === 0 ? t("keiner", "none") : String(planet.moons),
    },
    {
      emoji: "🪨",
      label: t("Größe", "Size"),
      value:
        planet.rel === 1
          ? t("= Erde", "= Earth")
          : planet.rel > 1
            ? `${planet.rel.toFixed(planet.rel < 10 ? 1 : 0)}× ${t("Erde", "Earth")}`
            : `${Math.round(planet.rel * 100)}% ${t("Erde", "Earth")}`,
    },
    { emoji: "🌡️", label: t("Temperatur", "Temperature"), value: `${planet.tempC} °C` },
    { emoji: "⏰", label: t("Ein Tag", "One Day"), value: formatDay(planet.dayHours, isEn) },
    { emoji: "📅", label: t("Ein Jahr", "One Year"), value: formatYear(planet.yearDays, isEn) },
    {
      emoji: "⚖️",
      label: t("Schwerkraft", "Gravity"),
      value: `${planet.g.toFixed(2)}× ${t("Erde", "Earth")}`,
    },
  ];
  return (
    <section className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Steckbrief", "Fact Sheet")}
      </p>
      <p className="mt-1 font-display text-lg font-black text-white">
        {t(planet.name[0], planet.name[1])} {t("in Zahlen", "in numbers")}
      </p>
      <div
        key={planet.id}
        className="mt-4 grid animate-[fade-in_0.4s_ease-out] grid-cols-2 gap-3"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/5 p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {s.label}
              </span>
            </div>
            <p className="mt-1 font-display text-base font-black text-white tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 3. Gravity — wie schwer wärst du dort? ---------- */

function GravityScale({ planet }: { planet: Planet }) {
  const t = useT();
  const [earthKg, setEarthKg] = useState(30);
  const otherKg = earthKg * planet.g;

  return (
    <section className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Wie schwer bist du dort?", "How heavy are you there?")}
      </p>
      <p className="mt-1 font-display text-lg font-black leading-tight text-white">
        {t(
          `Auf ${planet.name[0]} wiegst du anders. Probier es aus.`,
          `On ${planet.name[1]} you weigh differently. Try it out.`
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 items-end gap-3">
        {/* Earth */}
        <div className="flex flex-col items-center">
          <div className="text-5xl" aria-hidden>
            🧒
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t("Auf der Erde", "On Earth")}
          </p>
          <p className="font-display text-2xl font-black text-white tabular-nums">
            {earthKg} kg
          </p>
        </div>
        {/* Planet */}
        <div
          key={planet.id}
          className="relative flex flex-col items-center"
        >
          <div
            className="text-5xl transition-transform duration-500"
            style={{
              // visual hint: bigger glow for high-g, floating up for low-g
              transform: `translateY(${(1 - planet.g) * 14}px) scale(${0.85 + planet.g * 0.25})`,
            }}
            aria-hidden
          >
            👨‍🚀
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            {t(`Auf ${planet.name[0]}`, `On ${planet.name[1]}`)}
          </p>
          <p className="animate-[fade-in_0.4s_ease-out] font-display text-2xl font-black text-white tabular-nums">
            {otherKg.toFixed(otherKg < 10 ? 1 : 0)} kg
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("Schieb, um dein Gewicht zu ändern", "Drag to change your weight")}
        </p>
        <input
          type="range"
          min={15}
          max={80}
          step={1}
          value={earthKg}
          onChange={(e) => setEarthKg(Number(e.target.value))}
          className="w-full accent-amber-300"
          aria-label={t("Gewicht auf der Erde", "Weight on Earth")}
        />
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        {planet.g < 0.5
          ? t(
              `Du könntest auf ${planet.name[0]} fast wie ein Superheld springen.`,
              `You could jump almost like a superhero on ${planet.name[1]}.`
            )
          : planet.g > 1.5
            ? t(
                `Auf ${planet.name[0]} fühlst du dich, als würde dich jemand nach unten ziehen.`,
                `On ${planet.name[1]} you feel like someone is pulling you down.`
              )
            : t(
                `Auf ${planet.name[0]} fühlt es sich fast wie zu Hause an.`,
                `On ${planet.name[1]} it feels almost like home.`
              )}
      </p>
    </section>
  );
}

/* ---------- 4. Size comparison — pick two ---------- */

function SizeReveal() {
  const t = useT();
  const [a, setA] = useState<Planet>(PLANETS[2]); // Erde
  const [b, setB] = useState<Planet>(PLANETS[4]); // Jupiter

  const maxRel = Math.max(a.rel, b.rel);
  const scale = 220 / Math.max(maxRel, 1);

  return (
    <section className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Wie groß ist groß?", "How big is big?")}
      </p>
      <p className="mt-1 font-display text-lg font-black leading-tight text-white">
        {t(
          "Tippe zwei Planeten an. Stell sie nebeneinander.",
          "Tap two planets. Put them side by side."
        )}
      </p>

      <div className="mt-4 flex h-64 items-end justify-around">
        {[a, b].map((p, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <img
              src={p.img}
              alt={t(p.name[0], p.name[1])}
              draggable={false}
              className="rounded-full object-cover transition-all duration-500"
              style={{
                width: Math.max(20, p.rel * scale),
                height: Math.max(20, p.rel * scale),
              }}
            />
            <span className="font-display text-sm font-bold text-white">{t(p.name[0], p.name[1])}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center text-xs text-slate-400">
        {b.rel / a.rel >= 2
          ? t(
              `${b.name[0]} ist ${Math.round(b.rel / a.rel)}× so groß wie ${a.name[0]}.`,
              `${b.name[1]} is ${Math.round(b.rel / a.rel)}× as large as ${a.name[1]}.`
            )
          : a.rel / b.rel >= 2
            ? t(
                `${a.name[0]} ist ${Math.round(a.rel / b.rel)}× so groß wie ${b.name[0]}.`,
                `${a.name[1]} is ${Math.round(a.rel / b.rel)}× as large as ${b.name[1]}.`
              )
            : t("Fast gleich groß.", "Almost the same size.")}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SizePicker label={t("Links", "Left")} value={a.id} onChange={(id) => setA(PLANETS.find((p) => p.id === id)!)} />
        <SizePicker label={t("Rechts", "Right")} value={b.id} onChange={(id) => setB(PLANETS.find((p) => p.id === id)!)} />
      </div>
    </section>
  );
}

function SizePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const t = useT();
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLANETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`flex-shrink-0 overflow-hidden rounded-full transition-all active:scale-90 ${
              value === p.id ? "ring-2 ring-amber-300" : "opacity-50"
            }`}
            style={{ width: 32, height: 32 }}
            aria-label={t(p.name[0], p.name[1])}
          >
            <img src={p.img} alt="" className="h-full w-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- 5. Distance walk — scroll through space ---------- */

function DistanceWalk() {
  const t = useT();
  const { lang } = useLang();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [km, setKm] = useState(0);
  const [passed, setPassed] = useState<Planet | null>(null);

  const positions = PLANETS.map((p) => ({
    ...p,
    leftPx: Math.sqrt(p.distMkm) * 90,
  }));
  const totalWidth = positions[positions.length - 1].leftPx + 400;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const ratio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      const maxKm = PLANETS[PLANETS.length - 1].distMkm;
      const cur = Math.round(ratio * maxKm);
      setKm(cur);
      const lastPassed = [...positions].reverse().find((p) => cur >= p.distMkm * 0.85);
      setPassed(lastPassed ?? null);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Wie weit ist das?", "How far is that?")}
      </p>
      <p className="mt-1 font-display text-lg font-black leading-tight text-white">
        {t(
          "Wisch nach rechts. Reise von der Sonne weg.",
          "Swipe right. Journey away from the Sun."
        )}
      </p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl font-black text-white tabular-nums">
          {km.toLocaleString(lang === "en" ? "en-GB" : "de-DE")}
        </span>
        <span className="text-xs text-slate-400">{t("Mio. km von der Sonne", "M km from the Sun")}</span>
      </div>
      <div className="h-5 text-xs text-amber-300">
        {passed
          ? t(
              `🚀 Du bist gerade an ${passed.name[0]} vorbei.`,
              `🚀 You just passed ${passed.name[1]}.`
            )
          : t("🚀 Bereit zum Abflug…", "🚀 Ready for takeoff…")}
      </div>

      <div
        ref={scrollerRef}
        className="mt-2 -mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative h-40" style={{ width: totalWidth }}>
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: 0 }}>
            <img
              src={SUN_IMG}
              alt={t("Sonne", "Sun")}
              className="h-32 w-32 rounded-full object-cover shadow-[0_0_60px_20px_rgba(252,211,77,0.5)]"
              draggable={false}
            />
          </div>
          <div className="absolute left-32 right-0 top-1/2 h-px bg-gradient-to-r from-amber-300/50 via-purple-500/30 to-transparent" />
          {positions.map((p) => {
            const size = Math.max(20, Math.min(60, 14 + p.rel * 4));
            return (
              <div
                key={p.id}
                className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center"
                style={{ left: 130 + p.leftPx }}
              >
                <img
                  src={p.img}
                  alt={t(p.name[0], p.name[1])}
                  draggable={false}
                  className="rounded-full object-cover"
                  style={{ width: size, height: size }}
                />
                <span className="mt-1 text-[10px] font-bold text-white/80">{t(p.name[0], p.name[1])}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Moon counter ---------- */

function MoonCounter({ planet }: { planet: Planet }) {
  const t = useT();
  const max = 30;
  const dots = Math.min(planet.moons, max);
  return (
    <section className="rounded-3xl bg-[#10101e] p-5">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
        {t("Wie viele Monde?", "How many moons?")}
      </p>
      <p className="mt-1 font-display text-lg font-black leading-tight text-white">
        {t(planet.name[0], planet.name[1])}{" "}
        {t("hat", "has")}{" "}
        <span className="text-amber-300">
          {planet.moons === 0
            ? t("keinen Mond", "no moon")
            : `${planet.moons} ${planet.moons === 1 ? t("Mond", "moon") : t("Monde", "moons")}`}
        </span>
        .
      </p>
      <div className="mt-4 min-h-[64px]">
        {planet.moons === 0 ? (
          <p className="text-sm text-slate-400">
            {t(
              "Hier kreist nichts um den Planeten. Ganz allein im All.",
              "Nothing orbits this planet. All alone in space."
            )}
          </p>
        ) : (
          <div key={planet.id} className="flex flex-wrap gap-1.5 animate-[fade-in_0.4s_ease-out]">
            {Array.from({ length: dots }).map((_, i) => (
              <span
                key={i}
                className="block h-3 w-3 rounded-full bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />
            ))}
            {planet.moons > max && (
              <span className="ml-1 text-xs text-slate-400">+{planet.moons - max} {t("mehr", "more")}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Level system ---------- */

const LEVEL_KEY = "planeten_level";
const LEVEL_EVENT = "planeten-level-change";
const MAX_LEVEL = 3;

function readLevel(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(localStorage.getItem(LEVEL_KEY) ?? "0");
    return Number.isFinite(n) ? Math.max(0, Math.min(MAX_LEVEL, n)) : 0;
  } catch {
    return 0;
  }
}
function writeLevel(n: number) {
  try {
    localStorage.setItem(LEVEL_KEY, String(n));
    window.dispatchEvent(new Event(LEVEL_EVENT));
  } catch {
    /* ignore */
  }
}
function useLevel() {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    setLevel(readLevel());
    const h = () => setLevel(readLevel());
    window.addEventListener(LEVEL_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(LEVEL_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return level;
}

/* ---------- Quiz pools (one per level) ---------- */

type QuizQ = {
  q: Bi;
  options: Bi[];
  answer: number;
  explain: Bi;
};

const QUIZ_LEVELS: { title: Bi; reward: Bi; questions: QuizQ[] }[] = [
  {
    title: ["Level 1 · Die Planeten", "Level 1 · The Planets"],
    reward: ["Schaltet frei: Was der Boden jedes Planeten ist.", "Unlocks: What the surface of each planet is."],
    questions: [
      {
        q: ["Wie viele Monde hat Jupiter?", "How many moons does Jupiter have?"],
        options: [["4", "4"], ["27", "27"], ["95", "95"]],
        answer: 2,
        explain: ["Jupiter hat 95 bekannte Monde.", "Jupiter has 95 known moons."],
      },
      {
        q: ["Wo steht der größte Vulkan?", "Where is the biggest volcano?"],
        options: [["Venus", "Venus"], ["Mars", "Mars"], ["Erde", "Earth"]],
        answer: 1,
        explain: ["Olympus Mons auf dem Mars – 22 km hoch.", "Olympus Mons on Mars — 22 km tall."],
      },
      {
        q: ["Wie heißt Jupiters Sturm?", "What is Jupiter's storm called?"],
        options: [["Sechseck", "Hexagon"], ["Großer Roter Fleck", "Great Red Spot"], ["Scooter", "Scooter"]],
        answer: 1,
        explain: ["Er tobt seit über 350 Jahren.", "It has been raging for over 350 years."],
      },
      {
        q: ["Welcher Planet liegt auf der Seite?", "Which planet lies on its side?"],
        options: [["Neptun", "Neptune"], ["Uranus", "Uranus"], ["Venus", "Venus"]],
        answer: 1,
        explain: ["Uranus rollt seitlich um die Sonne.", "Uranus rolls sideways around the Sun."],
      },
      {
        q: ["Welcher Planet würde im Wasser schwimmen?", "Which planet would float on water?"],
        options: [["Saturn", "Saturn"], ["Jupiter", "Jupiter"], ["Neptun", "Neptune"]],
        answer: 0,
        explain: ["Saturn ist so leicht wie Wasser.", "Saturn is as light as water."],
      },
      {
        q: ["Welcher Planet ist der Sonne am nächsten?", "Which planet is closest to the Sun?"],
        options: [["Venus", "Venus"], ["Merkur", "Mercury"], ["Mars", "Mars"]],
        answer: 1,
        explain: ["Merkur ist die Nummer 1 von der Sonne.", "Mercury is number 1 from the Sun."],
      },
    ],
  },
  {
    title: ["Level 2 · Boden & Elemente", "Level 2 · Surface & Elements"],
    reward: ["Schaltet frei: Welche Elemente in jedem Planeten stecken.", "Unlocks: Which elements are in each planet."],
    questions: [
      {
        q: ["Woraus ist der rote Sand auf dem Mars?", "What is the red sand on Mars made of?"],
        options: [["Rost (Eisen)", "Rust (iron)"], ["Schwefel", "Sulphur"], ["Kohle", "Coal"]],
        answer: 0,
        explain: ["Eisen im Boden rostet – darum ist Mars rot.", "Iron in the ground rusts — that's why Mars is red."],
      },
      {
        q: ["Was macht Venus' Wolken gelb?", "What makes Venus's clouds yellow?"],
        options: [["Methan", "Methane"], ["Schwefel", "Sulphur"], ["Helium", "Helium"]],
        answer: 1,
        explain: ["Schwefel macht die gelben, stinkenden Wolken.", "Sulphur makes the yellow, smelly clouds."],
      },
      {
        q: ["Welches Gas färbt Uranus türkis?", "Which gas colours Uranus turquoise?"],
        options: [["Sauerstoff", "Oxygen"], ["Methan", "Methane"], ["Wasserstoff", "Hydrogen"]],
        answer: 1,
        explain: ["Methan schluckt rotes Licht – übrig bleibt Türkis.", "Methane absorbs red light — leaving turquoise."],
      },
      {
        q: ["Woraus sind Saturns Ringe?", "What are Saturn's rings made of?"],
        options: [["Staub", "Dust"], ["Wassereis", "Water ice"], ["Diamanten", "Diamonds"]],
        answer: 1,
        explain: ["Die Ringe sind zu 99 % aus Wassereis.", "The rings are 99% water ice."],
      },
      {
        q: ["Was liegt in Merkurs dunklen Kratern?", "What lies in Mercury's dark craters?"],
        options: [["Lava", "Lava"], ["Eis", "Ice"], ["Sand", "Sand"]],
        answer: 1,
        explain: ["Im ewigen Schatten liegt Wassereis.", "Water ice lies in the eternal shadow."],
      },
      {
        q: ["Woraus bestehen Jupiter und Saturn?", "What are Jupiter and Saturn made of?"],
        options: [["Fels", "Rock"], ["Wasserstoff & Helium", "Hydrogen & helium"], ["Eis", "Ice"]],
        answer: 1,
        explain: ["Beides sind Gasriesen.", "Both are gas giants."],
      },
    ],
  },
  {
    title: ["Level 3 · Forscher-Geheimnisse", "Level 3 · Explorer Secrets"],
    reward: ["Schaltet frei: Die verrücktesten Fakten zu jedem Planeten.", "Unlocks: The wildest facts about each planet."],
    questions: [
      {
        q: ["Was regnet tief in Uranus?", "What rains deep inside Uranus?"],
        options: [["Wasser", "Water"], ["Diamanten", "Diamonds"], ["Eisen", "Iron"]],
        answer: 1,
        explain: ["Kohlenstoff wird zu echten Diamanten gepresst.", "Carbon is compressed into real diamonds."],
      },
      {
        q: ["Was tut Merkur seit Milliarden Jahren?", "What has Mercury been doing for billions of years?"],
        options: [["Er wächst", "Growing"], ["Er schrumpft", "Shrinking"], ["Er glüht", "Glowing"]],
        answer: 1,
        explain: ["Er ist ca. 7 km kleiner geworden.", "It has become about 7 km smaller."],
      },
      {
        q: ["Wie schnell sind Neptuns Winde?", "How fast are Neptune's winds?"],
        options: [["200 km/h", "200 km/h"], ["800 km/h", "800 km/h"], ["2.000 km/h", "2,000 km/h"]],
        answer: 2,
        explain: ["Schneller als jeder Düsenjet.", "Faster than any jet aircraft."],
      },
      {
        q: ["Was passiert tief in Saturn?", "What happens deep inside Saturn?"],
        options: [["Helium regnet", "Helium rains"], ["Es schneit", "It snows"], ["Blitze sind grün", "Lightning is green"]],
        answer: 0,
        explain: ["Flüssige Helium-Tropfen fallen nach unten.", "Liquid helium droplets fall downward."],
      },
      {
        q: ["Wie lang ist ein Tag auf Venus?", "How long is a day on Venus?"],
        options: [["24 h", "24 h"], ["Länger als ein Jahr", "Longer than a year"], ["1 Woche", "1 week"]],
        answer: 1,
        explain: ["Venus dreht sich extrem langsam – und rückwärts.", "Venus rotates extremely slowly — and backwards."],
      },
      {
        q: ["Was liegt auf Venus' höchsten Bergen?", "What lies on Venus's highest mountains?"],
        options: [["Metallischer Schnee", "Metallic snow"], ["Goldstaub", "Gold dust"], ["Eiskristalle", "Ice crystals"]],
        answer: 0,
        explain: ["Ein Schnee aus Blei und Wismut.", "A snow of lead and bismuth."],
      },
    ],
  },
];

/* ---------- Quiz launcher (visible only when player chooses to test) ---------- */

function QuizLauncher({ onStart }: { onStart: () => void }) {
  const t = useT();
  const level = useLevel();
  const next = level + 1;
  const maxed = level >= MAX_LEVEL;
  const pool = QUIZ_LEVELS[Math.min(level, MAX_LEVEL - 1)];

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
          {t("Forscher-Stufe", "Explorer Level")}
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_LEVEL }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-6 rounded-full ${i < level ? "bg-amber-300" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 font-display text-xl font-black leading-snug text-white">
        {maxed
          ? t("Du bist auf der höchsten Stufe.", "You've reached the highest level.")
          : t(`Stufe ${level} erreicht. Quiz lösen → Stufe ${next}.`, `Level ${level} reached. Solve the quiz → Level ${next}.`)}
      </p>
      <p className="mt-2 text-sm text-white/85">
        {maxed
          ? t("Du hast alle Geheimnisse freigeschaltet. Stark.", "You've unlocked all secrets. Impressive.")
          : t(pool.reward[0], pool.reward[1])}
      </p>
      {!maxed && (
        <button
          onClick={onStart}
          className="mt-4 rounded-full bg-amber-400 px-5 py-2 font-display font-bold text-black active:scale-95"
        >
          {t("Quiz starten →", "Start quiz →")}
        </button>
      )}
      <p className="mt-3 text-[11px] text-white/60">
        {t(
          "Nur 100 % richtig schaltet die nächste Stufe frei.",
          "Only 100% correct unlocks the next level."
        )}
      </p>
    </section>
  );
}

/* ---------- Quiz modal ---------- */

function QuizModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const level = useLevel();
  const pool = QUIZ_LEVELS[Math.min(level, MAX_LEVEL - 1)];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = pool.questions[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 >= pool.questions.length) {
      if (score === pool.questions.length) {
        writeLevel(Math.min(MAX_LEVEL, level + 1));
      }
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }
  function retry() {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  const perfect = done && score === pool.questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg animate-[fade-in_0.25s_ease-out] overflow-hidden rounded-t-3xl bg-[#13132a] ring-1 ring-white/10 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
            {t(pool.title[0], pool.title[1])}
          </p>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white"
          >
            {t("Schließen", "Close")}
          </button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <p className="font-display text-3xl font-black text-white">
              {score} / {pool.questions.length}
            </p>
            <p
              className={`mt-2 font-display text-sm font-bold ${
                perfect ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {perfect
                ? t(`Perfekt! Stufe ${level + 1} freigeschaltet.`, `Perfect! Level ${level + 1} unlocked.`)
                : t("Noch nicht alles richtig.", "Not everything correct yet.")}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {perfect
                ? t("Die Planeten zeigen dir jetzt mehr.", "The planets will now show you more.")
                : t(
                    "Nur 100 % schalten die nächste Stufe frei – probier's nochmal.",
                    "Only 100% unlocks the next level — try again."
                  )}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              {!perfect && (
                <button
                  onClick={retry}
                  className="rounded-full bg-amber-400 px-5 py-2 font-display font-bold text-black active:scale-95"
                >
                  {t("Nochmal", "Try again")}
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-full bg-white/15 px-5 py-2 font-display font-bold text-white active:scale-95"
              >
                {t("Schließen", "Close")}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-xs text-slate-400">
              {t("Frage", "Question")} {idx + 1} / {pool.questions.length}
            </p>
            <h3 className="mt-2 font-display text-lg font-black leading-snug text-white">
              {t(q.q[0], q.q[1])}
            </h3>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                const chosen = picked === i;
                const showRight = picked !== null && i === q.answer;
                const showWrong = chosen && i !== q.answer;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-display font-bold transition ${
                      showRight
                        ? "bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-400"
                        : showWrong
                          ? "bg-rose-500/20 text-rose-200 ring-2 ring-rose-400"
                          : picked !== null
                            ? "bg-white/5 text-slate-400"
                            : "bg-white/10 text-white active:scale-[0.98] hover:bg-white/15"
                    }`}
                  >
                    <span>{t(opt[0], opt[1])}</span>
                    {showRight && <span>✓</span>}
                    {showWrong && <span>✗</span>}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-4 animate-[fade-in_0.3s_ease-out] rounded-2xl bg-black/40 p-4">
                <p
                  className={`font-display text-sm font-bold ${
                    picked === q.answer ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {picked === q.answer ? t("Richtig!", "Correct!") : t("Knapp daneben.", "Not quite.")}
                </p>
                <p className="mt-1 text-sm text-slate-200">{t(q.explain[0], q.explain[1])}</p>
                <button
                  onClick={next}
                  className="mt-3 rounded-full bg-amber-400 px-5 py-2 font-display font-bold text-black active:scale-95"
                >
                  {idx + 1 >= pool.questions.length ? t("Ergebnis ansehen", "See results") : t("Weiter →", "Next →")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Deep Dive — progressive reveal by level ---------- */

function DeepDivePanel({ planet }: { planet: Planet }) {
  const t = useT();
  const level = useLevel();
  const dive = DEEP_DIVES[planet.id];
  if (!dive || level < 1) return null;

  return (
    <section
      key={planet.id + level}
      className="overflow-hidden rounded-3xl bg-[#13132a] ring-1 ring-white/5 animate-[fade-in_0.4s_ease-out]"
    >
      <div className="bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-5">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
          {t("Forscher-Modus", "Explorer Mode")} · {t("Stufe", "Level")} {level} · {t(planet.name[0], planet.name[1])}
        </p>
        <p className="mt-1 font-display text-lg font-black leading-snug text-white">
          {level === 1
            ? t(`Der Boden von ${planet.name[0]}`, `The surface of ${planet.name[1]}`)
            : level === 2
              ? t(`Woraus ${planet.name[0]} besteht`, `What ${planet.name[1]} is made of`)
              : t(`Die Geheimnisse von ${planet.name[0]}`, `The secrets of ${planet.name[1]}`)}
        </p>
      </div>

      <div className="border-t border-white/5 p-5">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {t("Der Boden", "The Surface")}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-100">{t(dive.surface[0], dive.surface[1])}</p>
      </div>

      {level >= 2 && (
        <>
          <div className="border-t border-white/5 p-5">
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t("Elemente, die hier vorkommen", "Elements found here")}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {dive.elements.map((e) => (
                <div
                  key={e.symbol}
                  className="flex items-start gap-3 rounded-2xl bg-black/30 p-3 ring-1 ring-white/5"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-display text-base font-black text-black">
                    {e.symbol}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-black text-white">{t(e.name[0], e.name[1])}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-300">{t(e.use[0], e.use[1])}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 p-5">
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-amber-300">
              💎 {t("Das Wertvolle hier", "The treasure here")}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-100">{t(dive.treasure[0], dive.treasure[1])}</p>
          </div>
        </>
      )}

      {level >= 3 && (
        <div className="border-t border-white/5 p-5">
          <p className="font-display text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
            🤯 {t("Komplett verrückt", "Totally wild")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-100">{t(dive.weird[0], dive.weird[1])}</p>
        </div>
      )}
    </section>
  );
}

/* ---------- The full experience ---------- */

export function PlanetenExperience() {
  const t = useT();
  const [activeId, setActiveId] = useState<string>("erde");
  const [quizOpen, setQuizOpen] = useState(false);
  const active = PLANETS.find((p) => p.id === activeId)!;

  return (
    <main className="min-h-screen bg-[#0D0D1A] pb-24">
      {/* Sticky back */}
      <Link
        to="/erkunden"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md"
        aria-label={t("Zurück", "Back")}
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Link>

      {/* Hero */}
      <header className="px-5 pb-2 pt-20">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
          {t("Planeten & Weltall", "Planets & Space")}
        </p>
        <h1 className="mt-1 font-display text-2xl font-black leading-tight text-white">
          {t("Tippe einen Planeten.", "Tap a planet.")}
        </h1>
      </header>

      <div className="mx-auto mt-4 max-w-2xl space-y-6 px-5">
        <PlanetPicker activeId={activeId} setActiveId={setActiveId} />
        <AtlasSpread planet={active} />
        <PlanetFactSheet planet={active} />
        <GravityScale planet={active} />
        <MoonCounter planet={active} />
        <SizeReveal />
        <DistanceWalk />

        <DeepDivePanel planet={active} />
        <QuizLauncher onStart={() => setQuizOpen(true)} />
        {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}


      </div>
    </main>
  );
}
