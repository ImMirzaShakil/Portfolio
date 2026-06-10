function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-muted ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function ProjectLoading() {
  return (
    <article className="space-y-12" aria-busy="true" aria-label="Loading project">
      <SkeletonBlock className="aspect-[21/9] w-full rounded-none" />

      <header className="space-y-4">
        <SkeletonBlock className="h-12 w-2/3" />
        <SkeletonBlock className="h-6 w-1/2" />
        <SkeletonBlock className="h-20 w-full max-w-3xl" />
      </header>

      <SkeletonBlock className="h-40 w-full" />

      <div className="space-y-16">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-32 w-full" />
          </div>
        ))}
      </div>
    </article>
  );
}
