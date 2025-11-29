import { aboutData } from "@/data/about";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/**
 * Person Schema for the about section
 * Provides structured data about the portfolio owner
 */
export function PersonJsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: aboutData.name,
    jobTitle: aboutData.title,
    description: aboutData.tagline,
    url: siteUrl,
    image: `${siteUrl}${aboutData.avatarUrl}`,
    sameAs: aboutData.socialLinks
      .filter((link) => link.platform !== "email")
      .map((link) => link.url),
    knowsAbout: [
      "Flutter",
      "Dart",
      "Mobile Development",
      "Firebase",
      "Cross-platform Development",
      "iOS Development",
      "Android Development",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

/**
 * WebSite Schema for the homepage
 * Provides structured data about the website
 */
export function WebSiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${aboutData.name} Portfolio`,
    url: siteUrl,
    description: `Portfolio showcasing ${aboutData.title} projects and expertise. ${aboutData.tagline}`,
    author: {
      "@type": "Person",
      name: aboutData.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}

/**
 * BreadcrumbList Schema for blog pages
 * Provides navigation structure for search engines
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

/**
 * BlogPosting Schema for individual blog posts
 * Provides structured data for blog articles
 */
export function BlogPostJsonLd({
  title,
  description,
  publishedDate,
  updatedDate,
  coverImage,
  slug,
}: {
  title: string;
  description: string;
  publishedDate: string;
  updatedDate?: string;
  coverImage: string;
  slug: string;
}) {
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: coverImage.startsWith("http")
      ? coverImage
      : `${siteUrl}${coverImage}`,
    datePublished: publishedDate,
    dateModified: updatedDate || publishedDate,
    author: {
      "@type": "Person",
      name: aboutData.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: aboutData.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
    />
  );
}

/**
 * Combined JSON-LD for the homepage
 * Includes Person and WebSite schemas
 */
export function HomePageJsonLd() {
  return (
    <>
      <PersonJsonLd />
      <WebSiteJsonLd />
    </>
  );
}
