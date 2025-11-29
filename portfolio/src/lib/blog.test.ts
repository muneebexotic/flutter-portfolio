import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { truncateText } from './utils';

/**
 * Feature: flutter-portfolio, Property 8: Blog Pagination
 * For any array of blog posts with length greater than 6, the blog listing page
 * SHALL display exactly 6 posts per page with pagination controls.
 * Validates: Requirements 6.1
 */
describe('Property 8: Blog Pagination', () => {
  const POSTS_PER_PAGE = 6;

  // Helper function to simulate pagination logic
  function paginatePosts<T>(posts: T[], page: number): { posts: T[]; totalPages: number } {
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return {
      posts: posts.slice(startIndex, endIndex),
      totalPages,
    };
  }

  it('should return at most 6 posts per page for any array of posts', () => {
    fc.assert(
      fc.property(
        // Generate arrays of 0-50 posts
        fc.array(fc.record({ id: fc.uuid(), title: fc.string() }), { minLength: 0, maxLength: 50 }),
        // Generate page numbers 1-20
        fc.integer({ min: 1, max: 20 }),
        (posts, page) => {
          const result = paginatePosts(posts, page);
          
          // Each page should have at most POSTS_PER_PAGE posts
          expect(result.posts.length).toBeLessThanOrEqual(POSTS_PER_PAGE);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate correct total pages for any number of posts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (postCount) => {
          const posts = Array.from({ length: postCount }, (_, i) => ({ id: i }));
          const result = paginatePosts(posts, 1);
          
          const expectedTotalPages = Math.ceil(postCount / POSTS_PER_PAGE);
          expect(result.totalPages).toBe(expectedTotalPages || 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return exactly 6 posts for full pages when posts > 6', () => {
    fc.assert(
      fc.property(
        // Generate arrays with more than 6 posts
        fc.array(fc.record({ id: fc.uuid() }), { minLength: 7, maxLength: 50 }),
        fc.integer({ min: 1, max: 5 }),
        (posts, page) => {
          const result = paginatePosts(posts, page);
          const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
          
          // If not the last page, should have exactly 6 posts
          if (page < totalPages) {
            expect(result.posts.length).toBe(POSTS_PER_PAGE);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of exactly 6 posts (single page)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (page) => {
          const posts = Array.from({ length: 6 }, (_, i) => ({ id: i }));
          const result = paginatePosts(posts, page);
          
          // Should always return all 6 posts on page 1
          expect(result.totalPages).toBe(1);
          expect(result.posts.length).toBe(6);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: flutter-portfolio, Property 9: Blog Post Truncation
 * For any blog post with title exceeding 80 characters or excerpt exceeding 160 characters,
 * the rendered blog card SHALL truncate to the respective limits.
 * Validates: Requirements 6.2
 */
describe('Property 9: Blog Post Truncation', () => {
  const TITLE_LIMIT = 80;
  const EXCERPT_LIMIT = 160;

  it('should truncate titles exceeding 80 characters', () => {
    fc.assert(
      fc.property(
        // Generate strings of various lengths
        fc.string({ minLength: 1, maxLength: 200 }),
        (title) => {
          const truncated = truncateText(title, TITLE_LIMIT);
          
          if (title.length <= TITLE_LIMIT) {
            // Should not truncate if within limit
            expect(truncated).toBe(title);
          } else {
            // Should truncate and add ellipsis
            expect(truncated.length).toBeLessThanOrEqual(TITLE_LIMIT + 3); // +3 for "..."
            expect(truncated.endsWith('...')).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should truncate excerpts exceeding 160 characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        (excerpt) => {
          const truncated = truncateText(excerpt, EXCERPT_LIMIT);
          
          if (excerpt.length <= EXCERPT_LIMIT) {
            expect(truncated).toBe(excerpt);
          } else {
            expect(truncated.length).toBeLessThanOrEqual(EXCERPT_LIMIT + 3);
            expect(truncated.endsWith('...')).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve content up to the limit before truncation', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: TITLE_LIMIT + 1, maxLength: 200 }),
        (title) => {
          const truncated = truncateText(title, TITLE_LIMIT);
          
          // The truncated content (minus ellipsis) should be a prefix of the original
          const contentWithoutEllipsis = truncated.replace(/\.{3}$/, '').trimEnd();
          expect(title.startsWith(contentWithoutEllipsis)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty strings', () => {
    expect(truncateText('', TITLE_LIMIT)).toBe('');
    expect(truncateText('', EXCERPT_LIMIT)).toBe('');
  });

  it('should handle strings exactly at the limit', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(TITLE_LIMIT, EXCERPT_LIMIT),
        (limit) => {
          const exactString = 'a'.repeat(limit);
          const truncated = truncateText(exactString, limit);
          
          // Should not truncate if exactly at limit
          expect(truncated).toBe(exactString);
          expect(truncated.length).toBe(limit);
        }
      ),
      { numRuns: 10 }
    );
  });
});
