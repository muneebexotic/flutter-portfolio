import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";

// Mock component to test theme functionality
function ThemeTestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme("light")} data-testid="set-light">
        Set Light
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document class
    document.documentElement.className = "";
  });

  it("renders children correctly", () => {
    render(
      <ThemeProvider attribute="class" storageKey="portfolio-theme">
        <div data-testid="child">Child content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("uses the correct storage key for localStorage", async () => {
    render(
      <ThemeProvider
        attribute="class"
        storageKey="portfolio-theme"
        defaultTheme="light"
        enableSystem={false}
      >
        <ThemeTestComponent />
      </ThemeProvider>
    );

    // Change theme to trigger localStorage write
    fireEvent.click(screen.getByTestId("set-dark"));

    // Wait for theme to be stored with correct key
    await waitFor(() => {
      const storedTheme = localStorage.getItem("portfolio-theme");
      expect(storedTheme).toBe("dark");
    });
  });

  it("allows theme to be toggled", async () => {
    render(
      <ThemeProvider
        attribute="class"
        storageKey="portfolio-theme"
        defaultTheme="light"
        enableSystem={false}
      >
        <ThemeTestComponent />
      </ThemeProvider>
    );

    // Click to set dark theme
    fireEvent.click(screen.getByTestId("set-dark"));

    await waitFor(() => {
      expect(localStorage.getItem("portfolio-theme")).toBe("dark");
    });

    // Click to set light theme
    fireEvent.click(screen.getByTestId("set-light"));

    await waitFor(() => {
      expect(localStorage.getItem("portfolio-theme")).toBe("light");
    });
  });

  it("persists theme preference to localStorage", async () => {
    render(
      <ThemeProvider
        attribute="class"
        storageKey="portfolio-theme"
        defaultTheme="light"
        enableSystem={false}
      >
        <ThemeTestComponent />
      </ThemeProvider>
    );

    // Set dark theme
    fireEvent.click(screen.getByTestId("set-dark"));

    await waitFor(() => {
      const storedTheme = localStorage.getItem("portfolio-theme");
      expect(storedTheme).toBe("dark");
    });
  });

  it("applies class attribute for theming", async () => {
    render(
      <ThemeProvider
        attribute="class"
        storageKey="portfolio-theme"
        defaultTheme="dark"
        enableSystem={false}
      >
        <ThemeTestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
