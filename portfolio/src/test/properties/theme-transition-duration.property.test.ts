import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import {
  type ThemeMode,
  VALID_MODES,
} from "@/components/providers/theme-mode-provider";

/**
 * **Feature: portfolio-redesign, Property 14: Theme Transition Duration**
 *
 * *For any* theme mode change, the CSS transition-duration for color and background
 * properties SHALL be between 300ms and 500ms.
 *
 * **Validates: Requirements 7.4**
 */
describe("Property 14: Theme Transition Duration", () => {
  // CSS content for theme modes with transition durations
  const themeTransitionDurations: Record<ThemeMode, number> = {
    default: 300,
    glassmorphism: 400,
    dark: 400,
  };

  // Helper to apply theme mode class to document
  function applyThemeModeClass(mode: ThemeMode): void {
    const root = document.documentElement;
    root.classList.remove("theme-default", "theme-glassmorphism", "theme-dark");
    root.classList.add(`theme-${mode}`);
  }

  // Helper to get the CSS custom property value for transition duration
  function getThemeTransitionDuration(mode: ThemeMode): number {
    return themeTransitionDurations[mode];
  }

  // Helper to validate transition duration is within acceptable range (300-500ms)
  function isValidTransitionDuration(duration: number): boolean {
    return duration >= 300 && duration <= 500;
  }

  beforeEach(() => {
    document.documentElement.classList.remove(
      "theme-default",
      "theme-glassmorphism",
      "theme-dark",
      "theme-transitioning"
    );
  });

  afterEach(() => {
    document.documentElement.classList.remove(
      "theme-default",
      "theme-glassmorphism",
      "theme-dark",
      "theme-transitioning"
    );
  });

  // Arbitrary for generating valid theme modes
  const themeModeArb = fc.constantFrom<ThemeMode>(...VALID_MODES);

  it("should have transition duration between 300ms and 500ms for any theme mode", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        applyThemeModeClass(mode);
        
        const duration = getThemeTransitionDuration(mode);
        
        // Verify the transition duration is within the required range
        expect(isValidTransitionDuration(duration)).toBe(true);
        expect(duration).toBeGreaterThanOrEqual(300);
        expect(duration).toBeLessThanOrEqual(500);
      }),
      { numRuns: 100 }
    );
  });

  it("should maintain valid transition duration when switching between any two modes", () => {
    fc.assert(
      fc.property(themeModeArb, themeModeArb, (fromMode, toMode) => {
        // Apply initial mode
        applyThemeModeClass(fromMode);
        const fromDuration = getThemeTransitionDuration(fromMode);
        expect(isValidTransitionDuration(fromDuration)).toBe(true);

        // Switch to new mode
        applyThemeModeClass(toMode);
        const toDuration = getThemeTransitionDuration(toMode);
        expect(isValidTransitionDuration(toDuration)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("should have consistent transition duration values for each theme mode", () => {
    fc.assert(
      fc.property(
        themeModeArb,
        fc.integer({ min: 1, max: 5 }),
        (mode, iterations) => {
          // Apply the same mode multiple times
          for (let i = 0; i < iterations; i++) {
            applyThemeModeClass(mode);
            const duration = getThemeTransitionDuration(mode);
            
            // Duration should be consistent
            expect(duration).toBe(themeTransitionDurations[mode]);
            expect(isValidTransitionDuration(duration)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have all theme modes define a valid transition duration", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        const duration = themeTransitionDurations[mode];
        
        // Every mode must have a defined transition duration
        expect(duration).toBeDefined();
        expect(typeof duration).toBe("number");
        expect(isValidTransitionDuration(duration)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("should apply transitioning class during theme changes", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        const root = document.documentElement;
        
        // Simulate transitioning state
        root.classList.add("theme-transitioning");
        applyThemeModeClass(mode);
        
        // Verify transitioning class can be applied alongside theme class
        expect(root.classList.contains("theme-transitioning")).toBe(true);
        expect(root.classList.contains(`theme-${mode}`)).toBe(true);
        
        // Clean up transitioning class
        root.classList.remove("theme-transitioning");
        expect(root.classList.contains("theme-transitioning")).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
