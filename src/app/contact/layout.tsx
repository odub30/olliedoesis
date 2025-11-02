import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/utils/canonical';

export const metadata: Metadata = {
  title: 'Contact | Ollie Does Is',
  description: 'Get in touch with Ollie Does Is for web development projects and opportunities',
  alternates: {
    canonical: getCanonicalUrl('contact'),
  },
  openGraph: {
    title: 'Contact | Ollie Does Is',
    description: 'Get in touch with Ollie Does Is for web development projects and opportunities',
    url: getCanonicalUrl('contact'),
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
