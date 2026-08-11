"use client";

import { Button } from "@/components/ui/button";
import {
  getObjectLabel,
  sortCanvasObjects,
  type CanvasObject,
} from "@/lib/canvas-document";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Unlock } from "lucide-react";

interface CanvasLayersPanelProps {
  objects: CanvasObject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onToggleHidden: (id: string) => void;
  onToggleLocked: (id: string) => void;
}

export function CanvasLayersPanel({
  objects,
  selectedId,
  onSelect,
  onReorder,
  onToggleHidden,
  onToggleLocked,
}: CanvasLayersPanelProps) {
  // Top of list = front (highest zIndex)
  const ordered = sortCanvasObjects(objects).reverse();

  const move = (id: string, direction: "up" | "down") => {
    const ids = ordered.map((obj) => obj.id);
    const index = ids.indexOf(id);
    if (index < 0) return;
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= ids.length) return;
    const next = [...ids];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    onReorder(next);
  };

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <p className="text-sm font-semibold">Layers</p>
      {ordered.length === 0 ? (
        <p className="text-xs text-muted-foreground">No objects yet.</p>
      ) : (
        <ul className="space-y-1">
          {ordered.map((obj, index) => (
            <li key={obj.id}>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-lg border px-2 py-1.5 text-sm",
                  selectedId === obj.id
                    ? "border-foreground bg-muted"
                    : "border-transparent hover:bg-muted/60"
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left"
                  onClick={() => onSelect(obj.id)}
                >
                  {getObjectLabel(obj)}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => move(obj.id, "up")}
                  disabled={index === 0}
                  title="Bring forward"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => move(obj.id, "down")}
                  disabled={index === ordered.length - 1}
                  title="Send backward"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onToggleHidden(obj.id)}
                  title={obj.hidden ? "Show" : "Hide"}
                >
                  {obj.hidden ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onToggleLocked(obj.id)}
                  title={obj.locked ? "Unlock" : "Lock"}
                >
                  {obj.locked ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Unlock className="size-3.5" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
