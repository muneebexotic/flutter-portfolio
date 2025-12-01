"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseGsapScrollTriggerOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Custom hook for GSAP ScrollTrigger animations
 * Handles cleanup automatically on unmount
 */
export function useGsapScrollTrigger<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const createScrollAnimation = (
    targets: gsap.TweenTarget,
    vars: gsap.TweenVars,
    scrollTriggerOptions: UseGsapScrollTriggerOptions = {}
  ) => {
    const {
      trigger = containerRef.current,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      pin = false,
      markers = false,
      ...callbacks
    } = scrollTriggerOptions;

    return gsap.to(targets, {
      ...vars,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        pin,
        markers,
        ...callbacks,
      },
    });
  };

  const createTimeline = (scrollTriggerOptions: UseGsapScrollTriggerOptions = {}) => {
    const {
      trigger = containerRef.current,
      start = "top 80%",
      end = "bottom 20%",
      scrub = 1,
      pin = false,
      markers = false,
      ...callbacks
    } = scrollTriggerOptions;

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        pin,
        markers,
        ...callbacks,
      },
    });

    return timelineRef.current;
  };

  return {
    containerRef,
    createScrollAnimation,
    createTimeline,
    gsap,
    ScrollTrigger,
  };
}
