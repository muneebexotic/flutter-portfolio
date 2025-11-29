"use client";

import { Skeleton, SkeletonText, SkeletonCard } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Section skeleton loading components for code splitting
 * Requirements: 10.7, 10.8, 18.3
 */

interface SectionSkeletonProps {
  className?: string;
}

/**
 * Hero section skeleton
 */
export function HeroSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20",
        className
      )}
      aria-label="Loading hero section"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Skeleton className="mx-auto h-12 w-64 sm:h-14 md:h-16" />
        <Skeleton className="mx-auto mt-4 h-8 w-48 sm:h-10" />
        <Skeleton className="mx-auto mt-6 h-6 w-full max-w-2xl" />
        <Skeleton className="mx-auto mt-2 h-6 w-3/4 max-w-xl" />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    </section>
  );
}

/**
 * About section skeleton
 */
export function AboutSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn("px-4 py-20", className)}
      aria-label="Loading about section"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto mt-4 h-5 w-64" />
        </div>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
          <Skeleton className="h-48 w-48 flex-shrink-0 rounded-full md:h-56 md:w-56" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText className="w-3/4" />
            <SkeletonText />
            <SkeletonText className="w-2/3" />
          </div>
        </div>
      </div>
    </section>
  );
}


/**
 * Projects section skeleton
 */
export function ProjectsSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn("px-4 py-20", className)}
      aria-label="Loading projects section"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-40" />
          <Skeleton className="mx-auto mt-4 h-5 w-72" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Skills section skeleton
 */
export function SkillsSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn("px-4 py-20", className)}
      aria-label="Loading skills section"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-32" />
          <Skeleton className="mx-auto mt-4 h-5 w-64" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Experience section skeleton
 */
export function ExperienceSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn("px-4 py-20", className)}
      aria-label="Loading experience section"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-44" />
          <Skeleton className="mx-auto mt-4 h-5 w-56" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative pl-8 pb-8 border-l-2 border-border">
              <Skeleton className="absolute -left-2 top-0 h-4 w-4 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2 pt-2">
                  <SkeletonText />
                  <SkeletonText className="w-5/6" />
                  <SkeletonText className="w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Contact section skeleton
 */
export function ContactSkeleton({ className }: SectionSkeletonProps) {
  return (
    <section
      className={cn("px-4 py-20", className)}
      aria-label="Loading contact section"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto mt-4 h-5 w-80" />
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-8">
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <SkeletonText />
              <SkeletonText className="mt-2 w-4/5" />
              <div className="mt-6 flex gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-36 mb-4" />
              <SkeletonText />
              <SkeletonText className="mt-2 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
