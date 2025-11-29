import { track } from "@vercel/analytics";

/**
 * Analytics event tracking utilities
 * Requirements: 21.2 - Track user interactions
 */

// Event types for type safety
export type AnalyticsEvent =
  | { name: "project_card_click"; properties: { projectId: string; projectTitle: string } }
  | { name: "external_link_click"; properties: { url: string; linkType: "github" | "playstore" | "appstore" | "website" | "resume" | "social" } }
  | { name: "contact_form_submit"; properties: { success: boolean } }
  | { name: "theme_toggle"; properties: { newTheme: "light" | "dark" } };

/**
 * Track a project card click event
 */
export function trackProjectCardClick(projectId: string, projectTitle: string) {
  track("project_card_click", {
    projectId,
    projectTitle,
  });
}

/**
 * Track an external link click event
 */
export function trackExternalLinkClick(
  url: string,
  linkType: "github" | "playstore" | "appstore" | "website" | "resume" | "social"
) {
  track("external_link_click", {
    url,
    linkType,
  });
}

/**
 * Track a contact form submission event
 */
export function trackContactFormSubmit(success: boolean) {
  track("contact_form_submit", {
    success,
  });
}

/**
 * Track a theme toggle event
 */
export function trackThemeToggle(newTheme: "light" | "dark") {
  track("theme_toggle", {
    newTheme,
  });
}
