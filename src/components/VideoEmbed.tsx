import { useState } from "react";

export function VideoEmbed({
  url,
  thumb,
  title,
  duration,
}: {
  url: string;
  thumb: string;
  title: string;
  duration: string;
}) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-black">
        <iframe
          src={`${url}${url.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlay(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-black"
    >
      <img
        src={thumb}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-3xl shadow-2xl transition-transform group-active:scale-90">
          ▶
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 text-left">
        <div>
          <p className="font-display text-base font-bold text-white">Video ansehen 🎬</p>
          <p className="text-xs text-slate-300">{title}</p>
        </div>
        <span className="rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">
          {duration}
        </span>
      </div>
    </button>
  );
}
