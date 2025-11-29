// Project Interface - Requirements 15.1, 15.2, 15.3
export interface Project {
  id: string;
  title: string; // Max 60 characters
  shortDescription: string; // Max 120 characters (card view)
  fullDescription: string; // Max 500 characters (modal view)
  heroImage: string; // Primary screenshot path
  screenshots?: string[]; // 3-5 additional screenshots
  techStack: string[]; // Technology names
  features?: string[]; // 3-5 key features
  playStoreUrl?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  startDate?: string; // ISO format: "2024-01"
  endDate?: string; // ISO format or "Present"
  isFeatured: boolean;
  category?: 'Personal' | 'Client' | 'Open Source' | 'Freelance';
  metrics?: {
    downloads?: string; // e.g., "10K+"
    rating?: number; // 1-5
    users?: string; // e.g., "5K+ active users"
  };
}

// Skill Interface - Requirements 15.4
export interface Skill {
  name: string;
  proficiency: 1 | 2 | 3 | 4 | 5; // 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
}

export interface SkillCategory {
  category:
    | 'Languages'
    | 'Frameworks & Libraries'
    | 'Tools & Platforms'
    | 'Concepts';
  skills: Skill[];
}

// Experience Interface - Requirements 15.5
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string; // ISO format
  endDate?: string; // ISO format or undefined for current
  location?: string;
  achievements: string[]; // Bullet points
  technologies?: string[];
}


// Blog Post Interface (Optional feature)
export interface BlogPost {
  slug: string;
  title: string; // Max 80 characters
  excerpt: string; // Max 160 characters
  publishedDate: string; // ISO format
  updatedDate?: string;
  readingTime: number; // Minutes
  tags: string[]; // Max 5 tags
  coverImage: string;
  isDraft: boolean;
}

// Contact Form Types - Requirements 7.1, 7.5
export interface ContactFormData {
  name: string; // 2-50 chars, letters/spaces only
  email: string; // Valid email format
  message: string; // 10-1000 characters
  honeypot: string; // Must be empty (bot detection)
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export interface ContactFormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errors: FormErrors;
}

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
}

// About Types
export interface AboutData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  avatarAlt: string;
  socialLinks: SocialLink[];
  resumeUrl?: string;
}

export interface SocialLink {
  platform: 'email' | 'github' | 'linkedin' | 'twitter' | 'resume';
  url: string;
  label: string;
}
