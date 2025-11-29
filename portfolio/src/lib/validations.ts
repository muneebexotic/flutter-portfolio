import type { ContactFormData, FormErrors } from "@/types";

/**
 * Validates name field
 * Rules: 2-50 characters, letters and spaces only
 * @param name - The name to validate
 * @returns Error message or undefined if valid
 */
export function validateName(name: string): string | undefined {
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (trimmed.length > 50) {
    return "Name must be at most 50 characters";
  }

  // Allow letters (a-z, A-Z) and spaces only
  const namePattern = /^[a-zA-Z\s]+$/;
  if (!namePattern.test(trimmed)) {
    return "Name can only contain letters and spaces";
  }

  return undefined;
}

/**
 * Validates email field
 * Rules: Must be a valid email format
 * @param email - The email to validate
 * @returns Error message or undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();

  if (!trimmed) {
    return "Email is required";
  }

  // Standard email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return "Please enter a valid email address";
  }

  return undefined;
}

/**
 * Validates message field
 * Rules: 10-1000 characters
 * @param message - The message to validate
 * @returns Error message or undefined if valid
 */
export function validateMessage(message: string): string | undefined {
  const trimmed = message.trim();

  if (trimmed.length < 10) {
    return "Message must be at least 10 characters";
  }

  if (trimmed.length > 1000) {
    return "Message must be at most 1000 characters";
  }

  return undefined;
}

/**
 * Validates entire contact form
 * @param data - The form data to validate
 * @returns Object with field-specific errors, empty if all valid
 */
export function validateContactForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  const nameError = validateName(data.name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const messageError = validateMessage(data.message);
  if (messageError) {
    errors.message = messageError;
  }

  return errors;
}

/**
 * Sanitizes input to prevent XSS attacks
 * Escapes HTML special characters
 * @param input - The input string to sanitize
 * @returns Sanitized string with HTML entities escaped
 */
export function sanitizeInput(input: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}
