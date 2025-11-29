import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading placeholders
 * Requirements: 18.3
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Pre-built skeleton variants for common use cases
 */

function SkeletonText({ className, ...props }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} {...props} />;
}

function SkeletonTitle({ className, ...props }: SkeletonProps) {
  return <Skeleton className={cn("h-6 w-3/4", className)} {...props} />;
}

function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton className={cn("h-12 w-12 rounded-full", className)} {...props} />
  );
}

function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText className="w-2/3" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonTitle, SkeletonAvatar, SkeletonCard };
