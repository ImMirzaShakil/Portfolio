"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const heroHeadingTextClass =
  "text-[clamp(2.125rem,6.25vw+0.5rem,5rem)] font-bold leading-[1.05] tracking-[-0.02em]";

export const heroRotatingTextClass =
  "text-[clamp(1.5rem,3.5vw+0.75rem,4rem)] font-bold leading-[1.1] tracking-[-0.02em]";

/** @deprecated Use heroHeadingTextClass */
export const heroDisplayTextClass = heroHeadingTextClass;

interface RotatingHeroLinesProps {
  lines: string[];
  className?: string;
}

const ROTATE_INTERVAL_MS = 3600;
const ANIMATION_MS = 900;

export function RotatingHeroLines({ lines, className }: RotatingHeroLinesProps) {
  const [index, setIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const indexRef = useRef(0);
  const displayLines =
    lines.length > 0 ? lines : ["Building thoughtful digital experiences."];
  const [showInitialEnter, setShowInitialEnter] = useState(displayLines.length > 1);

  indexRef.current = index;

  useEffect(() => {
    if (!showInitialEnter) return;

    const timeout = window.setTimeout(() => setShowInitialEnter(false), ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [showInitialEnter]);

  useEffect(() => {
    if (displayLines.length <= 1) return;

    const interval = setInterval(() => {
      const current = indexRef.current;
      const next = (current + 1) % displayLines.length;

      setIsTransitioning(true);
      setOutgoingIndex(current);
      setIndex(next);

      window.setTimeout(() => {
        setOutgoingIndex(null);
        setIsTransitioning(false);
      }, ANIMATION_MS);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [displayLines.length]);

  const lineClass = "max-w-full break-words leading-[1.1]";

  return (
    <div
      className={cn(
        heroRotatingTextClass,
        "relative mt-3 min-h-[2.2em] overflow-hidden text-muted-foreground sm:mt-4",
        className
      )}
      aria-live="polite"
    >
      {outgoingIndex !== null ? (
        <p
          key={`out-${outgoingIndex}`}
          className={cn(lineClass, "absolute inset-x-0 top-0 animate-hero-line-exit")}
          aria-hidden
        >
          {displayLines[outgoingIndex]}
        </p>
      ) : null}
      <p
        key={index}
        className={cn(
          lineClass,
          isTransitioning && "absolute inset-x-0 top-0 animate-hero-line-enter",
          showInitialEnter && "animate-hero-line-enter"
        )}
      >
        {displayLines[index]}
      </p>
    </div>
  );
}
