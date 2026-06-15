interface CacheEntry<T> {
  data: T
  expiry: number
}

const cacheMap = new Map<string, CacheEntry<any>>()

// 1 hour TTL (static markdown files do not change during runtime)
const DEFAULT_TTL_MS = 60 * 60 * 1000 

// Clean up expired cache entries every 30 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000

const globalForApiCache = global as unknown as { apiCacheCleanup?: NodeJS.Timeout }

if (typeof global !== "undefined" && !globalForApiCache.apiCacheCleanup) {
  const interval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of cacheMap.entries()) {
      if (now > entry.expiry) {
        cacheMap.delete(key)
      }
    }
  }, CLEANUP_INTERVAL_MS)

  if (interval.unref) {
    interval.unref()
  }
  globalForApiCache.apiCacheCleanup = interval
}

export function getCache<T>(key: string): T | null {
  const entry = cacheMap.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    cacheMap.delete(key) // Expired
    return null
  }
  return entry.data
}

export function setCache<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  cacheMap.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  })
}

export function clearCache(): void {
  cacheMap.clear()
}
