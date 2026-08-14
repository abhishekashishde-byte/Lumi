import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getTopic, type PlanetData, type InternetStep, type ChainLink } from "@/content/topics";
import { PlanetsOrrery } from "@/components/diagrams/PlanetsOrrery";
import { CircuitBuilder } from "@/components/diagrams/CircuitBuilder";
import { InternetJourney } from "@/components/diagrams/InternetJourney";
import { NeuralNet } from "@/components/diagrams/NeuralNet";
import { FoodChain } from "@/components/diagrams/FoodChain";
import { LottiePanel } from "@/components/LottiePanel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { markExplored } from "@/lib/progress";
import { PlanetenExperience } from "@/components/planeten/PlanetenExperience";
import { StromExperience } from "@/components/strom/StromExperience";
import { InternetExperience } from "@/components/internet/InternetExperience";
import { KiExperience } from "@/components/ki/KiExperience";
import { NaturExperience } from "@/components/natur/NaturExperience";

export const Route = createFileRoute("/topic/$id")({
  loader: ({ params }) => {
    const topic = getTopic(params.id);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.topic.title} – Warum` },
          { name: "description", content: loaderData.topic.bigQuestion },
          { property: "og:title", content: `${loaderData.topic.title} – Warum` },
          { property: "og:description", content: loaderData.topic.bigQuestion },
          { property: "og:image", content: loaderData.topic.heroImage },
        ]
      : [],
  }),
  component: TopicView,
});

function TopicView() {
  const { topic } = Route.useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    markExplored(topic.id);
  }, [topic.id]);

  if (topic.id === "planeten") return <PlanetenExperience />;
  if (topic.id === "strom") return <StromExperience />;
  if (topic.id === "internet") return <InternetExperience />;
  if (topic.id === "ki") return <KiExperience />;
  if (topic.id === "natur") return <NaturExperience />;




  const renderDiagram = () => {
    switch (topic.id) {
      case "planeten":
        return <PlanetsOrrery planets={topic.diagramData as PlanetData[]} />;
      case "strom":
        return <CircuitBuilder />;
      case "internet":
        return <InternetJourney steps={topic.diagramData as InternetStep[]} />;
      case "ki":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <NeuralNet data={topic.diagramData as any} />;
      case "natur":
        return <FoodChain chain={topic.diagramData as ChainLink[]} />;
    }
    return null;
  };

  return (
    <main className="animate-slide-in-right">
      {/* Hero */}
      <header className="relative h-72 w-full overflow-hidden">
        <img
          src={topic.heroImage}
          alt={topic.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0D0D1A]" />
        <button
          onClick={() => navigate({ to: "/erkunden" })}
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-2xl p-5">
          <div className="text-5xl">{topic.emoji}</div>
          <h1 className="mt-2 font-display text-3xl font-black leading-tight text-white drop-shadow-lg">
            {topic.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-8 px-5 pt-6">
        {/* Big question */}
        <section>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
            Die große Frage
          </p>
          <h2 className="mt-1 font-display text-2xl font-black leading-snug text-white">
            {topic.bigQuestion}
          </h2>
        </section>

        {/* Lottie + facts */}
        <section className="space-y-3">
          <LottiePanel url={topic.lottieUrl} emoji={topic.emoji} />
          <h3 className="font-display text-lg font-bold text-white">Wusstest du?</h3>
          {topic.facts.map((f: { emoji: string; text: string }, i: number) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-[#1A1A2E] p-4 shadow-lg"
            >
              <div className="text-2xl">{f.emoji}</div>
              <p className="flex-1 text-base leading-relaxed text-slate-100">{f.text}</p>
            </div>
          ))}
        </section>

        {/* Interactive Diagram */}
        <section>
          <h3 className="mb-3 font-display text-lg font-bold text-white">Probier es aus</h3>
          {renderDiagram()}
        </section>

        {/* Video */}
        <section>
          <h3 className="mb-3 font-display text-lg font-bold text-white">Schau dir das an</h3>
          <VideoEmbed
            url={topic.videoUrl}
            thumb={topic.videoThumb}
            title={topic.videoTitle}
            duration={topic.videoDuration}
          />
        </section>

      </div>
    </main>
  );
}
