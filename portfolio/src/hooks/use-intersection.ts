"use client";

import { useState, useEffect, useRef, RefObject } from "react";

/**
 * Options for the useIntersection hook
 */
interface UseIntersectionOptions {
  /** Root element for intersection (default: viewport) */
  root?: Element | null;
  /** Margin around the root element */
  rootMargin?: string;
  /** Threshold(s) at which to trigger callback */
  threshold?: number | number[];
  /** Whether to disconnect after first intersection */
  triggerOnce?: boolean;
}

/**
 * Hook for detecting when an element enters the viewport
 * Uses Intersection Observer API for efficient viewport detection
 * Requirements: 9.4, 4.4
 * 
 * @param options - Configuration options for the intersection observer
 * @returns Tuple of [ref to attach to element, isIntersecting boolean]
 */
export function useIntersection<T extends Element = Element>(
  options: UseIntersectionOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    triggerOnce = false,
  } = options;

  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && triggerOnce) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting];
}
