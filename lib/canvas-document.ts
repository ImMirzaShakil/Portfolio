export const CANVAS_DOC_VERSION = 1;
export const DEFAULT_CANVAS_WIDTH = 1200;
export const DEFAULT_CANVAS_HEIGHT = 675;
export const MIN_CANVAS_WIDTH = 320;
export const MIN_CANVAS_HEIGHT = 180;
export const MAX_CANVAS_SIZE = 4000;

export function clampCanvasSize(width: number, height: number) {
  return {
    width: Math.min(
      MAX_CANVAS_SIZE,
      Math.max(MIN_CANVAS_WIDTH, Math.round(width))
    ),
    height: Math.min(
      MAX_CANVAS_SIZE,
      Math.max(MIN_CANVAS_HEIGHT, Math.round(height))
    ),
  };
}

export type CanvasObjectType = "text" | "image" | "rect" | "ellipse";

export interface CanvasObjectBase {
  id: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;
  name?: string;
}

export interface CanvasTextObject extends CanvasObjectBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: "normal" | "bold" | "italic" | "bold italic";
  fill: string;
  align: "left" | "center" | "right";
  lineHeight: number;
}

export interface CanvasImageObject extends CanvasObjectBase {
  type: "image";
  src: string;
}

export interface CanvasRectObject extends CanvasObjectBase {
  type: "rect";
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface CanvasEllipseObject extends CanvasObjectBase {
  type: "ellipse";
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export type CanvasObject =
  | CanvasTextObject
  | CanvasImageObject
  | CanvasRectObject
  | CanvasEllipseObject;

export interface CanvasBackground {
  type: "color" | "image";
  value: string;
}

export interface CanvasDocument {
  version: number;
  width: number;
  height: number;
  background: CanvasBackground;
  objects: CanvasObject[];
  /** Optional source template id when spawned from a template. */
  templateId?: string | null;
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `obj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyCanvasDocument(): CanvasDocument {
  return {
    version: CANVAS_DOC_VERSION,
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
    background: { type: "color", value: "#ffffff" },
    objects: [],
    templateId: null,
  };
}

export function cloneCanvasDocument(doc: CanvasDocument): CanvasDocument {
  return {
    ...structuredClone(doc),
    objects: doc.objects.map((obj) => ({
      ...structuredClone(obj),
      id: newId(),
    })),
  };
}

export function createTextObject(
  partial?: Partial<CanvasTextObject>
): CanvasTextObject {
  return {
    id: newId(),
    type: "text",
    x: 80,
    y: 80,
    width: 400,
    height: 80,
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    text: "Double-click to edit",
    fontSize: 32,
    fontFamily: "Manrope, sans-serif",
    fontStyle: "bold",
    fill: "#000000",
    align: "left",
    lineHeight: 1.3,
    name: "Text",
    ...partial,
  };
}

export function createImageObject(
  src: string,
  partial?: Partial<CanvasImageObject>
): CanvasImageObject {
  return {
    id: newId(),
    type: "image",
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    src,
    name: "Image",
    ...partial,
  };
}

export function createRectObject(
  partial?: Partial<CanvasRectObject>
): CanvasRectObject {
  return {
    id: newId(),
    type: "rect",
    x: 120,
    y: 120,
    width: 280,
    height: 180,
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    fill: "#eaeae3",
    stroke: "#000000",
    strokeWidth: 0,
    cornerRadius: 16,
    name: "Rectangle",
    ...partial,
  };
}

export function createEllipseObject(
  partial?: Partial<CanvasEllipseObject>
): CanvasEllipseObject {
  return {
    id: newId(),
    type: "ellipse",
    x: 140,
    y: 140,
    width: 220,
    height: 220,
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    fill: "#d4d4c8",
    stroke: "#000000",
    strokeWidth: 0,
    name: "Ellipse",
    ...partial,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clampOpacity(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return 1;
  return Math.min(1, Math.max(0, n));
}

function normalizeObject(raw: unknown, index: number): CanvasObject | null {
  if (!isRecord(raw) || typeof raw.type !== "string") return null;

  const base = {
    id: typeof raw.id === "string" && raw.id ? raw.id : newId(),
    x: typeof raw.x === "number" ? raw.x : 0,
    y: typeof raw.y === "number" ? raw.y : 0,
    width: typeof raw.width === "number" ? Math.max(1, raw.width) : 100,
    height: typeof raw.height === "number" ? Math.max(1, raw.height) : 100,
    rotation: typeof raw.rotation === "number" ? raw.rotation : 0,
    opacity: clampOpacity(raw.opacity),
    zIndex: typeof raw.zIndex === "number" ? raw.zIndex : index,
    locked: Boolean(raw.locked),
    hidden: Boolean(raw.hidden),
    name: typeof raw.name === "string" ? raw.name : undefined,
  };

  switch (raw.type) {
    case "text":
      return {
        ...base,
        type: "text",
        text: typeof raw.text === "string" ? raw.text : "Text",
        fontSize: typeof raw.fontSize === "number" ? raw.fontSize : 24,
        fontFamily:
          typeof raw.fontFamily === "string"
            ? raw.fontFamily
            : "Manrope, sans-serif",
        fontStyle:
          raw.fontStyle === "bold" ||
          raw.fontStyle === "italic" ||
          raw.fontStyle === "bold italic"
            ? raw.fontStyle
            : "normal",
        fill: typeof raw.fill === "string" ? raw.fill : "#000000",
        align:
          raw.align === "center" || raw.align === "right" ? raw.align : "left",
        lineHeight: typeof raw.lineHeight === "number" ? raw.lineHeight : 1.3,
      };
    case "image":
      if (typeof raw.src !== "string" || !raw.src.trim()) return null;
      return {
        ...base,
        type: "image",
        src: raw.src,
      };
    case "rect":
      return {
        ...base,
        type: "rect",
        fill: typeof raw.fill === "string" ? raw.fill : "#eaeae3",
        stroke: typeof raw.stroke === "string" ? raw.stroke : "#000000",
        strokeWidth:
          typeof raw.strokeWidth === "number" ? raw.strokeWidth : 0,
        cornerRadius:
          typeof raw.cornerRadius === "number" ? raw.cornerRadius : 0,
      };
    case "ellipse":
      return {
        ...base,
        type: "ellipse",
        fill: typeof raw.fill === "string" ? raw.fill : "#d4d4c8",
        stroke: typeof raw.stroke === "string" ? raw.stroke : "#000000",
        strokeWidth:
          typeof raw.strokeWidth === "number" ? raw.strokeWidth : 0,
      };
    default:
      return null;
  }
}

export function normalizeCanvasDocument(value: unknown): CanvasDocument {
  if (!isRecord(value)) {
    return createEmptyCanvasDocument();
  }

  const objects = Array.isArray(value.objects)
    ? value.objects
        .map((item, index) => normalizeObject(item, index))
        .filter((item): item is CanvasObject => item !== null)
    : [];

  const background = isRecord(value.background)
    ? {
        type: value.background.type === "image" ? ("image" as const) : ("color" as const),
        value:
          typeof value.background.value === "string"
            ? value.background.value
            : "#ffffff",
      }
    : { type: "color" as const, value: "#ffffff" };

  return {
    version:
      typeof value.version === "number" ? value.version : CANVAS_DOC_VERSION,
    width:
      typeof value.width === "number" && value.width > 0
        ? value.width
        : DEFAULT_CANVAS_WIDTH,
    height:
      typeof value.height === "number" && value.height > 0
        ? value.height
        : DEFAULT_CANVAS_HEIGHT,
    background,
    objects,
    templateId:
      typeof value.templateId === "string" ? value.templateId : null,
  };
}

export function sortCanvasObjects(objects: CanvasObject[]): CanvasObject[] {
  return [...objects].sort((a, b) => a.zIndex - b.zIndex);
}

export function nextZIndex(objects: CanvasObject[]): number {
  if (objects.length === 0) return 0;
  return Math.max(...objects.map((obj) => obj.zIndex)) + 1;
}

export function getObjectLabel(obj: CanvasObject): string {
  if (obj.name?.trim()) return obj.name.trim();
  switch (obj.type) {
    case "text":
      return obj.text.trim().slice(0, 24) || "Text";
    case "image":
      return "Image";
    case "rect":
      return "Rectangle";
    case "ellipse":
      return "Ellipse";
    default:
      return "Object";
  }
}
