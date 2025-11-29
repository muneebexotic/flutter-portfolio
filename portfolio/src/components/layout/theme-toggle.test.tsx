import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as fc from "fast-check";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "./theme-toggle";

/**
 * Property-based tests for ThemeToggle component
 * **Feature: flutter-portfolio, Property 15: Theme Toggle**
 * **Validates: Requirements 8.1, 8.3**
 */

// Helper to render ThemeToggle with provider
function renderThemeToggle(defaultTheme: "light" | "dark" = "light") {
  return render(
    <ThemeProvider
      attribute="class"
      storageKey="portfolio-theme"
      defaultTheme={defaultTheme}
      enableSystem={false}
    >
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders toggle button with correct aria-label", async () => {
    renderThemeToggle("light");

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
    });
  });

  /**
   * **Feature: flutter-portfolio, Property 15: Theme Toggle**
   * *For any* current theme state (dark or light), clicking the theme toggle
   * SHALL switch to the opposite theme and persist the new value to localStorage.
   * **Validates: Requirements 8.1, 8.3**
   */
  it("Property 15: clicking toggle switches theme and persists to localStorage", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("light", "dark") as fc.Arbitrary<"light" | "dark">,
        async (initialTheme) => {
          // Clear state before each property test iteration
          localStorage.clear();
          document.documentElement.className = "";

          // Set initial theme in localStorage
          localStorage.setItem("portfolio-theme", initialTheme);

          const { unmount } = renderThemeToggle(initialTheme);

          // Wait for component to mount and hydrate
          await waitFor(() => {
            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
          });

          const button = screen.getByRole("button");

          // Click the toggle
          fireEvent.click(button);

          // Expected theme after toggle
          const expectedTheme = initialTheme === "dark" ? "light" : "dark";

          // Verify localStorage is updated with the new theme
          await waitFor(
            () => {
              const storedTheme = localStorage.getItem("portfolio-theme");
              expect(storedTheme).toBe(expectedTheme);
            },
            { timeout: 1000 }
          );

          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: 10 } // Run 10 iterations for each theme
    );
  });

  it("toggles from light to dark theme", async () => {
    localStorage.setItem("portfolio-theme", "light");
    renderThemeToggle("light");

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem("portfolio-theme")).toBe("dark");
    });
  });

  it("toggles from dark to light theme", async () => {
    localStorage.setItem("portfolio-theme", "dark");
    renderThemeToggle("dark");

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem("portfolio-theme")).toBe("light");
    });
  });

  it("has correct aria-pressed attribute based on theme", async () => {
    localStorage.setItem("portfolio-theme", "dark");
    renderThemeToggle("dark");

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
  });
});
