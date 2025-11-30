"use client";

import { useThemeMode } from "@/hooks/useThemeMode";
import { cn } from "@/lib/utils";

/**
 * GlassmorphismBackground component
 * Renders an animated gradient or abstract background behind glass elements
 * Only visible when glassmorphism mode is active
 *
 * Requirements: 2.4 - gradient or abstract background behind glass elements
 */

export interface GlassmorphismBackgroundProps {
  className?: string;
}

export function GlassmorphismBackground({
  className,
}: GlassmorphismBackgroundProps) {
  const { isGlassmorphism } = useThemeMode();

  // Only render when glassmorphism mode is active
  if (!isGlassmorphism) {
    return null;
  }

  return (
    <div
      className={cn(
        "glassmorphism-background fixed inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Animated gradient orbs */}
      <div className="glass-gradient-orb glass-gradient-orb-1" />
      <div className="glass-gradient-orb glass-gradient-orb-2" />
      <div className="glass-gradient-orb glass-gradient-orb-3" />
    </div>
  );
}
