"use client";

import { useCallback, useState, RefObject, MouseEvent } from "react";
import { usePrefersReducedMotion } from "./use-media-query";

/**
 * Options for the useTilt hook
 */
export interface UseTiltOptions {
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Perspective value in pixels (default: 1000) */
  perspective?: number;
  /** Whether tilt effect is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for the useTilt hook
 */
export interface UseTiltReturn {
  /** CSS transform string to apply to the element */
  transform: string;
  /** Mouse move handler to attach to the element */
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  /** Mouse leave handler to attach to the element */
  onMouseLeave: () => void;
  /** Mouse enter handler to attach to the element */
  onMouseEnter: () => void;
  /** Whether the element is currently being hovered */
  isHovering: boolean;
  /** Current rotation values */
  rotation: { rotateX: number; rotateY: number };
}

/**
 * Calculates 3D tilt values based on mouse position relative to element center.
 * Returns transform string and event handlers for creating a 3D tilt effect.
 *
 * The rotateX and rotateY values are proportional to the cursor's offset from
 * the card center, bounded by the maxTilt configuration.
 *
 * Requirements: 4.1
 *
 * @param ref - Reference to the element to apply tilt effect
 * @param options - Configuration options for the tilt effect
 * @returns Object with transform string and event handlers
 */
export function useTilt<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseTiltOptions = {}
): UseTiltReturn {
  const {
    maxTilt = 15,
    scale = 1.02,
    perspective = 1000,
    enabled = true,
  } = options;

  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  /**
   * Calculate tilt rotation based on cursor position relative to element center.
   * rotateX is based on vertical offset (Y), rotateY is based on horizontal offset (X).
   * Values are clamped to maxTilt bounds.
   */
  const calculateTilt = useCallback(
    (clientX: number, clientY: number): { rotateX: number; rotateY: number } => {
      const element = ref.current;
      if (!element) return { rotateX: 0, rotateY: 0 };

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center as a ratio (-1 to 1)
      const offsetX = (clientX - centerX) / (rect.width / 2);
      const offsetY = (clientY - centerY) / (rect.height / 2);

      // Clamp values to -1 to 1 range
      const clampedOffsetX = Math.max(-1, Math.min(1, offsetX));
      const clampedOffsetY = Math.max(-1, Math.min(1, offsetY));

      // Calculate rotation (rotateY for horizontal, rotateX for vertical)
      // Invert rotateX so tilting up when cursor is at top
      const rotateY = clampedOffsetX * maxTilt;
      const rotateX = -clampedOffsetY * maxTilt;

      return { rotateX, rotateY };
    },
    [ref, maxTilt]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!enabled || prefersReducedMotion) return;

      const { rotateX, rotateY } = calculateTilt(e.clientX, e.clientY);
      setRotation({ rotateX, rotateY });
    },
    [enabled, prefersReducedMotion, calculateTilt]
  );

  const onMouseEnter = useCallback(() => {
    if (!enabled || prefersReducedMotion) return;
    setIsHovering(true);
  }, [enabled, prefersReducedMotion]);

  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ rotateX: 0, rotateY: 0 });
  }, []);

  // Build transform string
  const transform = (() => {
    if (!enabled || prefersReducedMotion) {
      return "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }

    const currentScale = isHovering ? scale : 1;
    return `perspective(${perspective}px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) scale(${currentScale})`;
  })();

  return {
    transform,
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
    isHovering,
    rotation,
  };
}

/**
 * Pure function to calculate tilt rotation values.
 * Useful for testing without React hooks.
 *
 * @param cursorX - Cursor X position
 * @param cursorY - Cursor Y position
 * @param rect - Element bounding rect
 * @param maxTilt - Maximum tilt angle in degrees
 * @returns Object with rotateX and rotateY values
 */
export function calculateTiltRotation(
  cursorX: number,
  cursorY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxTilt: number
): { rotateX: number; rotateY: number } {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Calculate offset from center as a ratio (-1 to 1)
  const offsetX = (cursorX - centerX) / (rect.width / 2);
  const offsetY = (cursorY - centerY) / (rect.height / 2);

  // Clamp values to -1 to 1 range
  const clampedOffsetX = Math.max(-1, Math.min(1, offsetX));
  const clampedOffsetY = Math.max(-1, Math.min(1, offsetY));

  // Calculate rotation (rotateY for horizontal, rotateX for vertical)
  // Invert rotateX so tilting up when cursor is at top
  const rotateY = clampedOffsetX * maxTilt;
  const rotateX = -clampedOffsetY * maxTilt;

  return { rotateX, rotateY };
}
