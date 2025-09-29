// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ollie Does Is - Web Developer & Cybersecurity Student',
  description: 'Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}