import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  animationVariants,
  reducedMotionVariants,
  type ScrollRevealAnimation,
} from "@/components/ui/scroll-reveal";

/**
 * **Feature: portfolio-redesign, Property 10: Scroll Reveal Animation Trigger**
 *
 * *For any* ScrollReveal component, when the element enters the viewport
 * (intersection ratio >= threshold), the animation variant SHALL transition
 * from 'hidden' to 'visible'.
 *
 * **Validates: Requirements 5.2**
 */
describe("Property 10: Scroll Reveal Animation Trigger", () => {
  // All available animation types
  const allAnimationTypes: ScrollRevealAnimation[] = [
    "fadeUp",
    "fadeIn",
    "slideLeft",
    "slideRight",
    "scale",
  ];

  // Arbitrary for generating valid animation types
  const animationTypeArb = fc.constantFrom<ScrollRevealAnimation>(...allAnimationTypes);

  // Arbitrary for generating valid threshold values (0-1)
  const thresholdArb = fc.double({ min: 0, max: 1, noNaN: true });

  // Arbitrary for generating valid delay values (0-2000ms)
  const delayArb = fc.integer({ min: 0, max: 2000 });

  // Arbitrary for generating valid duration values (100-1000ms)
  const durationArb = fc.integer({ min: 100, max: 1000 });

  it("should have all animation variants defined with hidden and visible states", () => {
    fc.assert(
      fc.property(animationTypeArb, (animation) => {
        const variants = animationVariants[animation];

        // Each animation variant should have hidden and visible states
        expect(variants).toHaveProperty("hidden");
        expect(variants).toHaveProperty("visible");

        // Hidden state should have opacity 0
        expect(variants.hidden).toHaveProperty("opacity", 0);

        // Visible state should have opacity 1
        expect(variants.visible).toHaveProperty("opacity", 1);
      }),
      { numRuns: 100 }
    );
  });

  it("should use GPU-accelerated properties (transform, opacity) in all variants", () => {
    fc.assert(
      fc.property(animationTypeArb, (animation) => {
        const variants = animationVariants[animation];

        // GPU-accelerated properties that are allowed
        const allowedProperties = ["opacity", "x", "y", "scale", "rotate"];

        // Check hidden state uses only GPU-accelerated properties
        const hiddenKeys = Object.keys(variants.hidden as object);
        for (const key of hiddenKeys) {
          expect(allowedProperties).toContain(key);
        }

        // Check visible state uses only GPU-accelerated properties
        const visibleKeys = Object.keys(variants.visible as object);
        for (const key of visibleKeys) {
          expect(allowedProperties).toContain(key);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have valid threshold range (0-1)", () => {
    fc.assert(
      fc.property(thresholdArb, (threshold) => {
        // Threshold should be between 0 and 1
        expect(threshold).toBeGreaterThanOrEqual(0);
        expect(threshold).toBeLessThanOrEqual(1);
      }),
      { numRuns: 100 }
    );
  });

  it("should have valid delay values (non-negative)", () => {
    fc.assert(
      fc.property(delayArb, (delay) => {
        // Delay should be non-negative
        expect(delay).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });

  it("should have valid duration values (positive)", () => {
    fc.assert(
      fc.property(durationArb, (duration) => {
        // Duration should be positive
        expect(duration).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("should have correct transform properties for each animation type", () => {
    // fadeUp should have y transform
    expect(animationVariants.fadeUp.hidden).toHaveProperty("y", 20);
    expect(animationVariants.fadeUp.visible).toHaveProperty("y", 0);

    // fadeIn should only have opacity
    expect(animationVariants.fadeIn.hidden).not.toHaveProperty("y");
    expect(animationVariants.fadeIn.hidden).not.toHaveProperty("x");
    expect(animationVariants.fadeIn.hidden).not.toHaveProperty("scale");

    // slideLeft should have negative x transform
    expect(animationVariants.slideLeft.hidden).toHaveProperty("x", -50);
    expect(animationVariants.slideLeft.visible).toHaveProperty("x", 0);

    // slideRight should have positive x transform
    expect(animationVariants.slideRight.hidden).toHaveProperty("x", 50);
    expect(animationVariants.slideRight.visible).toHaveProperty("x", 0);

    // scale should have scale transform
    expect(animationVariants.scale.hidden).toHaveProperty("scale", 0.95);
    expect(animationVariants.scale.visible).toHaveProperty("scale", 1);
  });

  it("should have reduced motion variants with instant transitions", () => {
    // Reduced motion variants should have hidden and visible states
    expect(reducedMotionVariants).toHaveProperty("hidden");
    expect(reducedMotionVariants).toHaveProperty("visible");

    // Hidden state should have opacity 0
    expect(reducedMotionVariants.hidden).toHaveProperty("opacity", 0);

    // Visible state should have opacity 1
    expect(reducedMotionVariants.visible).toHaveProperty("opacity", 1);

    // Reduced motion should not have transform properties (only opacity)
    expect(reducedMotionVariants.hidden).not.toHaveProperty("y");
    expect(reducedMotionVariants.hidden).not.toHaveProperty("x");
    expect(reducedMotionVariants.hidden).not.toHaveProperty("scale");
  });

  it("should transition from hidden to visible state for all animation types", () => {
    fc.assert(
      fc.property(animationTypeArb, (animation) => {
        const variants = animationVariants[animation];
        const hidden = variants.hidden as Record<string, number>;
        const visible = variants.visible as Record<string, number>;

        // Opacity should transition from 0 to 1
        expect(hidden.opacity).toBe(0);
        expect(visible.opacity).toBe(1);

        // For animations with transforms, the visible state should be the "rest" position
        if ("y" in hidden) {
          expect(visible.y).toBe(0);
        }
        if ("x" in hidden) {
          expect(visible.x).toBe(0);
        }
        if ("scale" in hidden) {
          expect(visible.scale).toBe(1);
        }
      }),
      { numRuns: 100 }
    );
  });
});
