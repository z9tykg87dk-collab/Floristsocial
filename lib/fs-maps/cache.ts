type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const globalCache = globalThis as typeof globalThis & {
  __fsMapsCache?: Map<string, CacheEntry<unknown>>;
};

const cache =
  globalCache.__fsMapsCache ??
  new Map<string, CacheEntry<unknown>>();

if (process.env.NODE_ENV !== "production") {
  globalCache.__fsMapsCache = cache;
}

export function getCachedValue<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCachedValue<T>(
  key: string,
  value: T,
  ttlMs: number
): void {
  const safeTtlMs = Number.isFinite(ttlMs)
    ? Math.max(1_000, Math.trunc(ttlMs))
    : 60_000;

  cache.set(key, {
    value,
    expiresAt: Date.now() + safeTtlMs,
  });
}

export function deleteCachedValue(key: string): void {
  cache.delete(key);
}

export function clearExpiredCacheEntries(): number {
  const now = Date.now();
  let removed = 0;

  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
      removed += 1;
    }
  }

  return removed;
}
