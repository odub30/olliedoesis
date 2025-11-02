// src/app/gallery/layout.tsx
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/utils/canonical";

export const metadata: Metadata = {
  title: "Photo Gallery | Ollie Does Is",
  description: "Explore our curated photo gallery showcasing projects, creative work, and memorable moments. Browse by tags and view high-quality images.",
  keywords: "photo gallery, portfolio images, project showcase, photography, web development portfolio",
  alternates: {
    canonical: getCanonicalUrl('gallery'),
  },
  openGraph: {
    title: "Photo Gallery | Ollie Does Is",
    description: "Explore our curated photo gallery showcasing projects, creative work, and memorable moments.",
    type: "website",
    url: getCanonicalUrl('gallery'),
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery | Ollie Does Is",
    description: "Explore our curated photo gallery showcasing projects, creative work, and memorable moments.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
