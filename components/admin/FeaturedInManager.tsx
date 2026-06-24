"use client";

import { AdminToggle } from "@/components/admin/AdminToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FeaturedIn } from "@/lib/types";

interface FeaturedInManagerProps {
  value: FeaturedIn[];
  onChange: (items: FeaturedIn[]) => void;
}

function createItem(): FeaturedIn {
  return {
    id: crypto.randomUUID(),
    year: "",
    title: "",
    url: "",
    publication: "",
    content_type: "",
    order_index: 0,
    is_visible: true,
  };
}

export function FeaturedInManager({ value, onChange }: FeaturedInManagerProps) {
  const updateItem = (
    index: number,
    field: keyof FeaturedIn,
    val: string | boolean
  ) => {
    onChange(
      value.map((item, i) =>
        i === index ? { ...item, [field]: val } : item
      )
    );
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No featured entries yet.
        </p>
      ) : (
        value.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-border p-4 space-y-3"
          >
            <AdminToggle
              checked={item.is_visible !== false}
              onCheckedChange={(checked) => updateItem(index, "is_visible", checked)}
              label="Show on site"
              className="w-full sm:w-auto"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`fi-year-${item.id}`}>Year</Label>
                <Input
                  id={`fi-year-${item.id}`}
                  value={item.year}
                  onChange={(e) => updateItem(index, "year", e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`fi-type-${item.id}`}>Type</Label>
                <Input
                  id={`fi-type-${item.id}`}
                  value={item.content_type ?? ""}
                  onChange={(e) =>
                    updateItem(index, "content_type", e.target.value)
                  }
                  placeholder="Article, Talk, Podcast…"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`fi-title-${item.id}`}>Title</Label>
              <Input
                id={`fi-title-${item.id}`}
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder="Article or talk title"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`fi-pub-${item.id}`}>Publication / Venue</Label>
                <Input
                  id={`fi-pub-${item.id}`}
                  value={item.publication ?? ""}
                  onChange={(e) =>
                    updateItem(index, "publication", e.target.value)
                  }
                  placeholder="Coursera, Figma…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`fi-url-${item.id}`}>URL</Label>
                <Input
                  id={`fi-url-${item.id}`}
                  value={item.url ?? ""}
                  onChange={(e) => updateItem(index, "url", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
            >
              Remove entry
            </Button>
          </div>
        ))
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...value, createItem()])}
      >
        Add featured entry
      </Button>
    </div>
  );
}
