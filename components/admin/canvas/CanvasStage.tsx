"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Ellipse,
  Text,
  Image as KonvaImage,
  Transformer,
  Line,
} from "react-konva";
import type Konva from "konva";
import {
  clampCanvasSize,
  sortCanvasObjects,
  type CanvasDocument,
  type CanvasObject,
} from "@/lib/canvas-document";
import { useCanvasImage } from "@/components/admin/canvas/useCanvasImage";
import { cn } from "@/lib/utils";

interface CanvasStageProps {
  document: CanvasDocument;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChangeObject: (id: string, updates: Partial<CanvasObject>) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  scale: number;
}

const SNAP_THRESHOLD = 8;

function BgImage({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
}) {
  const image = useCanvasImage(url);
  if (!image) {
    return <Rect x={0} y={0} width={width} height={height} fill="#f3f3f0" />;
  }
  return (
    <KonvaImage
      image={image as never}
      x={0}
      y={0}
      width={width}
      height={height}
    />
  );
}

function CanvasImageNode({
  obj,
  onSelect,
  onChange,
}: {
  obj: Extract<CanvasObject, { type: "image" }>;
  onSelect: () => void;
  onChange: (updates: Partial<CanvasObject>) => void;
}) {
  const image = useCanvasImage(obj.src);
  const shapeRef = useRef<Konva.Image>(null);

  return (
    <KonvaImage
      ref={shapeRef}
      id={obj.id}
      image={image as never}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      rotation={obj.rotation}
      opacity={obj.opacity}
      draggable={!obj.locked}
      visible={!obj.hidden}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(8, node.width() * scaleX),
          height: Math.max(8, node.height() * scaleY),
        });
      }}
    />
  );
}

type ResizeEdge = "e" | "s" | "se";

export function CanvasStage({
  document,
  selectedId,
  onSelect,
  onChangeObject,
  onSizeChange,
  scale,
}: CanvasStageProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [guides, setGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });
  const [resizing, setResizing] = useState<ResizeEdge | null>(null);
  const sizeRef = useRef({
    width: document.width,
    height: document.height,
    scale,
  });
  sizeRef.current = {
    width: document.width,
    height: document.height,
    scale,
  };

  const objects = useMemo(
    () => sortCanvasObjects(document.objects),
    [document.objects]
  );

  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne((item: Konva.Node) => item.id() === selectedId);
    const selected = document.objects.find((o) => o.id === selectedId);
    if (node && selected && !selected.locked && !selected.hidden) {
      tr.nodes([node]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, document.objects]);

  const beginResize = (
    edge: ResizeEdge,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(null);

    const startX = event.clientX;
    const startY = event.clientY;
    const startW = sizeRef.current.width;
    const startH = sizeRef.current.height;
    const startScale = sizeRef.current.scale;

    setResizing(edge);

    const onMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / startScale;
      const dy = (moveEvent.clientY - startY) / startScale;
      let width = startW;
      let height = startH;
      if (edge === "e" || edge === "se") width = startW + dx;
      if (edge === "s" || edge === "se") height = startH + dy;
      onSizeChange(clampCanvasSize(width, height));
    };

    const onUp = () => {
      setResizing(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const snapDuringDrag = (node: Konva.Node) => {
    const width = node.width() * node.scaleX();
    const height = node.height() * node.scaleY();
    let x = node.x();
    let y = node.y();
    const vertical: number[] = [];
    const horizontal: number[] = [];

    const centers = {
      x: document.width / 2,
      y: document.height / 2,
    };
    const edges = {
      left: 0,
      right: document.width,
      top: 0,
      bottom: document.height,
    };

    const objCenterX = x + width / 2;
    const objCenterY = y + height / 2;

    if (Math.abs(objCenterX - centers.x) < SNAP_THRESHOLD) {
      x = centers.x - width / 2;
      vertical.push(centers.x);
    } else if (Math.abs(x - edges.left) < SNAP_THRESHOLD) {
      x = edges.left;
      vertical.push(edges.left);
    } else if (Math.abs(x + width - edges.right) < SNAP_THRESHOLD) {
      x = edges.right - width;
      vertical.push(edges.right);
    }

    if (Math.abs(objCenterY - centers.y) < SNAP_THRESHOLD) {
      y = centers.y - height / 2;
      horizontal.push(centers.y);
    } else if (Math.abs(y - edges.top) < SNAP_THRESHOLD) {
      y = edges.top;
      horizontal.push(edges.top);
    } else if (Math.abs(y + height - edges.bottom) < SNAP_THRESHOLD) {
      y = edges.bottom - height;
      horizontal.push(edges.bottom);
    }

    node.position({ x, y });
    setGuides({ vertical, horizontal });
  };

  const stageWidth = document.width * scale;
  const stageHeight = document.height * scale;

  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
      <div
        className={cn(
          "relative mx-auto touch-none shadow-sm",
          resizing && "select-none"
        )}
        style={{ width: stageWidth, height: stageHeight }}
      >
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              onSelect(null);
            }
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) {
              onSelect(null);
            }
          }}
        >
          <Layer>
            {document.background.type === "image" ? (
              <BgImage
                url={document.background.value}
                width={document.width}
                height={document.height}
              />
            ) : (
              <Rect
                x={0}
                y={0}
                width={document.width}
                height={document.height}
                fill={document.background.value || "#ffffff"}
              />
            )}

            {objects.map((obj) => {
              if (obj.hidden) return null;
              const common = {
                id: obj.id,
                x: obj.x,
                y: obj.y,
                rotation: obj.rotation,
                opacity: obj.opacity,
                draggable: !obj.locked,
                onClick: () => onSelect(obj.id),
                onTap: () => onSelect(obj.id),
                onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => {
                  snapDuringDrag(e.target);
                },
                onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                  setGuides({ vertical: [], horizontal: [] });
                  onChangeObject(obj.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                },
              };

              if (obj.type === "text") {
                return (
                  <Text
                    key={obj.id}
                    {...common}
                    width={obj.width}
                    text={obj.text}
                    fontSize={obj.fontSize}
                    fontFamily={obj.fontFamily}
                    fontStyle={obj.fontStyle}
                    fill={obj.fill}
                    align={obj.align}
                    lineHeight={obj.lineHeight}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      onChangeObject(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        width: Math.max(20, node.width() * scaleX),
                        height: Math.max(
                          20,
                          (node.height?.() ?? obj.height) * scaleY
                        ),
                        fontSize: Math.max(
                          8,
                          Math.round(obj.fontSize * scaleY)
                        ),
                      });
                    }}
                  />
                );
              }

              if (obj.type === "rect") {
                return (
                  <Rect
                    key={obj.id}
                    {...common}
                    width={obj.width}
                    height={obj.height}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={obj.strokeWidth}
                    cornerRadius={obj.cornerRadius}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      onChangeObject(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        width: Math.max(8, node.width() * scaleX),
                        height: Math.max(8, node.height() * scaleY),
                      });
                    }}
                  />
                );
              }

              if (obj.type === "ellipse") {
                return (
                  <Ellipse
                    key={obj.id}
                    {...common}
                    x={obj.x + obj.width / 2}
                    y={obj.y + obj.height / 2}
                    radiusX={obj.width / 2}
                    radiusY={obj.height / 2}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={obj.strokeWidth}
                    onDragEnd={(e) => {
                      setGuides({ vertical: [], horizontal: [] });
                      const node = e.target;
                      onChangeObject(obj.id, {
                        x: node.x() - obj.width / 2,
                        y: node.y() - obj.height / 2,
                      });
                    }}
                    onDragMove={(e) => {
                      const node = e.target;
                      const fake = {
                        x: () => node.x() - obj.width / 2,
                        y: () => node.y() - obj.height / 2,
                        width: () => obj.width,
                        height: () => obj.height,
                        scaleX: () => 1,
                        scaleY: () => 1,
                        position: ({ x, y }: { x: number; y: number }) => {
                          node.position({
                            x: x + obj.width / 2,
                            y: y + obj.height / 2,
                          });
                        },
                      };
                      snapDuringDrag(fake as unknown as Konva.Node);
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Ellipse;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      const newW = Math.max(8, obj.width * scaleX);
                      const newH = Math.max(8, obj.height * scaleY);
                      onChangeObject(obj.id, {
                        x: node.x() - newW / 2,
                        y: node.y() - newH / 2,
                        rotation: node.rotation(),
                        width: newW,
                        height: newH,
                      });
                    }}
                  />
                );
              }

              if (obj.type === "image") {
                return (
                  <CanvasImageNode
                    key={obj.id}
                    obj={obj}
                    onSelect={() => onSelect(obj.id)}
                    onChange={(updates) => onChangeObject(obj.id, updates)}
                  />
                );
              }

              return null;
            })}

            {guides.vertical.map((x) => (
              <Line
                key={`v-${x}`}
                points={[x, 0, x, document.height]}
                stroke="#3b82f6"
                strokeWidth={1 / scale}
                dash={[4 / scale, 4 / scale]}
              />
            ))}
            {guides.horizontal.map((y) => (
              <Line
                key={`h-${y}`}
                points={[0, y, document.width, y]}
                stroke="#3b82f6"
                strokeWidth={1 / scale}
                dash={[4 / scale, 4 / scale]}
              />
            ))}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
                "top-center",
                "bottom-center",
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 8 || newBox.height < 8) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>

        {/* Artboard edge drag handles */}
        <div
          data-canvas-resize="e"
          onPointerDown={(event) => beginResize("e", event)}
          className="absolute top-0 -right-1.5 z-10 h-full w-3 cursor-ew-resize"
          title="Drag to change width"
        >
          <span className="absolute top-1/2 right-0.5 h-10 w-1 -translate-y-1/2 rounded-full bg-foreground/40" />
        </div>
        <div
          data-canvas-resize="s"
          onPointerDown={(event) => beginResize("s", event)}
          className="absolute -bottom-1.5 left-0 z-10 h-3 w-full cursor-ns-resize"
          title="Drag to change height"
        >
          <span className="absolute bottom-0.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/40" />
        </div>
        <div
          data-canvas-resize="se"
          onPointerDown={(event) => beginResize("se", event)}
          className="absolute -bottom-2 -right-2 z-20 size-4 cursor-nwse-resize rounded-sm border border-border bg-background shadow-sm"
          title="Drag to resize canvas"
        />
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag the right edge, bottom edge, or corner to resize the canvas
        ({document.width}×{document.height})
      </p>
    </div>
  );
}
