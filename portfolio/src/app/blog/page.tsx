import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedBlogPosts } from '@/lib/blog';
import { truncateText } from '@/lib/utils';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles about Flutter development, mobile apps, and software engineering.',
};

interface BlogPageProps {
  searchParams: { page?: string };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const { posts, totalPages, currentPage, hasNextPage, hasPrevPage } = getPaginatedBlogPosts(page);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="min-h-screen bg-background pt-[calc(var(--header-height)+2rem)] pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Technical articles about Flutter development, mobile apps, and software engineering.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
    </>
  );
}


interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedDate: string;
    readingTime: number;
    coverImage: string;
    tags: string[];
  };
}

function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {truncateText(post.title, 80)}
          </h2>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {truncateText(post.excerpt, 160)}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <time dateTime={post.publishedDate}>{formattedDate}</time>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationProps) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Blog pagination">
      <Link
        href={hasPrevPage ? `/blog?page=${currentPage - 1}` : '#'}
        className={`rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors ${
          hasPrevPage
            ? 'hover:border-primary hover:text-primary'
            : 'pointer-events-none opacity-50'
        }`}
        aria-disabled={!hasPrevPage}
      >
        Previous
      </Link>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={hasNextPage ? `/blog?page=${currentPage + 1}` : '#'}
        className={`rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors ${
          hasNextPage
            ? 'hover:border-primary hover:text-primary'
            : 'pointer-events-none opacity-50'
        }`}
        aria-disabled={!hasNextPage}
      >
        Next
      </Link>
    </nav>
  );
}
