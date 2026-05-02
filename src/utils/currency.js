function getCurrency(symbol) {
  return /\.(BSE|NSE|BO|NS)$/i.test(symbol) ? "INR" : "USD";
}

export function formatPrice(price, symbol = "") {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  const currency = getCurrency(symbol);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
