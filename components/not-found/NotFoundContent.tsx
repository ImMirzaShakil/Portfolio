function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12Z" />
    </svg>
  );
}

function HatchedBlobs() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full text-foreground"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="not-found-hatch"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(42)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </pattern>
      </defs>

      <path
        d="M78 36c46-26 108-20 146 22 34 36 40 94 12 136-30 46-92 70-146 58-52-12-98-48-108-98C-28 98 22 68 78 36Z"
        fill="url(#not-found-hatch)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M148 148c42-10 90 14 108 54 18 42-2 96-44 116-38 18-90 6-118-28-30-36-30-88 2-116 20-18 30-22 52-26Z"
        fill="url(#not-found-hatch)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M96 178c22-14 52-6 62 22 10 26-2 56-28 66-24 10-54 0-66-22-12-24 4-50 32-66Z"
        fill="url(#not-found-hatch)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotFoundContent() {
  return (
    <section className="flex min-h-[52vh] items-center justify-center py-8 sm:min-h-[58vh] sm:py-12 lg:min-h-[62vh]">
      <div className="mx-auto w-full max-w-[18rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-2 sm:gap-3 md:gap-4">
          <div className="relative z-10 min-w-0">
            <h1 className="font-hero text-[clamp(2.75rem,14vw,5.5rem)] font-bold leading-none tracking-tight">
              404
            </h1>
            <p className="mt-1.5 text-[clamp(0.85rem,3.4vw,1.15rem)] font-medium leading-snug text-foreground sm:mt-2">
              Page not found :(
            </p>
          </div>

          <div className="relative mx-auto w-[min(100%,13rem)] sm:w-[min(100%,15rem)] md:w-[min(100%,17rem)] lg:w-[min(100%,18.5rem)]">
            <div className="relative aspect-[320/280] w-full">
              <HatchedBlobs />
              <Sparkle className="absolute left-[4%] top-[10%] size-2.5 text-foreground sm:size-3 md:size-3.5" />
              <Sparkle className="absolute right-[10%] top-[2%] size-2 text-foreground sm:size-2.5" />
              <Sparkle className="absolute right-[18%] top-[38%] size-3 text-foreground sm:size-3.5 md:size-4" />
              <Sparkle className="absolute bottom-[16%] left-[8%] size-2.5 text-foreground sm:size-3" />
            </div>
          </div>
        </div>

        <p className="mt-3 text-right text-[clamp(0.8rem,2.8vw,1rem)] font-medium text-foreground sm:mt-4">
          Sorry about that ++
        </p>
      </div>
    </section>
  );
}
