"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  reducedMotionStaggerContainer,
  reducedMotionStaggerItem,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { SectionHeading } from "@/components/shared/section-heading";
import { SkillBar } from "@/components/shared/skill-bar";
import { skills } from "@/data/skills";
import type { SkillCategory } from "@/types";

/**
 * Skills section component
 * Grouped by four categories with animated proficiency bars on scroll
 * Hover feedback on skill items
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

export interface SkillsProps {
  className?: string;
}

/**
 * Expected skill categories
 * Property 5: Skills Categorization
 */
export const EXPECTED_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "Tools & Platforms",
  "Concepts",
] as const;

/**
 * Validate that skills are grouped into exactly 4 categories
 * Property 5: Skills Categorization
 */
export function validateSkillCategories(skillCategories: SkillCategory[]): boolean {
  const categoryNames = skillCategories.map((c) => c.category);
  return (
    categoryNames.length === 4 &&
    EXPECTED_CATEGORIES.every((expected) => categoryNames.includes(expected))
  );
}

/**
 * Get category icon based on category name
 */
function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case "Languages":
      return <CodeIcon className="h-5 w-5" />;
    case "Frameworks & Libraries":
      return <LayersIcon className="h-5 w-5" />;
    case "Tools & Platforms":
      return <ToolIcon className="h-5 w-5" />;
    case "Concepts":
      return <BrainIcon className="h-5 w-5" />;
    default:
      return null;
  }
}

function Skills({ className }: SkillsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;

  return (
    <section
      id="skills"
      className={cn("px-4 py-20", className)}
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
          id="skills-heading"
        />

        <motion.div
          className="grid gap-8 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              className="rounded-lg border border-border bg-card p-6"
              variants={itemVariants}
            >
              {/* Category Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {getCategoryIcon(category.category)}
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {category.category}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    index={categoryIndex * 2 + skillIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Icon components
function CodeIcon({ className }: { className?: string }) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
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
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function ToolIcon({ className }: { className?: string }) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
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
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  );
}

export { Skills };
