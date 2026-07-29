export default function PropertyDetailsLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header section skeleton */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="h-6 w-32 bg-muted/60 animate-pulse rounded" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-3">
            <div className="h-5 w-40 bg-muted/60 animate-pulse rounded" />
            <div className="h-10 w-64 md:w-96 bg-muted/60 animate-pulse rounded" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-10 w-32 bg-muted/60 animate-pulse rounded ml-auto" />
            <div className="h-4 w-20 bg-muted/60 animate-pulse rounded ml-auto" />
          </div>
        </div>

        {/* Image Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-100 md:h-125">
          <div className="md:col-span-3 rounded-2xl bg-muted/60 animate-pulse h-full" />
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="rounded-2xl bg-muted/60 animate-pulse h-full" />
            <div className="rounded-2xl bg-muted/60 animate-pulse h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info Bar Skeleton */}
            <div className="h-24 bg-muted/40 animate-pulse rounded-2xl border" />
            
            {/* Description Skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted/60 animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-5 w-full bg-muted/60 animate-pulse rounded" />
                <div className="h-5 w-full bg-muted/60 animate-pulse rounded" />
                <div className="h-5 w-3/4 bg-muted/60 animate-pulse rounded" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-64 bg-muted/60 animate-pulse rounded-2xl border" />
            <div className="h-48 bg-muted/60 animate-pulse rounded-2xl border" />
          </div>
        </div>
      </div>
    </div>
  );
}
