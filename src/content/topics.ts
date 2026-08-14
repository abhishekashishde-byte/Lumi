export interface TopicFact {
  emoji: string;
  text: string;
}

export interface PlanetData {
  name: string;
  color: string;
  sizeVsEarth: string;
  distance: string;
  fact: string;
  orbitRadius: number;
  size: number;
  duration: number;
}

export interface InternetStep {
  id: string;
  label: string;
  emoji: string;
  explanation: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  layer: "input" | "hidden" | "output";
  explanation: string;
}

export interface ChainLink {
  id: string;
  name: string;
  emoji: string;
  role: string;
}

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  heroImage: string;
  bigQuestion: string;
  lottieUrl: string;
  facts: TopicFact[];
  videoUrl: string;
  videoTitle: string;
  videoDuration: string;
  videoThumb: string;
  diagramData: unknown;
}

export const topics: Topic[] = [
  {
    id: "planeten",
    title: "Planeten & Weltall",
    emoji: "🪐",
    gradient: "from-indigo-600 via-purple-600 to-fuchsia-600",
    heroImage:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80",
    bigQuestion: "Warum schweben die Planeten um die Sonne?",
    lottieUrl:
      "https://assets-v2.lottiefiles.com/a/0c6a2a3e-1173-11ee-9a5c-c36d7c9a6d8c/8wMQFi9mwt.lottie",
    facts: [
      { emoji: "☀️", text: "Die Sonne ist ein Stern – und so heiß, dass eine Stecknadel daraus alles um sich herum verbrennen würde." },
      { emoji: "🪐", text: "Jupiter ist so groß, dass alle anderen Planeten zusammen hineinpassen würden." },
      { emoji: "🌍", text: "Die Erde ist der einzige Planet mit flüssigem Wasser an der Oberfläche." },
    ],
    videoUrl: "https://www.youtube.com/embed/libKVRa01L8?rel=0",
    videoTitle: "Eine Reise durch unser Sonnensystem",
    videoDuration: "6 Min",
    videoThumb: "https://img.youtube.com/vi/libKVRa01L8/maxresdefault.jpg",
    diagramData: [
      { name: "Merkur", color: "#a8a29e", sizeVsEarth: "0,38× Erde", distance: "58 Mio. km", fact: "Merkur ist der kleinste Planet und hat keine Atmosphäre.", orbitRadius: 60, size: 6, duration: 8 },
      { name: "Venus", color: "#fbbf24", sizeVsEarth: "0,95× Erde", distance: "108 Mio. km", fact: "Auf der Venus ist es heißer als auf Merkur – wegen der dicken Wolken.", orbitRadius: 85, size: 9, duration: 12 },
      { name: "Erde", color: "#3b82f6", sizeVsEarth: "1× Erde", distance: "150 Mio. km", fact: "Die Erde ist der einzige Planet mit flüssigem Wasser an der Oberfläche.", orbitRadius: 115, size: 10, duration: 16 },
      { name: "Mars", color: "#ef4444", sizeVsEarth: "0,53× Erde", distance: "228 Mio. km", fact: "Mars heißt der rote Planet, weil sein Boden voller Eisenrost ist.", orbitRadius: 145, size: 8, duration: 22 },
      { name: "Jupiter", color: "#f59e0b", sizeVsEarth: "11× Erde", distance: "778 Mio. km", fact: "Jupiter ist so groß, dass alle anderen Planeten zusammen hineinpassen würden.", orbitRadius: 185, size: 22, duration: 30 },
      { name: "Saturn", color: "#eab308", sizeVsEarth: "9× Erde", distance: "1,4 Mrd. km", fact: "Saturn hat Ringe aus Eis und Stein – manche so groß wie Häuser.", orbitRadius: 225, size: 19, duration: 40 },
      { name: "Uranus", color: "#06b6d4", sizeVsEarth: "4× Erde", distance: "2,9 Mrd. km", fact: "Uranus liegt auf der Seite – als würde er rollen statt sich drehen.", orbitRadius: 265, size: 14, duration: 52 },
      { name: "Neptun", color: "#2563eb", sizeVsEarth: "3,9× Erde", distance: "4,5 Mrd. km", fact: "Auf Neptun wehen die schnellsten Winde im Sonnensystem – bis 2.000 km/h.", orbitRadius: 305, size: 14, duration: 65 },
    ] as PlanetData[],
  },
  {
    id: "strom",
    title: "Strom & Schaltkreise",
    emoji: "⚡",
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    heroImage:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    bigQuestion: "Warum leuchtet eine Lampe, wenn du den Schalter drückst?",
    lottieUrl:
      "https://assets-v2.lottiefiles.com/a/e0e67e92-116d-11ee-b5e3-8f847c2a4a7f/Pq2EDlkMJM.lottie",
    facts: [
      { emoji: "🔁", text: "Strom fließt immer im Kreis – das nennt man einen Stromkreis." },
      { emoji: "🔋", text: "In einer Batterie steckt Energie, die als Strom durch ein Kabel reisen kann." },
      { emoji: "💡", text: "Eine Glühbirne leuchtet, weil ein dünner Draht im Inneren ganz heiß wird." },
    ],
    videoUrl: "https://www.youtube.com/embed/mc979OhitAg?rel=0",
    videoTitle: "Wie funktioniert Strom?",
    videoDuration: "5 Min",
    videoThumb: "https://img.youtube.com/vi/mc979OhitAg/maxresdefault.jpg",
    diagramData: {},
  },
  {
    id: "internet",
    title: "Das Internet",
    emoji: "🌐",
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    bigQuestion: "Wie kommt eine Nachricht von dir zu deinem Freund?",
    lottieUrl:
      "https://assets-v2.lottiefiles.com/a/3e78c3e0-1171-11ee-9a5c-c36d7c9a6d8c/5nPpG1Fhkr.lottie",
    facts: [
      { emoji: "🔌", text: "Das Internet besteht aus Millionen von Computern, die durch Kabel und Funk verbunden sind." },
      { emoji: "🌊", text: "Unter den Ozeanen liegen riesige Kabel – sie verbinden ganze Kontinente." },
      { emoji: "📦", text: "Deine Nachricht wird in viele kleine Pakete zerlegt und einzeln verschickt." },
    ],
    videoUrl: "https://www.youtube.com/embed/Dxcc6ycZ73M?rel=0",
    videoTitle: "Wie funktioniert das Internet?",
    videoDuration: "4 Min",
    videoThumb: "https://img.youtube.com/vi/Dxcc6ycZ73M/maxresdefault.jpg",
    diagramData: [
      { id: "device", label: "Dein Gerät", emoji: "📱", explanation: "Dein Handy oder Computer schickt deine Nachricht los." },
      { id: "router", label: "Router", emoji: "📡", explanation: "Der Router zu Hause leitet die Nachricht nach draußen weiter." },
      { id: "cable", label: "Kabel & Funk", emoji: "🌊", explanation: "Die Nachricht reist durch lange Kabel – manche liegen sogar unter dem Meer." },
      { id: "dc", label: "Rechenzentrum", emoji: "🏢", explanation: "Im Rechenzentrum stehen tausende Computer, die deine Nachricht speichern." },
      { id: "site", label: "Website", emoji: "🖥️", explanation: "Am Ende landet sie dort, wo dein Freund sie sehen kann." },
    ] as InternetStep[],
  },
  {
    id: "ki",
    title: "Was ist KI?",
    emoji: "🤖",
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    heroImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    bigQuestion: "Wie lernt ein Computer, eine Katze zu erkennen?",
    lottieUrl:
      "https://assets-v2.lottiefiles.com/a/2f0b4a00-1170-11ee-9a5c-c36d7c9a6d8c/9HjX1a2bMK.lottie",
    facts: [
      { emoji: "🧠", text: "KI lernt durch Beispiele, genau wie du in der Schule." },
      { emoji: "🖼️", text: "Eine KI muss tausende Bilder sehen, um eine Katze zu erkennen." },
      { emoji: "❓", text: "KI versteht nicht wirklich, was sie tut – sie rechnet nur sehr schnell." },
    ],
    videoUrl: "https://www.youtube.com/embed/SN2BZswEWUA?rel=0",
    videoTitle: "Was ist Künstliche Intelligenz?",
    videoDuration: "5 Min",
    videoThumb: "https://img.youtube.com/vi/SN2BZswEWUA/maxresdefault.jpg",
    diagramData: {
      inputs: [
        { id: "i1", label: "Katze", emoji: "🐱", layer: "input" as const, explanation: "Bilder gehen als Daten in die KI hinein." },
        { id: "i2", label: "Hund", emoji: "🐶", layer: "input" as const, explanation: "Jedes Bild wird in Zahlen umgewandelt." },
        { id: "i3", label: "Auto", emoji: "🚗", explanation: "Auch ein Auto kann die KI lernen." , layer: "input" as const },
      ],
      hidden: [
        { id: "h1", label: "Knoten", layer: "hidden" as const, explanation: "Dieser Knoten sucht nach Kanten und Linien im Bild." },
        { id: "h2", label: "Knoten", layer: "hidden" as const, explanation: "Dieser Knoten erkennt Formen wie Ohren oder Räder." },
        { id: "h3", label: "Knoten", layer: "hidden" as const, explanation: "Dieser Knoten kombiniert alles zu einem Muster." },
        { id: "h4", label: "Knoten", layer: "hidden" as const, explanation: "Dieser Knoten gewichtet, was am wichtigsten ist." },
      ],
      output: [
        { id: "o1", label: "Katze", layer: "output" as const, explanation: "Die KI sagt: Das ist mit 92 % eine Katze." },
      ],
    },
  },
  {
    id: "natur",
    title: "Erde & Natur",
    emoji: "🌍",
    gradient: "from-emerald-500 via-teal-600 to-green-700",
    heroImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    bigQuestion: "Warum braucht alles in der Natur einander?",
    lottieUrl:
      "https://assets-v2.lottiefiles.com/a/1a2b3c4d-1169-11ee-9a5c-c36d7c9a6d8c/3Kp8N2mQxL.lottie",
    facts: [
      { emoji: "🌱", text: "Pflanzen wandeln Sonnenlicht in Energie um – das heißt Fotosynthese." },
      { emoji: "🦌", text: "Pflanzenfresser wie das Reh fressen Gräser und Blätter, um stark zu werden." },
      { emoji: "🐺", text: "Räuber wie der Wolf helfen, dass nicht zu viele Tiere einer Art entstehen." },
    ],
    videoUrl: "https://www.youtube.com/embed/ZV7b_s9E_a4?rel=0",
    videoTitle: "Die Nahrungskette einfach erklärt",
    videoDuration: "4 Min",
    videoThumb: "https://img.youtube.com/vi/ZV7b_s9E_a4/maxresdefault.jpg",
    diagramData: [
      { id: "sun", name: "Sonne", emoji: "☀️", role: "Die Sonne gibt Energie – ohne sie geht nichts." },
      { id: "plant", name: "Pflanze", emoji: "🌿", role: "Pflanzen machen aus Sonnenlicht Nahrung." },
      { id: "deer", name: "Reh", emoji: "🦌", role: "Das Reh frisst Pflanzen und lebt davon." },
      { id: "wolf", name: "Wolf", emoji: "🐺", role: "Der Wolf jagt Rehe und hält das Gleichgewicht." },
    ] as ChainLink[],
  },
];

export const getTopic = (id: string) => topics.find((t) => t.id === id);
