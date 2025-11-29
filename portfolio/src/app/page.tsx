import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import {
  AboutSkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
  ContactSkeleton,
} from "@/components/sections/skeletons";

/**
 * Dynamic imports for below-fold sections with loading skeletons
 * Code splitting to reduce initial bundle size
 * Requirements: 10.7, 10.8
 */

const About = dynamic(() => import("@/components/sections/about").then((mod) => mod.About), {
  loading: () => <AboutSkeleton />,
  ssr: true,
});

const Projects = dynamic(
  () => import("@/components/sections/projects").then((mod) => mod.Projects),
  {
    loading: () => <ProjectsSkeleton />,
    ssr: true,
  }
);

const Skills = dynamic(() => import("@/components/sections/skills").then((mod) => mod.Skills), {
  loading: () => <SkillsSkeleton />,
  ssr: true,
});

const Experience = dynamic(
  () => import("@/components/sections/experience").then((mod) => mod.Experience),
  {
    loading: () => <ExperienceSkeleton />,
    ssr: true,
  }
);

const Contact = dynamic(
  () => import("@/components/sections/contact").then((mod) => mod.Contact),
  {
    loading: () => <ContactSkeleton />,
    ssr: true,
  }
);

/**
 * Homepage with all portfolio sections
 * Hero is loaded immediately (above the fold)
 * Other sections are dynamically imported with loading skeletons
 */
export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      {/* Hero section - loaded immediately (above the fold) */}
      <Hero />
      
      {/* Below-fold sections - dynamically imported */}
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
