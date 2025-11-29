/**
 * Rate limiting logic for contact form submissions
 * Limits to 5 submissions per IP address per hour
 * Uses in-memory store (for production, consider Redis)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Key: IP address, Value: submission count and reset time
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_MAX = 5; // Maximum submissions per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Checks if an IP address has exceeded the rate limit
 * @param ip - The IP address to check
 * @returns Object with allowed status and remaining submissions
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // If no entry exists or window has expired, create new entry
  if (!entry || now >= entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(ip, newEntry);
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(ip, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Resets the rate limit for an IP address (for testing purposes)
 * @param ip - The IP address to reset
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Clears all rate limit entries (for testing purposes)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Gets the current rate limit status for an IP without incrementing
 * @param ip - The IP address to check
 * @returns Current rate limit status
 */
export function getRateLimitStatus(ip: string): {
  count: number;
  remaining: number;
  resetTime: number | null;
} {
  const entry = rateLimitStore.get(ip);
  const now = Date.now();

  if (!entry || now >= entry.resetTime) {
    return {
      count: 0,
      remaining: RATE_LIMIT_MAX,
      resetTime: null,
    };
  }

  return {
    count: entry.count,
    remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
    resetTime: entry.resetTime,
  };
}

// Export constants for testing
export const RATE_LIMIT_CONFIG = {
  max: RATE_LIMIT_MAX,
  windowMs: RATE_LIMIT_WINDOW_MS,
};
