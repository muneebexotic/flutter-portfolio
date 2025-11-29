"use client";

import { useState, useEffect } from "react";

/**
 * Hook for detecting responsive breakpoints using media queries
 * Requirements: 9.4, 4.4
 * 
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks for common responsive patterns
 */

/** Returns true when viewport is mobile (< 768px) */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

/** Returns true when viewport is tablet or larger (>= 768px) */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** Returns true when viewport is desktop (>= 1024px) */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Returns true when user prefers reduced motion */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
