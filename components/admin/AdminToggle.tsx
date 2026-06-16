"use client";

import { cn } from "@/lib/utils";

interface ToggleVisualProps {
  checked: boolean;
  className?: string;
}

export function ToggleVisual({ checked, className }: ToggleVisualProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-border transition-colors duration-200",
        checked ? "bg-primary" : "bg-muted-foreground/40",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </span>
  );
}

interface AdminToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export function AdminToggle({
  checked,
  onCheckedChange,
  label,
  activeLabel = "Visible",
  inactiveLabel = "Hidden",
  className,
}: AdminToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${label}: ${checked ? activeLabel : inactiveLabel}`}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
        checked
          ? "border-foreground/15 bg-foreground/[0.04] text-foreground"
          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted/60",
        className
      )}
    >
      <ToggleVisual checked={checked} />
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
          checked
            ? "bg-foreground text-background"
            : "bg-background text-muted-foreground ring-1 ring-border"
        )}
      >
        {checked ? activeLabel : inactiveLabel}
      </span>
    </button>
  );
}
