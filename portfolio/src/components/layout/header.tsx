"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/data/navigation";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

/**
 * Header component with sticky behavior after 200px scroll
 * Requirements: 9.2, 9.4
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Handle scroll to show/hide sticky header after 200px
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const sections = navigationLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50",
            "bg-background/80 backdrop-blur-md border-b border-border",
            "h-[var(--header-height)]"
          )}
        >
          <div className="container mx-auto h-full px-4 flex items-center justify-between max-w-[var(--container-max)]">
            {/* Logo/Name */}
            <a
              href="#"
              className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Portfolio
            </a>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              <ul className="flex items-center gap-1" role="menubar">
                {navigationLinks.map((link) => (
                  <li key={link.href} role="none">
                    <a
                      href={link.href}
                      role="menuitem"
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        activeSection === link.href
                          ? "text-primary bg-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right side: Theme toggle + Mobile nav */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <MobileNav
                activeSection={activeSection}
                onNavClick={handleNavClick}
              />
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
