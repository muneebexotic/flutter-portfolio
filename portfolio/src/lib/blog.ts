import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types';
import { calculateReadingTime, truncateText } from './utils';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const POSTS_PER_PAGE = 6;

export interface BlogPostMeta extends BlogPost {
  content: string;
}

/**
 * Get all blog post slugs from the content directory
 */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
  
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get a single blog post by slug
 */
export function getBlogPost(slug: string): BlogPostMeta | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    title: truncateText(data.title || 'Untitled', 80),
    excerpt: truncateText(data.excerpt || '', 160),
    publishedDate: data.publishedDate || new Date().toISOString(),
    updatedDate: data.updatedDate,
    readingTime: calculateReadingTime(content),
    tags: (data.tags || []).slice(0, 5),
    coverImage: data.coverImage || '/images/blog/default-cover.jpg',
    isDraft: data.isDraft || false,
    content,
  };
}

/**
 * Get all blog posts sorted by date (newest first)
 * Excludes drafts in production
 */
export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getBlogSlugs();
  const posts = slugs
    .map((slug) => getBlogPost(slug))
    .filter((post): post is BlogPostMeta => {
      if (!post) return false;
      // Exclude drafts in production
      if (process.env.NODE_ENV === 'production' && post.isDraft) {
        return false;
      }
      return true;
    })
    .sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  
  return posts;
}

/**
 * Get paginated blog posts
 * @param page - Page number (1-indexed)
 * @returns Object with posts array and pagination info
 */
export function getPaginatedBlogPosts(page: number = 1): {
  posts: BlogPostMeta[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const allPosts = getAllBlogPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    totalPages,
    currentPage,
    totalPosts,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Get posts per page constant for testing
 */
export function getPostsPerPage(): number {
  return POSTS_PER_PAGE;
}
