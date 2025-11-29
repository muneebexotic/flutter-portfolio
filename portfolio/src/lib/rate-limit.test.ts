import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  checkRateLimit,
  resetRateLimit,
  clearAllRateLimits,
  getRateLimitStatus,
  RATE_LIMIT_CONFIG,
} from "./rate-limit";

describe("rate limiting", () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  /**
   * **Feature: flutter-portfolio, Property 13: Rate Limiting**
   * *For any* IP address that has submitted 5 or more contact forms within
   * the past hour, subsequent submissions SHALL be rejected with a rate limit error.
   * **Validates: Requirements 7.7**
   */
  it("Property 13: allows first 5 submissions for any IP", () => {
    fc.assert(
      fc.property(fc.ipV4(), (ip) => {
        clearAllRateLimits();

        // First 5 submissions should be allowed
        for (let i = 0; i < RATE_LIMIT_CONFIG.max; i++) {
          const result = checkRateLimit(ip);
          if (!result.allowed) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("Property 13: rejects 6th submission within rate limit window", () => {
    fc.assert(
      fc.property(fc.ipV4(), (ip) => {
        clearAllRateLimits();

        // Make 5 allowed submissions
        for (let i = 0; i < RATE_LIMIT_CONFIG.max; i++) {
          checkRateLimit(ip);
        }

        // 6th submission should be rejected
        const result = checkRateLimit(ip);
        return result.allowed === false && result.remaining === 0;
      }),
      { numRuns: 100 }
    );
  });

  it("Property 13: different IPs have independent rate limits", () => {
    fc.assert(
      fc.property(
        fc.ipV4(),
        fc.ipV4().filter((ip2) => ip2 !== "0.0.0.0"), // Ensure different IPs
        (ip1, ip2) => {
          if (ip1 === ip2) return true; // Skip if same IP generated

          clearAllRateLimits();

          // Exhaust rate limit for ip1
          for (let i = 0; i < RATE_LIMIT_CONFIG.max; i++) {
            checkRateLimit(ip1);
          }

          // ip2 should still be allowed
          const result = checkRateLimit(ip2);
          return result.allowed === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("tracks remaining submissions correctly", () => {
    const ip = "192.168.1.1";

    for (let i = 0; i < RATE_LIMIT_CONFIG.max; i++) {
      const result = checkRateLimit(ip);
      expect(result.remaining).toBe(RATE_LIMIT_CONFIG.max - i - 1);
    }
  });

  it("resetRateLimit clears limit for specific IP", () => {
    const ip = "192.168.1.1";

    // Exhaust rate limit
    for (let i = 0; i < RATE_LIMIT_CONFIG.max; i++) {
      checkRateLimit(ip);
    }

    // Should be blocked
    expect(checkRateLimit(ip).allowed).toBe(false);

    // Reset and try again
    resetRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  it("getRateLimitStatus returns correct status without incrementing", () => {
    const ip = "192.168.1.1";

    // Initial status
    let status = getRateLimitStatus(ip);
    expect(status.count).toBe(0);
    expect(status.remaining).toBe(RATE_LIMIT_CONFIG.max);

    // Make some submissions
    checkRateLimit(ip);
    checkRateLimit(ip);

    // Check status
    status = getRateLimitStatus(ip);
    expect(status.count).toBe(2);
    expect(status.remaining).toBe(RATE_LIMIT_CONFIG.max - 2);

    // Status check shouldn't increment
    status = getRateLimitStatus(ip);
    expect(status.count).toBe(2);
  });
});
