import { heroHeadingTextClass } from "@/components/home/RotatingHeroLines";
import { cn } from "@/lib/utils";

interface HeroHeadingProps {
  children: string;
  className?: string;
}

export function HeroHeading({ children, className }: HeroHeadingProps) {
  const headingClass = cn(heroHeadingTextClass, className);

  return (
    <>
      <svg
        width="1"
        height="1"
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <defs>
          <filter id="hero-heading-blur-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2 13" />
          </filter>
        </defs>
      </svg>

      <div className="relative">
        <div className="hero-heading-blur" aria-hidden="true">
          <p className={headingClass}>{children}</p>
        </div>
        <h1 className={cn(headingClass, "text-balance")}>{children}</h1>
      </div>
    </>
  );
}
