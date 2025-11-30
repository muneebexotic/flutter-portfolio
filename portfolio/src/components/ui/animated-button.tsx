"use client";

import { forwardRef, useState } from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * AnimatedButton component with micro-animation feedback
 * - Hover scale transition (200ms)
 * - Click feedback with brief scale animation
 * - Glow effect in dark mode on hover
 *
 * Requirements: 5.1, 5.3
 */

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Animation variants for the button
 * Uses GPU-accelerated properties (transform, opacity) for smooth performance
 * Requirements: 8.3
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

/**
 * Reduced motion variants - instant transitions for accessibility
 * Requirements: 5.6
 */
export const reducedMotionButtonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1,
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

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const { isDarkMode } = useThemeMode();
    const [isPressed, setIsPressed] = useState(false);

    const baseStyles =
      "inline-flex items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl transition-all duration-300";

    // Enhanced variants with gradients, shadows, and glow effects
    const variants = {
      primary: cn(
        "bg-gradient-to-r from-primary via-primary to-primary/90",
        "text-primary-foreground",
        "shadow-lg shadow-primary/25",
        "hover:shadow-xl hover:shadow-primary/40",
        "hover:from-primary/90 hover:via-primary hover:to-primary",
        "dark:shadow-primary/30 dark:hover:shadow-primary/50",
        "border border-primary/20"
      ),
      secondary: cn(
        "bg-gradient-to-r from-secondary to-secondary/80",
        "text-secondary-foreground",
        "shadow-md shadow-secondary/20",
        "hover:shadow-lg hover:shadow-secondary/30",
        "border border-secondary/30"
      ),
      ghost: cn(
        "bg-transparent",
        "text-foreground",
        "border-2 border-border/60",
        "hover:bg-accent/10 hover:border-primary/50",
        "hover:text-primary",
        "shadow-sm hover:shadow-md",
        "dark:border-border/40 dark:hover:border-primary/60",
        "dark:hover:shadow-primary/20"
      ),
    };

    const sizes = {
      sm: "h-9 px-4 text-sm gap-2",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-12 px-8 text-base gap-3",
    };

    // Dark mode glow styles - Requirements: 3.5
    const darkModeGlowStyles = isDarkMode
      ? "transition-shadow duration-200"
      : "";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!prefersReducedMotion) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }
      onClick?.(e);
    };

    const activeVariants = prefersReducedMotion
      ? reducedMotionButtonVariants
      : buttonVariants;

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          darkModeGlowStyles,
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        onClick={handleClick}
        variants={activeVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate={isPressed ? "tap" : "rest"}
        style={{
          // Ensure GPU acceleration - Requirements: 8.3
          willChange: "transform",
          // Transition duration for hover effects - Requirements: 5.1
          transitionProperty: "transform, background-color, box-shadow",
          transitionDuration: "200ms",
        }}
        {...props}
      >
        {isLoading ? (
          <Spinner className="mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

/**
 * Loading spinner component
 */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { AnimatedButton };
