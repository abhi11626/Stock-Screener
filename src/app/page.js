"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Loader from "@/components/Loader";
import SearchInput from "@/components/SearchInput";
import StockCard from "@/components/StockCard";
import Watchlist from "@/components/Watchlist";
import useWatchlist from "@/hooks/useWatchlist";
import Link from "next/link";

export default function Page() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const lastSearchRef = useRef("");
  const { watchlist, addStock, removeStock } = useWatchlist();

  const stockCards = useMemo(
    () =>
      stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} addStock={addStock} />
      )),
    [stocks, addStock],
  );

  const handleSearch = useCallback(async (query) => {
    const searchQuery = query.trim();

    if (!searchQuery || searchQuery === lastSearchRef.current) {
      return;
    }

    lastSearchRef.current = searchQuery;
    setHasSearched(true);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      const results =
        response.ok && Array.isArray(data.results)
          ? data.results
              .filter((stock) => stock.symbol && stock.name)
              .map((stock) => ({
                symbol: stock.symbol,
                name: stock.name,
              }))
          : [];

      setStocks(results);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main
      className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:space-y-6 sm:p-6 lg:py-8"
      aria-busy={loading}
    >
      <Link href="/">
        <h1 className="text-xl font-bold sm:text-2xl">Stock Dashboard</h1>
      </Link>

      <SearchInput onSearch={handleSearch} />

      {loading && <Loader label="Loading stocks..." />}

      {!loading && stocks.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {stockCards}
        </div>
      )}

      {!loading && hasSearched && stocks.length === 0 && (
        <p className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-sm text-gray-300">
          No results found
        </p>
      )}

      <Watchlist watchlist={watchlist} removeStock={removeStock} />
    </main>
  );
}
