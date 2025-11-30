import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateTiltRotation } from "@/hooks/useTilt";

/**
 * **Feature: portfolio-redesign, Property 7: Tilt Transform Proportionality**
 *
 * *For any* cursor position over a TiltCard component, the rotateX and rotateY
 * transform values SHALL be proportional to the cursor's offset from the card
 * center, bounded by the maxTilt configuration.
 *
 * **Validates: Requirements 4.1**
 */
describe("Property 7: Tilt Transform Proportionality", () => {
  // Arbitrary for generating valid element rectangles
  const rectArb = fc.record({
    left: fc.integer({ min: 0, max: 1000 }),
    top: fc.integer({ min: 0, max: 1000 }),
    width: fc.integer({ min: 50, max: 500 }),
    height: fc.integer({ min: 50, max: 500 }),
  });

  // Arbitrary for generating maxTilt values (typical range 5-30 degrees)
  const maxTiltArb = fc.integer({ min: 5, max: 30 });

  // Arbitrary for cursor positions relative to a rect
  const cursorInRectArb = (
    rect: { left: number; top: number; width: number; height: number }
  ) =>
    fc.record({
      x: fc.integer({ min: rect.left, max: rect.left + rect.width }),
      y: fc.integer({ min: rect.top, max: rect.top + rect.height }),
    });

  it("should bound rotateX and rotateY values within maxTilt range", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        // Generate cursor position anywhere (even outside rect)
        const cursorX = rect.left + rect.width / 2 + rect.width * 2;
        const cursorY = rect.top + rect.height / 2 + rect.height * 2;

        const { rotateX, rotateY } = calculateTiltRotation(
          cursorX,
          cursorY,
          rect,
          maxTilt
        );

        // Rotation values must be bounded by maxTilt
        expect(Math.abs(rotateX)).toBeLessThanOrEqual(maxTilt);
        expect(Math.abs(rotateY)).toBeLessThanOrEqual(maxTilt);
      }),
      { numRuns: 100 }
    );
  });

  it("should return zero rotation when cursor is at element center", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const { rotateX, rotateY } = calculateTiltRotation(
          centerX,
          centerY,
          rect,
          maxTilt
        );

        // At center, rotation should be zero (or very close due to floating point)
        expect(Math.abs(rotateX)).toBeLessThan(0.001);
        expect(Math.abs(rotateY)).toBeLessThan(0.001);
      }),
      { numRuns: 100 }
    );
  });

  it("should produce proportional rotation based on cursor offset from center", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Test at 50% offset from center
        const halfOffsetX = rect.width / 4;
        const halfOffsetY = rect.height / 4;

        const halfResult = calculateTiltRotation(
          centerX + halfOffsetX,
          centerY + halfOffsetY,
          rect,
          maxTilt
        );

        // Test at 100% offset from center (edge)
        const fullOffsetX = rect.width / 2;
        const fullOffsetY = rect.height / 2;

        const fullResult = calculateTiltRotation(
          centerX + fullOffsetX,
          centerY + fullOffsetY,
          rect,
          maxTilt
        );

        // Full offset should produce approximately double the rotation of half offset
        // (within tolerance for edge clamping)
        expect(Math.abs(fullResult.rotateY)).toBeGreaterThanOrEqual(
          Math.abs(halfResult.rotateY) * 1.5
        );
        expect(Math.abs(fullResult.rotateX)).toBeGreaterThanOrEqual(
          Math.abs(halfResult.rotateX) * 1.5
        );
      }),
      { numRuns: 100 }
    );
  });

  it("should produce maximum rotation at element edges", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        // Test at right edge
        const rightEdgeX = rect.left + rect.width;
        const centerY = rect.top + rect.height / 2;

        const rightEdgeResult = calculateTiltRotation(
          rightEdgeX,
          centerY,
          rect,
          maxTilt
        );

        // At right edge, rotateY should be at maxTilt
        expect(Math.abs(rightEdgeResult.rotateY)).toBeCloseTo(maxTilt, 1);

        // Test at bottom edge
        const centerX = rect.left + rect.width / 2;
        const bottomEdgeY = rect.top + rect.height;

        const bottomEdgeResult = calculateTiltRotation(
          centerX,
          bottomEdgeY,
          rect,
          maxTilt
        );

        // At bottom edge, rotateX should be at maxTilt (negative due to inversion)
        expect(Math.abs(bottomEdgeResult.rotateX)).toBeCloseTo(maxTilt, 1);
      }),
      { numRuns: 100 }
    );
  });

  it("should produce opposite rotation for opposite cursor positions", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = rect.width / 4;
        const offsetY = rect.height / 4;

        // Test positive offset
        const positiveResult = calculateTiltRotation(
          centerX + offsetX,
          centerY + offsetY,
          rect,
          maxTilt
        );

        // Test negative offset (opposite side)
        const negativeResult = calculateTiltRotation(
          centerX - offsetX,
          centerY - offsetY,
          rect,
          maxTilt
        );

        // Rotations should be opposite (same magnitude, different sign)
        expect(positiveResult.rotateX).toBeCloseTo(-negativeResult.rotateX, 5);
        expect(positiveResult.rotateY).toBeCloseTo(-negativeResult.rotateY, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("should clamp rotation when cursor is outside element bounds", () => {
    fc.assert(
      fc.property(rectArb, maxTiltArb, (rect, maxTilt) => {
        // Test cursor far outside the element
        const farOutsideX = rect.left + rect.width * 3;
        const farOutsideY = rect.top + rect.height * 3;

        const result = calculateTiltRotation(
          farOutsideX,
          farOutsideY,
          rect,
          maxTilt
        );

        // Even with cursor far outside, rotation should be clamped to maxTilt
        expect(Math.abs(result.rotateX)).toBeLessThanOrEqual(maxTilt);
        expect(Math.abs(result.rotateY)).toBeLessThanOrEqual(maxTilt);
      }),
      { numRuns: 100 }
    );
  });
});
