"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/data/navigation";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * Mobile navigation with premium hamburger menu and slide-in drawer
 */

interface MobileNavProps {
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function MobileNav({ activeSection, onNavClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { mode } = useThemeMode();

  const isGlass = mode === "glassmorphism";
  const isDark = mode === "dark";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setIsOpen(false);
      onNavClick(e, href);
    },
    [onNavClick]
  );

  return (
    <div className="md:hidden">
      {/* Premium Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative z-50 p-2.5 rounded-xl transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDark && "hover:bg-white/10",
          isGlass && "hover:bg-white/15",
          mode === "default" && "hover:bg-black/5"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
            className={cn(
              "block h-0.5 rounded-full origin-center",
              isDark && "bg-white",
              isGlass && "bg-white",
              mode === "default" && "bg-gray-800"
            )}
          />
          <motion.span
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className={cn(
              "block h-0.5 w-3.5 rounded-full",
              isDark && "bg-white",
              isGlass && "bg-white",
              mode === "default" && "bg-gray-800"
            )}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -7, width: 20 } : { rotate: 0, y: 0, width: 14 }}
            className={cn(
              "block h-0.5 rounded-full origin-center",
              isDark && "bg-white",
              isGlass && "bg-white",
              mode === "default" && "bg-gray-800"
            )}
          />
        </div>
      </motion.button>

      {/* Backdrop with blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-0 z-40 backdrop-blur-md",
              isDark && "bg-slate-900/60",
              isGlass && "bg-black/40",
              mode === "default" && "bg-white/60"
            )}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Premium Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-nav-drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-40 h-full w-72",
              "pt-24 px-6 border-l backdrop-blur-xl",
              isDark && "bg-slate-900/90 border-slate-700/50",
              isGlass && "bg-black/30 border-white/10",
              mode === "default" && "bg-white/90 border-gray-200/50"
            )}
            aria-label="Mobile navigation"
          >
            {/* Decorative gradient */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30",
                isDark && "bg-blue-500",
                isGlass && "bg-purple-500",
                mode === "default" && "bg-blue-400"
              )}
            />

            <ul className="relative flex flex-col gap-2">
              {navigationLinks.map((link, index) => {
                const isExternal = !link.href.startsWith("#");
                const isActive = isExternal
                  ? pathname === link.href || pathname.startsWith(link.href + "/")
                  : activeSection === link.href;

                const linkStyles = cn(
                  "block px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? cn(
                        isDark && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20",
                        isGlass && "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/20",
                        mode === "default" && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                      )
                    : cn(
                        isDark && "text-slate-300 hover:bg-white/10 hover:text-white",
                        isGlass && "text-white/70 hover:bg-white/10 hover:text-white",
                        mode === "default" && "text-gray-600 hover:bg-black/5 hover:text-gray-900"
                      )
                );

                if (isExternal) {
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={linkStyles}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                }

                const anchorHref = isHomePage ? link.href : `/${link.href}`;

                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <a
                      href={anchorHref}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={linkStyles}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {/* Bottom decorative element */}
            <div className="absolute bottom-8 left-6 right-6">
              <div
                className={cn(
                  "h-px rounded-full",
                  isDark && "bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent",
                  isGlass && "bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-transparent",
                  mode === "default" && "bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-transparent"
                )}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
