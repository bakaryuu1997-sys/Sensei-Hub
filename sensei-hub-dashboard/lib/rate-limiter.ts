interface RateLimitState {
  tokens: number
  lastRefill: number
}

const limitMap = new Map<string, RateLimitState>()

const BUCKET_CAPACITY = 60 // Max 60 requests
const REFILL_RATE_MS = 60 * 1000 // Refill capacity every 60 seconds (1 minute)

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  let state = limitMap.get(ip)

  if (!state) {
    state = { tokens: BUCKET_CAPACITY, lastRefill: now }
    limitMap.set(ip, state)
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
