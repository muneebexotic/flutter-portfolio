"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  reducedMotionStaggerContainer,
  reducedMotionStaggerItem,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { SectionHeading } from "@/components/shared/section-heading";
import { aboutData } from "@/data/about";

/**
 * About section component
 * Displays professional bio and Flutter journey
 * Avatar with proper alt text
 * Minimum 16px font size
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

export interface AboutProps {
  className?: string;
}

function About({ className }: AboutProps) {
  const { name, bio, avatarUrl, avatarAlt } = aboutData;
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;

  // Split bio into paragraphs for better readability
  const bioParagraphs = bio.split("\n\n").filter(Boolean);

  return (
    <section
      id="about"
      className={cn("px-4 py-20", className)}
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="About Me"
          subtitle="My journey into Flutter development"
          id="about-heading"
        />

        <motion.div
          className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Avatar */}
          <motion.div
            className="flex-shrink-0"
            variants={itemVariants}
          >
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg md:h-56 md:w-56">
              <Image
                src={avatarUrl}
                alt={avatarAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
                priority
              />
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            variants={itemVariants}
          >
            <h3 className="mb-4 text-2xl font-semibold text-foreground">
              Hi, I&apos;m {name}
            </h3>
            
            {/* Bio paragraphs with minimum 16px font size */}
            <div className="space-y-4">
              {bioParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-muted-foreground md:text-lg"
                  style={{ fontSize: "max(16px, 1rem)" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export { About };
