import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'fintrack-pro',
    title: 'FinTrack Pro',
    shortDescription:
      'Personal finance management app with expense tracking and budget insights.',
    fullDescription:
      'FinTrack Pro is a comprehensive personal finance app built with Flutter. Features include expense categorization, budget planning, financial goal tracking, and detailed analytics with beautiful charts. Supports multiple currencies and bank sync.',
    heroImage: '/images/projects/fintrack-hero.png',
    screenshots: [
      '/images/projects/fintrack-1.png',
      '/images/projects/fintrack-2.png',
      '/images/projects/fintrack-3.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'Riverpod', 'FL Chart'],
    features: [
      'Expense categorization with AI',
      'Budget planning and alerts',
      'Multi-currency support',
      'Bank sync integration',
      'Detailed financial reports',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fintrack',
    appStoreUrl: 'https://apps.apple.com/app/fintrack-pro/id123456789',
    githubUrl: 'https://github.com/username/fintrack-pro',
    startDate: '2023-06',
    endDate: '2024-01',
    isFeatured: true,
    category: 'Personal',
    metrics: {
      downloads: '50K+',
      rating: 4.8,
      users: '25K+ active users',
    },
  },
  {
    id: 'healthmate',
    title: 'HealthMate',
    shortDescription:
      'Health and fitness companion with workout tracking and meal planning.',
    fullDescription:
      'HealthMate helps users achieve their fitness goals with personalized workout plans, meal tracking, and progress analytics. Integrates with wearables for real-time health monitoring and provides AI-powered recommendations.',
    heroImage: '/images/projects/healthmate-hero.png',
    screenshots: [
      '/images/projects/healthmate-1.png',
      '/images/projects/healthmate-2.png',
      '/images/projects/healthmate-3.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'GetX', 'Health Connect'],
    features: [
      'Personalized workout plans',
      'Meal tracking with nutrition info',
      'Wearable device integration',
      'Progress analytics dashboard',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.healthmate',
    appStoreUrl: 'https://apps.apple.com/app/healthmate/id987654321',
    startDate: '2023-01',
    endDate: '2023-08',
    isFeatured: true,
    category: 'Client',
    metrics: {
      downloads: '100K+',
      rating: 4.6,
    },
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    shortDescription:
      'Collaborative task management app for teams with real-time sync.',
    fullDescription:
      'TaskFlow is a team productivity app featuring kanban boards, task assignments, deadline tracking, and real-time collaboration. Built with Flutter and Firebase for seamless cross-platform experience with offline support.',
    heroImage: '/images/projects/taskflow-hero.png',
    screenshots: [
      '/images/projects/taskflow-1.png',
      '/images/projects/taskflow-2.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'Bloc', 'Cloud Functions'],
    features: [
      'Kanban board interface',
      'Real-time collaboration',
      'Push notifications',
      'Offline mode support',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.taskflow',
    githubUrl: 'https://github.com/username/taskflow',
    startDate: '2022-09',
    endDate: '2023-02',
    isFeatured: true,
    category: 'Open Source',
    metrics: {
      downloads: '25K+',
      rating: 4.5,
    },
  },
  {
    id: 'shopease',
    title: 'ShopEase',
    shortDescription:
      'E-commerce mobile app with seamless shopping experience.',
    fullDescription:
      'ShopEase delivers a premium shopping experience with product discovery, wishlist management, secure checkout, and order tracking. Features include AR product preview and personalized recommendations.',
    heroImage: '/images/projects/shopease-hero.png',
    techStack: ['Flutter', 'Dart', 'REST API', 'Provider', 'Stripe'],
    features: [
      'AR product preview',
      'Secure payment integration',
      'Order tracking',
      'Personalized recommendations',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.shopease',
    appStoreUrl: 'https://apps.apple.com/app/shopease/id456789123',
    startDate: '2022-03',
    endDate: '2022-10',
    isFeatured: false,
    category: 'Freelance',
    metrics: {
      downloads: '75K+',
      rating: 4.4,
    },
  },
  {
    id: 'weathernow',
    title: 'WeatherNow',
    shortDescription:
      'Beautiful weather app with accurate forecasts and radar maps.',
    fullDescription:
      'WeatherNow provides hyperlocal weather forecasts with stunning visualizations. Features include hourly and 10-day forecasts, interactive radar maps, severe weather alerts, and customizable widgets.',
    heroImage: '/images/projects/weathernow-hero.png',
    techStack: ['Flutter', 'Dart', 'OpenWeather API', 'Riverpod'],
    features: [
      'Hyperlocal forecasts',
      'Interactive radar maps',
      'Severe weather alerts',
      'Home screen widgets',
    ],
    githubUrl: 'https://github.com/username/weathernow',
    startDate: '2022-01',
    endDate: '2022-04',
    isFeatured: false,
    category: 'Personal',
  },
  {
    id: 'notekeeper',
    title: 'NoteKeeper',
    shortDescription: 'Minimalist note-taking app with markdown support.',
    fullDescription:
      'NoteKeeper is a clean, distraction-free note-taking app with full markdown support, folder organization, cloud sync, and dark mode. Perfect for developers and writers who love markdown.',
    heroImage: '/images/projects/notekeeper-hero.png',
    techStack: ['Flutter', 'Dart', 'SQLite', 'Provider'],
    features: [
      'Full markdown support',
      'Folder organization',
      'Cloud sync',
      'Export to PDF/HTML',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.notekeeper',
    githubUrl: 'https://github.com/username/notekeeper',
    startDate: '2021-08',
    endDate: '2021-12',
    isFeatured: false,
    category: 'Open Source',
    metrics: {
      downloads: '10K+',
      rating: 4.7,
    },
  },
];
