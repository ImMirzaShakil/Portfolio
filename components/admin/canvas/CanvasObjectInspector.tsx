"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CanvasObject } from "@/lib/canvas-document";

interface CanvasObjectInspectorProps {
  object: CanvasObject | null;
  onChange: (updates: Partial<CanvasObject>) => void;
  onDelete: () => void;
}

export function CanvasObjectInspector({
  object,
  onChange,
  onDelete,
}: CanvasObjectInspectorProps) {
  if (!object) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Select an object to edit its properties.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold capitalize">{object.type}</p>
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>X</Label>
          <Input
            type="number"
            value={Math.round(object.x)}
            onChange={(e) => onChange({ x: Number(e.target.value) })}
            disabled={object.locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Y</Label>
          <Input
            type="number"
            value={Math.round(object.y)}
            onChange={(e) => onChange({ y: Number(e.target.value) })}
            disabled={object.locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Width</Label>
          <Input
            type="number"
            value={Math.round(object.width)}
            onChange={(e) =>
              onChange({ width: Math.max(1, Number(e.target.value)) })
            }
            disabled={object.locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Height</Label>
          <Input
            type="number"
            value={Math.round(object.height)}
            onChange={(e) =>
              onChange({ height: Math.max(1, Number(e.target.value)) })
            }
            disabled={object.locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Rotation</Label>
          <Input
            type="number"
            value={Math.round(object.rotation)}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            disabled={object.locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Opacity</Label>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={object.opacity}
            onChange={(e) =>
              onChange({
                opacity: Math.min(1, Math.max(0, Number(e.target.value))),
              })
            }
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(object.locked)}
          onChange={(e) => onChange({ locked: e.target.checked })}
        />
        Locked
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(object.hidden)}
          onChange={(e) => onChange({ hidden: e.target.checked })}
        />
        Hidden
      </label>

      {object.type === "text" ? (
        <div className="space-y-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <Label>Text</Label>
            <Textarea
              value={object.text}
              onChange={(e) => onChange({ text: e.target.value } as Partial<CanvasObject>)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Font size</Label>
              <Input
                type="number"
                value={object.fontSize}
                onChange={(e) =>
                  onChange({
                    fontSize: Math.max(8, Number(e.target.value)),
                  } as Partial<CanvasObject>)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <Input
                type="color"
                value={object.fill}
                onChange={(e) =>
                  onChange({ fill: e.target.value } as Partial<CanvasObject>)
                }
                className="h-8 cursor-pointer p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Weight</Label>
              <select
                value={object.fontStyle}
                onChange={(e) =>
                  onChange({
                    fontStyle: e.target.value,
                  } as Partial<CanvasObject>)
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
                <option value="bold italic">Bold italic</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Align</Label>
              <select
                value={object.align}
                onChange={(e) =>
                  onChange({
                    align: e.target.value,
                  } as Partial<CanvasObject>)
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}

      {object.type === "rect" || object.type === "ellipse" ? (
        <div className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fill</Label>
              <Input
                type="color"
                value={object.fill}
                onChange={(e) =>
                  onChange({ fill: e.target.value } as Partial<CanvasObject>)
                }
                className="h-8 cursor-pointer p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stroke</Label>
              <Input
                type="color"
                value={object.stroke}
                onChange={(e) =>
                  onChange({ stroke: e.target.value } as Partial<CanvasObject>)
                }
                className="h-8 cursor-pointer p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stroke width</Label>
              <Input
                type="number"
                min={0}
                value={object.strokeWidth}
                onChange={(e) =>
                  onChange({
                    strokeWidth: Math.max(0, Number(e.target.value)),
                  } as Partial<CanvasObject>)
                }
              />
            </div>
            {object.type === "rect" ? (
              <div className="space-y-1.5">
                <Label>Corner radius</Label>
                <Input
                  type="number"
                  min={0}
                  value={object.cornerRadius}
                  onChange={(e) =>
                    onChange({
                      cornerRadius: Math.max(0, Number(e.target.value)),
                    } as Partial<CanvasObject>)
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
