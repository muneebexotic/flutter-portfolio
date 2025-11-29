"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";

/**
 * ErrorBoundary component - Catch JavaScript errors in child components
 * Display friendly error message with retry button
 * Requirements: 18.1
 */

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <ErrorIcon className="mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">
            Something went wrong
          </h2>
          <p className="mb-4 max-w-md text-sm text-muted-foreground">
            We encountered an unexpected error. Please try again, or contact support if the problem persists.
          </p>
          <Button onClick={this.handleRetry} variant="primary">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export { ErrorBoundary };
