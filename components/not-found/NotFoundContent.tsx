import Link from "next/link";

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
      viewBox="0 0 520 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full text-foreground"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="hatch"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(42)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </pattern>
      </defs>

      {/* Back blob — upper right */}
      <path
        d="M268 48c52-28 118-18 156 28 34 40 42 98 18 144-28 52-92 78-148 70-58-8-112-42-126-98-14-58 40-104 100-144Z"
        fill="url(#hatch)"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />

      {/* Mid blob — lower right */}
      <path
        d="M310 168c48-8 98 18 118 62 22 48 4 108-44 132-42 22-102 12-136-22-38-38-42-98-8-132 28-28 42-36 70-40Z"
        fill="url(#hatch)"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />

      {/* Small accent blob — left of apology */}
      <path
        d="M248 232c28-16 62-4 74 28 12 30-4 66-34 78-28 12-64 2-78-26-14-28 4-60 38-80Z"
        fill="url(#hatch)"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotFoundContent() {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center py-10 sm:min-h-[64vh] sm:py-14">
      <div className="relative mx-auto w-full max-w-xl px-2 sm:max-w-2xl">
        <div className="relative aspect-[520/360] w-full">
          <HatchedBlobs />

          <Sparkle className="absolute left-[8%] top-[18%] size-4 text-foreground sm:size-5" />
          <Sparkle className="absolute right-[12%] top-[8%] size-3 text-foreground sm:size-4" />
          <Sparkle className="absolute right-[22%] top-[36%] size-5 text-foreground sm:size-6" />
          <Sparkle className="absolute bottom-[28%] left-[42%] size-3.5 text-foreground sm:size-4" />
          <Sparkle className="absolute bottom-[12%] right-[18%] size-4 text-foreground sm:size-5" />

          <div className="absolute left-[4%] top-[22%] z-10 max-w-[58%] sm:left-[6%] sm:top-[24%]">
            <h1 className="font-hero text-6xl font-bold leading-none tracking-tight sm:text-7xl md:text-8xl">
              404
            </h1>
            <p className="mt-2 text-base font-medium text-foreground sm:mt-3 sm:text-lg md:text-xl">
              Page not found :(
            </p>
          </div>

          <p className="absolute bottom-[10%] right-[4%] z-10 text-sm font-medium text-foreground sm:bottom-[12%] sm:right-[6%] sm:text-base">
            Sorry about that ++
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 text-sm font-semibold text-nav-inactive underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Back to home
      </Link>
    </section>
  );
}
