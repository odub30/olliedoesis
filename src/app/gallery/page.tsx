// src/app/gallery/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Camera, X, Search, Grid3x3, Grid2x2, Download, ExternalLink, Loader2 } from "lucide-react";
import { logError } from "@/lib/logger";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  size: number | null;
  createdAt: string;
  tags: Array<{ id: string; name: string; slug: string }>;
}

const IMAGES_PER_PAGE = 12;

export default function GalleryPage() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<2 | 3>(3);
  const [allTags, setAllTags] = useState<Array<{ name: string; count: number }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/admin/upload");
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        const publishedImages = data.images || [];

        setAllImages(publishedImages);
        setFilteredImages(publishedImages);
        setDisplayedImages(publishedImages.slice(0, IMAGES_PER_PAGE));
        setHasMore(publishedImages.length > IMAGES_PER_PAGE);

        // Extract unique tags with counts
        const tagMap = new Map<string, number>();
        publishedImages.forEach((img: GalleryImage) => {
          img.tags.forEach(tag => {
            tagMap.set(tag.name, (tagMap.get(tag.name) || 0) + 1);
          });
        });

        const tags = Array.from(tagMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setAllTags(tags);
      } catch (error) {
        logError("Failed to fetch gallery images", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, []);

  // Filter images based on search and tag
  useEffect(() => {
    let filtered = allImages;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(img =>
        img.tags.some(tag => tag.name === selectedTag)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.alt.toLowerCase().includes(query) ||
        img.caption?.toLowerCase().includes(query) ||
        img.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    setFilteredImages(filtered);
    setDisplayedImages(filtered.slice(0, IMAGES_PER_PAGE));
    setCurrentPage(1);
    setHasMore(filtered.length > IMAGES_PER_PAGE);
  }, [selectedTag, searchQuery, allImages]);

  // Load more images
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate network delay for smooth UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * IMAGES_PER_PAGE;
      const newDisplayedImages = filteredImages.slice(startIndex, endIndex);

      setDisplayedImages(newDisplayedImages);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filteredImages.length);
      setIsLoadingMore(false);
    }, 500);
  }, [currentPage, filteredImages, hasMore, isLoadingMore]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;

    const currentIndex = displayedImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % displayedImages.length;
    } else {
      newIndex = (currentIndex - 1 + displayedImages.length) % displayedImages.length;
    }

    setSelectedImage(displayedImages[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, displayedImages]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
  } as const;

  const lightboxVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  } as const;

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <m.section
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 overflow-hidden"
        >
          {/* Animated Background Circles */}
          <m.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
          <m.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />

          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <m.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <Camera className="h-10 w-10 text-white" />
            </m.div>
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Photo Gallery
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Explore our curated collection of images showcasing projects, moments, and creative work.
            </m.p>
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-sm text-blue-200"
            >
              {allImages.length} {allImages.length === 1 ? "image" : "images"} in collection
            </m.div>
          </div>
        </m.section>

        {/* Search and Filter Bar */}
        <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <m.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              {/* Search */}
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              {/* Grid Size Toggle */}
              <div className="flex items-center gap-2">
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGridSize(2)}
                  className={`p-2 rounded-lg transition-colors ${
                    gridSize === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="2 columns"
                >
                  <Grid2x2 className="h-5 w-5" />
                </m.button>
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGridSize(3)}
                  className={`p-2 rounded-lg transition-colors ${
                    gridSize === 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="3 columns"
                >
                  <Grid3x3 className="h-5 w-5" />
                </m.button>
              </div>
            </m.div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === null
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({allImages.length})
                </m.button>
                {allTags.map((tag, index) => (
                  <m.button
                    key={tag.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag.name
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name} ({tag.count})
                  </m.button>
                ))}
              </m.div>
            )}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-blue-600" />
              </m.div>
            </div>
          ) : filteredImages.length === 0 ? (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedTag
                  ? "Try adjusting your filters or search query"
                  : "No images have been uploaded yet"}
              </p>
            </m.div>
          ) : (
            <>
              {/* Results Count */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-sm text-gray-600"
              >
                Showing {displayedImages.length} of {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
                {(searchQuery || selectedTag) && ` matching your filters`}
              </m.div>

              {/* Image Grid */}
              <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  gridSize === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {displayedImages.map((image, index) => (
                  <m.div
                    key={image.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                    className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
                    onClick={() => openLightbox(image)}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <m.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes={gridSize === 2 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                          unoptimized
                        />
                      </m.div>
                      {/* Overlay */}
                      <m.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      >
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <m.p
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="font-semibold text-lg mb-1 line-clamp-2"
                          >
                            {image.alt}
                          </m.p>
                          {image.caption && (
                            <m.p
                              initial={{ y: 20, opacity: 0 }}
                              whileHover={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.15 }}
                              className="text-sm text-gray-200 line-clamp-2"
                            >
                              {image.caption}
                            </m.p>
                          )}
                        </div>
                        <m.div
                          initial={{ scale: 0, rotate: -90 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          className="absolute top-4 right-4"
                        >
                          <ExternalLink className="h-6 w-6 text-white" />
                        </m.div>
                      </m.div>
                    </div>

                    {/* Tags */}
                    {image.tags.length > 0 && (
                      <div className="p-4 bg-white">
                        <div className="flex flex-wrap gap-2">
                          {image.tags.slice(0, 3).map((tag, tagIndex) => (
                            <m.span
                              key={tag.id}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 + tagIndex * 0.05 }}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {tag.name}
                            </m.span>
                          ))}
                          {image.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{image.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </m.div>
                ))}
              </m.div>

              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="py-8">
                {isLoadingMore && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <m.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-8 w-8 text-blue-600" />
                    </m.div>
                    <p className="text-sm text-gray-500">Loading more images...</p>
                  </m.div>
                )}
                {!hasMore && displayedImages.length > 0 && (
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-gray-500"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                      <Camera className="h-4 w-4" />
                      You've seen all {filteredImages.length} images
                    </div>
                  </m.div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={lightboxVariants}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <m.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6 text-white" />
              </m.button>

              {/* Navigation Buttons */}
              {displayedImages.length > 1 && (
                <>
                  <m.button
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("prev");
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </m.button>
                  <m.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("next");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors z-10"
                    aria-label="Next image"
                  >
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </m.button>
                </>
              )}

              {/* Image Container */}
              <m.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative max-w-7xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <m.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.alt}
                      width={selectedImage.width || 1200}
                      height={selectedImage.height || 800}
                      className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                      unoptimized
                    />
                  </m.div>
                </div>

                {/* Image Info */}
                <m.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{selectedImage.alt}</h3>
                  {selectedImage.caption && (
                    <p className="text-gray-200 mb-4">{selectedImage.caption}</p>
                  )}

                  {/* Tags and Metadata */}
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedImage.tags.map((tag, index) => (
                      <m.span
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="px-3 py-1 bg-blue-600/80 text-white text-sm font-medium rounded-full backdrop-blur-sm"
                      >
                        {tag.name}
                      </m.span>
                    ))}
                    {selectedImage.width && selectedImage.height && (
                      <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                        {selectedImage.width} × {selectedImage.height}
                      </span>
                    )}
                    {selectedImage.format && (
                      <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm uppercase">
                        {selectedImage.format}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <m.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Original
                    </m.a>
                    <m.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedImage.url}
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </m.a>
                  </div>
                </m.div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
