"use client";

import Link from "next/link";
import { memo } from "react";
import { formatPrice } from "@/utils/currency";

function StockCard({ stock, addStock }) {
  if (!stock) {
    return null;
  }

  const symbol = stock.symbol;
  const name = stock?.name;
  const price = stock?.price;

  return (
    <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gray-600 hover:bg-gray-700">
      <Link href={`/stocks/${symbol}`}>
        <h2 className="text-lg font-semibold">{symbol}</h2>
        <p className="text-sm text-gray-400">
          {name ?? (price ? formatPrice(price, symbol) : "View details")}
        </p>
      </Link>
      <button
        type="button"
        onClick={() => addStock?.(stock)}
        className="mt-3 rounded bg-gray-700 px-3 py-2 text-sm text-white transition duration-200 hover:bg-gray-600"
      >
        Add to Watchlist
      </button>
    </div>
  );
}

export default memo(StockCard);
