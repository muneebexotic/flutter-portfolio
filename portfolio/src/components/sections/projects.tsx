"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerItem,
  fadeInUp,
  reducedMotionStaggerItem,
  reducedMotionFadeIn,
} from "@/lib/animations";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { ProjectModal } from "@/components/shared/project-modal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { TiltCard } from "@/components/ui/tilt-card";
import { StaggeredList } from "@/components/ui/staggered-list";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

/**
 * Projects section component
 * Grid of ProjectCard components with featured projects at top
 * Progressive loading (3 initial, lazy load rest)
 * Desktop: click opens modal
 * Mobile: tap expands accordion
 * Requirements: 3.1, 3.6, 3.7, 3.8, 3.9
 */

export interface ProjectsProps {
  className?: string;
}

/**
 * Sort projects with featured projects first
 * Property 3: Featured Projects Ordering
 */
export function sortProjectsByFeatured(projectList: Project[]): Project[] {
  return [...projectList].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });
}

const INITIAL_PROJECTS_COUNT = 3;

function Projects({ className }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use reduced motion variants when user prefers reduced motion
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;
  const fadeVariants = prefersReducedMotion ? reducedMotionFadeIn : fadeInUp;

  // Sort projects with featured first
  const sortedProjects = useMemo(() => sortProjectsByFeatured(projects), []);

  // Progressive loading: show 3 initially, then all
  const visibleProjects = showAll
    ? sortedProjects
    : sortedProjects.slice(0, INITIAL_PROJECTS_COUNT);

  const hasMoreProjects = sortedProjects.length > INITIAL_PROJECTS_COUNT;

  const handleProjectClick = (project: Project) => {
    if (isMobile) {
      // Mobile: toggle accordion
      setExpandedProjectId(
        expandedProjectId === project.id ? null : project.id
      );
    } else {
      // Desktop: open modal
      setSelectedProject(project);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section
      id="projects"
      className={cn("px-4 py-20", className)}
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="A selection of my Flutter applications"
          id="projects-heading"
        />

        {/* Staggered entrance animations for project cards (Requirements: 5.4) */}
        <StaggeredList
          animation="fadeUp"
          staggerDelay={100}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout={!prefersReducedMotion}
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                className={isMobile ? "" : "h-full"}
              >
                {/* Apply TiltCard to project cards (Requirements: 4.1) */}
                <TiltCard
                  maxTilt={12}
                  scale={1.02}
                  perspective={1000}
                  className={isMobile ? "" : "h-full"}
                  enabled={!isMobile}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => handleProjectClick(project)}
                    className={isMobile ? "" : "h-full"}
                  />
                </TiltCard>
                
                {/* Mobile Accordion Content */}
                {isMobile && (
                  <AnimatePresence>
                    {expandedProjectId === project.id && (
                      <MobileProjectDetails project={project} />
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </StaggeredList>

        {/* Load More Button with AnimatedButton */}
        {hasMoreProjects && !showAll && (
          <motion.div
            className="mt-10 text-center"
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatedButton
              variant="secondary"
              size="lg"
              onClick={() => setShowAll(true)}
              className="border border-border"
            >
              Load More Projects
            </AnimatedButton>
          </motion.div>
        )}
      </div>

      {/* Desktop Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

/**
 * Mobile accordion details component
 * Shows expanded project details on mobile tap
 */
function MobileProjectDetails({ project }: { project: Project }) {
  const { fullDescription, features = [], techStack } = project;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-2 rounded-lg border border-border bg-card p-4">
        <p className="mb-4 text-sm text-muted-foreground">{fullDescription}</p>
        
        {features.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Key Features
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export { Projects };
