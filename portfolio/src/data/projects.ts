import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'ai-chatbot-app',
    title: 'AI Chatbot App',
    shortDescription: 'Cross-platform AI chatbot with image generation and voice integration',
    fullDescription: 'A feature-rich Flutter application that provides conversational AI capabilities powered by Google Gemini. Users can engage in real-time chat conversations, generate AI images using multiple providers (DALL-E, Stable Diffusion, Hugging Face), and interact via voice with speech-to-text and text-to-speech functionality. The app includes persistent chat history, multiple AI personas, subscription-based premium features, and seamless cloud sync across devices.',
    heroImage: '/images/projects/ai-chatbot-hero.png',
    screenshots: [
      '/images/projects/ai-chatbot-chat.jpg',
      '/images/projects/ai-chatbot-image-gen.jpg',
      '/images/projects/ai-chatbot-settings.jpg',
      '/images/projects/ai-chatbot-subscription.jpg'
    ],
    techStack: [
      'Flutter',
      'Dart',
      'Firebase Auth',
      'Cloud Firestore',
      'Firebase Storage',
      'Google Gemini API',
      'OpenAI DALL-E',
      'Stability AI',
      'Hugging Face',
      'Cloudinary',
      'Provider',
      'Speech-to-Text',
      'Flutter TTS',
      'In-App Purchase'
    ],
    features: [
      'Real-time AI chat with Google Gemini',
      'AI image generation (DALL-E, Stable Diffusion)',
      'Voice input & text-to-speech responses',
      'Persistent chat history with cloud sync',
      'Multiple AI personas/characters',
      'Image upload and analysis',
      'Google Sign-In authentication',
      'Dark/light theme support',
      'Subscription system for premium features',
      'Offline capability with sync',
      'Cross-platform (Android, iOS, Web, Desktop)'
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=your.app.id',
    appStoreUrl: 'https://apps.apple.com/app/your-app-id',
    githubUrl: 'https://github.com/muneebexotic/ai_chatbot_app',
    startDate: '2024-01',
    endDate: '2024-06',
    isFeatured: true,
    category: 'Personal',
    metrics: {
      downloads: '1K+',
      rating: 4.5
    }
  },

  {
    id: 'neon-pulse-flappy-bird',
    title: 'Neon Pulse Flappy Bird',
    shortDescription: 'A cyberpunk-themed Flappy Bird game with neon effects, energy pulse mechanics, and global leaderboards.',
    fullDescription: 'Neon Pulse reimagines the classic Flappy Bird within a vibrant cyberpunk universe. Navigate through digital barriers and laser grids while using energy pulses to temporarily disable obstacles. Features progressive difficulty scaling, power-ups (Shield, Score Multiplier, Slow Motion), unlockable bird skins with unique particle trails, a real-time global leaderboard with Firebase, comprehensive accessibility support, and offline-first architecture with automatic score syncing.',
    heroImage: '/images/projects/neon-pulse-hero.png',
    screenshots: [
      '/images/projects/neon-pulse-menu.jpg',
      '/images/projects/neon-pulse-gameplay.jpg',
      '/images/projects/neon-pulse-shield.jpg',
      '/images/projects/neon-pulse-customization.jpg',
      '/images/projects/neon-pulse-leaderboard.jpg',
      '/images/projects/neon-pulse-achievements.jpg',
      '/images/projects/neon-pulse-settings.jpg'
    ],
    techStack: [
      'Flutter',
      'Dart',
      'Flame Engine',
      'Firebase Core',
      'Firebase Auth',
      'Cloud Firestore',
      'Google Sign-In',
      'Provider',
      'Audioplayers',
      'SharedPreferences',
      'Flutter Local Notifications',
      'Connectivity Plus'
    ],
    features: [
      'Cyberpunk aesthetic with neon glow effects and parallax backgrounds',
      'Energy pulse mechanic to disable obstacles temporarily',
      'Progressive difficulty with 3 obstacle types (Digital Barriers, Laser Grids, Floating Platforms)',
      'Power-up system: Shield, Score Multiplier, Slow Motion',
      'Unlockable bird skins with unique particle trail effects',
      'Real-time global leaderboard with Firebase',
      'Google Sign-In and guest authentication',
      'Achievement system with progression tracking',
      'Offline-first architecture with automatic score syncing',
      'Haptic feedback and vibration patterns',
      'Accessibility: High contrast, reduced motion, color blind support',
      'Adaptive quality management based on device performance',
      'Local notifications for achievements and milestones',
      'Cross-platform: Android, iOS, Web, Windows, macOS, Linux'
    ],
    playStoreUrl: '',  // Add when published
    appStoreUrl: '',   // Add when published
    githubUrl: '',     // Add if public
    startDate: '2024-01',
    endDate: '2025-11',
    isFeatured: true,
    category: 'Personal',
    metrics: {
      downloads: '10K+', rating: 4.5
    }
  },
  {
    id: 'covid19-tracker-flutter',
    title: 'COVID-19 Global Tracker',
    shortDescription: 'Real-time COVID-19 statistics tracker with interactive world map and data visualization.',
    fullDescription: 'A comprehensive Flutter application that provides real-time COVID-19 statistics from around the world. Features an interactive world map with heatmap visualization, country-wise detailed statistics, and beautiful data visualizations using pie charts and formatted metrics. The app supports dark/light themes, allows users to save favorite countries, and includes geolocation to show local statistics. Built with clean MVC architecture using GetX for state management.',
    heroImage: '/images/projects/covid19-tracker-hero.png',
    screenshots: [
      '/images/projects/covid19-tracker-home-light.jpg',
      '/images/projects/covid19-tracker-home-dark.jpg',
      '/images/projects/covid19-tracker-map.jpg',
      '/images/projects/covid19-tracker-map-filter.jpg',
      '/images/projects/covid19-tracker-map-four.jpg',
      '/images/projects/covid19-tracker-countries-light.jpg',
      '/images/projects/covid19-tracker-countries-dark.jpg',
      '/images/projects/covid19-tracker-country-detail-light.jpg',
      '/images/projects/covid19-tracker-favorites.jpg'
    ],
    techStack: [
      'Flutter',
      'Dart',
      'GetX',
      'Flutter Map',
      'FL Chart',
      'REST API',
      'Geolocator',
      'Cached Network Image',
      'Shimmer'
    ],
    features: [
      'Real-time global COVID-19 statistics',
      'Interactive world map with heatmap overlay',
      'Country-wise detailed statistics with risk levels',
      'Beautiful pie charts and data visualizations',
      'Dark/Light theme support',
      'Favorites system for quick access',
      'Search and filter countries',
      'Geolocation-based local stats',
      'Pull-to-refresh data updates',
      'Marker clustering for better map performance',
      'Animated UI transitions'
    ],
    playStoreUrl: '', 
    appStoreUrl: '',  
    githubUrl: 'https://github.com/muneebexotic/modern-covid19-tracker-app',     
    startDate: '2024-01',
    endDate: '2024-06',
    isFeatured: true,
    category: 'Personal',
    metrics: {
      // Add if available
    }
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
