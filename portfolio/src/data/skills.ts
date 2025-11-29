import { SkillCategory } from '@/types';

export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    skills: [
      { name: 'Dart', proficiency: 5 },
      { name: 'TypeScript', proficiency: 4 },
      { name: 'JavaScript', proficiency: 4 },
      { name: 'Python', proficiency: 3 },
      { name: 'Kotlin', proficiency: 3 },
      { name: 'Swift', proficiency: 2 },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { name: 'Flutter', proficiency: 5 },
      { name: 'React', proficiency: 4 },
      { name: 'Next.js', proficiency: 4 },
      { name: 'Riverpod', proficiency: 5 },
      { name: 'Bloc', proficiency: 4 },
      { name: 'GetX', proficiency: 4 },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Firebase', proficiency: 5 },
      { name: 'Git', proficiency: 5 },
      { name: 'Figma', proficiency: 4 },
      { name: 'VS Code', proficiency: 5 },
      { name: 'Android Studio', proficiency: 4 },
      { name: 'Xcode', proficiency: 3 },
      { name: 'Docker', proficiency: 3 },
    ],
  },
  {
    category: 'Concepts',
    skills: [
      { name: 'State Management', proficiency: 5 },
      { name: 'REST APIs', proficiency: 5 },
      { name: 'CI/CD', proficiency: 4 },
      { name: 'Clean Architecture', proficiency: 4 },
      { name: 'Unit Testing', proficiency: 4 },
      { name: 'Responsive Design', proficiency: 5 },
    ],
  },
];
