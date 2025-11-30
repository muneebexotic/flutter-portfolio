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
import { useThemeMode } from "@/hooks/useThemeMode";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { TiltCard } from "@/components/ui/tilt-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
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
  const { isGlassmorphism } = useThemeMode();

  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;

  // Split bio into paragraphs for better readability
  const bioParagraphs = bio.split("\n\n").filter(Boolean);

  // Wrapper component based on theme mode (Requirements: 2.1, 4.1)
  const CardWrapper = isGlassmorphism ? GlassCard : TiltCard;
  const cardProps = isGlassmorphism
    ? { blur: "md" as const, opacity: 0.2, hover: true }
    : { maxTilt: 10, scale: 1.02 };
  
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const isGlass = mode === "glassmorphism";

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

        {/* Wrap content in ScrollReveal for entrance animations (Requirements: 5.2) */}
        <ScrollReveal animation="fadeUp" duration={500}>
          <motion.div
            className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Avatar with scroll reveal */}
            <ScrollReveal animation="scale" delay={100}>
              <motion.div
                className="flex-shrink-0"
                variants={itemVariants}
              >
                <div className={cn(
                  "relative h-48 w-48 overflow-hidden rounded-full border-4 md:h-56 md:w-56 transition-shadow duration-300",
                  isDark && "border-blue-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]",
                  isGlass && "border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]",
                  mode === "default" && "border-blue-400 shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
                )}>
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
            </ScrollReveal>

            {/* Bio Content wrapped in GlassCard or TiltCard based on mode */}
            <ScrollReveal animation="slideRight" delay={200}>
              <CardWrapper
                className={cn(
                  "flex-1 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300",
                  !isGlassmorphism && [
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
                  ]
                )}
                {...cardProps}
              >
                <div className="text-center md:text-left">
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
                </div>
              </CardWrapper>
            </ScrollReveal>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { About };
