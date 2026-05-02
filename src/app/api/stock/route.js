import { getCache, setCache } from "@/utils/cache";

const CACHE_TTL = 60 * 1000;
const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return Response.json(
      { error: "Symbol is required", stock: null },
      { status: 400 }
    );
  }

  const cacheKey = `stock:${symbol}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return Response.json(cachedData);
  }

  const apiKey =
    process.env.ALPHA_VANTAGE_API_KEY ?? process.env.ALPHAVANTAGE_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Alpha Vantage API key is missing", stock: null },
      { status: 500 }
    );
  }

  try {
    const url = new URL(ALPHA_VANTAGE_URL);
    url.searchParams.set("function", "GLOBAL_QUOTE");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch stock quote", stock: null },
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
          stock: null,
        },
        { status: 502 }
      );
    }

    const quote = alphaData["Global Quote"];

    if (!quote || !quote["01. symbol"]) {
      return Response.json(
        { error: "Stock quote not found", stock: null },
        { status: 404 }
      );
    }

    const data = {
      stock: {
        symbol: quote["01. symbol"],
        price: quote["05. price"],
        change: quote["09. change"],
      },
    };

    setCache(cacheKey, data, CACHE_TTL);

    return Response.json(data);
  } catch (error) {
    console.error("Alpha Vantage stock quote failed:", error);

    return Response.json(
      { error: "Unable to fetch stock quote", stock: null },
      { status: 500 }
    );
  }
}
