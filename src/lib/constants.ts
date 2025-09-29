// src/lib/constants.ts
export const SITE_NAME = 'Ollie Does Is';
export const SITE_DESCRIPTION = 'Web Developer & Security Enthusiast';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://olliedoesis.vercel.app';
export const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'odub30';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '702seopro@gmail.com';

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: 'https://linkedin.com/in/your-profile',
  email: `mailto:${CONTACT_EMAIL}`,
};

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];