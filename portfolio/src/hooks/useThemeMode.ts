"use client";

import { useState, useEffect } from "react";

export type ThemeMode = "default" | "glassmorphism" | "dark";

export interface UseThemeModeReturn {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isGlassmorphism: boolean;
  isDarkMode: boolean;
  isDefault: boolean;
  isTransitioning: boolean;
}

/**
 * Hook to detect the current theme mode based on DOM classes.
 * Works with the unified ThemeSwitcher component.
 * 
 * @returns Object with mode and boolean helpers
 */
export function useThemeMode(): UseThemeModeReturn {
  const [mode, setModeState] = useState<ThemeMode>("default");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const detectTheme = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const isGlass = root.classList.contains("theme-glass");
      
      if (isGlass) {
        setModeState("glassmorphism");
      } else if (isDark) {
        setModeState("dark");
      } else {
        setModeState("default");
      }
    };

    // Initial detection
    detectTheme();

    // Watch for class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          setIsTransitioning(true);
          detectTheme();
          // Reset transitioning after animation
          setTimeout(() => setIsTransitioning(false), 400);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // setMode is a no-op since ThemeSwitcher handles this now
  const setMode = () => {
    console.warn("setMode is deprecated. Use ThemeSwitcher component instead.");
  };

  return {
    mode,
    setMode,
    isGlassmorphism: mode === "glassmorphism",
    isDarkMode: mode === "dark" || mode === "glassmorphism", // Glass is dark-based
    isDefault: mode === "default",
    isTransitioning,
  };
}
