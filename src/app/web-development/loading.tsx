// src/app/web-development/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-primary via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-48 h-8 bg-white/20 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="w-3/4 h-12 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-1/2 h-8 bg-white/20 rounded-lg mx-auto mb-8 animate-pulse" />
            <div className="flex gap-4 justify-center">
              <div className="w-32 h-12 bg-white/20 rounded-xl animate-pulse" />
              <div className="w-32 h-12 bg-white/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-16 h-16 bg-muted rounded-xl mb-6" />
              <div className="w-3/4 h-6 bg-muted rounded mb-3" />
              <div className="w-full h-4 bg-muted rounded mb-2" />
              <div className="w-5/6 h-4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
