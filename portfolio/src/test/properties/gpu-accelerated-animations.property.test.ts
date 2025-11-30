import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  buttonVariants,
  reducedMotionButtonVariants,
} from "@/components/ui/animated-button";
import {
  skillBadgeVariants,
  reducedMotionSkillBadgeVariants,
} from "@/components/ui/skill-badge";
import { animationVariants } from "@/components/ui/scroll-reveal";
import {
  containerVariants,
  itemVariants,
} from "@/components/ui/staggered-list";
import type { Variants } from "framer-motion";

/**
 * **Feature: portfolio-redesign, Property 15: GPU-Accelerated Animations**
 *
 * *For any* Framer Motion animation variant, the animated properties SHALL be
 * limited to transform and opacity (GPU-accelerated properties).
 *
 * **Validates: Requirements 8.3**
 */
describe("Property 15: GPU-Accelerated Animations", () => {
  /**
   * GPU-accelerated CSS properties that can be animated efficiently
   * These properties are composited on the GPU and don't trigger layout/paint
   */
  const GPU_ACCELERATED_PROPERTIES = [
    // Transform properties (all map to CSS transform)
    "scale",
    "scaleX",
    "scaleY",
    "x",
    "y",
    "z",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
    // Opacity
    "opacity",
    // Framer Motion internal properties (not animated CSS properties)
    "transition",
  ];

  /**
   * Helper to check if all animated properties in a variant are GPU-accelerated
   */
  const areAllPropertiesGPUAccelerated = (variants: Variants): boolean => {
    for (const [, variant] of Object.entries(variants)) {
      if (typeof variant === "object" && variant !== null) {
        const keys = Object.keys(variant);
        for (const key of keys) {
          if (!GPU_ACCELERATED_PROPERTIES.includes(key)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  /**
   * Helper to get non-GPU-accelerated properties from variants
   */
  const getNonGPUProperties = (variants: Variants): string[] => {
    const nonGPU: string[] = [];
    for (const [stateName, variant] of Object.entries(variants)) {
      if (typeof variant === "object" && variant !== null) {
        const keys = Object.keys(variant);
        for (const key of keys) {
          if (!GPU_ACCELERATED_PROPERTIES.includes(key)) {
            nonGPU.push(`${stateName}.${key}`);
          }
        }
      }
    }
    return nonGPU;
  };

  // Arbitrary for selecting animation variant sets to test
  const variantSetArb = fc.constantFrom(
    { name: "buttonVariants", variants: buttonVariants },
    { name: "reducedMotionButtonVariants", variants: reducedMotionButtonVariants },
    { name: "skillBadgeVariants", variants: skillBadgeVariants },
    { name: "reducedMotionSkillBadgeVariants", variants: reducedMotionSkillBadgeVariants },
    { name: "scrollReveal.fadeUp", variants: animationVariants.fadeUp },
    { name: "scrollReveal.fadeIn", variants: animationVariants.fadeIn },
    { name: "scrollReveal.slideLeft", variants: animationVariants.slideLeft },
    { name: "scrollReveal.slideRight", variants: animationVariants.slideRight },
    { name: "scrollReveal.scale", variants: animationVariants.scale },
    { name: "containerVariants", variants: containerVariants },
    { name: "itemVariants.fadeUp", variants: itemVariants.fadeUp },
    { name: "itemVariants.fadeIn", variants: itemVariants.fadeIn },
    { name: "itemVariants.scale", variants: itemVariants.scale }
  );

  it("should only use GPU-accelerated properties in all animation variants", () => {
    fc.assert(
      fc.property(variantSetArb, ({ name, variants }) => {
        const isGPUAccelerated = areAllPropertiesGPUAccelerated(variants);
        const nonGPU = getNonGPUProperties(variants);

        if (!isGPUAccelerated) {
          console.log(`Non-GPU properties in ${name}:`, nonGPU);
        }

        expect(isGPUAccelerated).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("should use transform properties (scale, x, y) instead of width/height/margin", () => {
    // Properties that should NOT be animated (cause layout thrashing)
    const layoutProperties = [
      "width",
      "height",
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "top",
      "right",
      "bottom",
      "left",
    ];

    fc.assert(
      fc.property(variantSetArb, ({ variants }) => {
        for (const [, variant] of Object.entries(variants)) {
          if (typeof variant === "object" && variant !== null) {
            const keys = Object.keys(variant);
            for (const key of keys) {
              expect(layoutProperties).not.toContain(key);
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should not animate color properties directly (use CSS transitions instead)", () => {
    // Color properties that should use CSS transitions, not Framer Motion
    const colorProperties = [
      "color",
      "backgroundColor",
      "borderColor",
      "fill",
      "stroke",
    ];

    fc.assert(
      fc.property(variantSetArb, ({ variants }) => {
        for (const [, variant] of Object.entries(variants)) {
          if (typeof variant === "object" && variant !== null) {
            const keys = Object.keys(variant);
            for (const key of keys) {
              expect(colorProperties).not.toContain(key);
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have opacity values between 0 and 1 when opacity is animated", () => {
    fc.assert(
      fc.property(variantSetArb, ({ variants }) => {
        for (const [, variant] of Object.entries(variants)) {
          if (
            typeof variant === "object" &&
            variant !== null &&
            "opacity" in variant
          ) {
            const opacity = variant.opacity as number;
            expect(opacity).toBeGreaterThanOrEqual(0);
            expect(opacity).toBeLessThanOrEqual(1);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have reasonable scale values (0.5 to 2.0) when scale is animated", () => {
    fc.assert(
      fc.property(variantSetArb, ({ variants }) => {
        for (const [, variant] of Object.entries(variants)) {
          if (
            typeof variant === "object" &&
            variant !== null &&
            "scale" in variant
          ) {
            const scale = variant.scale as number;
            expect(scale).toBeGreaterThanOrEqual(0.5);
            expect(scale).toBeLessThanOrEqual(2.0);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should have reasonable translation values when x/y are animated", () => {
    // Reasonable translation range in pixels
    const MAX_TRANSLATION = 200;

    fc.assert(
      fc.property(variantSetArb, ({ variants }) => {
        for (const [, variant] of Object.entries(variants)) {
          if (typeof variant === "object" && variant !== null) {
            if ("x" in variant) {
              const x = variant.x as number;
              expect(Math.abs(x)).toBeLessThanOrEqual(MAX_TRANSLATION);
            }
            if ("y" in variant) {
              const y = variant.y as number;
              expect(Math.abs(y)).toBeLessThanOrEqual(MAX_TRANSLATION);
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
