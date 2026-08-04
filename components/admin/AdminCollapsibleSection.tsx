"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminCollapsibleSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  headerExtra?: ReactNode;
  leading?: ReactNode;
  className?: string;
  onSave?: () => void | Promise<void>;
  saving?: boolean;
}

export function AdminCollapsibleSection({
  title,
  description,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  headerExtra,
  leading,
  className,
  onSave,
  saving = false,
}: AdminCollapsibleSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex min-w-0 flex-1 items-start justify-between gap-4 text-left transition-colors hover:opacity-80"
          >
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">{title}</h2>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <ChevronDown
              className={cn(
                "mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {headerExtra ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">{headerExtra}</div>
        ) : null}
      </div>

      {open ? (
        <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
          {children}
          {onSave ? (
            <div className="flex justify-end border-t border-border pt-4">
              <Button type="button" onClick={onSave} disabled={saving}>
                {saving ? "Saving…" : "Save section"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
