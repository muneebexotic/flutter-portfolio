"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  reducedMotionStaggerContainer,
  reducedMotionStaggerItem,
  reducedMotionFadeIn,
} from "@/lib/animations";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { ProjectModal } from "@/components/shared/project-modal";
import { Button } from "@/components/ui/button";
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
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
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

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
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
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  className="h-full"
                />
                
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
        </motion.div>

        {/* Load More Button */}
        {hasMoreProjects && !showAll && (
          <motion.div
            className="mt-10 text-center"
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
            >
              Load More Projects
            </Button>
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
