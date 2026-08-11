import Image from "next/image";
import {
  normalizeBlocksDocument,
  type ContentBlock,
} from "@/lib/blocks-document";
import { sanitizeAdminHtml } from "@/lib/project-sections";

interface BlocksSectionRendererProps {
  title?: string | null;
  blocksData: unknown;
}

function splitParagraphs(content: string) {
  return content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function isGifUrl(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".gif");
}

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph": {
      const paragraphs = splitParagraphs(block.content);
      if (paragraphs.length === 0) return null;
      return (
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      );
    }
    case "heading": {
      if (!block.content.trim()) return null;
      if (block.level === 3) {
        return <h3 className="text-xl font-bold md:text-2xl">{block.content}</h3>;
      }
      if (block.level === 4) {
        return <h4 className="text-lg font-semibold md:text-xl">{block.content}</h4>;
      }
      return <h2 className="text-2xl font-bold md:text-3xl">{block.content}</h2>;
    }
    case "image": {
      if (!block.url.trim()) return null;
      return (
        <figure className="space-y-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {isGifUrl(block.url) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.url}
                alt={block.alt || ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={block.url}
                alt={block.alt || ""}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            )}
          </div>
          {block.caption.trim() ? (
            <figcaption className="text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "quote": {
      if (!block.content.trim()) return null;
      return (
        <blockquote className="space-y-2 border-l-4 border-foreground pl-5">
          <p className="text-lg leading-relaxed text-foreground md:text-xl">
            {block.content}
          </p>
          {block.citation.trim() ? (
            <cite className="block text-sm not-italic text-muted-foreground">
              — {block.citation}
            </cite>
          ) : null}
        </blockquote>
      );
    }
    case "list": {
      const items = block.items.map((item) => item.trim()).filter(Boolean);
      if (items.length === 0) return null;
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={
            block.ordered
              ? "list-decimal space-y-2 pl-5 text-base leading-relaxed text-muted-foreground"
              : "list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground"
          }
        >
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "columns": {
      const left = splitParagraphs(block.left);
      const right = splitParagraphs(block.right);
      if (left.length === 0 && right.length === 0) return null;
      return (
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {left.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {right.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      );
    }
    case "spacer":
      return <div style={{ height: block.height }} aria-hidden="true" />;
    case "divider":
      return <hr className="border-border" />;
    case "html": {
      const html = sanitizeAdminHtml(block.content).trim();
      if (!html) return null;
      return (
        <div
          className="case-study-html"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    default:
      return null;
  }
}

export function BlocksSectionRenderer({
  title,
  blocksData,
}: BlocksSectionRendererProps) {
  const doc = normalizeBlocksDocument(blocksData);
  const hasContent = doc.blocks.some((block) => {
    switch (block.type) {
      case "paragraph":
      case "heading":
      case "quote":
      case "html":
        return Boolean(block.content.trim());
      case "image":
        return Boolean(block.url.trim());
      case "list":
        return block.items.some((item) => item.trim());
      case "columns":
        return Boolean(block.left.trim() || block.right.trim());
      case "spacer":
      case "divider":
        return true;
      default:
        return false;
    }
  });

  if (!title?.trim() && !hasContent) return null;

  return (
    <section className="min-w-0 space-y-8" data-section-type="blocks">
      {title?.trim() ? (
        <h2 className="text-2xl font-bold md:text-3xl">{title.trim()}</h2>
      ) : null}
      <div className="space-y-8 md:space-y-10">
        {doc.blocks.map((block) => (
          <RenderBlock key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}
