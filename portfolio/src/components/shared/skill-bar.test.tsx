import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render } from "@testing-library/react";
import { SkillBar, calculateProficiencyPercentage } from "./skill-bar";
import type { Skill } from "@/types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div {...props} style={style}>{children}</div>
    ),
  },
}));

// Arbitrary for generating valid proficiency levels (1-5)
const proficiencyLevel = fc.integer({ min: 1, max: 5 }) as fc.Arbitrary<1 | 2 | 3 | 4 | 5>;

// Arbitrary for generating skill names
const skillName = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

describe("SkillBar - Property Tests", () => {
  /**
   * **Feature: flutter-portfolio, Property 4: Proficiency Bar Calculation**
   * *For any* skill with proficiency level N (where N is 1-5),
   * the rendered proficiency bar width SHALL equal N * 20 percent.
   * **Validates: Requirements 4.2**
   */
  it("Property 4: proficiency N renders as N*20% width", () => {
    fc.assert(
      fc.property(
        proficiencyLevel,
        (level) => {
          const percentage = calculateProficiencyPercentage(level);
          return percentage === level * 20;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 4: Proficiency Bar Calculation**
   * Proficiency percentage should always be between 20 and 100 (inclusive)
   * **Validates: Requirements 4.2**
   */
  it("Property 4: proficiency percentage is always between 20 and 100", () => {
    fc.assert(
      fc.property(
        proficiencyLevel,
        (level) => {
          const percentage = calculateProficiencyPercentage(level);
          return percentage >= 20 && percentage <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 4: Proficiency Bar Calculation**
   * SkillBar component displays the correct percentage text
   * **Validates: Requirements 4.2**
   */
  it("Property 4: SkillBar displays correct percentage text", () => {
    fc.assert(
      fc.property(
        skillName,
        proficiencyLevel,
        (name, proficiency) => {
          const skill: Skill = { name, proficiency };
          const { container } = render(<SkillBar skill={skill} />);
          
          const expectedPercentage = proficiency * 20;
          const percentageText = container.textContent;
          
          // Check that the percentage is displayed
          const hasCorrectPercentage = percentageText?.includes(`${expectedPercentage}%`);
          
          // Cleanup
          container.remove();
          
          return hasCorrectPercentage === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 4: Proficiency Bar Calculation**
   * SkillBar component displays the skill name
   * **Validates: Requirements 4.2**
   */
  it("Property 4: SkillBar displays skill name", () => {
    fc.assert(
      fc.property(
        skillName,
        proficiencyLevel,
        (name, proficiency) => {
          const skill: Skill = { name, proficiency };
          const { container } = render(<SkillBar skill={skill} />);
          
          const hasName = container.textContent?.includes(name);
          
          // Cleanup
          container.remove();
          
          return hasName === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("calculateProficiencyPercentage", () => {
  it("returns 20 for level 1", () => {
    expect(calculateProficiencyPercentage(1)).toBe(20);
  });

  it("returns 40 for level 2", () => {
    expect(calculateProficiencyPercentage(2)).toBe(40);
  });

  it("returns 60 for level 3", () => {
    expect(calculateProficiencyPercentage(3)).toBe(60);
  });

  it("returns 80 for level 4", () => {
    expect(calculateProficiencyPercentage(4)).toBe(80);
  });

  it("returns 100 for level 5", () => {
    expect(calculateProficiencyPercentage(5)).toBe(100);
  });
});
