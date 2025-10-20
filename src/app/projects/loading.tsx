// src/app/projects/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Header Skeleton */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-12 w-56 bg-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="h-64 bg-gray-200"></div>

                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>

                  {/* Technologies Skeleton */}
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                  </div>

                  {/* Stats Skeleton */}
                  <div className="flex items-center gap-4 pt-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
