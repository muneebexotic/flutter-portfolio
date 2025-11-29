import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render } from "@testing-library/react";
import { TimelineItem, formatDuration } from "./timeline-item";
import type { Experience } from "@/types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Arbitrary for generating valid ISO date strings (YYYY-MM format)
const isoDateString = fc
  .tuple(
    fc.integer({ min: 2015, max: 2025 }),
    fc.integer({ min: 1, max: 12 })
  )
  .map(([year, month]) => `${year}-${month.toString().padStart(2, "0")}`);

// Arbitrary for generating company names
const companyName = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

// Arbitrary for generating role names
const roleName = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

// Arbitrary for generating achievements
const achievement = fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0);
const achievements = fc.array(achievement, { minLength: 1, maxLength: 5 });

// Arbitrary for generating a valid Experience object
const experienceArbitrary: fc.Arbitrary<Experience> = fc.record({
  id: fc.uuid(),
  company: companyName,
  role: roleName,
  startDate: isoDateString,
  endDate: fc.option(isoDateString, { nil: undefined }),
  location: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
  achievements: achievements,
  technologies: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 0, maxLength: 5 }), { nil: undefined }),
});

describe("TimelineItem - Property Tests", () => {
  /**
   * **Feature: flutter-portfolio, Property 7: Experience Entry Fields**
   * *For any* experience entry, the rendered timeline item SHALL display
   * company name, role, duration (calculated from startDate and endDate), and all achievements.
   * **Validates: Requirements 5.2**
   */
  it("Property 7: all required fields are rendered", () => {
    fc.assert(
      fc.property(
        experienceArbitrary,
        (experience) => {
          const { container } = render(<TimelineItem experience={experience} />);
          const textContent = container.textContent || "";

          // Check company name is rendered
          const hasCompany = textContent.includes(experience.company);

          // Check role is rendered
          const hasRole = textContent.includes(experience.role);

          // Check all achievements are rendered
          const hasAllAchievements = experience.achievements.every(
            (achievement) => textContent.includes(achievement)
          );

          // Check duration is rendered (formatted from dates)
          const duration = formatDuration(experience.startDate, experience.endDate);
          const hasDuration = textContent.includes(duration);

          // Cleanup
          container.remove();

          return hasCompany && hasRole && hasAllAchievements && hasDuration;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 7: Experience Entry Fields**
   * Duration should show "Present" when endDate is undefined
   * **Validates: Requirements 5.2**
   */
  it("Property 7: shows Present for current positions", () => {
    fc.assert(
      fc.property(
        experienceArbitrary.map(exp => ({ ...exp, endDate: undefined })),
        (experience) => {
          const { container } = render(<TimelineItem experience={experience} />);
          const textContent = container.textContent || "";

          const hasPresent = textContent.includes("Present");

          // Cleanup
          container.remove();

          return hasPresent;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("formatDuration", () => {
  it("formats start and end dates correctly", () => {
    expect(formatDuration("2023-03", "2024-01")).toBe("Mar 2023 - Jan 2024");
  });

  it("shows Present when endDate is undefined", () => {
    expect(formatDuration("2023-03")).toBe("Mar 2023 - Present");
  });

  it("handles single digit months", () => {
    expect(formatDuration("2023-01", "2023-12")).toBe("Jan 2023 - Dec 2023");
  });
});
