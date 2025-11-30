"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/data/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { MobileNav } from "./mobile-nav";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * Header component - Premium floating design with glassmorphism
 * Features: Animated logo, magnetic nav items, glowing active states
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { mode } = useThemeMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = navigationLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => link.href.slice(1));

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentSection = "";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = `#${id}`;
            break;
          }
        }
      }

      if (!currentSection && window.scrollY < 100 && sectionIds.length > 0) {
        currentSection = `#${sectionIds[0]}`;
      }

      if (!currentSection && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentSection = `#${sectionIds[sectionIds.length - 1]}`;
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && isHomePage) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  const isGlass = mode === "glassmorphism";
  const isDark = mode === "dark";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div
        className={cn(
          "mx-auto max-w-5xl rounded-2xl transition-all duration-500",
          "border backdrop-blur-xl",
          // Light mode
          mode === "default" && [
            "bg-white/70 border-gray-200/50",
            "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
            isScrolled && "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          ],
          // Dark mode
          isDark && [
            "bg-slate-900/80 border-slate-700/50",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)]",
          ],
          // Glass mode
          isGlass && [
            "bg-white/10 border-white/20",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
          ]
        )}
      >
        <div className="h-16 px-6 flex items-center justify-between">
          {/* Animated Logo */}
          <Link href="/" className="group relative flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Logo glow effect */}
              <div
                className={cn(
                  "absolute -inset-2 rounded-lg opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100",
                  isDark && "bg-gradient-to-r from-blue-500/40 to-purple-500/40",
                  isGlass && "bg-gradient-to-r from-purple-500/40 to-pink-500/40",
                  mode === "default" && "bg-gradient-to-r from-blue-400/30 to-indigo-400/30"
                )}
              />
              <span
                className={cn(
                  "relative font-bold text-xl tracking-tight",
                  "bg-clip-text text-transparent",
                  isDark && "bg-gradient-to-r from-white via-blue-100 to-purple-200",
                  isGlass && "bg-gradient-to-r from-white via-purple-200 to-pink-200",
                  mode === "default" && "bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900"
                )}
              >
                Muneeb Creates
              </span>
              {/* Animated underline */}
              <motion.div
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 rounded-full",
                  isDark && "bg-gradient-to-r from-blue-500 to-purple-500",
                  isGlass && "bg-gradient-to-r from-purple-400 to-pink-400",
                  mode === "default" && "bg-gradient-to-r from-blue-500 to-indigo-500"
                )}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" aria-label="Main navigation">
            <ul className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5" role="menubar">
              {navigationLinks.map((link) => {
                const isExternal = !link.href.startsWith("#");
                const isActive = isExternal
                  ? pathname === link.href || pathname.startsWith(link.href + "/")
                  : activeSection === link.href;
                const isHovered = hoveredLink === link.href;

                const linkContent = (
                  <span
                    className={cn(
                      "relative z-10 px-4 py-2 text-sm font-medium rounded-lg block transition-colors duration-200",
                      isActive
                        ? cn(
                            isDark && "text-white",
                            isGlass && "text-white",
                            mode === "default" && "text-white"
                          )
                        : cn(
                            isDark && "text-slate-300 hover:text-white",
                            isGlass && "text-white/70 hover:text-white",
                            mode === "default" && "text-gray-600 hover:text-gray-900"
                          )
                    )}
                  >
                    {link.label}
                    {/* Active background - always visible for active item */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className={cn(
                          "absolute inset-0 rounded-lg -z-10",
                          isDark && "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25",
                          isGlass && "bg-gradient-to-r from-purple-500/80 to-pink-500/80 shadow-lg shadow-purple-500/25",
                          mode === "default" && "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25"
                        )}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover background - separate from active */}
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          "absolute inset-0 rounded-lg -z-10",
                          isDark && "bg-white/10",
                          isGlass && "bg-white/10",
                          mode === "default" && "bg-black/5"
                        )}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </span>
                );

                if (isExternal) {
                  return (
                    <li key={link.href} role="none">
                      <Link
                        href={link.href}
                        role="menuitem"
                        onMouseEnter={() => setHoveredLink(link.href)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                      >
                        {linkContent}
                      </Link>
                    </li>
                  );
                }

                const anchorHref = isHomePage ? link.href : `/${link.href}`;

                return (
                  <li key={link.href} role="none">
                    <a
                      href={anchorHref}
                      role="menuitem"
                      onClick={(e) => handleNavClick(e, link.href)}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    >
                      {linkContent}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Theme switcher with enhanced styling */}
            <div
              className={cn(
                "rounded-xl p-1 transition-colors",
                isDark && "bg-white/5 hover:bg-white/10",
                isGlass && "bg-white/10 hover:bg-white/15",
                mode === "default" && "bg-black/5 hover:bg-black/10"
              )}
            >
              <ThemeSwitcher />
            </div>
            <MobileNav activeSection={activeSection} onNavClick={handleNavClick} />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={cn(
            "h-px mx-6 rounded-full transition-opacity duration-300",
            isScrolled ? "opacity-100" : "opacity-0",
            isDark && "bg-gradient-to-r from-transparent via-blue-500/50 to-transparent",
            isGlass && "bg-gradient-to-r from-transparent via-purple-400/50 to-transparent",
            mode === "default" && "bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          )}
        />
      </div>
    </motion.header>
  );
}
