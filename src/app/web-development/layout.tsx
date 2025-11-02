// src/app/web-development/layout.tsx
import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/utils/canonical';

export const metadata: Metadata = {
  title: 'Web Development Services | Ollie Does Is',
  description: 'Professional web development services using React, Next.js, TypeScript, and modern technologies. Full-stack development from concept to deployment.',
  keywords: ['web development', 'react', 'next.js', 'typescript', 'tailwind css', 'full-stack', 'frontend', 'backend', 'responsive design'],
  alternates: {
    canonical: getCanonicalUrl('web-development'),
  },
  openGraph: {
    title: 'Web Development Services | Ollie Does Is',
    description: 'Professional web development services using React, Next.js, TypeScript, and modern technologies.',
    type: 'website',
    url: getCanonicalUrl('web-development'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Services | Ollie Does Is',
    description: 'Professional web development services using React, Next.js, TypeScript, and modern technologies.',
  },
};

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
