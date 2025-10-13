import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  // Build breadcrumb list for schema
  const breadcrumbList = [
    { name: "Home", item: "/" },
    ...items.map(item => ({ name: item.label, item: item.href })),
    { name: currentPage, item: "" } // Current page has no link
  ];

  // Generate JSON-LD structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      ...(crumb.item && { "item": `${process.env.NEXT_PUBLIC_SITE_URL || ""}${crumb.item}` })
    }))
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {/* Intermediate items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Current page */}
          <li className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground" aria-current="page">
              {currentPage}
            </span>
          </li>
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumb items for blog post page
export function getBlogPostBreadcrumbs(postTitle: string, categorySlug?: string, categoryName?: string) {
  const items: BreadcrumbItem[] = [
    { label: "Blog", href: "/blogs" }
  ];

  if (categorySlug && categoryName) {
    items.push({
      label: categoryName,
      href: `/blogs/category/${categorySlug}`
    });
  }

  return { items, currentPage: postTitle };
}

// Helper function to generate breadcrumb items for category page
export function getCategoryBreadcrumbs(categoryName: string) {
  return {
    items: [{ label: "Blog", href: "/blogs" }],
    currentPage: categoryName
  };
}

// Helper function to generate breadcrumb items for tag page
export function getTagBreadcrumbs(tagName: string) {
  return {
    items: [{ label: "Blog", href: "/blogs" }],
    currentPage: `Posts tagged: ${tagName}`
  };
}
