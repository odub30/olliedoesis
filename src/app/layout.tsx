import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { getCanonicalUrl } from '@/lib/utils/canonical';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://olliedoesis.dev'),
  title: 'Ollie Does Is - Web Developer & Cybersecurity Student',
  description: 'Portfolio of Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada',
  keywords: ['web developer', 'cybersecurity', 'portfolio', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Ollie Does Is' }],
  creator: 'Ollie Does Is',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getCanonicalUrl('/'),
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
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        <Analytics />
        
        {/* Google Analytics 4 with Privacy Settings */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                gtag('config', '${GA_ID}', {
  anonymize_ip: true,                    // IP masking (redundant in GA4 but safe)
  cookie_flags: 'SameSite=None;Secure',  // Secure cookies
  allow_google_signals: false,           // Disable Google Signals (cross-device tracking)
  allow_ad_personalization_signals: false // Disable ad personalization
});
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}