"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * PhoneFrame component - Custom SVG phone frame with 9:19.5 aspect ratio
 * Supports light/dark theme variants
 * Uses next/image for screenshot
 * Requirements: 3.1, 16.1
 */

export interface PhoneFrameProps {
  screenshot: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

function PhoneFrame({ screenshot, alt, className, priority = false }: PhoneFrameProps) {
  // 9:19.5 aspect ratio = 0.4615 (width/height)
  // Using 270x585 as base dimensions (270/585 ≈ 0.4615)
  
  return (
    <div
      className={cn(
        "relative inline-block",
        className
      )}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* Screenshot Image - rendered first (behind frame) with theme-aware treatments (Requirements: 7.3) */}
      <div className="image-container absolute inset-0 overflow-hidden rounded-[28px] m-[4.4%]">
        <Image
          src={screenshot}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      {/* Phone Frame SVG - rendered on top with transparent screen area */}
      <svg
        viewBox="0 0 270 585"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-10 h-full w-full pointer-events-none"
        aria-hidden="true"
      >
        {/* Frame border using path with hole for screen */}
        <defs>
          <mask id="frameMask">
            <rect width="270" height="585" fill="white" />
            <rect x="12" y="12" width="246" height="561" rx="28" fill="black" />
          </mask>
        </defs>
        
        {/* Outer frame with mask to create hole */}
        <rect
          x="2"
          y="2"
          width="266"
          height="581"
          rx="36"
          className="fill-card stroke-border"
          strokeWidth="4"
          mask="url(#frameMask)"
        />
        
        {/* Top notch/dynamic island */}
        <rect
          x="95"
          y="18"
          width="80"
          height="24"
          rx="12"
          className="fill-foreground/10"
        />
        
        {/* Side buttons - Volume */}
        <rect
          x="0"
          y="120"
          width="3"
          height="30"
          rx="1.5"
          className="fill-border"
        />
        <rect
          x="0"
          y="160"
          width="3"
          height="30"
          rx="1.5"
          className="fill-border"
        />
        
        {/* Side button - Power */}
        <rect
          x="267"
          y="140"
          width="3"
          height="50"
          rx="1.5"
          className="fill-border"
        />
        
        {/* Bottom home indicator */}
        <rect
          x="100"
          y="555"
          width="70"
          height="5"
          rx="2.5"
          className="fill-foreground/20"
        />
      </svg>
    </div>
  );
}

export { PhoneFrame };
