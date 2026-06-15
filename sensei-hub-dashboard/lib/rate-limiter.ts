interface RateLimitState {
  tokens: number
  lastRefill: number
  lastAccess: number
}

const limitMap = new Map<string, RateLimitState>()

const BUCKET_CAPACITY = 60 // Max 60 requests
const REFILL_RATE_MS = 60 * 1000 // Refill capacity every 60 seconds (1 minute)

// Clean up inactive rate limiter states every 10 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000

const globalForRateLimiter = global as unknown as { rateLimiterCleanup?: NodeJS.Timeout }

if (typeof global !== "undefined" && !globalForRateLimiter.rateLimiterCleanup) {
  const interval = setInterval(() => {
    const now = Date.now()
    for (const [ip, state] of limitMap.entries()) {
      if (now - state.lastAccess > CLEANUP_INTERVAL_MS) {
        limitMap.delete(ip)
      }
    }
  }, CLEANUP_INTERVAL_MS)

  if (interval.unref) {
    interval.unref()
  }
  globalForRateLimiter.rateLimiterCleanup = interval
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  let state = limitMap.get(ip)

  if (!state) {
    state = { tokens: BUCKET_CAPACITY, lastRefill: now, lastAccess: now }
    limitMap.set(ip, state)
  } else {
    state.lastAccess = now
  }

  // Refill tokens based on elapsed time
  const timePassed = now - state.lastRefill
  if (timePassed >= REFILL_RATE_MS) {
    state.tokens = BUCKET_CAPACITY
    state.lastRefill = now
  }

  if (state.tokens > 0) {
    state.tokens--
    return true // Request allowed
  }

  return false // Rate limit exceeded
}
