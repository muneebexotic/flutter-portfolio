"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GsapHeroIntro } from "@/components/ui/gsap-hero-intro";
import { aboutData } from "@/data/about";

// Lazy-load FloatingBackground for below-fold optimization
const FloatingBackground = dynamic(
  () =>
    import("@/components/ui/floating-background").then((mod) => ({
      default: mod.FloatingBackground,
    })),
  { ssr: false }
);

export interface HeroProps {
  className?: string;
}

function Hero({ className }: HeroProps) {
  const { name, title, tagline } = aboutData;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showButtons, setShowButtons] = useState(false);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonsRef.current || !showButtons) return;

    if (prefersReducedMotion) {
      gsap.set(buttonsRef.current.children, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      buttonsRef.current.children,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.7)",
      }
    );
  }, [showButtons, prefersReducedMotion]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
      <div className="mx-auto max-w-4xl w-full">
        {/* GSAP Cinematic Hero Intro */}
        <GsapHeroIntro
          name={name}
          title={title}
          tagline={tagline}
          onAnimationComplete={() => setShowButtons(true)}
        />

        {/* CTA Buttons - animate in after intro completes */}
        <div
          ref={buttonsRef}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={() => scrollToSection("projects")}
            rightIcon={
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            }
            className="group min-w-[180px] opacity-0"
          >
            View Projects
          </AnimatedButton>
          <AnimatedButton
            variant="ghost"
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="min-w-[180px] opacity-0"
          >
            Get in Touch
          </AnimatedButton>
        </div>
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <FloatingBackground parallaxIntensity={0.3} className="opacity-60" />
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
