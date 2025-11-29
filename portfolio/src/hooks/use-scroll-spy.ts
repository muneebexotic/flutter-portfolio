"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Options for the useScrollSpy hook
 */
interface UseScrollSpyOptions {
  /** IDs of sections to track (without #) */
  sectionIds: string[];
  /** Offset from top of viewport for activation (default: 80px for header) */
  offset?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

/**
 * Hook for tracking which section is currently active based on scroll position
 * Uses Intersection Observer for efficient scroll tracking
 * Requirements: 9.4
 * 
 * @param options - Configuration options
 * @returns The ID of the currently active section (with #)
 */
export function useScrollSpy(options: UseScrollSpyOptions): string {
  const { sectionIds, offset = 80, rootMargin } = options;
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Get all section elements
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    // Calculate root margin based on offset
    const margin = rootMargin ?? `-${offset}px 0px -50% 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting section
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          setActiveSection(`#${intersecting.target.id}`);
        }
      },
      {
        rootMargin: margin,
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds, offset, rootMargin]);

  return activeSection;
}

/**
 * Hook for programmatic smooth scrolling to sections
 * Requirements: 9.1
 * 
 * @param offset - Offset from top for sticky header clearance (default: 80px)
 * @returns Function to scroll to a section by href
 */
export function useScrollTo(offset: number = 80) {
  const scrollTo = useCallback(
    (href: string) => {
      const element = document.querySelector(href);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [offset]
  );

  return scrollTo;
}
