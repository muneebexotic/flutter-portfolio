"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { skillBarFillWithReducedMotion } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import type { Skill } from "@/types";

/**
 * SkillBar component - Animated proficiency bar
 * Proficiency level N renders as N*20% width
 * Scroll-triggered animation with stagger
 * Requirements: 4.2, 4.4
 */

export interface SkillBarProps {
  skill: Skill;
  index?: number;
  className?: string;
}

/**
 * Calculate proficiency percentage from level
 * Level 1 = 20%, Level 2 = 40%, Level 3 = 60%, Level 4 = 80%, Level 5 = 100%
 */
export function calculateProficiencyPercentage(level: 1 | 2 | 3 | 4 | 5): number {
  return level * 20;
}

function SkillBar({ skill, index = 0, className }: SkillBarProps) {
  const { name, proficiency } = skill;
  const percentage = calculateProficiencyPercentage(proficiency);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Stagger delay based on index (disabled for reduced motion)
  const staggerDelay = prefersReducedMotion ? 0 : index * 0.1;

  return (
    <div className={cn("group", className)}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">
          {percentage}%
        </span>
      </div>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          variants={skillBarFillWithReducedMotion(percentage, prefersReducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: staggerDelay }}
          style={{ originX: 0 }}
          aria-label={`${name} proficiency: ${percentage}%`}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export { SkillBar };
