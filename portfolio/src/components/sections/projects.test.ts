import { describe, it } from "vitest";
import * as fc from "fast-check";
import { sortProjectsByFeatured } from "./projects";
import type { Project } from "@/types";

/**
 * Property tests for Projects section
 */

// Arbitrary for generating valid Project objects
const projectArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 60 }),
  shortDescription: fc.string({ minLength: 1, maxLength: 120 }),
  fullDescription: fc.string({ minLength: 1, maxLength: 500 }),
  heroImage: fc.constant("/images/test.png"),
  techStack: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
  isFeatured: fc.boolean(),
  screenshots: fc.array(fc.constant("/images/screenshot.png"), { minLength: 0, maxLength: 3 }),
  playStoreUrl: fc.option(fc.webUrl(), { nil: undefined }),
  appStoreUrl: fc.option(fc.webUrl(), { nil: undefined }),
  githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
  websiteUrl: fc.option(fc.webUrl(), { nil: undefined }),
  startDate: fc.option(fc.constant("2023-01"), { nil: undefined }),
  endDate: fc.option(fc.constant("2024-01"), { nil: undefined }),
  category: fc.option(
    fc.constantFrom("Personal", "Client", "Open Source", "Freelance") as fc.Arbitrary<"Personal" | "Client" | "Open Source" | "Freelance">,
    { nil: undefined }
  ),
  features: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 5 }), { nil: undefined }),
  metrics: fc.option(
    fc.record({
      downloads: fc.option(fc.string(), { nil: undefined }),
      rating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: undefined }),
      users: fc.option(fc.string(), { nil: undefined }),
    }),
    { nil: undefined }
  ),
}) as fc.Arbitrary<Project>;

describe("Projects Section", () => {
  /**
   * **Feature: flutter-portfolio, Property 3: Featured Projects Ordering**
   * *For any* array of projects containing both featured and non-featured items,
   * the rendered project list SHALL display all featured projects before any non-featured projects.
   * **Validates: Requirements 3.9**
   */
  it("Property 3: Featured projects appear before non-featured projects", () => {
    fc.assert(
      fc.property(
        fc.array(projectArbitrary, { minLength: 1, maxLength: 20 }),
        (projectList) => {
          const sorted = sortProjectsByFeatured(projectList);
          
          // Find the index of the last featured project
          let lastFeaturedIndex = -1;
          // Find the index of the first non-featured project
          let firstNonFeaturedIndex = sorted.length;
          
          sorted.forEach((project, index) => {
            if (project.isFeatured) {
              lastFeaturedIndex = index;
            } else if (firstNonFeaturedIndex === sorted.length) {
              firstNonFeaturedIndex = index;
            }
          });
          
          // All featured projects should come before all non-featured projects
          // This means lastFeaturedIndex should be less than firstNonFeaturedIndex
          // (or there are no featured projects, or there are no non-featured projects)
          return lastFeaturedIndex < firstNonFeaturedIndex;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 3: Featured Projects Ordering**
   * Sorting should preserve all projects (no projects lost or duplicated)
   * **Validates: Requirements 3.9**
   */
  it("Property 3: Sorting preserves all projects", () => {
    fc.assert(
      fc.property(
        fc.array(projectArbitrary, { minLength: 0, maxLength: 20 }),
        (projectList) => {
          const sorted = sortProjectsByFeatured(projectList);
          
          // Same length
          if (sorted.length !== projectList.length) return false;
          
          // All original projects are in sorted list
          const sortedIds = new Set(sorted.map(p => p.id));
          return projectList.every(p => sortedIds.has(p.id));
        }
      ),
      { numRuns: 100 }
    );
  });
});
