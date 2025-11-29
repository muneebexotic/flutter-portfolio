import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Contact } from "./contact";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock the server action
const mockSubmitContactForm = vi.fn();
vi.mock("@/app/actions/contact", () => ({
  submitContactForm: (...args: unknown[]) => mockSubmitContactForm(...args),
}));

// Mock about data
vi.mock("@/data/about", () => ({
  aboutData: {
    socialLinks: [
      { platform: "github", url: "https://github.com/test", label: "GitHub" },
    ],
    resumeUrl: "/resume.pdf",
  },
}));

// Helper to get form elements by their input type/role
const getFormElements = () => {
  const nameInput = screen.getByRole("textbox", { name: /name/i });
  const emailInput = screen.getByRole("textbox", { name: /^email$/i });
  const messageInput = screen.getByRole("textbox", { name: /message/i });
  const submitButton = screen.getByRole("button", { name: /send message/i });
  return { nameInput, emailInput, messageInput, submitButton };
};

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitContactForm.mockResolvedValue({ success: true, message: "Success" });
  });

  describe("rendering", () => {
    it("renders the contact section with heading", () => {
      render(<Contact />);
      expect(screen.getByRole("heading", { name: /get in touch/i })).toBeInTheDocument();
    });

    it("renders name, email, and message fields", () => {
      render(<Contact />);
      const { nameInput, emailInput, messageInput } = getFormElements();
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<Contact />);
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    });

    it("renders social links section", () => {
      render(<Contact />);
      expect(screen.getByText(/connect with me/i)).toBeInTheDocument();
    });
  });

  describe("form validation display", () => {
    it("displays validation error for short name", async () => {
      render(<Contact />);
      
      const { nameInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "J" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it("displays validation error for invalid email", async () => {
      render(<Contact />);
      
      const { nameInput, emailInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it("displays validation error for short message", async () => {
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "Hi" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it("clears field error when user starts typing", async () => {
      render(<Contact />);
      
      const { nameInput, submitButton } = getFormElements();
      
      // Trigger validation error
      fireEvent.change(nameInput, { target: { value: "J" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
      
      // Start typing to clear error
      fireEvent.change(nameInput, { target: { value: "Jo" } });
      
      await waitFor(() => {
        expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("success/error state handling", () => {
    it("displays success message on successful submission", async () => {
      mockSubmitContactForm.mockResolvedValue({ success: true, message: "Success" });
      
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message with enough characters." } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
      });
    });

    it("clears form fields on successful submission", async () => {
      mockSubmitContactForm.mockResolvedValue({ success: true, message: "Success" });
      
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message with enough characters." } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect((nameInput as HTMLInputElement).value).toBe("");
        expect((emailInput as HTMLInputElement).value).toBe("");
        expect((messageInput as HTMLTextAreaElement).value).toBe("");
      });
    });

    it("displays error message on failed submission", async () => {
      mockSubmitContactForm.mockResolvedValue({
        success: false,
        errors: { general: "Something went wrong" },
      });
      
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message with enough characters." } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it("displays field-specific errors from server", async () => {
      mockSubmitContactForm.mockResolvedValue({
        success: false,
        errors: { email: "Email already registered" },
      });
      
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message with enough characters." } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
      });
    });
  });

  describe("loading state", () => {
    it("button has aria-busy attribute for accessibility", () => {
      render(<Contact />);
      
      const submitButton = screen.getByRole("button", { name: /send message/i });
      // Button should have aria-busy attribute (false when not loading)
      expect(submitButton).toHaveAttribute("aria-busy", "false");
    });
  });

  describe("honeypot field", () => {
    it("includes hidden honeypot field in form submission", async () => {
      render(<Contact />);
      
      const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
      
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message with enough characters." } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmitContactForm).toHaveBeenCalledWith(
          expect.objectContaining({
            honeypot: "",
          })
        );
      });
    });
  });
});
