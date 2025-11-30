"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";
import { useThemeMode } from "@/hooks/useThemeMode";

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
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const isGlass = mode === "glassmorphism";

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
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          "bg-clip-text text-transparent",
          isDark && "bg-gradient-to-r from-white via-blue-100 to-purple-200",
          isGlass && "bg-gradient-to-r from-white via-purple-200 to-pink-200",
          mode === "default" && "bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900"
        )}
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
