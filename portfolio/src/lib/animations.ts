import type { Variants, Transition } from "framer-motion";

/**
 * Animation variants for Framer Motion
 * All animations use GPU-accelerated properties (transform, opacity)
 * Maximum duration: 800ms as per Requirements 17.1, 17.2
 * Supports reduced motion preference as per Requirements 11.4, 17.4
 */

/**
 * Reduced motion transition - instant with no animation
 */
const reducedMotionTransition: Transition = {
  duration: 0,
};

/**
 * Get animation variants that respect reduced motion preference
 * @param variants - Original animation variants
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Modified variants with instant transitions if reduced motion is preferred
 */
export function getReducedMotionVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  if (!prefersReducedMotion) return variants;

  const reducedVariants: Variants = {};
  
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      reducedVariants[key] = {
        ...value,
        transition: reducedMotionTransition,
      };
    } else {
      reducedVariants[key] = value;
    }
  }
  
  return reducedVariants;
}

/**
 * Fade in and slide up animation
 * Used for section entrances and content reveals
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Simple fade in animation
 * Used for subtle content reveals
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Container variant for staggered children animations
 * Used for lists and grids of items
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Scale animation on hover
 * Used for interactive cards and buttons
 */
export const scaleOnHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from left animation
 * Used for timeline items and side content
 */
export const slideInFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right animation
 * Used for alternating timeline items
 */
export const slideInFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Skill bar fill animation
 * Animates width from 0 to the specified percentage
 * @param percentage - Target width percentage (0-100)
 * @returns Variants object for the skill bar
 */
export const skillBarFill = (percentage: number): Variants => ({
  hidden: {
    width: 0,
  },
  visible: {
    width: `${percentage}%`,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
});

/**
 * Card hover animation with shadow
 * Used for project cards
 */
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Modal backdrop animation
 * Used for modal overlays
 */
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Modal content animation
 * Scales and fades in from center
 */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Navigation link hover animation
 * Subtle scale and color transition
 */
export const navLinkHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Stagger item variant
 * Used as children of staggerContainer
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


/**
 * Reduced motion variants - instant transitions for accessibility
 * Used when user has prefers-reduced-motion enabled
 * Requirements: 11.4, 17.4
 */

export const reducedMotionFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export const reducedMotionStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0, staggerChildren: 0, delayChildren: 0 },
  },
};

export const reducedMotionStaggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export const reducedMotionCardHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1, transition: { duration: 0 } },
};

export const reducedMotionModalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export const reducedMotionModalContent: Variants = {
  hidden: { opacity: 0, scale: 1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 0, scale: 1, transition: { duration: 0 } },
};

/**
 * Skill bar fill animation with reduced motion support
 * @param percentage - Target width percentage (0-100)
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Variants object for the skill bar
 */
export const skillBarFillWithReducedMotion = (
  percentage: number,
  prefersReducedMotion: boolean
): Variants => ({
  hidden: { width: 0 },
  visible: {
    width: `${percentage}%`,
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" },
  },
});
