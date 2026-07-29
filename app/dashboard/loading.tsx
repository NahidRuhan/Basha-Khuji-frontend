export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-16rem)]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <div className="h-10 w-32 bg-muted/80 animate-pulse rounded-md mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <main className="flex-1 w-full space-y-6">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <div className="h-10 w-64 bg-muted/80 animate-pulse rounded-md" />
            <div className="h-5 w-96 bg-muted/40 animate-pulse rounded-md" />
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card shadow-sm h-36 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-muted/60 animate-pulse rounded-md" />
                  <div className="h-8 w-8 bg-muted/40 animate-pulse rounded-full" />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-8 w-20 bg-muted/80 animate-pulse rounded-md" />
                  <div className="h-3 w-40 bg-muted/40 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
