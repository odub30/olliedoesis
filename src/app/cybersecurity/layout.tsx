// src/app/cybersecurity/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cybersecurity Services & Expertise | Ollie Does Is',
  description: 'Cybersecurity services including security assessment, penetration testing, network security, and digital forensics. CompTIA Security+ certified student.',
  keywords: ['cybersecurity', 'security assessment', 'penetration testing', 'network security', 'digital forensics', 'CompTIA Security+', 'ethical hacking', 'security audit'],
  openGraph: {
    title: 'Cybersecurity Services & Expertise | Ollie Does Is',
    description: 'Cybersecurity services including security assessment, penetration testing, and network security.',
    type: 'website',
    url: 'https://olliedoesis.dev/cybersecurity',
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
