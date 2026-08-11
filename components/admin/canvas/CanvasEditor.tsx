"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasLayersPanel } from "@/components/admin/canvas/CanvasLayersPanel";
import { CanvasObjectInspector } from "@/components/admin/canvas/CanvasObjectInspector";
import { CanvasStage } from "@/components/admin/canvas/CanvasStage";
import { CanvasToolbar } from "@/components/admin/canvas/CanvasToolbar";
import {
  clampCanvasSize,
  createEllipseObject,
  createImageObject,
  createRectObject,
  createTextObject,
  nextZIndex,
  normalizeCanvasDocument,
  type CanvasBackground,
  type CanvasDocument,
  type CanvasObject,
} from "@/lib/canvas-document";

interface CanvasEditorProps {
  value: unknown;
  onChange: (document: CanvasDocument) => void;
  onSaveTemplate?: (document: CanvasDocument) => void | Promise<void>;
  savingTemplate?: boolean;
}

export function CanvasEditor({
  value,
  onChange,
  onSaveTemplate,
  savingTemplate = false,
}: CanvasEditorProps) {
  const document = useMemo(() => normalizeCanvasDocument(value), [value]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageHostRef = useRef<HTMLDivElement>(null);
  const [hostWidth, setHostWidth] = useState(640);

  useEffect(() => {
    const el = stageHostRef.current;
    if (!el) return;

    const update = () => {
      setHostWidth(Math.max(240, el.clientWidth));
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selected =
    document.objects.find((obj) => obj.id === selectedId) ?? null;

  const updateDocument = (next: CanvasDocument) => {
    onChange(next);
  };

  const patchObject = (id: string, updates: Partial<CanvasObject>) => {
    updateDocument({
      ...document,
      objects: document.objects.map((obj) =>
        obj.id === id ? ({ ...obj, ...updates } as CanvasObject) : obj
      ),
    });
  };

  const addObject = (obj: CanvasObject) => {
    updateDocument({
      ...document,
      objects: [...document.objects, obj],
    });
    setSelectedId(obj.id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    updateDocument({
      ...document,
      objects: document.objects.filter((obj) => obj.id !== selectedId),
    });
    setSelectedId(null);
  };

  const reorderLayers = (frontToBackIds: string[]) => {
    const zById = new Map(
      frontToBackIds.map((id, index) => [id, frontToBackIds.length - 1 - index])
    );
    updateDocument({
      ...document,
      objects: document.objects.map((obj) => ({
        ...obj,
        zIndex: zById.get(obj.id) ?? obj.zIndex,
      })),
    });
  };

  // Fit artboard to available admin panel width (works on phone → desktop)
  const scale = Math.max(
    0.12,
    Math.min(1, (hostWidth - 32) / Math.max(document.width, 1))
  );

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <CanvasToolbar
        document={document}
        onBackgroundChange={(background: CanvasBackground) =>
          updateDocument({ ...document, background })
        }
        onSizeChange={({ width, height }) =>
          updateDocument({
            ...document,
            ...clampCanvasSize(width, height),
          })
        }
        onAddText={() =>
          addObject(
            createTextObject({ zIndex: nextZIndex(document.objects) })
          )
        }
        onAddRect={() =>
          addObject(
            createRectObject({ zIndex: nextZIndex(document.objects) })
          )
        }
        onAddEllipse={() =>
          addObject(
            createEllipseObject({ zIndex: nextZIndex(document.objects) })
          )
        }
        onAddImage={(url) =>
          addObject(
            createImageObject(url, { zIndex: nextZIndex(document.objects) })
          )
        }
        onSaveTemplate={() => onSaveTemplate?.(document)}
        savingTemplate={savingTemplate}
      />

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_min(100%,240px)]">
        <div ref={stageHostRef} className="min-w-0">
          <CanvasStage
            document={document}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChangeObject={patchObject}
            onSizeChange={({ width, height }) =>
              updateDocument({
                ...document,
                ...clampCanvasSize(width, height),
              })
            }
            scale={scale}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <CanvasLayersPanel
            objects={document.objects}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={reorderLayers}
            onToggleHidden={(id) => {
              const obj = document.objects.find((item) => item.id === id);
              if (!obj) return;
              patchObject(id, { hidden: !obj.hidden });
            }}
            onToggleLocked={(id) => {
              const obj = document.objects.find((item) => item.id === id);
              if (!obj) return;
              patchObject(id, { locked: !obj.locked });
            }}
          />
          <CanvasObjectInspector
            object={selected}
            onChange={(updates) => {
              if (!selectedId) return;
              patchObject(selectedId, updates);
            }}
            onDelete={deleteSelected}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Drag objects to move; use blue handles to resize/rotate. Drag the
        canvas right edge, bottom edge, or corner to change section size.
        Layout scales to your screen in admin and on the live site.
      </p>
    </div>
  );
}
