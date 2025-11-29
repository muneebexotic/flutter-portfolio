"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/data/navigation";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

/**
 * Header component - always visible with blur effect on scroll
 * Requirements: 9.2, 9.4
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Handle scroll for background blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section highlighting (only on homepage)
  useEffect(() => {
    if (!isHomePage) return;

    const sections = navigationLinks
      .filter((link) => link.href.startsWith("#"))
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
  }, [isHomePage]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Only handle anchor links on homepage
    if (href.startsWith("#") && isHomePage) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "h-[var(--header-height)]",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between max-w-[var(--container-max)]">
        {/* Logo/Name */}
        <Link
          href="/"
          className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
        >
          Portfolio
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-1" role="menubar">
            {navigationLinks.map((link) => {
              const isExternal = !link.href.startsWith("#");
              const isActive = isExternal
                ? pathname === link.href || pathname.startsWith(link.href + "/")
                : activeSection === link.href;

              if (isExternal) {
                return (
                  <li key={link.href} role="none">
                    <Link
                      href={link.href}
                      role="menuitem"
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "text-primary bg-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }

              // For anchor links, use regular <a> on homepage, Link to homepage with hash otherwise
              const anchorHref = isHomePage ? link.href : `/${link.href}`;

              return (
                <li key={link.href} role="none">
                  <a
                    href={anchorHref}
                    role="menuitem"
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
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
  );
}
