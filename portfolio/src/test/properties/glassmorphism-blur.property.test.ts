import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  BLUR_VALUES,
  getBlurValue,
  type GlassBlur,
} from "@/components/ui/glass-card";

/**
 * **Feature: portfolio-redesign, Property 3: Glassmorphism Blur Range**
 *
 * *For any* GlassCard component rendered while glassmorphism mode is active,
 * the computed backdrop-filter blur value SHALL be between 10px and 20px.
 *
 * **Validates: Requirements 2.1**
 */
describe("Property 3: Glassmorphism Blur Range", () => {
  // Arbitrary for generating valid blur options
  const blurOptionArb = fc.constantFrom<GlassBlur>("sm", "md", "lg");

  it("should return blur values within the valid range (10-20px) for all blur options", () => {
    fc.assert(
      fc.property(blurOptionArb, (blur) => {
        const blurValue = getBlurValue(blur);

        // Blur value must be between 10px and 20px (inclusive)
        // Requirements: 2.1 - blur effects between 10px and 20px
        expect(blurValue).toBeGreaterThanOrEqual(10);
        expect(blurValue).toBeLessThanOrEqual(20);
      }),
      { numRuns: 100 }
    );
  });

  it("should have all BLUR_VALUES within the valid range", () => {
    fc.assert(
      fc.property(blurOptionArb, (blur) => {
        const blurValue = BLUR_VALUES[blur];

        // All predefined blur values must be in range
        expect(blurValue).toBeGreaterThanOrEqual(10);
        expect(blurValue).toBeLessThanOrEqual(20);
      }),
      { numRuns: 100 }
    );
  });

  it("should map blur options to expected pixel values", () => {
    // sm = 10px, md = 15px, lg = 20px
    expect(getBlurValue("sm")).toBe(10);
    expect(getBlurValue("md")).toBe(15);
    expect(getBlurValue("lg")).toBe(20);
  });

  it("should maintain consistent blur values across multiple calls", () => {
    fc.assert(
      fc.property(blurOptionArb, (blur) => {
        const firstCall = getBlurValue(blur);
        const secondCall = getBlurValue(blur);

        // Same input should always produce same output
        expect(firstCall).toBe(secondCall);
      }),
      { numRuns: 100 }
    );
  });
});
