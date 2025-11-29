import * as React from "react";

/**
 * Contact Form Email Template
 * Professional branded design for contact form submissions
 * Includes sender name, email, message, and timestamp
 * Requirements: 22.1, 22.2
 * 
 * Note: This is a simple React component that generates HTML.
 * For production use with React Email library, install @react-email/components
 * and use their pre-built components for better email client compatibility.
 */

export interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
  timestamp?: Date;
}

export function ContactFormEmail({
  name,
  email,
  message,
  timestamp = new Date(),
}: ContactFormEmailProps) {
  const formattedDate = timestamp.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Contact Form Submission</title>
      </head>
      <body style={styles.body}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>New Contact Form Submission</h1>
          <p style={styles.headerSubtitle}>Someone reached out through your portfolio</p>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Sender Info */}
          <div style={styles.section}>
            <div style={styles.field}>
              <span style={styles.label}>From</span>
              <p style={styles.value}>{name}</p>
            </div>

            <div style={styles.field}>
              <span style={styles.label}>Email</span>
              <p style={styles.value}>
                <a href={`mailto:${email}`} style={styles.link}>
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Message */}
          <div style={styles.section}>
            <span style={styles.label}>Message</span>
            <div style={styles.messageBox}>
              <p style={styles.messageText}>{message}</p>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.timestamp}>Submitted on {formattedDate}</p>
            <p style={styles.replyNote}>
              Reply directly to this email to respond to {name}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

/**
 * Render the email template to HTML string
 * For use with Resend API
 */
export function renderContactFormEmail(props: ContactFormEmailProps): string {
  const { name, email, message, timestamp = new Date() } = props;
  
  const formattedDate = timestamp.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f5;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0 0 8px; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 14px;">Someone reached out through your portfolio</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      <!-- Sender Info -->
      <div style="margin-bottom: 24px;">
        <div style="margin-bottom: 16px;">
          <span style="display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px;">From</span>
          <p style="margin: 0; font-size: 16px; color: #1a1a2e; font-weight: 500;">${escapeHtml(name)}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <span style="display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px;">Email</span>
          <p style="margin: 0; font-size: 16px;">
            <a href="mailto:${escapeHtml(email)}" style="color: #3b82f6; text-decoration: none;">${escapeHtml(email)}</a>
          </p>
        </div>
      </div>

      <!-- Message -->
      <div style="margin-bottom: 24px;">
        <span style="display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px;">Message</span>
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="margin: 0; white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.7;">${escapeHtml(message)}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">Submitted on ${formattedDate}</p>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">Reply directly to this email to respond to ${escapeHtml(name)}</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS in email
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// Inline styles for the React component version
const styles: Record<string, React.CSSProperties> = {
  body: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    lineHeight: 1.6,
    color: "#1a1a2e",
    maxWidth: 600,
    margin: "0 auto",
    padding: 0,
    backgroundColor: "#f4f4f5",
  },
  header: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    padding: "40px 30px",
    borderRadius: "12px 12px 0 0",
  },
  headerTitle: {
    color: "white",
    margin: "0 0 8px",
    fontSize: 24,
    fontWeight: 600,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
    fontSize: 14,
  },
  content: {
    background: "white",
    padding: 30,
    border: "1px solid #e5e7eb",
    borderTop: "none",
    borderRadius: "0 0 12px 12px",
  },
  section: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    color: "#6b7280",
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    fontWeight: 600,
    marginBottom: 4,
  },
  value: {
    margin: 0,
    fontSize: 16,
    color: "#1a1a2e",
    fontWeight: 500,
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
  messageBox: {
    padding: 16,
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  messageText: {
    margin: 0,
    whiteSpace: "pre-wrap" as const,
    color: "#374151",
    fontSize: 15,
    lineHeight: 1.7,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTop: "1px solid #e5e7eb",
  },
  timestamp: {
    margin: "0 0 8px",
    fontSize: 12,
    color: "#9ca3af",
  },
  replyNote: {
    margin: 0,
    fontSize: 12,
    color: "#6b7280",
  },
};

export default ContactFormEmail;
