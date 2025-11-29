import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * Handles conditional classes and resolves Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Truncates text to a specified character limit
 * Adds ellipsis if text exceeds the limit
 * @param text - The text to truncate
 * @param limit - Maximum number of characters
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit).trimEnd() + "...";
}

/**
 * Calculates estimated reading time for content
 * Based on average reading speed of 200 words per minute
 * @param content - The text content to analyze
 * @returns Reading time in minutes (minimum 1)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}
