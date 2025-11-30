"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, reducedMotionStaggerContainer } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { SectionHeading } from "@/components/shared/section-heading";
import { TimelineItem } from "@/components/shared/timeline-item";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { experiences } from "@/data/experience";
import type { Experience as ExperienceType } from "@/types";

/**
 * Experience section component
 * Chronological timeline format (most recent first)
 * Progressive scroll animations
 * Single-column on mobile
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

export interface ExperienceProps {
  className?: string;
}

/**
 * Sort experiences by startDate in descending order (most recent first)
 * Property 6: Experience Chronological Order
 */
export function sortExperiencesByDate(experienceList: ExperienceType[]): ExperienceType[] {
  return [...experienceList].sort((a, b) => {
    // Parse dates for comparison (format: "YYYY-MM")
    const dateA = new Date(a.startDate + "-01");
    const dateB = new Date(b.startDate + "-01");
    // Sort descending (most recent first)
    return dateB.getTime() - dateA.getTime();
  });
}

function Experience({ className }: ExperienceProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Sort experiences with most recent first
  const sortedExperiences = useMemo(
    () => sortExperiencesByDate(experiences),
    []
  );

  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;

  return (
    <section
      id="experience"
      className={cn("px-4 py-20", className)}
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey"
          id="experience-heading"
        />

        <motion.div
          className="relative space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Wrap timeline items in ScrollReveal for entrance animations (Requirements: 5.2) */}
          {sortedExperiences.map((experience, index) => (
            <ScrollReveal
              key={experience.id}
              animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
              delay={index * 100}
              threshold={0.2}
            >
              <TimelineItem
                experience={experience}
                index={index}
              />
            </ScrollReveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { Experience };
