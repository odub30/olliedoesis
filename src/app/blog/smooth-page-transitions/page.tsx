import type { Metadata } from "next"
import PageClient from "./page.client"

export const metadata: Metadata = {
  title: "Implementing Smooth Page Transitions Without Sacrificing Performance | Complete Guide 2025",
  description:
    "Master buttery-smooth 60fps page transitions and animations using Framer Motion while maintaining perfect Lighthouse scores. Includes performance charts, code examples, and optimization strategies.",
  keywords:
    "framer motion, page transitions, web animations, performance optimization, react animations, next.js animations, 60fps, lighthouse score, GPU acceleration, animation performance",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Implementing Smooth Page Transitions Without Sacrificing Performance",
    description:
      "Learn how to create buttery-smooth page transitions using Framer Motion while maintaining perfect Lighthouse scores and 60fps performance.",
    type: "article",
    publishedTime: "2025-10-11T00:00:00.000Z",
    authors: ["Your Name"],
    tags: ["Frontend Development", "Animation", "Performance", "React", "Framer Motion"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Implementing Smooth Page Transitions Without Sacrificing Performance",
    description: "Master 60fps animations with Framer Motion while keeping perfect Lighthouse scores.",
  },
}

export default function Page() {
  return <PageClient />
}
