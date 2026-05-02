const cache = new Map();

export function getCache(key) {
  const item = cache.get(key);

  if (!item) {
    return undefined;
  }

  if (item.expiresAt && Date.now() > item.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  return item.value;
}

export function setCache(key, value, ttl) {
  const expiresAt = typeof ttl === "number" ? Date.now() + ttl : null;

  cache.set(key, { value, expiresAt });
  return value;
}
