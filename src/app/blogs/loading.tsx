// src/app/blogs/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Header Skeleton */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-12 w-48 bg-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </section>

      {/* Blog List Skeleton */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar Skeleton */}
          <div className="mb-8 space-y-4">
            <div className="h-12 bg-white/10 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
            <div className="flex gap-2 justify-center">
              <div className="h-10 w-24 bg-white/10 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-white/10 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Blog Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
