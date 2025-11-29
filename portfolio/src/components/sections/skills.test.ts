import { describe, it } from "vitest";
import * as fc from "fast-check";
import { validateSkillCategories } from "./skills";
import type { SkillCategory, Skill } from "@/types";

/**
 * Property tests for Skills section
 */

// Arbitrary for generating valid Skill objects
const skillArbitrary: fc.Arbitrary<Skill> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }),
  proficiency: fc.constantFrom(1, 2, 3, 4, 5) as fc.Arbitrary<1 | 2 | 3 | 4 | 5>,
});

// Arbitrary for generating valid SkillCategory objects
const skillCategoryArbitrary: fc.Arbitrary<SkillCategory> = fc.record({
  category: fc.constantFrom(
    "Languages",
    "Frameworks & Libraries",
    "Tools & Platforms",
    "Concepts"
  ) as fc.Arbitrary<"Languages" | "Frameworks & Libraries" | "Tools & Platforms" | "Concepts">,
  skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
});

describe("Skills Section", () => {
  /**
   * **Feature: flutter-portfolio, Property 5: Skills Categorization**
   * *For any* skills data array, the rendered skills section SHALL group all skills
   * into exactly four categories: Languages, Frameworks & Libraries, Tools & Platforms, and Concepts.
   * **Validates: Requirements 4.3**
   */
  it("Property 5: Skills are grouped into exactly 4 categories", () => {
    fc.assert(
      fc.property(
        // Generate exactly 4 categories with unique category names
        fc.tuple(
          fc.record({
            category: fc.constant("Languages" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
          }),
          fc.record({
            category: fc.constant("Frameworks & Libraries" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
          }),
          fc.record({
            category: fc.constant("Tools & Platforms" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
          }),
          fc.record({
            category: fc.constant("Concepts" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
          })
        ),
        ([languages, frameworks, tools, concepts]) => {
          const skillCategories: SkillCategory[] = [languages, frameworks, tools, concepts];
          return validateSkillCategories(skillCategories);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 5: Skills Categorization**
   * Validation should fail if not exactly 4 categories
   * **Validates: Requirements 4.3**
   */
  it("Property 5: Validation fails with fewer than 4 categories", () => {
    fc.assert(
      fc.property(
        fc.array(skillCategoryArbitrary, { minLength: 0, maxLength: 3 }),
        (skillCategories) => {
          // Should always fail validation with fewer than 4 categories
          return !validateSkillCategories(skillCategories);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 5: Skills Categorization**
   * Validation should fail if missing any expected category
   * **Validates: Requirements 4.3**
   */
  it("Property 5: Validation fails with missing expected category", () => {
    fc.assert(
      fc.property(
        // Generate 4 categories but with one duplicate (missing one expected)
        fc.tuple(
          fc.record({
            category: fc.constant("Languages" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 5 }),
          }),
          fc.record({
            category: fc.constant("Languages" as const), // Duplicate!
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 5 }),
          }),
          fc.record({
            category: fc.constant("Tools & Platforms" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 5 }),
          }),
          fc.record({
            category: fc.constant("Concepts" as const),
            skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 5 }),
          })
        ),
        ([cat1, cat2, cat3, cat4]) => {
          const skillCategories: SkillCategory[] = [cat1, cat2, cat3, cat4];
          // Should fail because "Frameworks & Libraries" is missing
          return !validateSkillCategories(skillCategories);
        }
      ),
      { numRuns: 100 }
    );
  });
});
