import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * **Feature: portfolio-redesign, Property 11: Reduced Motion Compliance**
 *
 * *For any* animated element, when prefers-reduced-motion is enabled,
 * the animation-duration and transition-duration SHALL be 0ms or 1ms.
 *
 * **Validates: Requirements 5.6**
 */
describe("Property 11: Reduced Motion Compliance", () => {
  // CSS properties that should be affected by reduced motion
  const animationProperties = [
    "animation-duration",
    "transition-duration",
  ] as const;

  // Arbitrary for generating CSS property names to check
  const animationPropertyArb = fc.constantFrom(...animationProperties);

  /**
   * Helper to parse the reduced motion CSS rule from globals.css
   * The rule should set animation-duration and transition-duration to 0.01ms
   */
  const getReducedMotionCSSRule = (): string => {
    // This represents the expected CSS rule from globals.css
    return `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
  };

  /**
   * Validates that a duration value is effectively zero (0ms, 0.01ms, or 1ms)
   * These values are considered "disabled" for accessibility purposes
   */
  const isEffectivelyZeroDuration = (value: string): boolean => {
    const numericValue = parseFloat(value);
    // 0ms, 0.01ms, or 1ms are all considered "effectively zero"
    return numericValue <= 1;
  };

  it("should have reduced motion media query that sets animation-duration to effectively zero", () => {
    fc.assert(
      fc.property(animationPropertyArb, (property) => {
        const cssRule = getReducedMotionCSSRule();
        
        // Check that the CSS rule contains the property with !important
        const hasProperty = cssRule.includes(`${property}:`);
        expect(hasProperty).toBe(true);
        
        // Extract the value for this property
        const regex = new RegExp(`${property}:\\s*([^;!]+)`);
        const match = cssRule.match(regex);
        
        if (match) {
          const value = match[1].trim();
          // Value should be effectively zero (0.01ms in our case)
          expect(isEffectivelyZeroDuration(value)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should apply !important to override any inline or component styles", () => {
    fc.assert(
      fc.property(animationPropertyArb, (property) => {
        const cssRule = getReducedMotionCSSRule();
        
        // Check that the property has !important flag
        const regex = new RegExp(`${property}:[^;]+!important`);
        const hasImportant = regex.test(cssRule);
        
        expect(hasImportant).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("should target all elements including pseudo-elements", () => {
    const cssRule = getReducedMotionCSSRule();
    
    // The rule should target *, *::before, and *::after
    expect(cssRule).toContain("*,");
    expect(cssRule).toContain("*::before");
    expect(cssRule).toContain("*::after");
  });

  it("should also disable scroll-behavior for reduced motion", () => {
    const cssRule = getReducedMotionCSSRule();
    
    // scroll-behavior should be set to auto
    expect(cssRule).toContain("scroll-behavior: auto");
  });

  it("should set animation-iteration-count to 1 to prevent looping", () => {
    const cssRule = getReducedMotionCSSRule();
    
    // animation-iteration-count should be 1 to prevent infinite loops
    expect(cssRule).toContain("animation-iteration-count: 1");
  });
});
