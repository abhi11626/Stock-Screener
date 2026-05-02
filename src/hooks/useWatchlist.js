import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "watchlist";

function getStockKey(stock) {
  const symbol = typeof stock === "string" ? stock : stock?.symbol;

  return symbol?.trim().toUpperCase();
}

function normalizeStock(stock) {
  if (typeof stock === "string") {
    return { symbol: getStockKey(stock) };
  }

  return stock;
}

async function fetchStockDetails(symbol) {
  const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
  const data = await response.json();

  if (!response.ok || !data.stock) {
    return null;
  }

  return {
    symbol: getStockKey(data.stock),
    price: data.stock.price,
    change: data.stock.change,
  };
}

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const watchlistRef = useRef(watchlist);
  const pendingSymbolsRef = useRef(new Set());

  useEffect(() => {
    watchlistRef.current = watchlist;
  }, [watchlist]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const savedWatchlist = localStorage.getItem(STORAGE_KEY);

        if (savedWatchlist) {
          const parsedWatchlist = JSON.parse(savedWatchlist);

          setWatchlist(Array.isArray(parsedWatchlist) ? parsedWatchlist : []);
        }
      } catch {
        setWatchlist([]);
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [loaded, watchlist]);

  const refreshStock = useCallback(async (stock) => {
    const symbol = getStockKey(stock);

    if (!symbol || pendingSymbolsRef.current.has(symbol)) {
      return null;
    }

    pendingSymbolsRef.current.add(symbol);

    try {
      const stockDetails = await fetchStockDetails(symbol);

      if (!stockDetails) {
        return null;
      }

      return {
        ...normalizeStock(stock),
        ...stockDetails,
      };
    } finally {
      pendingSymbolsRef.current.delete(symbol);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    async function refreshWatchlist() {
      const currentWatchlist = watchlistRef.current;

      if (currentWatchlist.length === 0) {
        return;
      }

      const refreshedStocks = await Promise.all(
        currentWatchlist.map((stock) => refreshStock(stock))
      );
      const refreshedBySymbol = new Map(
        refreshedStocks
          .filter(Boolean)
          .map((stock) => [getStockKey(stock), stock])
      );

      if (refreshedBySymbol.size === 0) {
        return;
      }

      setWatchlist((currentWatchlist) =>
        currentWatchlist.map((stock) => {
          const refreshedStock = refreshedBySymbol.get(getStockKey(stock));

          return refreshedStock ?? stock;
        })
      );
    }

    refreshWatchlist();
    const intervalId = setInterval(refreshWatchlist, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loaded, refreshStock]);

  const addStock = useCallback(async (stock) => {
    const stockKey = getStockKey(stock);

    if (!stockKey) {
      return;
    }

    const symbol = stockKey;
    const alreadyAdded = watchlistRef.current.some(
      (item) => getStockKey(item) === symbol
    );

    if (alreadyAdded || pendingSymbolsRef.current.has(symbol)) {
      return;
    }

    const enrichedStock = await refreshStock(stock);

    if (!enrichedStock) {
      return;
    }

    setWatchlist((currentWatchlist) => {
      const exists = currentWatchlist.some(
        (item) => getStockKey(item) === symbol
      );

      if (exists) {
        return currentWatchlist;
      }

      return [...currentWatchlist, enrichedStock];
    });
  }, [refreshStock]);

  const removeStock = useCallback((stock) => {
    const stockKey = getStockKey(stock);

    setWatchlist((currentWatchlist) =>
      currentWatchlist.filter((item) => getStockKey(item) !== stockKey)
    );
  }, []);

  return { watchlist, addStock, removeStock };
}
