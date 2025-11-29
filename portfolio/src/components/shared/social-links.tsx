"use client";

import { cn } from "@/lib/utils";
import { trackExternalLinkClick } from "@/lib/analytics";
import type { SocialLink } from "@/types";

/**
 * SocialLinks component - Display social links in order
 * Order: Email, GitHub, LinkedIn, Twitter/X, Resume
 * Resume opens in new tab
 * Requirements: 7.6, 7.9
 */

export interface SocialLinksProps {
  links: SocialLink[];
  resumeUrl?: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

// Define the order of social platforms
const PLATFORM_ORDER: SocialLink["platform"][] = [
  "email",
  "github",
  "linkedin",
  "twitter",
  "resume",
];

function SocialLinks({
  links,
  resumeUrl,
  className,
  iconSize = "md",
}: SocialLinksProps) {
  // Sort links by platform order
  const sortedLinks = [...links].sort((a, b) => {
    const aIndex = PLATFORM_ORDER.indexOf(a.platform);
    const bIndex = PLATFORM_ORDER.indexOf(b.platform);
    return aIndex - bIndex;
  });

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const iconClassName = iconSizes[iconSize];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {sortedLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target={link.platform === "email" ? undefined : "_blank"}
          rel={link.platform === "email" ? undefined : "noopener noreferrer"}
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          )}
          aria-label={link.label}
          onClick={() => trackExternalLinkClick(link.url, "social")}
        >
          <SocialIcon platform={link.platform} className={iconClassName} />
        </a>
      ))}
      
      {/* Resume link (separate from social links) */}
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          )}
          aria-label="Download Resume (opens in new tab)"
          onClick={() => trackExternalLinkClick(resumeUrl, "resume")}
        >
          <ResumeIcon className={iconClassName} />
        </a>
      )}
    </div>
  );
}

interface SocialIconProps {
  platform: SocialLink["platform"];
  className?: string;
}

function SocialIcon({ platform, className }: SocialIconProps) {
  switch (platform) {
    case "email":
      return <EmailIcon className={className} />;
    case "github":
      return <GitHubIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "twitter":
      return <TwitterIcon className={className} />;
    case "resume":
      return <ResumeIcon className={className} />;
    default:
      return null;
  }
}

function EmailIcon({ className }: { className?: string }) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ResumeIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export { SocialLinks };
