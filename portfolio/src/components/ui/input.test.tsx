import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders with label", () => {
      render(<Input label="Email" name="email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<Input label="Email" name="email" required />);
      const label = screen.getByText(/email/i);
      expect(label.parentElement).toHaveTextContent("*");
    });

    it("renders placeholder text", () => {
      render(
        <Input label="Email" name="email" placeholder="Enter your email" />
      );
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });
  });

  describe("error states", () => {
    it("displays error message when error prop is provided", () => {
      render(<Input label="Email" name="email" error="Invalid email format" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email format");
    });

    it("sets aria-invalid to true when error exists", () => {
      render(<Input label="Email" name="email" error="Invalid email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-invalid to false when no error", () => {
      render(<Input label="Email" name="email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute("aria-invalid", "false");
    });

    it("links error message with aria-describedby", () => {
      render(<Input label="Email" name="email" error="Invalid email" />);
      const input = screen.getByLabelText(/email/i);
      const errorId = input.getAttribute("aria-describedby");
      expect(errorId).toBeTruthy();
      const errorElement = document.getElementById(errorId!);
      expect(errorElement).toHaveTextContent("Invalid email");
    });

    it("applies error styling when error exists", () => {
      render(<Input label="Email" name="email" error="Invalid email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveClass("border-destructive");
    });
  });

  describe("ARIA attributes", () => {
    it("has proper label association", () => {
      render(<Input label="Username" name="username" />);
      const input = screen.getByLabelText(/username/i);
      expect(input).toBeInTheDocument();
    });

    it("does not have aria-describedby when no error", () => {
      render(<Input label="Email" name="email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("interactions", () => {
    it("calls onChange when value changes", () => {
      const handleChange = vi.fn();
      render(<Input label="Email" name="email" onChange={handleChange} />);
      const input = screen.getByLabelText(/email/i);
      fireEvent.change(input, { target: { value: "test@example.com" } });
      expect(handleChange).toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(<Input label="Email" name="email" disabled />);
      const input = screen.getByLabelText(/email/i);
      expect(input).toBeDisabled();
    });
  });
});
