// src/app/blogs/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Back Button Skeleton */}
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-5 w-32 bg-white/10 rounded mb-8 animate-pulse"></div>
        </div>
      </div>

      {/* Article Skeleton */}
      <article className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Content Skeleton */}
            <div className="p-8 md:p-12">
              {/* Title Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>

              {/* Excerpt Skeleton */}
              <div className="space-y-2 mb-8">
                <div className="h-5 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-gray-100 rounded w-5/6 animate-pulse"></div>
              </div>

              {/* Meta Info Skeleton */}
              <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2 mt-6">
                <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Article Content Skeleton */}
            <div className="px-8 md:px-12 pb-12 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-11/12 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
