import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * **Feature: portfolio-redesign, Property 6: Dark Mode Color Lightness**
 *
 * *For any* background element in dark mode, the HSL lightness value SHALL be below 15%,
 * and for any text element, the HSL lightness value SHALL be above 85%.
 *
 * **Validates: Requirements 3.1, 3.2**
 */

// Dark mode color definitions (matching globals.css .theme-dark)
// Format: HSL values as defined in CSS variables
interface DarkModeColors {
  // Background colors - Requirements 3.1: lightness < 15%
  backgrounds: {
    name: string;
    h: number;
    s: number;
    l: number;
  }[];
  // Text colors - Requirements 3.2: lightness > 85%
  texts: {
    name: string;
    h: number;
    s: number;
    l: number;
  }[];
}

const darkModeColors: DarkModeColors = {
  backgrounds: [
    { name: "--background", h: 222, s: 47, l: 6 },
    { name: "--card", h: 222, s: 47, l: 8 },
    { name: "--secondary", h: 217, s: 33, l: 12 },
    { name: "--muted", h: 217, s: 33, l: 10 },
  ],
  texts: [
    { name: "--foreground", h: 210, s: 40, l: 98 },
    { name: "--card-foreground", h: 210, s: 40, l: 98 },
    { name: "--secondary-foreground", h: 210, s: 40, l: 92 },
    { name: "--accent-foreground", h: 210, s: 40, l: 98 },
    { name: "--destructive-foreground", h: 210, s: 40, l: 98 },
  ],
};

// Lightness thresholds per requirements
const MAX_BACKGROUND_LIGHTNESS = 15; // Requirements 3.1: < 15%
const MIN_TEXT_LIGHTNESS = 85; // Requirements 3.2: > 85%

describe("Property 6: Dark Mode Color Lightness", () => {
  // Arbitrary for background colors
  const backgroundColorArb = fc.constantFrom(...darkModeColors.backgrounds);

  // Arbitrary for text colors
  const textColorArb = fc.constantFrom(...darkModeColors.texts);

  it("should have all background colors with lightness below 15%", () => {
    fc.assert(
      fc.property(backgroundColorArb, (color) => {
        // Requirements 3.1: Background lightness < 15%
        expect(color.l).toBeLessThan(MAX_BACKGROUND_LIGHTNESS);
      }),
      { numRuns: 100 }
    );
  });

  it("should have all text colors with lightness above 85%", () => {
    fc.assert(
      fc.property(textColorArb, (color) => {
        // Requirements 3.2: Text lightness > 85%
        expect(color.l).toBeGreaterThan(MIN_TEXT_LIGHTNESS);
      }),
      { numRuns: 100 }
    );
  });

  it("should maintain sufficient contrast between any background and text combination", () => {
    fc.assert(
      fc.property(backgroundColorArb, textColorArb, (bgColor, textColor) => {
        // The lightness difference should be significant for readability
        const lightnessDiff = Math.abs(textColor.l - bgColor.l);

        // With bg < 15% and text > 85%, difference should be at least 70%
        expect(lightnessDiff).toBeGreaterThan(70);
      }),
      { numRuns: 100 }
    );
  });

  it("should verify all defined background colors meet the requirement", () => {
    for (const color of darkModeColors.backgrounds) {
      expect(color.l).toBeLessThan(MAX_BACKGROUND_LIGHTNESS);
    }
  });

  it("should verify all defined text colors meet the requirement", () => {
    for (const color of darkModeColors.texts) {
      expect(color.l).toBeGreaterThan(MIN_TEXT_LIGHTNESS);
    }
  });

  it("should have valid HSL values for all dark mode colors", () => {
    const allColors = [...darkModeColors.backgrounds, ...darkModeColors.texts];

    fc.assert(
      fc.property(fc.constantFrom(...allColors), (color) => {
        // Hue: 0-360
        expect(color.h).toBeGreaterThanOrEqual(0);
        expect(color.h).toBeLessThanOrEqual(360);

        // Saturation: 0-100
        expect(color.s).toBeGreaterThanOrEqual(0);
        expect(color.s).toBeLessThanOrEqual(100);

        // Lightness: 0-100
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });
});
