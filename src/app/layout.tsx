// src/app/layout.tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ollie Does Is - Web Developer & Cybersecurity Student',
  description: 'Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
  keywords: ['web developer', 'cybersecurity', 'portfolio', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Ollie Does Is' }],
  creator: 'Ollie Does Is',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://olliedoesis.dev',
    title: 'Ollie Does Is - Web Developer & Cybersecurity Student',
    description: 'Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
    siteName: 'Ollie Does Is Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ollie Does Is - Web Developer & Cybersecurity Student',
    description: 'Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}