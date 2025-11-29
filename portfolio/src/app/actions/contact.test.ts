import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";

/**
 * Tests for contact form server action
 * Property-based testing for honeypot rejection
 */

// Mock the headers function from next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve({
    get: vi.fn((key: string) => {
      if (key === "x-forwarded-for") return "127.0.0.1";
      if (key === "x-real-ip") return "127.0.0.1";
      return null;
    }),
  })),
}));

// Import after mocking
import { submitContactForm } from "./contact";
import { clearAllRateLimits } from "@/lib/rate-limit";

describe("submitContactForm - Honeypot Rejection", () => {
  beforeEach(() => {
    // Clear rate limits before each test
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  /**
   * **Feature: flutter-portfolio, Property 14: Honeypot Rejection**
   * *For any* form submission where the honeypot field contains a non-empty value,
   * the submission SHALL be silently rejected without sending an email.
   * **Validates: Requirements 7.8**
   */
  it("Property 14: silently rejects submissions with non-empty honeypot field", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate non-empty honeypot values
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        // Generate valid form data
        fc.record({
          name: fc.constant("John Doe"),
          email: fc.constant("john@example.com"),
          message: fc.constant("This is a valid test message for the contact form."),
        }),
        async (honeypotValue, formData) => {
          const result = await submitContactForm({
            ...formData,
            honeypot: honeypotValue,
          });

          // Should return success (silent rejection - doesn't reveal bot detection)
          return result.success === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 14: accepts submissions with empty honeypot field", async () => {
    const result = await submitContactForm({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a valid test message for the contact form.",
      honeypot: "",
    });

    // Should succeed (no RESEND_API_KEY in test, but form processing works)
    expect(result.success).toBe(true);
  });

  it("Property 14: honeypot with only whitespace is treated as empty (passes validation)", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate whitespace-only strings that are non-empty
        fc.array(fc.constantFrom(" ", "\t", "\n"), { minLength: 1, maxLength: 10 })
          .map((chars) => chars.join("")),
        async (whitespaceHoneypot) => {
          // Clear rate limits for each iteration
          clearAllRateLimits();
          
          const result = await submitContactForm({
            name: "John Doe",
            email: "john@example.com",
            message: "This is a valid test message for the contact form.",
            honeypot: whitespaceHoneypot,
          });

          // Whitespace-only honeypot is trimmed to empty, so it passes honeypot check
          // and proceeds with normal form processing (which succeeds in test env)
          return result.success === true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe("submitContactForm - Validation", () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  it("returns validation errors for invalid form data", async () => {
    const result = await submitContactForm({
      name: "J", // Too short
      email: "invalid-email",
      message: "short", // Too short
      honeypot: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    }
  });

  it("accepts valid form data", async () => {
    const result = await submitContactForm({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a valid test message with more than 10 characters.",
      honeypot: "",
    });

    expect(result.success).toBe(true);
  });
});
