import { AboutData } from '@/types';

export const aboutData: AboutData = {
  name: 'Alex Chen',
  title: 'Flutter Developer',
  tagline: 'Building beautiful, performant mobile experiences',
  bio: `I'm a passionate Flutter developer with 6+ years of experience crafting 
cross-platform mobile applications. My journey into Flutter began in 2018, 
and I've been hooked ever since by its expressive UI toolkit and rapid 
development capabilities.

I specialize in building production-ready apps with clean architecture, 
robust state management, and pixel-perfect designs. From fintech to 
health tech, I've delivered apps that serve hundreds of thousands of users.

When I'm not coding, you'll find me contributing to open-source Flutter 
packages, writing technical articles, or exploring the latest in mobile 
development. I believe in writing code that's not just functional, but 
maintainable and delightful to work with.`,
  avatarUrl: '/images/avatar.jpg',
  avatarAlt: 'Alex Chen - Flutter Developer',
  socialLinks: [
    {
      platform: 'email',
      url: 'mailto:alex@example.com',
      label: 'Email me',
    },
    {
      platform: 'github',
      url: 'https://github.com/alexchen',
      label: 'GitHub Profile',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/alexchen',
      label: 'LinkedIn Profile',
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/alexchen_dev',
      label: 'Twitter/X Profile',
    },
  ],
  resumeUrl: '/resume.pdf',
};
