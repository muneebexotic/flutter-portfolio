import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * **Feature: portfolio-redesign, Property 5: Text Contrast Compliance**
 *
 * *For any* text element in any theme mode, the contrast ratio between
 * the text color and its background SHALL meet WCAG AA standards
 * (minimum 4.5:1 for normal text, 3:1 for large text).
 *
 * **Validates: Requirements 2.5, 3.4**
 */

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Calculate relative luminance per WCAG 2.1
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio per WCAG 2.1
export function getContrastRatio(
  fg: [number, number, number],
  bg: [number, number, number]
): number {
  const l1 = getRelativeLuminance(...fg);
  const l2 = getRelativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA minimum contrast ratios
const WCAG_AA_NORMAL_TEXT = 4.5;
const WCAG_AA_LARGE_TEXT = 3.0;

// Theme color definitions (matching globals.css)
interface ThemeColors {
  background: { h: number; s: number; l: number };
  foreground: { h: number; s: number; l: number };
  mutedForeground: { h: number; s: number; l: number };
}

const themeColors: Record<string, ThemeColors> = {
  default: {
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 222.2, s: 84, l: 4.9 },
    mutedForeground: { h: 215.4, s: 16.3, l: 46.9 },
  },
  glassmorphism: {
    // Glassmorphism uses same base colors as default
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 222.2, s: 84, l: 4.9 },
    mutedForeground: { h: 215.4, s: 16.3, l: 46.9 },
  },
  dark: {
    background: { h: 222.2, s: 84, l: 4.9 },
    foreground: { h: 210, s: 40, l: 98 },
    mutedForeground: { h: 215, s: 20.2, l: 65.1 },
  },
};

describe("Property 5: Text Contrast Compliance", () => {
  // Arbitrary for theme modes
  const themeModeArb = fc.constantFrom("default", "glassmorphism", "dark");

  it("should have foreground text meeting WCAG AA contrast ratio (4.5:1) against background", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        const colors = themeColors[mode];
        const bgRgb = hslToRgb(
          colors.background.h,
          colors.background.s,
          colors.background.l
        );
        const fgRgb = hslToRgb(
          colors.foreground.h,
          colors.foreground.s,
          colors.foreground.l
        );

        const contrastRatio = getContrastRatio(fgRgb, bgRgb);

        // Requirements: 2.5, 3.4 - minimum contrast ratio of 4.5:1
        expect(contrastRatio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
      }),
      { numRuns: 100 }
    );
  });

  it("should have muted foreground text meeting WCAG AA contrast ratio for large text (3:1)", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        const colors = themeColors[mode];
        const bgRgb = hslToRgb(
          colors.background.h,
          colors.background.s,
          colors.background.l
        );
        const mutedRgb = hslToRgb(
          colors.mutedForeground.h,
          colors.mutedForeground.s,
          colors.mutedForeground.l
        );

        const contrastRatio = getContrastRatio(mutedRgb, bgRgb);

        // Muted text should at least meet large text requirements (3:1)
        expect(contrastRatio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
      }),
      { numRuns: 100 }
    );
  });

  it("should maintain consistent contrast ratios across theme modes", () => {
    const modes = ["default", "glassmorphism", "dark"];

    for (const mode of modes) {
      const colors = themeColors[mode];
      const bgRgb = hslToRgb(
        colors.background.h,
        colors.background.s,
        colors.background.l
      );
      const fgRgb = hslToRgb(
        colors.foreground.h,
        colors.foreground.s,
        colors.foreground.l
      );

      const contrastRatio = getContrastRatio(fgRgb, bgRgb);

      // All themes should meet WCAG AA
      expect(contrastRatio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    }
  });

  it("should calculate correct contrast ratio for known color pairs", () => {
    // Black on white should be 21:1
    const blackOnWhite = getContrastRatio([0, 0, 0], [255, 255, 255]);
    expect(blackOnWhite).toBeCloseTo(21, 0);

    // White on black should also be 21:1
    const whiteOnBlack = getContrastRatio([255, 255, 255], [0, 0, 0]);
    expect(whiteOnBlack).toBeCloseTo(21, 0);

    // Same color should be 1:1
    const sameColor = getContrastRatio([128, 128, 128], [128, 128, 128]);
    expect(sameColor).toBeCloseTo(1, 0);
  });
});
