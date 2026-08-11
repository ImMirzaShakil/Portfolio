export const BLOCKS_DOC_VERSION = 1;

export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "list"
  | "columns"
  | "spacer"
  | "divider"
  | "html";

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BlockBase {
  type: "paragraph";
  content: string;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  level: 2 | 3 | 4;
  content: string;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  url: string;
  alt: string;
  caption: string;
}

export interface QuoteBlock extends BlockBase {
  type: "quote";
  content: string;
  citation: string;
}

export interface ListBlock extends BlockBase {
  type: "list";
  ordered: boolean;
  items: string[];
}

export interface ColumnsBlock extends BlockBase {
  type: "columns";
  left: string;
  right: string;
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  height: number;
}

export interface DividerBlock extends BlockBase {
  type: "divider";
}

export interface HtmlBlock extends BlockBase {
  type: "html";
  content: string;
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | ListBlock
  | ColumnsBlock
  | SpacerBlock
  | DividerBlock
  | HtmlBlock;

export interface BlocksDocument {
  version: number;
  blocks: ContentBlock[];
}

export const BLOCK_TYPE_OPTIONS: Array<{
  type: BlockType;
  label: string;
  description: string;
}> = [
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Body text",
  },
  {
    type: "heading",
    label: "Heading",
    description: "Section heading",
  },
  {
    type: "image",
    label: "Image",
    description: "Full-width image with optional caption",
  },
  {
    type: "quote",
    label: "Quote",
    description: "Pull quote / citation",
  },
  {
    type: "list",
    label: "List",
    description: "Bulleted or numbered list",
  },
  {
    type: "columns",
    label: "Columns",
    description: "Two text columns",
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Vertical space",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Horizontal rule",
  },
  {
    type: "html",
    label: "Custom HTML",
    description: "Raw HTML block",
  },
];

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyBlocksDocument(): BlocksDocument {
  return {
    version: BLOCKS_DOC_VERSION,
    blocks: [createBlock("paragraph")],
  };
}

export function createBlock(type: BlockType): ContentBlock {
  switch (type) {
    case "paragraph":
      return { id: newId(), type, content: "" };
    case "heading":
      return { id: newId(), type, level: 2, content: "" };
    case "image":
      return { id: newId(), type, url: "", alt: "", caption: "" };
    case "quote":
      return { id: newId(), type, content: "", citation: "" };
    case "list":
      return { id: newId(), type, ordered: false, items: [""] };
    case "columns":
      return { id: newId(), type, left: "", right: "" };
    case "spacer":
      return { id: newId(), type, height: 48 };
    case "divider":
      return { id: newId(), type };
    case "html":
      return { id: newId(), type, content: "" };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeBlock(raw: unknown): ContentBlock | null {
  if (!isRecord(raw) || typeof raw.type !== "string") return null;
  const id =
    typeof raw.id === "string" && raw.id ? raw.id : newId();

  switch (raw.type) {
    case "paragraph":
      return {
        id,
        type: "paragraph",
        content: typeof raw.content === "string" ? raw.content : "",
      };
    case "heading": {
      const level = raw.level === 3 || raw.level === 4 ? raw.level : 2;
      return {
        id,
        type: "heading",
        level,
        content: typeof raw.content === "string" ? raw.content : "",
      };
    }
    case "image":
      return {
        id,
        type: "image",
        url: typeof raw.url === "string" ? raw.url : "",
        alt: typeof raw.alt === "string" ? raw.alt : "",
        caption: typeof raw.caption === "string" ? raw.caption : "",
      };
    case "quote":
      return {
        id,
        type: "quote",
        content: typeof raw.content === "string" ? raw.content : "",
        citation: typeof raw.citation === "string" ? raw.citation : "",
      };
    case "list": {
      const items = Array.isArray(raw.items)
        ? raw.items.filter((item): item is string => typeof item === "string")
        : [""];
      return {
        id,
        type: "list",
        ordered: Boolean(raw.ordered),
        items: items.length > 0 ? items : [""],
      };
    }
    case "columns":
      return {
        id,
        type: "columns",
        left: typeof raw.left === "string" ? raw.left : "",
        right: typeof raw.right === "string" ? raw.right : "",
      };
    case "spacer":
      return {
        id,
        type: "spacer",
        height:
          typeof raw.height === "number" && raw.height > 0 ? raw.height : 48,
      };
    case "divider":
      return { id, type: "divider" };
    case "html":
      return {
        id,
        type: "html",
        content: typeof raw.content === "string" ? raw.content : "",
      };
    default:
      return null;
  }
}

export function normalizeBlocksDocument(value: unknown): BlocksDocument {
  if (!isRecord(value)) {
    return createEmptyBlocksDocument();
  }

  const blocks = Array.isArray(value.blocks)
    ? value.blocks
        .map((item) => normalizeBlock(item))
        .filter((item): item is ContentBlock => item !== null)
    : [];

  return {
    version:
      typeof value.version === "number" ? value.version : BLOCKS_DOC_VERSION,
    blocks: blocks.length > 0 ? blocks : [createBlock("paragraph")],
  };
}

export function moveBlock(
  blocks: ContentBlock[],
  id: string,
  direction: "up" | "down"
): ContentBlock[] {
  const index = blocks.findIndex((block) => block.id === id);
  if (index < 0) return blocks;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= blocks.length) return blocks;
  const next = [...blocks];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
