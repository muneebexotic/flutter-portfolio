import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  type ThemeMode,
  VALID_MODES,
  THEME_MODE_STORAGE_KEY,
  getStoredThemeMode,
  setStoredThemeMode,
} from "@/components/providers/theme-mode-provider";

/**
 * **Feature: portfolio-redesign, Property 1: Theme Persistence Round-Trip**
 *
 * *For any* valid theme mode selection, storing the mode to localStorage
 * and then reading it back SHALL return the same theme mode value.
 *
 * **Validates: Requirements 1.3, 1.4**
 */
describe("Property 1: Theme Persistence Round-Trip", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Arbitrary for generating valid theme modes
  const themeModeArb = fc.constantFrom<ThemeMode>(...VALID_MODES);

  it("should return the same theme mode after storing and retrieving", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        // Store the theme mode
        const stored = setStoredThemeMode(mode);
        expect(stored).toBe(true);

        // Retrieve the theme mode
        const retrieved = getStoredThemeMode();

        // Round-trip should preserve the value
        expect(retrieved).toBe(mode);
      }),
      { numRuns: 100 }
    );
  });

  it("should persist across multiple set operations", () => {
    fc.assert(
      fc.property(
        fc.array(themeModeArb, { minLength: 1, maxLength: 10 }),
        (modes) => {
          // Set each mode in sequence
          for (const mode of modes) {
            setStoredThemeMode(mode);
          }

          // The last mode should be persisted
          const lastMode = modes[modes.length - 1];
          const retrieved = getStoredThemeMode();
          expect(retrieved).toBe(lastMode);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should return null for invalid stored values", () => {
    // Store an invalid value directly
    localStorage.setItem(THEME_MODE_STORAGE_KEY, "invalid-mode");
    const retrieved = getStoredThemeMode();
    expect(retrieved).toBeNull();
  });

  it("should return null when no value is stored", () => {
    const retrieved = getStoredThemeMode();
    expect(retrieved).toBeNull();
  });
});
