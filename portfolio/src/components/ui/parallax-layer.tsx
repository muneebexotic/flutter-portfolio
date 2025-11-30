"use client";

import { ReactNode } from "react";
import { useParallax, type UseParallaxOptions } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";

/**
 * Props for the ParallaxLayer component
 */
export interface ParallaxLayerProps {
  /** Content to render with parallax effect */
  children: ReactNode;
  /** Speed factor for parallax effect (0.1 = slow, 1 = normal, 2 = fast) */
  speed?: number;
  /** Direction of parallax movement */
  direction?: "vertical" | "horizontal";
  /** Whether parallax effect is enabled (default: true) */
  enabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A wrapper component that applies parallax scrolling to children.
 * Supports vertical and horizontal directions with configurable speed.
 *
 * Requirements: 4.3
 *
 * @example
 * ```tsx
 * <ParallaxLayer speed={0.5}>
 *   <div>This content moves at half scroll speed</div>
 * </ParallaxLayer>
 *
 * <ParallaxLayer speed={1.5} direction="horizontal">
 *   <div>This content moves horizontally at 1.5x scroll speed</div>
 * </ParallaxLayer>
 * ```
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "vertical",
  enabled = true,
  className,
}: ParallaxLayerProps) {
  const parallaxOptions: UseParallaxOptions = {
    speed,
    direction,
    enabled,
  };

  const { style } = useParallax(parallaxOptions);

  return (
    <div
      className={cn("will-change-transform", className)}
      style={style}
    >
      {children}
    </div>
  );
}
