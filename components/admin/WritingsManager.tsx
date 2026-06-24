"use client";

import { AdminToggle } from "@/components/admin/AdminToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Writing } from "@/lib/types";

interface WritingsManagerProps {
  value: Writing[];
  onChange: (items: Writing[]) => void;
}

function createWriting(): Writing {
  return {
    id: crypto.randomUUID(),
    title: "",
    url: "",
    publication: "",
    year: "",
    description: null,
    order_index: 0,
    is_visible: true,
  };
}

export function WritingsManager({ value, onChange }: WritingsManagerProps) {
  const updateItem = (
    id: string,
    field: keyof Omit<Writing, "id" | "order_index">,
    val: string | boolean
  ) => {
    onChange(
      value.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                typeof val === "boolean"
                  ? val
                  : val || (field === "description" ? null : ""),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const idx = value.findIndex((e) => e.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === value.length - 1) return;

    const result = [...value];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [result[idx], result[swapIdx]] = [result[swapIdx], result[idx]];
    onChange(result);
  };

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <p className="text-sm text-muted-foreground">No writing entries yet.</p>
      ) : (
        value.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-xl border border-border p-4 space-y-3"
          >
            <AdminToggle
              checked={item.is_visible !== false}
              onCheckedChange={(checked) =>
                updateItem(item.id, "is_visible", checked)
              }
              label="Show on site"
              className="w-full sm:w-auto"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`wr-year-${item.id}`}>Year</Label>
                <Input
                  id={`wr-year-${item.id}`}
                  value={item.year ?? ""}
                  onChange={(e) => updateItem(item.id, "year", e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`wr-pub-${item.id}`}>Publication / Platform</Label>
                <Input
                  id={`wr-pub-${item.id}`}
                  value={item.publication ?? ""}
                  onChange={(e) =>
                    updateItem(item.id, "publication", e.target.value)
                  }
                  placeholder="Medium, Substack…"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`wr-title-${item.id}`}>Title</Label>
              <Input
                id={`wr-title-${item.id}`}
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Article or post title"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`wr-url-${item.id}`}>URL</Label>
              <Input
                id={`wr-url-${item.id}`}
                value={item.url}
                onChange={(e) => updateItem(item.id, "url", e.target.value)}
                placeholder="https://…"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`wr-desc-${item.id}`}>Description / Excerpt</Label>
              <Textarea
                id={`wr-desc-${item.id}`}
                value={item.description ?? ""}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                rows={2}
                placeholder="A short excerpt or summary shown beneath the title…"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => moveItem(item.id, "up")}
                disabled={idx === 0}
              >
                ↑ Up
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => moveItem(item.id, "down")}
                disabled={idx === value.length - 1}
              >
                ↓ Down
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...value, createWriting()])}
      >
        Add writing
      </Button>
    </div>
  );
}
