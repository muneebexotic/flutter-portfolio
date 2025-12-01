"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animation variant types for StaggeredList items
 */
export type StaggeredAnimation = "fadeUp" | "fadeIn" | "scale";

export interface StaggeredListProps {
  children: React.ReactNode;
  /** Delay between each child animation (ms) */
  staggerDelay?: number;
  /** Animation variant to use for children */
  animation?: StaggeredAnimation;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to animate on mount or wait for trigger */
  animateOnMount?: boolean;
}

/**
 * Container variants for staggered animations
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Default, will be overridden
      delayChildren: 0.1,
    },
  },
};

/**
 * Reduced motion container variants
 */
const reducedMotionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0,
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

/**
 * Item variants for each animation type
 * All use GPU-accelerated properties (transform, opacity)
 */
const itemVariants: Record<StaggeredAnimation, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
};

/**
 * Reduced motion item variants
 */
const reducedMotionItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
};

/**
 * StaggeredList Component
 *
 * Container component that animates children with staggered entrance effects.
 * Uses Framer Motion's staggerChildren for coordinated animations.
 * Respects user's reduced motion preference.
 *
 * Requirements: 5.4
 *
 * @example
 * ```tsx
 * <StaggeredList animation="fadeUp" staggerDelay={100}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggeredList>
 * ```
 */
export function StaggeredList({
  children,
  staggerDelay = 100,
  animation = "fadeUp",
  className = "",
  animateOnMount = true,
}: StaggeredListProps) {
  const prefersReducedMotion = useReducedMotion();

  // Convert ms to seconds for Framer Motion
  const staggerDelaySeconds = staggerDelay / 1000;

  // Create container variants with custom stagger delay
  const customContainerVariants: Variants = prefersReducedMotion
    ? reducedMotionContainerVariants
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelaySeconds,
            delayChildren: 0.1,
          },
        },
      };

  // Children are passed directly - they should have their own motion wrappers
  // This preserves grid/flex layout since we don't add extra wrapper divs
  const animatedChildren = children;

  return (
    <motion.div
      className={className}
      variants={customContainerVariants}
      initial="hidden"
      animate={animateOnMount ? "visible" : undefined}
      whileInView={!animateOnMount ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
    >
      {animatedChildren}
    </motion.div>
  );
}

/**
 * Export variants for testing and external use
 */
export { containerVariants, itemVariants, reducedMotionItemVariants };

export default StaggeredList;
