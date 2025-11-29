import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  validateName,
  validateEmail,
  validateMessage,
  validateContactForm,
  sanitizeInput,
} from "./validations";

describe("validateName", () => {
  /**
   * **Feature: flutter-portfolio, Property 10: Form Validation - Name**
   * *For any* name input, the validation function SHALL return an error if the name
   * is less than 2 characters, greater than 50 characters, or contains characters
   * other than letters and spaces.
   * **Validates: Requirements 7.5**
   */
  it("Property 10: rejects names shorter than 2 characters", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 1 }), (name) => {
        const error = validateName(name);
        return error !== undefined;
      }),
      { numRuns: 100 }
    );
  });

  it("Property 10: rejects names longer than 50 characters", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 51, maxLength: 100 }),
        (chars) => {
          // Use only letters (no spaces) to ensure trimmed length > 50
          const name = chars.join('');
          const error = validateName(name);
          return error !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 10: accepts valid names (2-50 chars, letters and spaces)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('')), { minLength: 2, maxLength: 50 })
          .filter((chars) => chars.join('').trim().length >= 2),
        (chars) => {
          const name = chars.join('');
          const error = validateName(name);
          return error === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 10: rejects names with invalid characters", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 1, maxLength: 10 }),
          fc.constantFrom('1', '2', '@', '#', '!', '$'),
          fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 1, maxLength: 10 })
        ),
        ([prefixChars, invalidChar, suffixChars]) => {
          const name = prefixChars.join('') + invalidChar + suffixChars.join('');
          const error = validateName(name);
          return error !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("validateEmail", () => {
  /**
   * **Feature: flutter-portfolio, Property 11: Form Validation - Email**
   * *For any* email input, the validation function SHALL return an error if the
   * email does not match a valid email format pattern.
   * **Validates: Requirements 7.5**
   */
  it("Property 11: accepts valid email formats", () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const error = validateEmail(email);
          return error === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 11: rejects emails without @ symbol", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => !s.includes("@") && s.trim().length > 0),
        (email) => {
          const error = validateEmail(email);
          return error !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 11: rejects empty emails", () => {
    const error = validateEmail("");
    expect(error).toBe("Email is required");
  });
});

describe("validateMessage", () => {
  /**
   * **Feature: flutter-portfolio, Property 12: Form Validation - Message**
   * *For any* message input, the validation function SHALL return an error if the
   * message is less than 10 characters or greater than 1000 characters.
   * **Validates: Requirements 7.5**
   */
  it("Property 12: rejects messages shorter than 10 characters", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 9 }),
        (message) => {
          const error = validateMessage(message);
          return error !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 12: rejects messages longer than 1000 characters", () => {
    fc.assert(
      fc.property(
        // Generate strings that will still be > 1000 chars after trimming
        // Use alphanumeric characters to avoid whitespace-only strings
        fc.array(
          fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split('')),
          { minLength: 1001, maxLength: 1500 }
        ).map(chars => chars.join('')),
        (message) => {
          const error = validateMessage(message);
          return error !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 12: accepts messages between 10-1000 characters", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 1000 })
          .filter((s) => s.trim().length >= 10), // Ensure trimmed length is valid
        (message) => {
          const error = validateMessage(message);
          return error === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("validateContactForm", () => {
  it("returns empty errors for valid form data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "This is a valid message with more than 10 characters.",
      honeypot: "",
    };
    const errors = validateContactForm(validData);
    expect(errors).toEqual({});
  });

  it("returns all errors for completely invalid form", () => {
    const invalidData = {
      name: "J",
      email: "invalid",
      message: "short",
      honeypot: "",
    };
    const errors = validateContactForm(invalidData);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});

describe("sanitizeInput", () => {
  /**
   * **Feature: flutter-portfolio, Property 17: XSS Sanitization**
   * *For any* form input containing HTML tags or script elements, the server-side
   * validation SHALL sanitize the input by escaping or removing potentially
   * malicious content.
   * **Validates: Requirements 18.5**
   */
  it("Property 17: escapes HTML special characters", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const sanitized = sanitizeInput(input);
        // Sanitized output should not contain raw < or > characters
        // unless they were already escaped
        const hasRawHtmlChars =
          sanitized.includes("<") || sanitized.includes(">");
        return !hasRawHtmlChars;
      }),
      { numRuns: 100 }
    );
  });

  it("Property 17: escapes script tags", () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).toContain("&lt;script&gt;");
  });

  it("Property 17: escapes common XSS vectors", () => {
    const vectors = [
      '<img src="x" onerror="alert(1)">',
      '<a href="javascript:alert(1)">click</a>',
      '"><script>alert(1)</script>',
      "' onclick='alert(1)'",
    ];

    vectors.forEach((vector) => {
      const sanitized = sanitizeInput(vector);
      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
    });
  });
});
