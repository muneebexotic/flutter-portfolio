"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { truncateText } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

/**
 * ProjectModal component - Screenshot carousel with full details
 * Requirements: 3.7
 */

export interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    title,
    fullDescription,
    heroImage,
    screenshots = [],
    techStack,
    features = [],
    playStoreUrl,
    appStoreUrl,
    githubUrl,
    websiteUrl,
  } = project;

  // Combine hero image with screenshots for carousel
  const allImages = [heroImage, ...screenshots];
  
  // Truncate description to 500 chars per requirements
  const truncatedDescription = truncateText(fullDescription, 500);

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-2xl"
    >
      {/* Screenshot Carousel - with theme-aware treatments (Requirements: 7.3) */}
      <div className="relative mb-6 overflow-hidden rounded-lg bg-muted">
        <div className="image-container relative aspect-[9/16] max-h-[400px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={allImages[currentImageIndex]}
                alt={`${title} screenshot ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2",
                "hover:bg-background transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              aria-label="Previous screenshot"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2",
                "hover:bg-background transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              aria-label="Next screenshot"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/50 hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to screenshot ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <p className="mb-4 text-muted-foreground">{truncatedDescription}</p>

      {/* Tech Stack */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-semibold text-foreground">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-semibold text-foreground">Key Features</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* External Links */}
      <div className="flex flex-wrap gap-3">
        {playStoreUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(playStoreUrl, "_blank")}
          >
            <PlayStoreIcon className="mr-2 h-4 w-4" />
            Play Store
          </Button>
        )}
        {appStoreUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(appStoreUrl, "_blank")}
          >
            <AppStoreIcon className="mr-2 h-4 w-4" />
            App Store
          </Button>
        )}
        {githubUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(githubUrl, "_blank")}
          >
            <GitHubIcon className="mr-2 h-4 w-4" />
            Source Code
          </Button>
        )}
        {websiteUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(websiteUrl, "_blank")}
          >
            <GlobeIcon className="mr-2 h-4 w-4" />
            Website
          </Button>
        )}
      </div>
    </Modal>
  );
}

// Icon components
function ChevronLeftIcon({ className }: { className?: string }) {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

function AppStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.744-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" />
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

function GlobeIcon({ className }: { className?: string }) {
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
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export { ProjectModal };
