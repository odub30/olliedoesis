// src/app/search/layout.tsx
import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/utils/canonical';

export const metadata: Metadata = {
  title: 'Search | Ollie Does Is',
  description: 'Search through blog posts, projects, images, and tags on Ollie Does Is portfolio.',
  alternates: {
    canonical: getCanonicalUrl('search'),
  },
  openGraph: {
    title: 'Search | Ollie Does Is',
    description: 'Search through blog posts, projects, images, and tags.',
    type: 'website',
    url: getCanonicalUrl('search'),
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
