import { createFileRoute } from "@tanstack/react-router";

// Server-side YouTube search via scraping the public results page.
// Returns the first non-Shorts video ID + title for a given query.
// No API key required.

type YTResult = { videoId: string; title: string; channel?: string };

async function searchYouTube(query: string, lang: "de" | "en"): Promise<YTResult | null> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
  // sp=EgIQAQ%3D%3D filters to "Videos" only (excludes channels/playlists/shorts mixes).
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": lang === "de" ? "de-DE,de;q=0.9,en;q=0.5" : "en-US,en;q=0.9",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();

  // ytInitialData JSON is embedded in the page.
  const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!m) {
    // Fallback: extract first videoId via regex
    const idMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (!idMatch) return null;
    return { videoId: idMatch[1], title: query };
  }
  try {
    const data = JSON.parse(m[1]);
    const contents =
      data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents ?? [];
    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents ?? [];
      for (const it of items) {
        const v = it?.videoRenderer;
        if (!v?.videoId) continue;
        // Skip live streams and ones that obviously look like Shorts
        const title = v.title?.runs?.[0]?.text ?? v.title?.simpleText ?? query;
        const channel = v.ownerText?.runs?.[0]?.text;
        return { videoId: v.videoId, title, channel };
      }
    }
  } catch {
    /* fall through */
  }
  const idMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
  if (idMatch) return { videoId: idMatch[1], title: query };
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
        try {
          const result = await searchYouTube(query, lang);
          if (!result) return Response.json({ found: false });
          return Response.json({ found: true, ...result });
        } catch (e) {
          return Response.json({ found: false, error: String(e) }, { status: 200 });
        }
      },
    },
  },
});
