import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { clampOpacity } from "@/components/ui/glass-card";

/**
 * **Feature: portfolio-redesign, Property 4: Glassmorphism Opacity Range**
 *
 * *For any* glass container element while glassmorphism mode is active,
 * the background color alpha value SHALL be between 0.1 and 0.3.
 *
 * **Validates: Requirements 2.2, 2.3**
 */
describe("Property 4: Glassmorphism Opacity Range", () => {
  // Arbitrary for generating any float value (using Math.fround for 32-bit floats)
  const anyFloatArb = fc.float({ min: Math.fround(-10), max: Math.fround(10), noNaN: true });

  // Arbitrary for generating valid opacity values (within range)
  const validOpacityArb = fc.float({ min: Math.fround(0.1), max: Math.fround(0.3), noNaN: true });

  it("should clamp any opacity value to the valid range (0.1-0.3)", () => {
    fc.assert(
      fc.property(anyFloatArb, (opacity) => {
        const clampedValue = clampOpacity(opacity);

        // Clamped value must always be between 0.1 and 0.3 (inclusive)
        // Requirements: 2.2 - opacity between 0.1 and 0.3
        expect(clampedValue).toBeGreaterThanOrEqual(0.1);
        expect(clampedValue).toBeLessThanOrEqual(0.3);
      }),
      { numRuns: 100 }
    );
  });

  it("should preserve valid opacity values within range", () => {
    // Use a slightly narrower range to avoid floating-point precision issues at boundaries
    const safeValidOpacityArb = fc.float({ min: Math.fround(0.1001), max: Math.fround(0.2999), noNaN: true });
    
    fc.assert(
      fc.property(safeValidOpacityArb, (opacity) => {
        const clampedValue = clampOpacity(opacity);

        // Values already in range should be preserved
        expect(clampedValue).toBe(opacity);
      }),
      { numRuns: 100 }
    );
  });

  it("should clamp values below 0.1 to 0.1", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-10), max: Math.fround(0.09), noNaN: true }),
        (opacity) => {
          const clampedValue = clampOpacity(opacity);

          // Values below 0.1 should be clamped to 0.1
          expect(clampedValue).toBe(0.1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should clamp values above 0.3 to 0.3", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.31), max: Math.fround(10), noNaN: true }),
        (opacity) => {
          const clampedValue = clampOpacity(opacity);

          // Values above 0.3 should be clamped to 0.3
          expect(clampedValue).toBe(0.3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle boundary values correctly", () => {
    // Test exact boundary values
    expect(clampOpacity(0.1)).toBe(0.1);
    expect(clampOpacity(0.3)).toBe(0.3);
    expect(clampOpacity(0.2)).toBe(0.2);
  });

  it("should be idempotent - clamping twice produces same result", () => {
    fc.assert(
      fc.property(anyFloatArb, (opacity) => {
        const firstClamp = clampOpacity(opacity);
        const secondClamp = clampOpacity(firstClamp);

        // Clamping an already clamped value should produce the same result
        expect(secondClamp).toBe(firstClamp);
      }),
      { numRuns: 100 }
    );
  });
});
