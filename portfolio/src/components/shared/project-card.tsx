"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { truncateText } from "@/lib/utils";
import { cardHover, reducedMotionCardHover } from "@/lib/animations";
import { usePrefersReducedMotion, useMediaQuery } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { trackProjectCardClick, trackExternalLinkClick } from "@/lib/analytics";
import type { Project } from "@/types";

/**
 * ProjectCard component - Display project with phone frame mockup
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  const {
    title,
    shortDescription,
    heroImage,
    techStack,
    playStoreUrl,
    appStoreUrl,
    githubUrl,
  } = project;

  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Truncate title to 60 chars and description to 120 chars per requirements
  const truncatedTitle = truncateText(title, 60);
  const truncatedDescription = truncateText(shortDescription, 120);

  // Use reduced motion variants when user prefers reduced motion
  // Disable hover scale animation on mobile to prevent tap-to-hover issues
  const hoverVariants = prefersReducedMotion || isMobile ? reducedMotionCardHover : cardHover;

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card",
        "cursor-pointer transition-shadow",
        className
      )}
      variants={hoverVariants}
      initial="rest"
      whileHover={isMobile ? undefined : "hover"}
      onClick={() => {
        trackProjectCardClick(project.id, title);
        onClick?.();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trackProjectCardClick(project.id, title);
          onClick?.();
        }
      }}
      aria-label={`View details for ${title}`}
    >
      {/* Hero Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={heroImage}
          alt={`${title} app screenshot`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 pt-4">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
          {truncatedTitle}
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {truncatedDescription}
        </p>

        {/* Tech Stack Badges - show 4 badges + overflow count */}
        <div className="mt-4 flex flex-wrap gap-2 h-[4.5rem] content-start overflow-hidden">
          {techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {techStack.length > 4 && (
            <Badge variant="outline">+{techStack.length - 4}</Badge>
          )}
        </div>

        {/* Links - pushed to bottom */}
        <div className="mt-auto pt-4 flex items-center gap-3 min-h-[2.5rem]">
          {playStoreUrl && (
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackExternalLinkClick(playStoreUrl, "playstore");
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${title} on Play Store`}
            >
              <PlayStoreIcon className="h-5 w-5" />
            </a>
          )}
          {appStoreUrl && (
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackExternalLinkClick(appStoreUrl, "appstore");
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${title} on App Store`}
            >
              <AppStoreIcon className="h-5 w-5" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackExternalLinkClick(githubUrl, "github");
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${title} source code on GitHub`}
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// Icon components
function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

function AppStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.744-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export { ProjectCard };
