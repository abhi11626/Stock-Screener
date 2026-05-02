"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { formatPrice } from "@/utils/currency";

export default function StockPage({ params }) {
  const { symbol } = use(params);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isFetching = false;
    let hasLoadedData = false;
    let controller = null;

    async function fetchStock() {
      if (isFetching) {
        return;
      }

      isFetching = true;
      controller = new AbortController();
      setLoading(!hasLoadedData);
      setError("");

      try {
        const response = await fetch(
          `/api/stock?symbol=${encodeURIComponent(symbol)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load stock");
        }

        setStock(data.stock);
        hasLoadedData = true;
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setStock(null);
          setError(fetchError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }

        isFetching = false;
      }
    }

    fetchStock();
    const intervalId = setInterval(fetchStock, 5000);

    return () => {
      clearInterval(intervalId);
      controller?.abort();
    };
  }, [symbol]);

  const change = Number(stock?.change ?? 0);

  return (
    <main
      className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 sm:p-6 lg:py-8"
      aria-busy={loading}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">{symbol}</h1>
        <Link
          href="/"
          className="rounded bg-gray-800 px-3 py-2 text-sm text-white transition duration-200 hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {loading && <Loader label="Loading stock..." />}

      {!loading && error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {!loading && stock && (
        <section className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <p className="text-sm text-gray-400">Current price</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatPrice(stock.price, stock.symbol)}
          </p>
          <p
            className={`mt-3 text-sm ${
              change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {stock.change}
          </p>
        </section>
      )}
    </main>
  );
}
