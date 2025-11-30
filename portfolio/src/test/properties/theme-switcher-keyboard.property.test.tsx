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
 * **Feature: portfolio-redesign, Property 13: Theme Switcher Keyboard Accessibility**
 *
 * *For any* Theme Switcher component, all options SHALL be reachable via keyboard
 * navigation (Tab, Arrow keys) and SHALL have visible focus indicators.
 *
 * **Validates: Requirements 6.4**
 */
describe("Property 13: Theme Switcher Keyboard Accessibility", () => {
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

  it("should have focusable trigger button with focus-visible styles", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        cleanup();
        renderWithMode(mode);

        const trigger = screen.getByTestId("theme-switcher-trigger");
        
        // Trigger should be focusable (button element)
        expect(trigger.tagName.toLowerCase()).toBe("button");
        
        // Should have focus-visible classes for keyboard focus indication
        expect(trigger.className).toContain("focus-visible:");
      }),
      { numRuns: 100 }
    );
  });

  it("should open dropdown with Enter key", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      trigger.focus();
      
      // Press Enter to open dropdown
      fireEvent.keyDown(trigger, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });
    }
  });

  it("should open dropdown with Space key", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      trigger.focus();
      
      // Press Space to open dropdown
      fireEvent.keyDown(trigger, { key: " " });

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });
    }
  });

  it("should navigate options with ArrowDown key", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      trigger.focus();
      
      // Open dropdown
      fireEvent.keyDown(trigger, { key: "ArrowDown" });

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      // Dropdown should be open after ArrowDown
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("should navigate options with ArrowUp key", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      trigger.focus();
      
      // Open dropdown
      fireEvent.keyDown(trigger, { key: "ArrowUp" });

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      // Dropdown should be open after ArrowUp
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("should close dropdown with Escape key", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      
      // Open dropdown first
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      // Press Escape to close
      fireEvent.keyDown(trigger, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByTestId("theme-switcher-options")).not.toBeInTheDocument();
      });
    }
  });

  it("should select option with Enter key when focused", async () => {
    cleanup();
    renderWithMode("default");

    const trigger = screen.getByTestId("theme-switcher-trigger");
    trigger.focus();
    
    // Open dropdown
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    await waitFor(() => {
      expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
    });

    // Navigate to next option
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    
    // Select with Enter
    fireEvent.keyDown(trigger, { key: "Enter" });

    // Dropdown should close after selection
    await waitFor(() => {
      expect(screen.queryByTestId("theme-switcher-options")).not.toBeInTheDocument();
    });
  });

  it("should have proper ARIA attributes for accessibility", () => {
    fc.assert(
      fc.property(themeModeArb, (mode) => {
        cleanup();
        renderWithMode(mode);

        const trigger = screen.getByTestId("theme-switcher-trigger");
        
        // Should have aria-haspopup for dropdown indication
        expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
        
        // Should have aria-expanded attribute
        expect(trigger).toHaveAttribute("aria-expanded");
        
        // Should have aria-label for screen readers
        expect(trigger).toHaveAttribute("aria-label");
        expect(trigger.getAttribute("aria-label")).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  it("should have proper ARIA roles on dropdown options", async () => {
    for (const mode of VALID_MODES) {
      cleanup();
      renderWithMode(mode);

      const trigger = screen.getByTestId("theme-switcher-trigger");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-options")).toBeInTheDocument();
      });

      const optionsList = screen.getByTestId("theme-switcher-options");
      
      // List should have listbox role
      expect(optionsList).toHaveAttribute("role", "listbox");
      
      // Each option should have option role
      for (const option of themeOptions) {
        const optionElement = screen.getByTestId(`theme-option-${option.value}`);
        expect(optionElement).toHaveAttribute("role", "option");
      }
    }
  });
});
