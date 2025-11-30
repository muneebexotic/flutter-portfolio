"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type ThemeMode = "default" | "glassmorphism" | "dark";

const THEME_MODE_STORAGE_KEY = "portfolio-theme-mode";
const VALID_MODES: ThemeMode[] = ["default", "glassmorphism", "dark"];

export interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isTransitioning: boolean;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined
);

function isValidThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && VALID_MODES.includes(value as ThemeMode);
}

export function getStoredThemeMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (stored && isValidThemeMode(stored)) {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredThemeMode(mode: ThemeMode): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}


function applyThemeModeClass(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // Remove all theme mode classes
  root.classList.remove("theme-default", "theme-glassmorphism", "theme-dark");
  // Add the current mode class
  root.classList.add(`theme-${mode}`);
}

function setTransitioningClass(isTransitioning: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (isTransitioning) {
    root.classList.add("theme-transitioning");
  } else {
    root.classList.remove("theme-transitioning");
  }
}

interface ThemeModeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeModeProvider({
  children,
  defaultMode = "default",
}: ThemeModeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = getStoredThemeMode();
    if (stored) {
      setModeState(stored);
      applyThemeModeClass(stored);
    } else {
      applyThemeModeClass(defaultMode);
    }
    setMounted(true);
  }, [defaultMode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    if (!isValidThemeMode(newMode)) return;

    // Set transitioning state and apply CSS class for smooth transitions
    setIsTransitioning(true);
    setTransitioningClass(true);
    
    setModeState(newMode);
    setStoredThemeMode(newMode);
    applyThemeModeClass(newMode);

    // Reset transitioning flag after animation completes (500ms max per requirements 7.4)
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setTransitioningClass(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, isTransitioning }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeModeContext(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeModeContext must be used within a ThemeModeProvider"
    );
  }
  return context;
}

export { ThemeModeContext, THEME_MODE_STORAGE_KEY, VALID_MODES };
