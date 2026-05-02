import { getCache, setCache } from "@/utils/cache";

const CACHE_TTL = 60 * 1000;
const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ results: [] });
  }

  const cacheKey = `search:${query.toUpperCase()}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return Response.json(cachedData);
  }

  const apiKey =
    process.env.ALPHA_VANTAGE_API_KEY ?? process.env.ALPHAVANTAGE_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Alpha Vantage API key is missing", results: [] },
      { status: 500 }
    );
  }

  try {
    const url = new URL(ALPHA_VANTAGE_URL);
    url.searchParams.set("function", "SYMBOL_SEARCH");
    url.searchParams.set("keywords", query);
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch stock search results", results: [] },
        { status: response.status }
      );
    }

    const alphaData = await response.json();

    if (alphaData["Error Message"] || alphaData.Note || alphaData.Information) {
      return Response.json(
        {
          error:
            alphaData["Error Message"] ??
            alphaData.Note ??
            alphaData.Information,
          results: [],
        },
        { status: 502 }
      );
    }

    const results = (alphaData.bestMatches ?? []).map((match) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
    }));

    const data = { results };

    setCache(cacheKey, data, CACHE_TTL);

    return Response.json(data);
  } catch (error) {
    console.error("Alpha Vantage search failed:", error);

    return Response.json(
      { error: "Unable to search stocks", results: [] },
      { status: 500 }
    );
  }
}
