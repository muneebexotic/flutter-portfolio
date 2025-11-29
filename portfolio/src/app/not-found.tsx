import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

/**
 * Custom 404 page with friendly error message and navigation links
 * Requirements: 18.2
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* Illustration - SVG 404 graphic */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-muted-foreground/50"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              className="fill-muted/30"
            />
            {/* 404 text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="fill-current text-6xl font-bold"
              style={{ fontSize: "48px" }}
            >
              404
            </text>
            {/* Sad face */}
            <circle cx="70" cy="120" r="5" className="fill-current" />
            <circle cx="130" cy="120" r="5" className="fill-current" />
            <path
              d="M75 145 Q100 135 125 145"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Decorative elements */}
            <circle cx="40" cy="50" r="8" className="fill-primary/20" />
            <circle cx="160" cy="60" r="6" className="fill-primary/20" />
            <circle cx="150" cy="160" r="10" className="fill-primary/20" />
            <circle cx="50" cy="150" r="5" className="fill-primary/20" />
          </svg>
        </div>

        {/* Error message */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Page Not Found
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Navigation links */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            View Projects
          </Link>
        </div>

        {/* Additional help text */}
        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <Link
            href="/#contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            Contact me
          </Link>
        </p>
      </div>
    </main>
  );
}
