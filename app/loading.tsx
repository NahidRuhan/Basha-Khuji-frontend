export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="w-full relative bg-muted/20 py-20 md:py-32 overflow-hidden flex items-center justify-center border-b">
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="h-12 md:h-16 w-3/4 md:w-1/2 bg-muted/80 animate-pulse rounded-xl" />
            <div className="h-6 w-5/6 md:w-1/3 bg-muted/50 animate-pulse rounded-md" />
          </div>
          
          {/* Search Box Skeleton */}
          <div className="w-full max-w-4xl mx-auto h-20 md:h-24 bg-background border rounded-2xl shadow-sm animate-pulse" />
        </div>
      </section>

      {/* Featured Properties Skeleton */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="h-10 w-64 bg-muted/60 animate-pulse rounded-md" />
            <div className="h-5 w-96 bg-muted/40 animate-pulse rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden h-105 flex flex-col">
                <div className="h-56 bg-muted/60 animate-pulse" />
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="h-6 w-3/4 bg-muted/80 animate-pulse rounded-sm" />
                  <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded-sm" />
                  <div className="mt-auto flex justify-between">
                    <div className="h-6 w-1/3 bg-muted/60 animate-pulse rounded-sm" />
                    <div className="h-6 w-1/4 bg-muted/50 animate-pulse rounded-sm" />
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
