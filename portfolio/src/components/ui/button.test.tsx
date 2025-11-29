import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  describe("variants", () => {
    it("renders primary variant by default", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toHaveClass("bg-primary");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toHaveClass("bg-secondary");
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("bg-transparent");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toHaveClass("hover:bg-accent");
    });
  });

  describe("loading state", () => {
    it("shows spinner when loading", () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole("button", { name: /submit/i });
      const spinner = button.querySelector("svg");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("animate-spin");
    });

    it("disables button when loading", () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toBeDisabled();
    });

    it("sets aria-busy when loading", () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("hides left icon when loading", () => {
      const icon = <span data-testid="left-icon">Icon</span>;
      render(
        <Button isLoading leftIcon={icon}>
          Submit
        </Button>
      );
      expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    });
  });

  describe("icons", () => {
    it("renders left icon", () => {
      const icon = <span data-testid="left-icon">Icon</span>;
      render(<Button leftIcon={icon}>Click me</Button>);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon", () => {
      const icon = <span data-testid="right-icon">Icon</span>;
      render(<Button rightIcon={icon}>Click me</Button>);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole("button", { name: /click me/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );
      fireEvent.click(screen.getByRole("button", { name: /click me/i }));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
