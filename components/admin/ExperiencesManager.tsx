"use client";

import { AdminToggle } from "@/components/admin/AdminToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experience, ExperienceType } from "@/lib/types";

interface ExperiencesManagerProps {
  value: Experience[];
  onChange: (items: Experience[]) => void;
  sectionVisibility: Record<ExperienceType, boolean>;
  onSectionVisibilityChange: (type: ExperienceType, visible: boolean) => void;
}

const TYPE_LABELS: Record<ExperienceType, string> = {
  job: "Job",
  internship: "Internship",
  education: "Education",
};

const SECTIONS: { type: ExperienceType; label: string; description: string }[] = [
  { type: "job", label: "Experience", description: "Full-time and part-time roles." },
  { type: "internship", label: "Internships", description: "Internship positions." },
  { type: "education", label: "Education", description: "Degrees and certifications." },
];

function createEntry(type: ExperienceType): Experience {
  return {
    id: crypto.randomUUID(),
    year_range: "",
    organization: "",
    role: "",
    description: null,
    type,
    order_index: 0,
    is_visible: true,
  };
}

export function ExperiencesManager({
  value,
  onChange,
  sectionVisibility,
  onSectionVisibilityChange,
}: ExperiencesManagerProps) {
  const updateEntry = (
    id: string,
    field: keyof Omit<Experience, "id" | "type" | "order_index">,
    val: string | boolean
  ) => {
    onChange(
      value.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      )
    );
  };

  const removeEntry = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const addEntry = (type: ExperienceType) => {
    onChange([...value, createEntry(type)]);
  };

  const moveEntry = (id: string, direction: "up" | "down", type: ExperienceType) => {
    const typeItems = value.filter((e) => e.type === type);
    const idx = typeItems.findIndex((e) => e.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === typeItems.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const swapId = typeItems[swapIdx].id;

    const result = [...value];
    const aIdx = result.findIndex((e) => e.id === id);
    const bIdx = result.findIndex((e) => e.id === swapId);
    [result[aIdx], result[bIdx]] = [result[bIdx], result[aIdx]];
    onChange(result);
  };

  return (
    <div className="space-y-10">
      {SECTIONS.map(({ type, label, description }) => {
        const entries = value.filter((e) => e.type === type);

        return (
          <div key={type} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <AdminToggle
                  checked={sectionVisibility[type]}
                  onCheckedChange={(checked) =>
                    onSectionVisibilityChange(type, checked)
                  }
                  label={label}
                />
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addEntry(type)}
              >
                Add {TYPE_LABELS[type].toLowerCase()}
              </Button>
            </div>

            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {label.toLowerCase()} entries yet.
              </p>
            ) : (
              entries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border p-4 space-y-3"
                >
                  <AdminToggle
                    checked={entry.is_visible !== false}
                    onCheckedChange={(checked) =>
                      updateEntry(entry.id, "is_visible", checked)
                    }
                    label="Show on site"
                    className="w-full sm:w-auto"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`exp-yr-${entry.id}`}>Year range</Label>
                      <Input
                        id={`exp-yr-${entry.id}`}
                        value={entry.year_range}
                        onChange={(e) =>
                          updateEntry(entry.id, "year_range", e.target.value)
                        }
                        placeholder="2023—Now"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`exp-org-${entry.id}`}>
                        {type === "education" ? "Institution" : "Organization"}
                      </Label>
                      <Input
                        id={`exp-org-${entry.id}`}
                        value={entry.organization}
                        onChange={(e) =>
                          updateEntry(entry.id, "organization", e.target.value)
                        }
                        placeholder={type === "education" ? "University of Dhaka" : "Figma"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`exp-role-${entry.id}`}>
                      {type === "education" ? "Degree / Program" : "Role / Title"}
                    </Label>
                    <Input
                      id={`exp-role-${entry.id}`}
                      value={entry.role}
                      onChange={(e) =>
                        updateEntry(entry.id, "role", e.target.value)
                      }
                      placeholder={
                        type === "education"
                          ? "B.Sc. in Computer Science"
                          : "Software Engineer"
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`exp-desc-${entry.id}`}>Description</Label>
                    <Textarea
                      id={`exp-desc-${entry.id}`}
                      value={entry.description ?? ""}
                      onChange={(e) =>
                        updateEntry(entry.id, "description", e.target.value)
                      }
                      rows={2}
                      placeholder="Brief description of your responsibilities or achievements…"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveEntry(entry.id, "up", type)}
                      disabled={idx === 0}
                    >
                      ↑ Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveEntry(entry.id, "down", type)}
                      disabled={idx === entries.length - 1}
                    >
                      ↓ Down
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeEntry(entry.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
