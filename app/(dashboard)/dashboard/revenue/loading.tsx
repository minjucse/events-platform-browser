export default function Loading() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
            <div className="h-10 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}