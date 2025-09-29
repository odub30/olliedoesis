// src/lib/metadata.ts
export interface PageMetadata {
  title: string;
  description: string;
  slug?: string;
}

export const generatePageMetadata = (page: PageMetadata) => ({
  title: `${page.title} | Ollie Does Is - Portfolio`,
  description: page.description,
  openGraph: {
    title: page.title,
    description: page.description,
    type: 'website',
    images: [
      {
        url: `/og/${page.slug || 'default'}.png`,
        width: 1200,
        height: 630,
        alt: page.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: page.title,
    description: page.description,
  },
});