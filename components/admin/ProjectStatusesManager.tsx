"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveProjectStatusesAction } from "@/app/admin/projects/statuses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectStatusOption } from "@/lib/types";

interface StatusRow {
  clientId: string;
  id?: string;
  label: string;
}

interface ProjectStatusesManagerProps {
  initialStatuses: ProjectStatusOption[];
}

function mapToRows(statuses: ProjectStatusOption[]): StatusRow[] {
  return statuses.map((status) => ({
    clientId: status.id,
    id: status.id,
    label: status.label,
  }));
}

export function ProjectStatusesManager({
  initialStatuses,
}: ProjectStatusesManagerProps) {
  const router = useRouter();
  const [rows, setRows] = useState<StatusRow[]>(mapToRows(initialStatuses));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRow = (clientId: string, label: string) => {
    setRows((current) =>
      current.map((row) =>
        row.clientId === clientId ? { ...row, label } : row
      )
    );
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      { clientId: crypto.randomUUID(), label: "" },
    ]);
  };

  const removeRow = (clientId: string) => {
    setRows((current) => current.filter((row) => row.clientId !== clientId));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveProjectStatusesAction(
      rows.map((row) => ({
        id: row.id,
        label: row.label,
      }))
    );

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success("Project statuses saved.");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Project statuses</h1>
        <p className="text-muted-foreground">
          Add, rename, or remove status labels shown on project cards. Projects
          default to no badge until you pick a status.
        </p>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No statuses yet. Add one to show it in the project editor.
          </p>
        ) : (
          rows.map((row, index) => (
            <div
              key={row.clientId}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor={`status-label-${row.clientId}`}>
                  Status {index + 1}
                </Label>
                <Input
                  id={`status-label-${row.clientId}`}
                  value={row.label}
                  onChange={(event) =>
                    updateRow(row.clientId, event.target.value)
                  }
                  placeholder="e.g. Shipped, In progress, Concept"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeRow(row.clientId)}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={addRow}>
          Add status
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save statuses"}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
