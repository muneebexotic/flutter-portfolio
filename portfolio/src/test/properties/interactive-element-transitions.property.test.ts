import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  buttonVariants,
  reducedMotionButtonVariants,
} from "@/components/ui/animated-button";

/**
 * **Feature: portfolio-redesign, Property 9: Interactive Element Transitions**
 *
 * *For any* interactive element (button, link, card), the CSS transition property
 * SHALL include transform and the transition duration SHALL be 200ms or less.
 *
 * **Validates: Requirements 5.1, 5.3, 5.5**
 */
describe("Property 9: Interactive Element Transitions", () => {
  // Maximum allowed transition duration in milliseconds
  const MAX_TRANSITION_DURATION_MS = 200;

  // Arbitrary for generating animation states
  const animationStateArb = fc.constantFrom("rest", "hover", "tap");

  // Arbitrary for generating scale values (typical range for interactive elements)
  const scaleValueArb = fc.double({ min: 0.9, max: 1.1, noNaN: true });

  /**
   * Helper to extract duration from Framer Motion transition config
   */
  const getTransitionDuration = (
    variants: typeof buttonVariants,
    state: string
  ): number => {
    const variant = variants[state];
    if (
      typeof variant === "object" &&
      variant !== null &&
      "transition" in variant
    ) {
      const transition = variant.transition as { duration?: number };
      // Framer Motion uses seconds, convert to ms
      return (transition.duration ?? 0) * 1000;
    }
    return 0;
  };

  /**
   * Helper to check if variants use GPU-accelerated properties
   * GPU-accelerated properties: transform (scale, rotate, translate), opacity
   */
  const usesGPUAcceleratedProperties = (
    variants: typeof buttonVariants
  ): boolean => {
    const gpuProperties = ["scale", "opacity", "x", "y", "rotate", "rotateX", "rotateY"];
    
    for (const [, variant] of Object.entries(variants)) {
      if (typeof variant === "object" && variant !== null) {
        const keys = Object.keys(variant).filter((k) => k !== "transition");
        // All animated properties should be GPU-accelerated
        const allGPU = keys.every((key) => gpuProperties.includes(key));
        if (!allGPU && keys.length > 0) {
          return false;
        }
      }
    }
    return true;
  };

  it("should have hover transition duration of 200ms or less", () => {
    fc.assert(
      fc.property(fc.constant("hover"), (state) => {
        const duration = getTransitionDuration(buttonVariants, state);
        expect(duration).toBeLessThanOrEqual(MAX_TRANSITION_DURATION_MS);
      }),
      { numRuns: 100 }
    );
  });

  it("should have tap/click transition duration of 200ms or less", () => {
    fc.assert(
      fc.property(fc.constant("tap"), (state) => {
        const duration = getTransitionDuration(buttonVariants, state);
        expect(duration).toBeLessThanOrEqual(MAX_TRANSITION_DURATION_MS);
      }),
      { numRuns: 100 }
    );
  });

  it("should use scale transform for hover state", () => {
    const hoverVariant = buttonVariants.hover;
    expect(hoverVariant).toBeDefined();
    expect(typeof hoverVariant).toBe("object");
    if (typeof hoverVariant === "object" && hoverVariant !== null) {
      expect("scale" in hoverVariant).toBe(true);
    }
  });

  it("should use scale transform for tap/click feedback", () => {
    const tapVariant = buttonVariants.tap;
    expect(tapVariant).toBeDefined();
    expect(typeof tapVariant).toBe("object");
    if (typeof tapVariant === "object" && tapVariant !== null) {
      expect("scale" in tapVariant).toBe(true);
    }
  });

  it("should only use GPU-accelerated properties (transform, opacity)", () => {
    fc.assert(
      fc.property(animationStateArb, () => {
        const usesGPU = usesGPUAcceleratedProperties(buttonVariants);
        expect(usesGPU).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("should have hover scale greater than rest scale for visual feedback", () => {
    fc.assert(
      fc.property(scaleValueArb, () => {
        const restVariant = buttonVariants.rest;
        const hoverVariant = buttonVariants.hover;

        if (
          typeof restVariant === "object" &&
          restVariant !== null &&
          "scale" in restVariant &&
          typeof hoverVariant === "object" &&
          hoverVariant !== null &&
          "scale" in hoverVariant
        ) {
          const restScale = restVariant.scale as number;
          const hoverScale = hoverVariant.scale as number;
          // Hover should scale up for visual feedback
          expect(hoverScale).toBeGreaterThan(restScale);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have tap scale less than rest scale for click feedback", () => {
    fc.assert(
      fc.property(scaleValueArb, () => {
        const restVariant = buttonVariants.rest;
        const tapVariant = buttonVariants.tap;

        if (
          typeof restVariant === "object" &&
          restVariant !== null &&
          "scale" in restVariant &&
          typeof tapVariant === "object" &&
          tapVariant !== null &&
          "scale" in tapVariant
        ) {
          const restScale = restVariant.scale as number;
          const tapScale = tapVariant.scale as number;
          // Tap should scale down for tactile feedback
          expect(tapScale).toBeLessThan(restScale);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have reduced motion variants with zero duration", () => {
    fc.assert(
      fc.property(animationStateArb, (state) => {
        const duration = getTransitionDuration(reducedMotionButtonVariants, state);
        // Reduced motion should have 0ms duration
        expect(duration).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it("should have reduced motion variants with no scale change", () => {
    fc.assert(
      fc.property(animationStateArb, (state) => {
        const variant = reducedMotionButtonVariants[state];
        if (typeof variant === "object" && variant !== null && "scale" in variant) {
          // All states should have scale of 1 (no animation)
          expect(variant.scale).toBe(1);
        }
      }),
      { numRuns: 100 }
    );
  });
});
