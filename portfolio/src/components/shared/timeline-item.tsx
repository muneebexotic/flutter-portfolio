"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";
import { useThemeMode } from "@/hooks/useThemeMode";
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
  const { mode } = useThemeMode();
  
  const isDark = mode === "dark";
  const isGlass = mode === "glassmorphism";
  
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
      {/* Timeline line with gradient */}
      <div className={cn(
        "absolute left-[11px] top-2 h-full w-0.5 last:hidden",
        isDark && "bg-gradient-to-b from-blue-500/50 to-purple-500/30",
        isGlass && "bg-gradient-to-b from-purple-400/50 to-pink-400/30",
        mode === "default" && "bg-gradient-to-b from-blue-400/50 to-indigo-400/30"
      )} />
      
      {/* Timeline dot with glow */}
      <div className={cn(
        "absolute left-0 top-2 h-6 w-6 rounded-full border-2 bg-background transition-shadow duration-300",
        isDark && "border-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]",
        isGlass && "border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
        mode === "default" && "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
      )} />

      {/* Content */}
      <div className={cn(
        "rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300",
        // Light mode
        mode === "default" && [
          "bg-white/80 border-gray-300",
          "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
          "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "hover:border-blue-300",
        ],
        // Dark mode
        isDark && [
          "bg-slate-900/60 border-slate-700/50",
          "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
          "hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]",
        ],
        // Glass mode
        isGlass && [
          "bg-white/10 border-white/20",
          "shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
          "hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]",
        ]
      )}>
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
