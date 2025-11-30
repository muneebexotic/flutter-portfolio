import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateParallaxOffset } from "@/hooks/useParallax";

/**
 * **Feature: portfolio-redesign, Property 8: Parallax Scroll Proportionality**
 *
 * *For any* scroll position and ParallaxLayer with a given speed factor,
 * the translateY value SHALL equal scroll position multiplied by the speed factor.
 *
 * **Validates: Requirements 4.3**
 */
describe("Property 8: Parallax Scroll Proportionality", () => {
  // Arbitrary for generating valid scroll positions (0 to typical max page height)
  const scrollPositionArb = fc.integer({ min: 0, max: 10000 });

  // Arbitrary for generating speed factors (typical range 0.1 to 2)
  const speedArb = fc.float({ min: Math.fround(0.1), max: Math.fround(2), noNaN: true });

  it("should calculate offset as scroll position multiplied by speed factor", () => {
    fc.assert(
      fc.property(scrollPositionArb, speedArb, (scrollPosition, speed) => {
        const offset = calculateParallaxOffset(scrollPosition, speed);
        const expected = scrollPosition * speed;

        // Offset should equal scroll position * speed
        expect(offset).toBeCloseTo(expected, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("should return zero offset when scroll position is zero", () => {
    fc.assert(
      fc.property(speedArb, (speed) => {
        const offset = calculateParallaxOffset(0, speed);

        // At scroll position 0, offset should always be 0
        expect(offset).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it("should return zero offset when speed is zero", () => {
    fc.assert(
      fc.property(scrollPositionArb, (scrollPosition) => {
        const offset = calculateParallaxOffset(scrollPosition, 0);

        // With speed 0, offset should always be 0
        expect(offset).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it("should produce proportionally larger offset with higher speed", () => {
    fc.assert(
      fc.property(
        scrollPositionArb.filter((s) => s > 0),
        speedArb,
        (scrollPosition, baseSpeed) => {
          const doubleSpeed = baseSpeed * 2;

          const baseOffset = calculateParallaxOffset(scrollPosition, baseSpeed);
          const doubleOffset = calculateParallaxOffset(scrollPosition, doubleSpeed);

          // Double speed should produce double offset
          expect(doubleOffset).toBeCloseTo(baseOffset * 2, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should produce proportionally larger offset with higher scroll position", () => {
    fc.assert(
      fc.property(
        scrollPositionArb.filter((s) => s > 0),
        speedArb,
        (baseScrollPosition, speed) => {
          const doubleScrollPosition = baseScrollPosition * 2;

          const baseOffset = calculateParallaxOffset(baseScrollPosition, speed);
          const doubleOffset = calculateParallaxOffset(doubleScrollPosition, speed);

          // Double scroll position should produce double offset
          expect(doubleOffset).toBeCloseTo(baseOffset * 2, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should maintain linear relationship between scroll and offset", () => {
    fc.assert(
      fc.property(
        fc.array(scrollPositionArb, { minLength: 3, maxLength: 10 }),
        speedArb,
        (scrollPositions, speed) => {
          // Sort positions to simulate scrolling
          const sortedPositions = [...scrollPositions].sort((a, b) => a - b);

          const offsets = sortedPositions.map((pos) =>
            calculateParallaxOffset(pos, speed)
          );

          // Offsets should maintain the same order as scroll positions
          for (let i = 1; i < offsets.length; i++) {
            expect(offsets[i]).toBeGreaterThanOrEqual(offsets[i - 1]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle negative speed for reverse parallax effect", () => {
    fc.assert(
      fc.property(
        scrollPositionArb.filter((s) => s > 0),
        fc.float({ min: Math.fround(-2), max: Math.fround(-0.1), noNaN: true }),
        (scrollPosition, negativeSpeed) => {
          const offset = calculateParallaxOffset(scrollPosition, negativeSpeed);

          // Negative speed should produce negative offset
          expect(offset).toBeLessThan(0);
          expect(offset).toBeCloseTo(scrollPosition * negativeSpeed, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
