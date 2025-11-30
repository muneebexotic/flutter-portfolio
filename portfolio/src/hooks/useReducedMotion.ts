"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect user's reduced motion preference.
 * Returns true when the user has enabled "prefers-reduced-motion: reduce"
 * in their system settings.
 *
 * Requirements: 5.6
 *
 * @returns Boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler for preference changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
