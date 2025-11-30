"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  reducedMotionStaggerContainer,
  reducedMotionStaggerItem,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { aboutData } from "@/data/about";

// Lazy-load FloatingBackground for below-fold optimization (Requirements: 8.2)
const FloatingBackground = dynamic(
  () => import("@/components/ui/floating-background").then((mod) => ({ default: mod.FloatingBackground })),
  { ssr: false }
);

/**
 * Hero section component
 * Displays name, title "Flutter Developer", tagline with CTA buttons
 * Framer Motion entrance animations within 500ms
 * Responsive single-column on mobile
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

export interface HeroProps {
  className?: string;
}

function Hero({ className }: HeroProps) {
  const { name, title, tagline } = aboutData;
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className={cn(
        "relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-20",
        className
      )}
      aria-label="Hero section"
    >
      <ScrollReveal animation="fadeUp" duration={500} className="w-full">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Name - displayed prominently within 100ms of content paint */}
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            {name}
          </motion.h1>

          {/* Title - "Flutter Developer" */}
          <motion.p
            className="mt-4 text-xl font-medium text-primary sm:text-2xl md:text-3xl"
            variants={itemVariants}
          >
            {title}
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            variants={itemVariants}
          >
            {tagline}
          </motion.p>

          {/* CTA Buttons - Using AnimatedButton for micro-animations (Requirements: 5.1, 5.3) */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
            variants={itemVariants}
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={() => scrollToSection("projects")}
              rightIcon={<ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              className="group min-w-[180px]"
            >
              View Projects
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="min-w-[180px]"
            >
              Get in Touch
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </ScrollReveal>

      {/* Floating 3D background with parallax effects (Requirements: 4.2) */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Floating 3D shapes */}
        <FloatingBackground
          parallaxIntensity={0.3}
          className="opacity-60"
        />
        
        {/* Decorative gradient background */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export { Hero };
