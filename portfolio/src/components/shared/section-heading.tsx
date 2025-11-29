"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";

/**
 * SectionHeading component - Consistent heading style with optional subtitle
 * Proper heading hierarchy (h2)
 * Requirements: 11.1
 */

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
}

function SectionHeading({ title, subtitle, className, id }: SectionHeadingProps) {
  return (
    <motion.div
      className={cn("mb-12 text-center", className)}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <h2
        id={id}
        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export { SectionHeading };
