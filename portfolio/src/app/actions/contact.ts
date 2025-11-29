"use server";

import { headers } from "next/headers";
import { validateContactForm, sanitizeInput } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ContactFormData, FormErrors } from "@/types";

/**
 * Contact form server action
 * Server-side validation with sanitization
 * Rate limiting check (5 per hour per IP)
 * Honeypot field check (silent rejection)
 * Send email via Resend
 * Return structured success/error response
 * Requirements: 7.2, 7.4, 7.7, 7.8
 */

export type ContactActionResult =
  | { success: true; message: string }
  | { success: false; errors: FormErrors };

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactActionResult> {
  // Check honeypot field - silently reject if filled (bot detection)
  // Requirements: 7.8
  if (data.honeypot && data.honeypot.trim() !== "") {
    // Return success to not reveal bot detection to attackers
    return { success: true, message: "Message sent successfully" };
  }

  // Get client IP for rate limiting
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  // Check rate limit (5 submissions per hour per IP)
  // Requirements: 7.7
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    const minutesRemaining = Math.ceil(
      (rateLimitResult.resetTime - Date.now()) / 60000
    );
    return {
      success: false,
      errors: {
        general: `Too many submissions. Please try again in ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}.`,
      },
    };
  }


  // Sanitize inputs to prevent XSS
  // Requirements: 18.5
  const sanitizedData: ContactFormData = {
    name: sanitizeInput(data.name.trim()),
    email: sanitizeInput(data.email.trim()),
    message: sanitizeInput(data.message.trim()),
    honeypot: "",
  };

  // Server-side validation
  // Requirements: 7.5
  const validationErrors = validateContactForm(sanitizedData);
  if (Object.keys(validationErrors).length > 0) {
    return { success: false, errors: validationErrors };
  }

  // Send email via Resend
  // Requirements: 7.2
  try {
    const emailResult = await sendContactEmail(sanitizedData);
    
    if (!emailResult.success) {
      return {
        success: false,
        errors: {
          general: "Failed to send message. Please try again later.",
        },
      };
    }

    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      errors: {
        general: "An unexpected error occurred. Please try again later.",
      },
    };
  }
}

/**
 * Send contact email via Resend
 * Requirements: 7.2, 22.3
 */
async function sendContactEmail(
  data: Omit<ContactFormData, "honeypot">
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // If no API key is configured, log and return success for development
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY not configured. Email would be sent with:",
      {
        from: data.email,
        name: data.name,
        message: data.message.substring(0, 100) + "...",
        timestamp: new Date().toISOString(),
      }
    );
    // In development, return success to allow testing the form flow
    return { success: true };
  }

  // Import the email template renderer
  const { renderContactFormEmail } = await import("@/emails/contact-form");
  
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || "alex@example.com",
        subject: `New Contact Form Submission from ${data.name}`,
        html: renderContactFormEmail({
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: new Date(),
        }),
        reply_to: data.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend API error:", errorData);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}


