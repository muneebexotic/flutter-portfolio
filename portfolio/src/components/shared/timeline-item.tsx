"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/types";

/**
 * TimelineItem component - Display experience entry with scroll-triggered animation
 * Requirements: 5.2, 5.3
 */

export interface TimelineItemProps {
  experience: Experience;
  index?: number;
  className?: string;
}

/**
 * Format duration from start and end dates
 * @param startDate - ISO format date string (e.g., "2023-03")
 * @param endDate - ISO format date string or undefined for current position
 * @returns Formatted duration string (e.g., "Mar 2023 - Present")
 */
export function formatDuration(startDate: string, endDate?: string): string {
  const formatDate = (dateStr: string): string => {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Present";

  return `${start} - ${end}`;
}

function TimelineItem({ experience, index = 0, className }: TimelineItemProps) {
  const { company, role, startDate, endDate, location, achievements, technologies } = experience;
  
  const duration = formatDuration(startDate, endDate);
  const staggerDelay = index * 0.15;

  return (
    <motion.div
      className={cn("relative pl-8 pb-8 last:pb-0", className)}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: staggerDelay }}
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2 h-full w-0.5 bg-border last:hidden" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-2 h-6 w-6 rounded-full border-2 border-primary bg-background" />

      {/* Content */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        {/* Header */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-card-foreground">{role}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{company}</span>
            {location && (
              <>
                <span>•</span>
                <span>{location}</span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{duration}</p>
        </div>

        {/* Achievements */}
        <ul className="mb-3 space-y-1.5">
          {achievements.map((achievement, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {achievement}
            </li>
          ))}
        </ul>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { TimelineItem };
