import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/utils/canonical';

export const metadata: Metadata = {
  title: 'About | Ollie Does Is',
  description: 'Learn about Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
  alternates: {
    canonical: getCanonicalUrl('about'),
  },
  openGraph: {
    title: 'About | Ollie Does Is',
    description: 'Learn about Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
    url: getCanonicalUrl('about'),
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
