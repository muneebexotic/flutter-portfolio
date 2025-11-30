"use client";

import React, { useCallback } from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animation variant types for ScrollReveal
 */
export type ScrollRevealAnimation =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scale";

export interface ScrollRevealProps {
  children: React.ReactNode;
  /** Animation variant to use */
  animation?: ScrollRevealAnimation;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Viewport intersection threshold (0-1) */
  threshold?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to only animate once */
  once?: boolean;
}

/**
 * Animation variants for each animation type
 * All use GPU-accelerated properties (transform, opacity)
 */
const animationVariants: Record<ScrollRevealAnimation, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Reduced motion variants - instant transitions for accessibility
 */
const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * ScrollReveal Component
 *
 * Wrapper component that animates children when they enter the viewport.
 * Uses Framer Motion with Intersection Observer for efficient scroll-triggered animations.
 * Respects user's reduced motion preference.
 *
 * Requirements: 5.2
 *
 * @example
 * ```tsx
 * <ScrollReveal animation="fadeUp" delay={100}>
 *   <Card>Content</Card>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const [intersectionRef, isIntersecting] = useIntersection<HTMLDivElement>({
    threshold,
    triggerOnce: once,
  });

  const prefersReducedMotion = useReducedMotion();

  // Use reduced motion variants if user prefers reduced motion
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : animationVariants[animation];

  // Transition configuration
  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: duration / 1000, // Convert ms to seconds for Framer Motion
        delay: delay / 1000,
        ease: "easeOut" as const,
      };

  // Callback ref to handle the intersection ref
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Update the intersection ref
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [intersectionRef]
  );

  return (
    <motion.div
      ref={setRef}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Export animation variants for testing and external use
 */
export { animationVariants, reducedMotionVariants };

export default ScrollReveal;
