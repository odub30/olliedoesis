// src/lib/seoHelpers.ts
// SEO metadata helpers for blog posts

import { Metadata } from "next";
import { BlogPost, PrimaryCategory } from "./blogMetadata";

// Base site configuration
const SITE_CONFIG = {
  name: "Ollie Doesis",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://olliedoesis.com",
  author: "Ollie",
  description: "Articles and insights on web development, performance optimization, and modern tech stacks",
  social: {
    twitter: "@olliedoesis",
  }
};

/**
 * Generate complete metadata for a blog post page
 */
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const postUrl = `${SITE_CONFIG.url}/articles/${post.slug}`;
  const imageUrl = `${SITE_CONFIG.url}/og-images/${post.slug}.png`; // You can implement OG image generation

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: [...post.tags, post.category],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedDate,
      modifiedTime: post.lastUpdated,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: SITE_CONFIG.social.twitter,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

/**
 * Generate JSON-LD schema for a blog post (Article schema)
 */
export function generateArticleSchema(post: BlogPost) {
  const postUrl = `${SITE_CONFIG.url}/articles/${post.slug}`;
  const imageUrl = `${SITE_CONFIG.url}/og-images/${post.slug}.png`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": SITE_CONFIG.url
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/logo.png`
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.lastUpdated,
    "image": imageUrl,
    "url": postUrl,
    "mainEntityOfPage": postUrl,
    "keywords": post.tags.join(", "),
    "articleSection": post.category,
    "wordCount": post.readTime * 200, // Approximate word count
    "timeRequired": `PT${post.readTime}M`,
    ...(post.githubRepo && {
      "sameAs": [post.githubRepo]
    })
  };
}

/**
 * Generate metadata for articles listing page
 */
export function generateArticlesListingMetadata(): Metadata {
  return {
    title: "Articles - Web Development & Tech Insights",
    description: SITE_CONFIG.description,
    openGraph: {
      title: "Articles - Web Development & Tech Insights",
      description: SITE_CONFIG.description,
      type: "website",
      url: `${SITE_CONFIG.url}/articles`,
    },
    twitter: {
      card: "summary",
      title: "Articles - Web Development & Tech Insights",
      description: SITE_CONFIG.description,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  category: PrimaryCategory,
  postCount: number
): Metadata {
  const categorySlug = categoryToSlug(category);
  const categoryUrl = `${SITE_CONFIG.url}/articles/category/${categorySlug}`;

  return {
    title: `${category} Articles`,
    description: `Explore ${postCount} articles about ${category}. Learn from tutorials, guides, and insights.`,
    openGraph: {
      title: `${category} Articles`,
      description: `Explore ${postCount} articles about ${category}.`,
      type: "website",
      url: categoryUrl,
    },
    twitter: {
      card: "summary",
      title: `${category} Articles`,
      description: `Explore ${postCount} articles about ${category}.`,
    },
  };
}

/**
 * Generate metadata for tag pages
 */
export function generateTagMetadata(
  tag: string,
  postCount: number
): Metadata {
  const tagSlug = tagToSlug(tag);
  const tagUrl = `${SITE_CONFIG.url}/articles/tag/${tagSlug}`;

  return {
    title: `${tag} Articles`,
    description: `Explore ${postCount} articles tagged with ${tag}. Find tutorials, guides, and insights.`,
    openGraph: {
      title: `${tag} Articles`,
      description: `Explore ${postCount} articles tagged with ${tag}.`,
      type: "website",
      url: tagUrl,
    },
    twitter: {
      card: "summary",
      title: `${tag} Articles`,
      description: `Explore ${postCount} articles tagged with ${tag}.`,
    },
  };
}

/**
 * Generate JSON-LD schema for the articles listing (ItemList schema)
 */
export function generateArticlesListingSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": posts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${SITE_CONFIG.url}/articles/${post.slug}`,
      "name": post.title
    }))
  };
}

/**
 * Generate robots meta tags
 */
export function generateRobotsMetadata(
  index: boolean = true,
  follow: boolean = true
): { robots: string } {
  const indexValue = index ? "index" : "noindex";
  const followValue = follow ? "follow" : "nofollow";

  return {
    robots: `${indexValue}, ${followValue}`
  };
}

/**
 * Generate sitemap entry for a blog post
 */
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export function generateSitemapEntry(post: BlogPost): SitemapEntry {
  return {
    url: `${SITE_CONFIG.url}/articles/${post.slug}`,
    lastModified: post.lastUpdated,
    changeFrequency: "monthly",
    priority: post.featured ? 0.9 : 0.7,
  };
}

/**
 * Helper: Convert category to slug
 */
export function categoryToSlug(category: PrimaryCategory): string {
  return category
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/\s+/g, "-");
}

/**
 * Helper: Convert tag to slug
 */
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Helper: Generate page title with site name
 */
export function generatePageTitle(title: string): string {
  return `${title} | ${SITE_CONFIG.name}`;
}

/**
 * Helper: Truncate description to optimal length
 */
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;

  return description.substring(0, maxLength - 3).trim() + "...";
}

/**
 * Generate RSS feed item for a blog post
 */
export function generateRSSItem(post: BlogPost): string {
  const postUrl = `${SITE_CONFIG.url}/articles/${post.slug}`;

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <author>${escapeXml(post.author)}</author>
    </item>
  `.trim();
}

/**
 * Helper: Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export { SITE_CONFIG };
