"use client";

import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParallax } from "@/hooks/useParallax";
import { usePrefersReducedMotion } from "@/hooks";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * FloatingBackground component
 * Renders animated floating 3D shapes (spheres, blobs, geometric forms)
 * Applies parallax effect to shapes at different speeds
 * Uses CSS transforms for 3D depth
 * Lazy-loaded component (below fold optimization)
 *
 * Requirements: 4.2, 4.4, 8.2
 */

export type ShapeType = "sphere" | "cube" | "torus" | "blob";

export interface FloatingShape {
  type: ShapeType;
  size: number;
  position: { x: number; y: number; z: number };
  color: string;
}

export interface FloatingBackgroundProps {
  shapes?: FloatingShape[];
  parallaxIntensity?: number;
  className?: string;
}

// Default shapes configuration
const DEFAULT_SHAPES: FloatingShape[] = [
  { type: "sphere", size: 120, position: { x: 15, y: 20, z: 0 }, color: "primary" },
  { type: "blob", size: 180, position: { x: 75, y: 15, z: -50 }, color: "secondary" },
  { type: "cube", size: 80, position: { x: 85, y: 60, z: 20 }, color: "accent" },
  { type: "torus", size: 100, position: { x: 10, y: 70, z: -30 }, color: "primary" },
  { type: "sphere", size: 60, position: { x: 50, y: 80, z: 10 }, color: "secondary" },
  { type: "blob", size: 140, position: { x: 30, y: 45, z: -20 }, color: "accent" },
];


// Animation variants for floating shapes
const floatVariants: Variants = {
  initial: {
    y: 0,
    rotate: 0,
  },
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 5, -5, 0],
    transition: {
      y: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// Reduced motion variants - no animation
const reducedMotionVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: { y: 0, rotate: 0, transition: { duration: 0 } },
};

// Get color class based on color name
function getColorClass(color: string, themeMode: string): string {
  const colorMap: Record<string, Record<string, string>> = {
    primary: {
      default: "bg-primary/20",
      glassmorphism: "bg-primary/30",
      dark: "bg-primary/25",
    },
    secondary: {
      default: "bg-secondary/15",
      glassmorphism: "bg-secondary/25",
      dark: "bg-secondary/20",
    },
    accent: {
      default: "bg-accent/20",
      glassmorphism: "bg-accent/30",
      dark: "bg-accent/25",
    },
  };

  return colorMap[color]?.[themeMode] || colorMap[color]?.default || "bg-primary/20";
}

// Get shape-specific styles
function getShapeStyles(type: ShapeType): string {
  switch (type) {
    case "sphere":
      return "rounded-full";
    case "cube":
      return "rounded-lg";
    case "torus":
      return "rounded-full ring-8 ring-current/20";
    case "blob":
      return "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]";
    default:
      return "rounded-full";
  }
}


// Individual floating shape component
interface FloatingShapeItemProps {
  shape: FloatingShape;
  index: number;
  parallaxIntensity: number;
  prefersReducedMotion: boolean;
  themeMode: string;
}

const FloatingShapeItem = memo(function FloatingShapeItem({
  shape,
  index,
  parallaxIntensity,
  prefersReducedMotion,
  themeMode,
}: FloatingShapeItemProps) {
  // Each shape has different parallax speed based on z-position
  const parallaxSpeed = (shape.position.z + 50) / 100 * parallaxIntensity;
  const { style: parallaxStyle } = useParallax({
    speed: parallaxSpeed,
    enabled: !prefersReducedMotion,
  });

  const variants = prefersReducedMotion ? reducedMotionVariants : floatVariants;
  const colorClass = getColorClass(shape.color, themeMode);
  const shapeStyles = getShapeStyles(shape.type);

  // Calculate 3D transform based on z-position
  const scale = 1 + (shape.position.z / 200);
  const blur = Math.max(0, -shape.position.z / 25);

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none will-change-transform",
        colorClass,
        shapeStyles,
        "blur-sm"
      )}
      style={{
        width: shape.size,
        height: shape.size,
        left: `${shape.position.x}%`,
        top: `${shape.position.y}%`,
        transform: `scale(${scale}) translateZ(${shape.position.z}px)`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        zIndex: Math.floor(shape.position.z),
        ...parallaxStyle,
      }}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        delay: index * 0.2,
      }}
      aria-hidden="true"
    />
  );
});


/**
 * FloatingBackground component
 * Renders animated floating 3D shapes with parallax effects
 * 
 * @example
 * ```tsx
 * <FloatingBackground />
 * 
 * <FloatingBackground 
 *   shapes={[
 *     { type: "sphere", size: 100, position: { x: 20, y: 30, z: 0 }, color: "primary" }
 *   ]}
 *   parallaxIntensity={0.5}
 * />
 * ```
 */
function FloatingBackground({
  shapes = DEFAULT_SHAPES,
  parallaxIntensity = 0.3,
  className,
}: FloatingBackgroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { mode } = useThemeMode();

  // Memoize shapes to prevent unnecessary re-renders
  const memoizedShapes = useMemo(() => shapes, [shapes]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden perspective-1000",
        className
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      aria-hidden="true"
    >
      {memoizedShapes.map((shape, index) => (
        <FloatingShapeItem
          key={`${shape.type}-${index}`}
          shape={shape}
          index={index}
          parallaxIntensity={parallaxIntensity}
          prefersReducedMotion={prefersReducedMotion}
          themeMode={mode}
        />
      ))}
    </div>
  );
}

export { FloatingBackground, DEFAULT_SHAPES };
