"use client";

import { forwardRef, useRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTilt, type UseTiltOptions } from "@/hooks/useTilt";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * TiltCard component with 3D tilt effect on hover
 * Responds to cursor position to create depth perception
 * Includes smooth transition on mouse leave
 *
 * Requirements: 4.1
 */

export interface TiltCardProps
  extends Omit<HTMLMotionProps<"div">, "onMouseMove" | "onMouseLeave"> {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Perspective value in pixels (default: 1000) */
  perspective?: number;
  /** Whether tilt effect is enabled (default: true) */
  enabled?: boolean;
  /** Transition duration in ms for smooth reset (default: 300) */
  transitionDuration?: number;
}

const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      className,
      maxTilt = 15,
      scale = 1.02,
      perspective = 1000,
      enabled = true,
      transitionDuration = 300,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const prefersReducedMotion = usePrefersReducedMotion();

    const tiltOptions: UseTiltOptions = {
      maxTilt,
      scale,
      perspective,
      enabled: enabled && !prefersReducedMotion,
    };

    const { transform, onMouseMove, onMouseLeave, onMouseEnter, isHovering } =
      useTilt(ref, tiltOptions);

    // Transition for smooth reset on mouse leave
    const transitionStyle = {
      transition: isHovering
        ? "none"
        : `transform ${transitionDuration}ms ease-out`,
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative will-change-transform",
          className
        )}
        style={{
          transform,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          ...transitionStyle,
          ...style,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        data-tilt-enabled={enabled && !prefersReducedMotion}
        data-tilt-hovering={isHovering}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TiltCard.displayName = "TiltCard";

export { TiltCard };
