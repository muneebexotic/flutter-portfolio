export { Hero } from "./hero";
export { About } from "./about";
export { Projects, sortProjectsByFeatured } from "./projects";
export { Skills, validateSkillCategories, EXPECTED_CATEGORIES } from "./skills";
export { Experience, sortExperiencesByDate } from "./experience";
export { Contact } from "./contact";

// Skeleton loading components for code splitting
export {
  HeroSkeleton,
  AboutSkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
  ContactSkeleton,
} from "./skeletons";
