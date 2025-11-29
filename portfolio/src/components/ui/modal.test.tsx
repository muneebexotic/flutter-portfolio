import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "./modal";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
      role,
      "aria-modal": ariaModal,
      "aria-labelledby": ariaLabelledby,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      "aria-modal"?: string;
      "aria-labelledby"?: string;
    }) => (
      <div
        className={className}
        onClick={onClick}
        role={role}
        aria-modal={ariaModal}
        aria-labelledby={ariaLabelledby}
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  describe("rendering", () => {
    it("renders when isOpen is true", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<Modal {...defaultProps} title="Test Title" />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("button", { name: /close modal/i })).toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("has role dialog", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal set to true", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby when title is provided", () => {
      render(<Modal {...defaultProps} title="Test Title" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    });

    it("close button has aria-label", () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByRole("button", { name: /close modal/i });
      expect(closeButton).toHaveAttribute("aria-label", "Close modal");
    });
  });

  describe("keyboard navigation", () => {
    it("closes on Escape key press", async () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("close interactions", () => {
    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close modal/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when backdrop is clicked", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      // Find the backdrop (the element with aria-hidden="true")
      const backdrop = document.querySelector('[aria-hidden="true"]');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("body scroll lock", () => {
    it("prevents body scroll when open", () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when closed", () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("");
    });
  });
});
