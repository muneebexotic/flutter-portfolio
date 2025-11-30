"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * SkillBadge component with hover bounce/pulse animation
 * Styled appropriately for each theme mode
 *
 * Requirements: 5.5
 */

export interface SkillBadgeProps
  extends Omit<HTMLMotionProps<"span">, "ref" | "children"> {
  variant?: "default" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

/**
 * Animation variants for the skill badge
 * Uses GPU-accelerated properties (transform, opacity) for smooth performance
 * Requirements: 5.5, 8.3
 */
export const skillBadgeVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.08,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Pulse animation for subtle continuous effect on hover
 */
export const pulseVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

/**
 * Reduced motion variants - no animation for accessibility
 * Requirements: 5.6
 */
export const reducedMotionSkillBadgeVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0,
    },
  },
  tap: {
    scale: 1,
    transition: {
      duration: 0,
    },
  },
};

function SkillBadge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: SkillBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isDarkMode, isGlassmorphism } = useThemeMode();

  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium cursor-default select-none";

  // Size variants
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  // Theme-aware variant styles
  const getVariantStyles = () => {
    // Glassmorphism mode styles
    if (isGlassmorphism && variant !== "outline") {
      return cn(
        "backdrop-blur-md bg-white/10 border border-white/20",
        "text-foreground shadow-lg"
      );
    }

    // Dark mode styles with glow effect
    if (isDarkMode) {
      const darkVariants = {
        default:
          "bg-primary/20 text-primary-foreground border border-primary/30 glow-primary",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary/50",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary/50",
        glass:
          "backdrop-blur-sm bg-white/5 border border-white/10 text-foreground",
      };
      return darkVariants[variant];
    }

    // Default/light mode styles
    const lightVariants = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-border bg-transparent text-foreground",
      glass: "backdrop-blur-sm bg-white/80 border border-gray-200 text-foreground",
    };
    return lightVariants[variant];
  };

  // Transition styles for smooth hover effects
  const transitionStyles = "transition-colors duration-200";

  const activeVariants = prefersReducedMotion
    ? reducedMotionSkillBadgeVariants
    : skillBadgeVariants;

  return (
    <motion.span
      className={cn(
        baseStyles,
        sizes[size],
        getVariantStyles(),
        transitionStyles,
        className
      )}
      variants={activeVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      style={{
        // Ensure GPU acceleration - Requirements: 8.3
        willChange: "transform",
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}

SkillBadge.displayName = "SkillBadge";

export { SkillBadge };
