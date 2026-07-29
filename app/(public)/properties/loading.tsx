export default function PropertiesLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-16rem)]">
      {/* Sidebar Skeleton */}
      <div className="w-full md:w-64 shrink-0">
        <div className="h-150 bg-muted/60 animate-pulse rounded-2xl border" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="h-8 w-48 bg-muted/60 animate-pulse rounded-md" />
          <div className="h-10 w-40 bg-muted/60 animate-pulse rounded-md" />
        </div>

        {/* Grid of Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden h-105 flex flex-col">
              {/* Image */}
              <div className="h-56 bg-muted/60 animate-pulse" />
              {/* Content */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="h-6 w-3/4 bg-muted/60 animate-pulse rounded-sm" />
                <div className="h-4 w-1/2 bg-muted/60 animate-pulse rounded-sm" />
                <div className="mt-auto flex justify-between">
                  <div className="h-5 w-1/3 bg-muted/60 animate-pulse rounded-sm" />
                  <div className="h-5 w-1/4 bg-muted/60 animate-pulse rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
