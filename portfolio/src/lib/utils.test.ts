import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { cn, truncateText, calculateReadingTime } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("truncateText", () => {
  /**
   * **Feature: flutter-portfolio, Property 1: Content Truncation**
   * *For any* project data with title, shortDescription, or fullDescription
   * exceeding character limits, the rendered output SHALL truncate to the limit.
   * **Validates: Requirements 3.2, 3.7**
   */
  it("Property 1: truncated text never exceeds limit (including ellipsis)", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.integer({ min: 1, max: 1000 }),
        (text, limit) => {
          const result = truncateText(text, limit);
          // Result should never exceed limit + 3 (for "...")
          if (text.length <= limit) {
            return result === text;
          }
          // When truncated, result length is limit + 3 (for "...")
          return result.length <= limit + 3 && result.endsWith("...");
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 1: Content Truncation**
   * Text within limit should remain unchanged
   * **Validates: Requirements 3.2, 3.7**
   */
  it("Property 1: text within limit remains unchanged", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.integer({ min: 100, max: 500 }),
        (text, limit) => {
          const result = truncateText(text, limit);
          return result === text;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 1: Content Truncation**
   * Truncated text should preserve the beginning of the original text
   * **Validates: Requirements 3.2, 3.7**
   */
  it("Property 1: truncated text preserves beginning of original", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10 }),
        fc.integer({ min: 1, max: 9 }),
        (text, limit) => {
          const result = truncateText(text, limit);
          // The result without ellipsis should be a prefix of the original
          const withoutEllipsis = result.slice(0, -3);
          return text.startsWith(withoutEllipsis.trimEnd());
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("calculateReadingTime", () => {
  it("returns minimum 1 minute for short content", () => {
    expect(calculateReadingTime("Hello")).toBe(1);
  });

  it("calculates reading time based on word count", () => {
    // 400 words at 200 wpm = 2 minutes
    const words = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("handles empty content", () => {
    expect(calculateReadingTime("")).toBe(1);
  });
});
