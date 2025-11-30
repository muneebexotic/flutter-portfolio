import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ThemeSwitcher, themeOptions } from "@/components/ui/theme-switcher";
import {
  ThemeModeProvider,
  type ThemeMode,
  VALID_MODES,
} from "@/components/providers/theme-mode-provider";

/**
 * **Feature: portfolio-redesign, Property 12: Theme Switcher Active State**
 *
 * *For any* theme mode selection, the Theme Switcher component SHALL render
 * the corresponding option with an active/selected visual state (aria-selected="true").
 *
 * **Validates: Requirements 6.3**
 */
describe("Property 12: Theme Switcher Active State", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  // Arbitrary for generating valid theme modes
  const themeModeArb = fc.constantFrom<ThemeMode>(...VALID_MODES);

  // Helper to render ThemeSwitcher with a specific initial mode
  function renderWithMode(mode: ThemeMode) {
    return render(
      <ThemeModeProvider defaultMode={mode}>
        <ThemeSwitcher />
      </ThemeModeProvider>
    );
  }

  it("should display the correct active mode in the trigger button", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        cleanup();
        renderWithMode(mode);

        const trigger = screen.getByTestId("theme-switcher-trigger");
        const expectedOption = themeOptions.find((opt) => opt.value === mode);

        // The trigger should contain the label of the current mode
        expect(trigger).toHaveAttribute(
          "aria-label",
          expect.stringContaining(expectedOption!.label)
        );
      }),
      { numRuns: 100 }
    );
  });

  it("should mark the active option with aria-selected=true when dropdown is open", async () => {
    // Test each mode explicitly to avoid async property test timeout issues
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      
      // Open the dropdown using fireEvent (faster than userEvent)
      fireEvent.click(trigger);

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      // Find the option for the current mode
      const activeOption = screen.getByTestId(`theme-option-${mode}`);

      // Verify aria-selected is true for the active option
      expect(activeOption).toHaveAttribute("aria-selected", "true");

      // Verify other options have aria-selected=false
      for (const option of themeOptions) {
        if (option.value !== mode) {
          const otherOption = screen.getByTestId(`theme-option-${option.value}`);
          expect(otherOption).toHaveAttribute("aria-selected", "false");
        }
      }
    }
  });

  it("should have exactly one option with aria-selected=true at any time", async () => {
    await fc.assert(
      fc.asyncProperty(themeModeArb, async (mode) => {
        cleanup();
        renderWithMode(mode);

        const trigger = screen.getByTestId("theme-switcher-trigger");
        fireEvent.click(trigger);

        // Wait for dropdown to appear
        await waitFor(() => {
          expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
        });

        // Count options with aria-selected=true
        const selectedOptions = themeOptions.filter((option) => {
          const element = screen.getByTestId(`theme-option-${option.value}`);
          return element.getAttribute("aria-selected") === "true";
        });

        expect(selectedOptions.length).toBe(1);
        expect(selectedOptions[0].value).toBe(mode);
      }),
      { numRuns: 30 } // Reduced runs for async tests
    );
  });

  it("should update active state when mode changes", async () => {
    // Test mode transitions explicitly
    const transitions: [ThemeMode, ThemeMode][] = [
      ["default", "glassmorphism"],
      ["glassmorphism", "dark"],
      ["dark", "default"],
    ];

    for (const [initialMode, newMode] of transitions) {
      cleanup();
      renderWithMode(initialMode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      
      // Open dropdown and select new mode
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      const newOption = screen.getByTestId(`theme-option-${newMode}`);
      fireEvent.click(newOption);

      // Re-open dropdown to verify state
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      // The new mode should now be selected
      const selectedOption = screen.getByTestId(`theme-option-${newMode}`);
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    }
  });
});
