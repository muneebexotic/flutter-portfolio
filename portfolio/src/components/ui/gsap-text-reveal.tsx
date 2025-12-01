"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface GsapTextRevealProps {
  text: string;
  className?: string;
  /** Show debug markers */
  markers?: boolean;
}

/**
 * GSAP ScrollTrigger text reveal component
 * Each word fades in and moves up as you scroll
 * The animation is "scrubbed" - tied directly to scroll position
 */
export function GsapTextReveal({ text, className, markers = false }: GsapTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || wordsRef.current.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Just show all words immediately
      wordsRef.current.forEach((word) => {
        gsap.set(word, { opacity: 1, y: 0 });
      });
      return;
    }

    // Create the scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1, // Smooth scrubbing tied to scroll
        markers: markers,
      },
    });

    // Animate each word with stagger
    tl.fromTo(
      wordsRef.current,
      {
        opacity: 0.2,
        y: 20,
        filter: "blur(4px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [text, markers]);

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) wordsRef.current[index] = el;
            }}
            className="inline-block opacity-20"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
