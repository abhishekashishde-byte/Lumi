import { createFileRoute } from "@tanstack/react-router";

// Lumi never embeds an arbitrary first YouTube result.
// Search results are screened server-side and younger-child mode only permits
// a small set of well-known educational/science channels. If nothing passes,
// Lumi simply shows no video.

type YTResult = { videoId: string; title: string; channel?: string };

const TRUSTED_CHANNELS = [
  /kurzgesagt/i,
  /wissen macht ah/i,
  /sendung mit der maus/i,
  /die maus/i,
  /checker tobi/i,
  /checker welt/i,
  /terra x/i,
  /logo!?(?: |$)/i,
  /neuneinhalb/i,
  /quarks/i,
  /national geographic kids/i,
  /scishow kids/i,
  /ted-?ed/i,
  /crash course kids/i,
  /nasa/i,
  /smithsonian/i,
  /pbs kids/i,
];

// Conservative title/channel guard. This is not used to "classify" a video as
// child-safe; it is an additional rejection layer on top of the trusted list.
const BLOCKED = /(sex(?:ual)?|porn|nude|naked|fetish|drug(?:s)?|cocaine|heroin|meth|weed|cannabis|suicide|self[- ]?harm|kill yourself|murder|gore|graphic|beheading|terror(?:ist|ism)?|bomb[- ]?making|how to make (?:a )?bomb|gun tutorial|shooting compilation|prank|challenge|reaction|roast|diss|18\+|nsfw)/i;
const CLICKBAIT = /(you won'?t believe|shocking|gone wrong|gone sexual|must watch|insane challenge|24 hours|at 3 ?am)/i;

function isTrustedChannel(channel = "") {
  return TRUSTED_CHANNELS.some((re) => re.test(channel));
}

function isSafeCandidate(v: any, title: string, channel: string) {
  const blob = `${title} ${channel}`;
  if (BLOCKED.test(blob) || CLICKBAIT.test(blob)) return false;

  // Reject live/upcoming streams.
  if (v?.badges?.some((b: any) => /live|premiere|upcoming/i.test(JSON.stringify(b)))) return false;
  if (v?.thumbnailOverlays?.some((o: any) => /live|shorts/i.test(JSON.stringify(o)))) return false;

  // Reject explicit Shorts links if YouTube exposes one in the renderer.
  const nav = JSON.stringify(v?.navigationEndpoint ?? {});
  if (/\/shorts\//i.test(nav)) return false;

  return isTrustedChannel(channel);
}

async function searchYouTube(query: string, lang: "de" | "en"): Promise<YTResult | null> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": lang === "de" ? "de-DE,de;q=0.9,en;q=0.5" : "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const html = await res.text();

  const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!m) return null; // Never use an unvalidated regex fallback for children.

  try {
    const data = JSON.parse(m[1]);
    const contents =
      data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents ?? [];

    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents ?? [];
      for (const it of items) {
        const v = it?.videoRenderer;
        if (!v?.videoId) continue;

        const title = (v.title?.runs?.[0]?.text ?? v.title?.simpleText ?? "").trim();
        const channel = (v.ownerText?.runs?.[0]?.text ?? "").trim();
        if (!title || !channel) continue;
        if (!isSafeCandidate(v, title, channel)) continue;

        return { videoId: v.videoId, title, channel };
      }
    }
  } catch (error) {
    console.warn("[youtube] Failed to parse search results", error);
  }

  return null;
}

export const Route = createFileRoute("/api/youtube")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { query?: string; lang?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const query = (body.query ?? "").toString().slice(0, 200).trim();
        if (!query) return new Response("Empty query", { status: 400 });
        const lang = body.lang === "en" ? "en" : "de";

        // Refuse obviously unsafe search requests before contacting YouTube.
        if (BLOCKED.test(query)) {
          return Response.json({ found: false, reason: "blocked_query" });
        }

        try {
          const result = await searchYouTube(query, lang);
          if (!result) return Response.json({ found: false, reason: "no_trusted_result" });
          return Response.json({ found: true, ...result, trusted: true });
        } catch (e) {
          console.warn("[youtube] Search failed", e);
          return Response.json({ found: false, reason: "search_failed" });
        }
      },
    },
  },
});
