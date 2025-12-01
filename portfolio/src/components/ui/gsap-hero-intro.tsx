"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export interface GsapHeroIntroProps {
  name: string;
  title: string;
  tagline: string;
  className?: string;
  onAnimationComplete?: () => void;
}

/**
 * GSAP-powered cinematic hero intro
 * Features: split text animation, staggered reveals, smooth easing
 */
export function GsapHeroIntro({
  name,
  title,
  tagline,
  className,
  onAnimationComplete,
}: GsapHeroIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      // Show everything immediately
      gsap.set([nameRef.current, titleRef.current, taglineRef.current, lineRef.current], {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
      });
      onAnimationComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: onAnimationComplete,
      });

      // Split name into characters for individual animation
      const nameChars = nameRef.current?.querySelectorAll(".char") ?? [];
      const titleWords = titleRef.current?.querySelectorAll(".word") ?? [];
      const taglineWords = taglineRef.current?.querySelectorAll(".word") ?? [];

      if (!nameChars.length) return;

      // Initial states
      gsap.set(nameChars, { y: 100, opacity: 0, rotateX: -90 });
      gsap.set(titleWords, { y: 40, opacity: 0 });
      gsap.set(taglineWords, { y: 30, opacity: 0, filter: "blur(10px)" });
      gsap.set(lineRef.current, { scaleX: 0 });

      // Animate name characters with 3D flip
      tl.to(nameChars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
      });

      // Animate decorative line
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.inOut",
      }, "-=0.4");

      // Animate title words
      tl.to(titleWords, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
      }, "-=0.3");

      // Animate tagline with blur reveal
      tl.to(taglineWords, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.04,
      }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, [name, title, tagline, onAnimationComplete]);

  // Split text into spans for animation
  const splitIntoChars = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ willChange: "transform, opacity" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const splitIntoWords = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        className="word inline-block mr-[0.3em]"
        style={{ willChange: "transform, opacity, filter" }}
      >
        {word}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={cn("text-center", className)}>
      {/* Name with character animation */}
      <h1
        ref={nameRef}
        className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl overflow-hidden py-2"
        style={{ perspective: "1000px" }}
      >
        {splitIntoChars(name)}
      </h1>

      {/* Decorative animated line */}
      <div className="flex justify-center my-4">
        <div
          ref={lineRef}
          className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full origin-center"
        />
      </div>

      {/* Title with word animation */}
      <p
        ref={titleRef}
        className="text-xl font-medium text-primary sm:text-2xl md:text-3xl overflow-hidden py-1"
      >
        {splitIntoWords(title)}
      </p>

      {/* Tagline with blur reveal */}
      <p
        ref={taglineRef}
        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl overflow-hidden py-1"
      >
        {splitIntoWords(tagline)}
      </p>
    </div>
  );
}
