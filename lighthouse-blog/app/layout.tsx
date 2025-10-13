import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Achieving 100/100 Lighthouse Scores: A Complete Performance Optimization Guide",
  description:
    "Learn how to achieve perfect 100/100 Lighthouse scores through systematic optimization of images, JavaScript, CSS, and Core Web Vitals. Includes charts, data, and real-world results.",
  generator: "v0.app",
  metadataBase: new URL("https://yourdomain.com"),
  keywords: [
    "Lighthouse",
    "Performance Optimization",
    "Core Web Vitals",
    "Image Optimization",
    "JavaScript Bundle",
    "SEO",
    "Web Performance",
    "Next.js",
  ],
  authors: [{ name: "Ollie Does Is" }],
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://yourdomain.com/blog/lighthouse-100-scores",
    siteName: "Ollie Does Is",
    title: "Achieving 100/100 Lighthouse Scores: A Complete Guide",
    description:
      "Systematic guide to achieving perfect Lighthouse scores with real data, charts, and optimization strategies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lighthouse 100/100 Scores Achievement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Achieving 100/100 Lighthouse Scores",
    description: "Complete guide with charts and real data on achieving perfect web performance.",
    creator: "@yourusername",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
