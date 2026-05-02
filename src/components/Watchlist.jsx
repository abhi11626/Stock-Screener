import { formatPrice } from "@/utils/currency";

export default function Watchlist({ watchlist = [], removeStock }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Watchlist</h2>
        <span className="text-sm text-gray-400">{watchlist.length} saved</span>
      </div>

      {watchlist.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/50 p-4 text-sm text-gray-400">
          No stocks added yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {watchlist.map((stock) => (
            <li
              key={stock.symbol}
              className="flex flex-col gap-3 rounded-lg bg-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{stock.symbol}</p>
                {stock.name && (
                  <p className="text-sm text-gray-400">{stock.name}</p>
                )}
                {(stock.price || stock.change) && (
                  <p className="text-sm text-gray-400">
                    {formatPrice(stock.price, stock.symbol)}
                    {stock.change ? ` (${stock.change})` : ""}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => removeStock?.(stock.symbol)}
                  className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600 sm:w-auto"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
