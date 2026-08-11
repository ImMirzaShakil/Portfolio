"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BLOCK_TYPE_OPTIONS,
  createBlock,
  createEmptyBlocksDocument,
  moveBlock,
  normalizeBlocksDocument,
  type BlockType,
  type BlocksDocument,
  type ContentBlock,
} from "@/lib/blocks-document";
import { cn } from "@/lib/utils";

interface BlocksEditorProps {
  value: unknown;
  onChange: (document: BlocksDocument) => void;
}

function BlockCard({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
  onInsertAfter,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (block: ContentBlock) => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
  onInsertAfter: (type: BlockType) => void;
}) {
  return (
    <div className="group relative space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold capitalize">{block.type}</p>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onMove("up")}
            disabled={index === 0}
            title="Move up"
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            title="Move down"
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            title="Delete block"
            className="text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {block.type === "paragraph" ? (
        <Textarea
          value={block.content}
          onChange={(event) =>
            onChange({ ...block, content: event.target.value })
          }
          rows={4}
          placeholder="Write a paragraph…"
        />
      ) : null}

      {block.type === "heading" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Level</Label>
            <select
              value={block.level}
              onChange={(event) =>
                onChange({
                  ...block,
                  level: Number(event.target.value) as 2 | 3 | 4,
                })
              }
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
          </div>
          <Input
            value={block.content}
            onChange={(event) =>
              onChange({ ...block, content: event.target.value })
            }
            placeholder="Heading text"
            className={cn(
              block.level === 2 && "text-xl font-bold",
              block.level === 3 && "text-lg font-semibold",
              block.level === 4 && "text-base font-semibold"
            )}
          />
        </div>
      ) : null}

      {block.type === "image" ? (
        <div className="space-y-3">
          <ImageUpload
            label="Block image"
            value={block.url || null}
            onChange={(url) => onChange({ ...block, url: url ?? "" })}
            requirementsKind="image"
            previewClassName="aspect-[16/9] max-w-full"
          />
          <Input
            value={block.alt}
            onChange={(event) =>
              onChange({ ...block, alt: event.target.value })
            }
            placeholder="Alt text"
          />
          <Input
            value={block.caption}
            onChange={(event) =>
              onChange({ ...block, caption: event.target.value })
            }
            placeholder="Caption (optional)"
          />
        </div>
      ) : null}

      {block.type === "quote" ? (
        <div className="space-y-3">
          <Textarea
            value={block.content}
            onChange={(event) =>
              onChange({ ...block, content: event.target.value })
            }
            rows={3}
            placeholder="Quote…"
          />
          <Input
            value={block.citation}
            onChange={(event) =>
              onChange({ ...block, citation: event.target.value })
            }
            placeholder="Citation / source (optional)"
          />
        </div>
      ) : null}

      {block.type === "list" ? (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={block.ordered}
              onChange={(event) =>
                onChange({ ...block, ordered: event.target.checked })
              }
            />
            Numbered list
          </label>
          {block.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <Input
                value={item}
                onChange={(event) => {
                  const items = [...block.items];
                  items[itemIndex] = event.target.value;
                  onChange({ ...block, items });
                }}
                placeholder={`Item ${itemIndex + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = block.items.filter((_, i) => i !== itemIndex);
                  onChange({
                    ...block,
                    items: items.length > 0 ? items : [""],
                  });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({ ...block, items: [...block.items, ""] })
            }
          >
            Add item
          </Button>
        </div>
      ) : null}

      {block.type === "columns" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Left column</Label>
            <Textarea
              value={block.left}
              onChange={(event) =>
                onChange({ ...block, left: event.target.value })
              }
              rows={4}
              placeholder="Left column text…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Right column</Label>
            <Textarea
              value={block.right}
              onChange={(event) =>
                onChange({ ...block, right: event.target.value })
              }
              rows={4}
              placeholder="Right column text…"
            />
          </div>
        </div>
      ) : null}

      {block.type === "spacer" ? (
        <div className="space-y-1.5">
          <Label>Height (px)</Label>
          <Input
            type="number"
            min={8}
            max={320}
            value={block.height}
            onChange={(event) =>
              onChange({
                ...block,
                height: Math.max(8, Number(event.target.value) || 48),
              })
            }
            className="w-28"
          />
        </div>
      ) : null}

      {block.type === "divider" ? (
        <div className="border-t border-border pt-2 text-xs text-muted-foreground">
          Horizontal rule on the public page.
        </div>
      ) : null}

      {block.type === "html" ? (
        <Textarea
          value={block.content}
          onChange={(event) =>
            onChange({ ...block, content: event.target.value })
          }
          rows={8}
          className="font-mono text-xs leading-relaxed"
          placeholder={`<div class="my-block">\n  <p>Custom markup…</p>\n</div>`}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Plus className="size-3" />
          Insert after
        </span>
        {BLOCK_TYPE_OPTIONS.map((option) => (
          <Button
            key={option.type}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertAfter(option.type)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function BlocksEditor({ value, onChange }: BlocksEditorProps) {
  const document = normalizeBlocksDocument(value);

  const updateBlocks = (blocks: ContentBlock[]) => {
    onChange({ ...document, blocks });
  };

  const updateBlock = (id: string, next: ContentBlock) => {
    updateBlocks(
      document.blocks.map((block) => (block.id === id ? next : block))
    );
  };

  const insertAfter = (afterId: string | null, type: BlockType) => {
    const block = createBlock(type);
    if (!afterId) {
      updateBlocks([block, ...document.blocks]);
      return;
    }
    const index = document.blocks.findIndex((item) => item.id === afterId);
    if (index < 0) {
      updateBlocks([...document.blocks, block]);
      return;
    }
    const next = [...document.blocks];
    next.splice(index + 1, 0, block);
    updateBlocks(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 p-3">
        <p className="mr-1 text-sm font-medium">Add block</p>
        {BLOCK_TYPE_OPTIONS.map((option) => (
          <Button
            key={option.type}
            type="button"
            variant="outline"
            size="sm"
            title={option.description}
            onClick={() =>
              updateBlocks([...document.blocks, createBlock(option.type)])
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      {document.blocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            No blocks yet. Start with a paragraph or heading.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(createEmptyBlocksDocument())}
          >
            Add paragraph
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {document.blocks.map((block, index) => (
            <BlockCard
              key={block.id}
              block={block}
              index={index}
              total={document.blocks.length}
              onChange={(next) => updateBlock(block.id, next)}
              onMove={(direction) =>
                updateBlocks(moveBlock(document.blocks, block.id, direction))
              }
              onRemove={() =>
                updateBlocks(
                  document.blocks.filter((item) => item.id !== block.id)
                )
              }
              onInsertAfter={(type) => insertAfter(block.id, type)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Stack blocks top-to-bottom like Gutenberg. Reorder with arrows. The
        public page renders these as responsive HTML.
      </p>
    </div>
  );
}
