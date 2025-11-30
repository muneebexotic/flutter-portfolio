"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Unified Theme Switcher component with dropdown for selecting themes
 * Controls both next-themes (light/dark) and visual mode (glassmorphism)
 * Implements keyboard navigation and ARIA accessibility
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

type UnifiedTheme = "light" | "dark" | "glass";

interface ThemeSwitcherProps {
  className?: string;
}

interface ThemeOption {
  value: UnifiedTheme;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: <SunIcon className="w-4 h-4" />,
    description: "Clean, light appearance",
  },
  {
    value: "dark",
    label: "Dark",
    icon: <MoonIcon className="w-4 h-4" />,
    description: "Dark mode",
  },
  {
    value: "glass",
    label: "Glass",
    icon: <GlassIcon className="w-4 h-4" />,
    description: "Frosted glass aesthetic",
  },
];

const UNIFIED_THEME_KEY = "portfolio-unified-theme";

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [unifiedTheme, setUnifiedTheme] = useState<UnifiedTheme>("light");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Initialize from localStorage and sync with next-themes
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(UNIFIED_THEME_KEY) as UnifiedTheme | null;
    if (stored && ["light", "dark", "glass"].includes(stored)) {
      setUnifiedTheme(stored);
      applyTheme(stored);
    } else if (resolvedTheme) {
      // Fallback to next-themes resolved theme
      const initial = resolvedTheme === "dark" ? "dark" : "light";
      setUnifiedTheme(initial);
    }
  }, [resolvedTheme]);

  const applyTheme = useCallback((theme: UnifiedTheme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("theme-glass");
    
    // Apply the appropriate theme
    if (theme === "light") {
      setTheme("light");
    } else if (theme === "dark") {
      setTheme("dark");
    } else if (theme === "glass") {
      setTheme("dark"); // Glass is dark-based
      root.classList.add("theme-glass");
    }
  }, [setTheme]);

  const currentOption = themeOptions.find((opt) => opt.value === unifiedTheme) || themeOptions[0];
  const currentIndex = themeOptions.findIndex((opt) => opt.value === unifiedTheme);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management when dropdown opens
  useEffect(() => {
    if (isOpen && listRef.current) {
      setFocusedIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback((value: UnifiedTheme) => {
    setUnifiedTheme(value);
    localStorage.setItem(UNIFIED_THEME_KEY, value);
    applyTheme(value);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  }, [applyTheme]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(themeOptions[focusedIndex].value);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < themeOptions.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : themeOptions.length - 1));
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(themeOptions.length - 1);
        }
        break;
    }
  }, [isOpen, focusedIndex, handleSelect]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("relative", className)}>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "text-sm font-medium text-muted-foreground"
          )}
          aria-label="Theme selector loading"
        >
          <div className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
          <ChevronIcon className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm font-medium transition-all duration-200",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-foreground/5",
          "focus-visible:outline-none focus-visible:text-foreground focus-visible:bg-foreground/5",
          isOpen && "text-foreground bg-foreground/5"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Theme: ${currentOption.label}. Click to change theme`}
        data-testid="theme-switcher-trigger"
      >
        <span className="text-foreground" aria-hidden="true">
          {currentOption.icon}
        </span>
        <span className="hidden sm:inline text-foreground">{currentOption.label}</span>
        <ChevronIcon
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-2 z-50",
              "min-w-[200px] p-2 rounded-xl",
              "bg-background/95 backdrop-blur-xl",
              "border border-border/50 shadow-xl shadow-black/20",
              "origin-top-right"
            )}
          >
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Theme options"
              aria-activedescendant={
                focusedIndex >= 0 ? `theme-option-${themeOptions[focusedIndex].value}` : undefined
              }
              className="space-y-1"
              data-testid="theme-switcher-options"
            >
              {themeOptions.map((option, index) => {
                const isSelected = option.value === unifiedTheme;
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`theme-option-${option.value}`}
                    role="option"
                    aria-selected={isSelected}
                    data-testid={`theme-option-${option.value}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                      "transition-all duration-150",
                      "focus:outline-none",
                      isSelected && "bg-primary/15 text-primary",
                      isFocused && !isSelected && "bg-foreground/5",
                      !isSelected && !isFocused && "hover:bg-foreground/5"
                    )}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Icon Components
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function GlassIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export { themeOptions };
export type { ThemeOption, UnifiedTheme };
