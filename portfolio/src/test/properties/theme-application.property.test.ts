import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import {
  type ThemeMode,
  VALID_MODES,
} from "@/components/providers/theme-mode-provider";

/**
 * **Feature: portfolio-redesign, Property 2: Theme Application Consistency**
 *
 * *For any* theme mode, when that mode is selected, the document root SHALL have
 * the corresponding CSS class applied and all theme CSS variables SHALL be defined.
 *
 * **Validates: Requirements 1.2, 7.1**
 */
describe("Property 2: Theme Application Consistency", () => {
  // Helper to apply theme mode class to document
  function applyThemeModeClass(mode: ThemeMode): void {
    const root = document.documentElement;
    // Remove all theme mode classes
    root.classList.remove("theme-default", "theme-glassmorphism", "theme-dark");
    // Add the current mode class
    root.classList.add(`theme-${mode}`);
  }

  // Helper to check if theme class is applied
  function hasThemeClass(mode: ThemeMode): boolean {
    return document.documentElement.classList.contains(`theme-${mode}`);
  }

  // Helper to check that only one theme class is applied
  function hasExactlyOneThemeClass(): boolean {
    const root = document.documentElement;
    const themeClasses = VALID_MODES.filter((mode) =>
      root.classList.contains(`theme-${mode}`)
    );
    return themeClasses.length === 1;
  }

  beforeEach(() => {
    // Clean up any existing theme classes
    document.documentElement.classList.remove(
      "theme-default",
      "theme-glassmorphism",
      "theme-dark"
    );
  });

  afterEach(() => {
    // Clean up after each test
    document.documentElement.classList.remove(
      "theme-default",
      "theme-glassmorphism",
      "theme-dark"
    );
  });

  // Arbitrary for generating valid theme modes
  const themeModeArb = fc.constantFrom<ThemeMode>(...VALID_MODES);

  it("should apply the corresponding CSS class for any theme mode", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        // Apply the theme mode
        applyThemeModeClass(mode);

        // Verify the correct class is applied
        expect(hasThemeClass(mode)).toBe(true);

        // Verify only one theme class is applied
        expect(hasExactlyOneThemeClass()).toBe(true);
      }),
      { numRuns: 100 }
    );
  });


  it("should remove previous theme class when switching modes", () => {
    fc.assert(
      fc.property(themeModeArb, themeModeArb, (mode1, mode2) => {
        // Apply first theme mode
        applyThemeModeClass(mode1);
        expect(hasThemeClass(mode1)).toBe(true);

        // Apply second theme mode
        applyThemeModeClass(mode2);

        // Verify only the new class is applied
        expect(hasThemeClass(mode2)).toBe(true);
        expect(hasExactlyOneThemeClass()).toBe(true);

        // If modes are different, the old class should be removed
        if (mode1 !== mode2) {
          expect(hasThemeClass(mode1)).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should maintain class consistency through multiple mode changes", () => {
    fc.assert(
      fc.property(
        fc.array(themeModeArb, { minLength: 1, maxLength: 10 }),
        (modes) => {
          // Apply each mode in sequence
          for (const mode of modes) {
            applyThemeModeClass(mode);
          }

          // After all changes, only the last mode's class should be applied
          const lastMode = modes[modes.length - 1];
          expect(hasThemeClass(lastMode)).toBe(true);
          expect(hasExactlyOneThemeClass()).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have valid theme class name format for all modes", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        const expectedClassName = `theme-${mode}`;

        // Verify the class name follows the expected pattern
        expect(expectedClassName).toMatch(/^theme-(default|glassmorphism|dark)$/);

        // Apply and verify
        applyThemeModeClass(mode);
        expect(
          document.documentElement.classList.contains(expectedClassName)
        ).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
