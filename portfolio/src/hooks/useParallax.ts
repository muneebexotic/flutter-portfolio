"use client";

import { useCallback, useEffect, useState, CSSProperties } from "react";
import { usePrefersReducedMotion } from "./use-media-query";

/**
 * Options for the useParallax hook
 */
export interface UseParallaxOptions {
  /** Speed factor for parallax effect (0.1 = slow, 1 = normal, 2 = fast) */
  speed?: number;
  /** Direction of parallax movement */
  direction?: "vertical" | "horizontal";
  /** Whether parallax effect is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for the useParallax hook
 */
export interface UseParallaxReturn {
  /** Current Y offset value */
  y: number;
  /** Current X offset value */
  x: number;
  /** CSS style object with transform */
  style: CSSProperties;
  /** Current scroll position */
  scrollPosition: number;
}

/**
 * Calculates parallax offset based on scroll position and speed factor.
 * Uses requestAnimationFrame for smooth updates.
 *
 * The translateY/translateX value equals scroll position multiplied by the speed factor.
 *
 * Requirements: 4.3
 *
 * @param options - Configuration options for the parallax effect
 * @returns Object with offset values and style object
 */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
  const { speed = 0.5, direction = "vertical", enabled = true } = options;

  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    if (!enabled || prefersReducedMotion) return;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setScrollPosition(window.scrollY);
    });
  }, [enabled, prefersReducedMotion]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    // Set initial scroll position
    setScrollPosition(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, prefersReducedMotion, handleScroll]);

  // Calculate offset based on scroll position and speed
  const offset = calculateParallaxOffset(scrollPosition, speed);

  // Determine x and y based on direction
  const x = direction === "horizontal" ? offset : 0;
  const y = direction === "vertical" ? offset : 0;

  // Build style object
  const style: CSSProperties =
    !enabled || prefersReducedMotion
      ? {}
      : {
          transform:
            direction === "vertical"
              ? `translateY(${y}px)`
              : `translateX(${x}px)`,
          willChange: "transform",
        };

  return {
    y,
    x,
    style,
    scrollPosition,
  };
}

/**
 * Pure function to calculate parallax offset.
 * Useful for testing without React hooks.
 *
 * @param scrollPosition - Current scroll position in pixels
 * @param speed - Speed factor for parallax effect
 * @returns Calculated offset value
 */
export function calculateParallaxOffset(
  scrollPosition: number,
  speed: number
): number {
  return scrollPosition * speed;
}
