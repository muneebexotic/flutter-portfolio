import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { sortExperiencesByDate } from "./experience";
import type { Experience } from "@/types";

/**
 * Property tests for Experience section
 */

// Generate a valid date string in "YYYY-MM" format
const dateStringArbitrary = fc
  .tuple(
    fc.integer({ min: 2015, max: 2025 }),
    fc.integer({ min: 1, max: 12 })
  )
  .map(([year, month]) => `${year}-${month.toString().padStart(2, "0")}`);

// Arbitrary for generating valid Experience objects
const experienceArbitrary: fc.Arbitrary<Experience> = fc.record({
  id: fc.uuid(),
  company: fc.string({ minLength: 1, maxLength: 50 }),
  role: fc.string({ minLength: 1, maxLength: 50 }),
  startDate: dateStringArbitrary,
  endDate: fc.option(dateStringArbitrary, { nil: undefined }),
  location: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  achievements: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
  technologies: fc.option(
    fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
    { nil: undefined }
  ),
});

describe("Experience Section", () => {
  /**
   * **Feature: flutter-portfolio, Property 6: Experience Chronological Order**
   * *For any* array of experience entries with startDate values,
   * the rendered timeline SHALL display entries in reverse chronological order (most recent first).
   * **Validates: Requirements 5.1**
   */
  it("Property 6: Experiences are sorted by startDate descending (most recent first)", () => {
    fc.assert(
      fc.property(
        fc.array(experienceArbitrary, { minLength: 1, maxLength: 20 }),
        (experienceList) => {
          const sorted = sortExperiencesByDate(experienceList);

          // Check that each entry's startDate is >= the next entry's startDate
          for (let i = 0; i < sorted.length - 1; i++) {
            const currentDate = new Date(sorted[i].startDate + "-01");
            const nextDate = new Date(sorted[i + 1].startDate + "-01");
            if (currentDate.getTime() < nextDate.getTime()) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 6: Experience Chronological Order**
   * Sorting should preserve all experiences (no experiences lost or duplicated)
   * **Validates: Requirements 5.1**
   */
  it("Property 6: Sorting preserves all experiences", () => {
    fc.assert(
      fc.property(
        fc.array(experienceArbitrary, { minLength: 0, maxLength: 20 }),
        (experienceList) => {
          const sorted = sortExperiencesByDate(experienceList);

          // Same length
          if (sorted.length !== experienceList.length) return false;

          // All original experiences are in sorted list
          const sortedIds = new Set(sorted.map((e) => e.id));
          return experienceList.every((e) => sortedIds.has(e.id));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 6: Experience Chronological Order**
   * Empty array should return empty array
   * **Validates: Requirements 5.1**
   */
  it("Property 6: Empty array returns empty array", () => {
    const result = sortExperiencesByDate([]);
    expect(result).toEqual([]);
  });
});
