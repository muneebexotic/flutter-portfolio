import { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    id: 'senior-flutter-dev',
    company: 'TechCorp Solutions',
    role: 'Senior Flutter Developer',
    startDate: '2023-03',
    location: 'San Francisco, CA (Remote)',
    achievements: [
      'Led development of flagship mobile app serving 500K+ users',
      'Architected scalable state management solution using Riverpod',
      'Reduced app startup time by 40% through performance optimization',
      'Mentored team of 4 junior developers on Flutter best practices',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'Riverpod', 'GitHub Actions'],
  },
  {
    id: 'flutter-dev',
    company: 'MobileFirst Inc.',
    role: 'Flutter Developer',
    startDate: '2021-06',
    endDate: '2023-02',
    location: 'Austin, TX',
    achievements: [
      'Developed 5 production apps from concept to App Store release',
      'Integrated complex payment systems using Stripe and PayPal',
      'Built reusable component library used across 3 projects',
      'Collaborated with design team to implement pixel-perfect UIs',
    ],
    technologies: ['Flutter', 'Dart', 'REST APIs', 'Bloc', 'SQLite'],
  },
  {
    id: 'mobile-dev',
    company: 'StartupHub',
    role: 'Mobile Developer',
    startDate: '2019-08',
    endDate: '2021-05',
    location: 'New York, NY',
    achievements: [
      'Transitioned team from native development to Flutter',
      'Reduced codebase by 50% by consolidating iOS and Android apps',
      'Implemented real-time features using Firebase Firestore',
      'Achieved 4.5+ star rating on both app stores',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'Kotlin'],
  },
  {
    id: 'junior-dev',
    company: 'Digital Agency Co.',
    role: 'Junior Mobile Developer',
    startDate: '2018-01',
    endDate: '2019-07',
    location: 'Boston, MA',
    achievements: [
      'Built native Android apps using Kotlin and Java',
      'Learned Flutter and delivered first cross-platform project',
      'Participated in agile development with 2-week sprints',
      'Contributed to open-source Flutter packages',
    ],
    technologies: ['Android', 'Kotlin', 'Java', 'Flutter', 'Git'],
  },
];
