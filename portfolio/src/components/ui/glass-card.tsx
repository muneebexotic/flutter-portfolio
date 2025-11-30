"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useThemeMode } from "@/hooks/useThemeMode";
import { cardHover } from "@/lib/animations";

/**
 * GlassCard component with glassmorphism effects
 * Implements backdrop-filter blur (10-20px based on blur prop)
 * Applies semi-transparent backgrounds (opacity 0.1-0.3)
 * Includes @supports fallback for browsers without backdrop-filter
 *
 * Requirements: 2.1, 2.2, 2.3, 8.4
 */

export type GlassBlur = "sm" | "md" | "lg";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  blur?: GlassBlur;
  opacity?: number; // 0.1 - 0.3
  hover?: boolean;
}

// Blur values in pixels: sm=10px, md=15px, lg=20px
// Requirements: 2.1 - blur effects between 10px and 20px
export const BLUR_VALUES: Record<GlassBlur, number> = {
  sm: 10,
  md: 15,
  lg: 20,
};

// Clamp opacity to valid range (0.1 - 0.3)
// Requirements: 2.2 - opacity between 0.1 and 0.3
export function clampOpacity(opacity: number): number {
  return Math.max(0.1, Math.min(0.3, opacity));
}

// Get blur value in pixels
export function getBlurValue(blur: GlassBlur): number {
  return BLUR_VALUES[blur];
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      blur = "md",
      opacity = 0.2,
      hover = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { isGlassmorphism } = useThemeMode();

    // Clamp opacity to valid range
    const clampedOpacity = clampOpacity(opacity);
    const blurValue = getBlurValue(blur);

    // Base styles for all modes
    const baseStyles = "rounded-lg border transition-all";

    // Glass-specific styles when glassmorphism mode is active
    const glassStyles = isGlassmorphism
      ? "glass-card"
      : "bg-card text-card-foreground border-border shadow-sm";

    // Inline styles for dynamic blur and opacity values
    const glassInlineStyles = isGlassmorphism
      ? {
          backdropFilter: `blur(${blurValue}px)`,
          WebkitBackdropFilter: `blur(${blurValue}px)`,
          backgroundColor: `hsl(var(--card) / ${clampedOpacity})`,
          borderColor: `hsl(var(--border) / var(--glass-border-opacity, 0.2))`,
          ...(style || {}),
        }
      : style;

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseStyles, glassStyles, className)}
          style={glassInlineStyles}
          variants={cardHover}
          initial="rest"
          whileHover="hover"
          data-blur={blur}
          data-opacity={clampedOpacity}
          data-glass={isGlassmorphism}
          data-card // For dark mode glow effects (Requirements: 3.5)
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, glassStyles, className)}
        style={glassInlineStyles}
        data-blur={blur}
        data-opacity={clampedOpacity}
        data-glass={isGlassmorphism}
        data-card // For dark mode glow effects (Requirements: 3.5)
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
