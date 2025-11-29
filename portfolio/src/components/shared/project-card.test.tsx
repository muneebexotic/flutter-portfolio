import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render } from "@testing-library/react";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article {...props}>{children}</article>
    ),
  },
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Helper to create a valid project with optional URL fields
const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: "test-project",
  title: "Test Project",
  shortDescription: "A test project description",
  fullDescription: "A longer test project description for the modal view",
  heroImage: "/test-image.png",
  techStack: ["Flutter", "Dart"],
  isFeatured: false,
  ...overrides,
});

// Arbitrary for generating optional URL strings
const optionalUrl = fc.option(
  fc.webUrl({ validSchemes: ["https"] }),
  { nil: undefined }
);

describe("ProjectCard - Property Tests", () => {
  /**
   * **Feature: flutter-portfolio, Property 2: Optional Links Rendering**
   * *For any* project with playStoreUrl, appStoreUrl, or githubUrl defined,
   * the project card SHALL render clickable links for each defined URL,
   * and SHALL NOT render links for undefined URLs.
   * **Validates: Requirements 3.3, 3.4**
   */
  it("Property 2: links render only when URLs are defined", () => {
    fc.assert(
      fc.property(
        optionalUrl,
        optionalUrl,
        optionalUrl,
        (playStoreUrl, appStoreUrl, githubUrl) => {
          const project = createProject({
            playStoreUrl,
            appStoreUrl,
            githubUrl,
          });

          const { container } = render(<ProjectCard project={project} />);

          // Check Play Store link
          const playStoreLink = container.querySelector(
            'a[aria-label*="Play Store"]'
          );
          if (playStoreUrl) {
            expect(playStoreLink).toBeInTheDocument();
            expect(playStoreLink).toHaveAttribute("href", playStoreUrl);
          } else {
            expect(playStoreLink).not.toBeInTheDocument();
          }

          // Check App Store link
          const appStoreLink = container.querySelector(
            'a[aria-label*="App Store"]'
          );
          if (appStoreUrl) {
            expect(appStoreLink).toBeInTheDocument();
            expect(appStoreLink).toHaveAttribute("href", appStoreUrl);
          } else {
            expect(appStoreLink).not.toBeInTheDocument();
          }

          // Check GitHub link
          const githubLink = container.querySelector(
            'a[aria-label*="GitHub"]'
          );
          if (githubUrl) {
            expect(githubLink).toBeInTheDocument();
            expect(githubLink).toHaveAttribute("href", githubUrl);
          } else {
            expect(githubLink).not.toBeInTheDocument();
          }

          // Cleanup for next iteration
          container.remove();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 2: Optional Links Rendering**
   * When all URLs are undefined, no link elements should be rendered
   * **Validates: Requirements 3.3, 3.4**
   */
  it("Property 2: no links render when all URLs are undefined", () => {
    const project = createProject({
      playStoreUrl: undefined,
      appStoreUrl: undefined,
      githubUrl: undefined,
    });

    const { container } = render(<ProjectCard project={project} />);

    const links = container.querySelectorAll('a[target="_blank"]');
    expect(links.length).toBe(0);
  });

  /**
   * **Feature: flutter-portfolio, Property 2: Optional Links Rendering**
   * When all URLs are defined, all link elements should be rendered
   * **Validates: Requirements 3.3, 3.4**
   */
  it("Property 2: all links render when all URLs are defined", () => {
    const project = createProject({
      playStoreUrl: "https://play.google.com/store/apps/details?id=test",
      appStoreUrl: "https://apps.apple.com/app/test/id123",
      githubUrl: "https://github.com/test/repo",
    });

    const { container } = render(<ProjectCard project={project} />);

    const links = container.querySelectorAll('a[target="_blank"]');
    expect(links.length).toBe(3);
  });
});
