function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-muted ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function PublicLoading() {
  return (
    <div className="space-y-20" aria-busy="true" aria-label="Loading page">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <SkeletonBlock className="h-12 w-3/4" />
          <SkeletonBlock className="h-6 w-full max-w-md" />
          <SkeletonBlock className="h-6 w-2/3" />
        </div>
        <div className="flex flex-col items-center lg:items-end">
          <SkeletonBlock className="size-40 rounded-full lg:size-48" />
          <SkeletonBlock className="mt-6 h-8 w-48" />
          <SkeletonBlock className="mt-4 h-20 w-full max-w-md" />
        </div>
      </section>

      <section className="space-y-8">
        <SkeletonBlock className="h-8 w-40" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <SkeletonBlock className="aspect-[16/9] w-full" />
              <SkeletonBlock className="h-6 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
