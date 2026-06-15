interface CacheEntry<T> {
  data: T
  expiry: number
}

const cacheMap = new Map<string, CacheEntry<any>>()

// 1 hour TTL (static markdown files do not change during runtime)
const DEFAULT_TTL_MS = 60 * 60 * 1000 

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
