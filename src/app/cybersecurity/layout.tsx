// src/app/cybersecurity/layout.tsx
import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/utils/canonical';

export const metadata: Metadata = {
  title: 'Cybersecurity Services & Expertise | Ollie Does Is',
  description: 'Cybersecurity services including security assessment, penetration testing, network security, and digital forensics. CompTIA Security+ certified student.',
  keywords: ['cybersecurity', 'security assessment', 'penetration testing', 'network security', 'digital forensics', 'CompTIA Security+', 'ethical hacking', 'security audit'],
  alternates: {
    canonical: getCanonicalUrl('cybersecurity'),
  },
  openGraph: {
    title: 'Cybersecurity Services & Expertise | Ollie Does Is',
    description: 'Cybersecurity services including security assessment, penetration testing, and network security.',
    type: 'website',
    url: getCanonicalUrl('cybersecurity'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cybersecurity Services & Expertise | Ollie Does Is',
    description: 'Cybersecurity services including security assessment, penetration testing, and network security.',
  },
};

export default function CybersecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
