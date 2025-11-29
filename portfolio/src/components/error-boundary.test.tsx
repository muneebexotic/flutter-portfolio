import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "./error-boundary";

// Suppress console.error during tests since we're testing error handling
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

// Component that throws an error
function ThrowingComponent({ error }: { error: Error }): never {
  throw error;
}

// Component that renders normally
function NormalComponent({ text }: { text: string }) {
  return <div data-testid="normal-content">{text}</div>;
}

describe("ErrorBoundary - Property Tests", () => {
  /**
   * **Feature: flutter-portfolio, Property 16: Error Boundary Recovery**
   * *For any* JavaScript error thrown within a section component,
   * the Error Boundary SHALL catch the error and render a fallback UI with a retry button.
   * **Validates: Requirements 18.1**
   */
  it("Property 16: errors are caught and fallback UI is rendered", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        (errorMessage) => {
          const error = new Error(errorMessage);
          
          const { container } = render(
            <ErrorBoundary>
              <ThrowingComponent error={error} />
            </ErrorBoundary>
          );

          // Check that fallback UI is rendered
          const hasErrorHeading = container.textContent?.includes("Something went wrong");
          const hasRetryButton = container.querySelector('button');
          
          // Cleanup
          container.remove();

          return hasErrorHeading === true && hasRetryButton !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: flutter-portfolio, Property 16: Error Boundary Recovery**
   * Retry button should reset the error state
   * **Validates: Requirements 18.1**
   */
  it("Property 16: retry button resets error state", () => {
    let shouldThrow = true;
    
    function ConditionalThrow() {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div data-testid="recovered">Recovered!</div>;
    }

    const { container } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(container.textContent).toContain("Something went wrong");

    // Stop throwing and click retry
    shouldThrow = false;
    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);

    // Should now show recovered content
    expect(screen.getByTestId("recovered")).toBeInTheDocument();
  });

  /**
   * **Feature: flutter-portfolio, Property 16: Error Boundary Recovery**
   * Normal children should render without fallback
   * **Validates: Requirements 18.1**
   */
  it("Property 16: normal children render without fallback", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        (text) => {
          const { container } = render(
            <ErrorBoundary>
              <NormalComponent text={text} />
            </ErrorBoundary>
          );

          // Check that normal content is rendered
          const normalContent = container.querySelector('[data-testid="normal-content"]');
          const hasText = normalContent?.textContent === text;
          
          // Check that error UI is NOT rendered
          const hasNoErrorUI = !container.textContent?.includes("Something went wrong");

          // Cleanup
          container.remove();

          return hasText && hasNoErrorUI;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders fallback UI when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div data-testid="custom-fallback">Custom error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it("has proper accessibility attributes", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>
    );

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveAttribute("aria-live", "assertive");
  });
});
