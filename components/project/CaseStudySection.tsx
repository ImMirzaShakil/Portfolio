import Image from "next/image";
import {
  getFeatureImageGrid,
  isFeatureSplitLayout,
  isHtmlSectionContent,
  normalizeMediaUrls,
  normalizeSectionItems,
  sanitizeAdminHtml,
  splitFeatureTitle,
  type FeatureImageGrid,
  type FeatureLayout,
} from "@/lib/project-sections";
import { CanvasSectionRenderer } from "@/components/project/CanvasSectionRenderer";
import { BlocksSectionRenderer } from "@/components/project/BlocksSectionRenderer";
import { ContentSectionRenderer } from "@/components/project/ContentSectionRenderer";
import type { ProjectSection } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CaseStudySectionProps {
  section: ProjectSection;
}

function splitParagraphs(content?: string | null) {
  if (!content) return [];
  return content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function SectionBody({
  content,
  asHtml,
  className,
}: {
  content?: string | null;
  asHtml: boolean;
  className?: string;
}) {
  if (!content?.trim()) return null;

  if (asHtml) {
    const html = sanitizeAdminHtml(content);
    if (!html.trim()) return null;
    return (
      <div
        className={cn("case-study-html", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const paragraphs = splitParagraphs(content);
  if (paragraphs.length === 0) return null;

  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-muted-foreground",
        className
      )}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function SectionMediaImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-muted",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
      />
    </div>
  );
}

function FeatureMediaGrid({
  urls,
  layout,
  title,
}: {
  urls: string[];
  layout: FeatureImageGrid;
  title?: string | null;
}) {
  if (urls.length === 0) return null;

  if (layout === "stack") {
    return (
      <div className="space-y-4">
        {urls.map((url, index) => (
          <SectionMediaImage
            key={`${url}-${index}`}
            src={url}
            alt={`${title ?? "Feature"} image ${index + 1}`}
            className="aspect-[16/9]"
          />
        ))}
      </div>
    );
  }

  if (layout === "grid-3") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {urls.map((url, index) => (
          <SectionMediaImage
            key={`${url}-${index}`}
            src={url}
            alt={`${title ?? "Feature"} image ${index + 1}`}
            className="aspect-[4/5]"
          />
        ))}
      </div>
    );
  }

  if (layout === "grid-1-2" && urls.length >= 2) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <SectionMediaImage
          src={urls[0]}
          alt={`${title ?? "Feature"} image 1`}
          className="aspect-[4/5] md:col-span-1"
        />
        <SectionMediaImage
          src={urls[1]}
          alt={`${title ?? "Feature"} image 2`}
          className="aspect-[16/9] md:col-span-2"
        />
        {urls.slice(2).map((url, index) => (
          <SectionMediaImage
            key={`${url}-${index}`}
            src={url}
            alt={`${title ?? "Feature"} image ${index + 3}`}
            className="aspect-[16/9] md:col-span-3"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {urls.map((url, index) => (
        <SectionMediaImage
          key={`${url}-${index}`}
          src={url}
          alt={`${title ?? "Feature"} image ${index + 1}`}
          className="aspect-[5/6]"
        />
      ))}
    </div>
  );
}

export function CaseStudySection({ section }: CaseStudySectionProps) {
  const {
    section_type,
    title,
    content,
    content_format,
    image_url,
    video_url,
    layout,
    media_urls,
    items,
  } = section;

  const asHtml = isHtmlSectionContent(section_type, content_format);
  const paragraphs = asHtml ? [] : splitParagraphs(content);
  const hasBody = asHtml
    ? Boolean(sanitizeAdminHtml(content ?? "").trim())
    : paragraphs.length > 0;
  const listItems = normalizeSectionItems(items);
  const gallery = normalizeMediaUrls(media_urls);
  const featureLayout = (layout as FeatureLayout) || "feature-split-grid-2";
  const featureImageGrid = getFeatureImageGrid(featureLayout);
  const featureSplit = isFeatureSplitLayout(featureLayout);
  const { eyebrow: featureEyebrow, heading: featureHeading } =
    splitFeatureTitle(title);

  if (section_type === "media-hero") {
    if (!image_url && !video_url) return null;

    return (
      <section className="space-y-6" data-section-type={section_type}>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted md:aspect-[21/9]">
          {image_url ? (
            <Image
              src={image_url}
              alt={title ?? "Project media"}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : null}
          {video_url ? (
            <video
              src={video_url}
              autoPlay
              muted
              loop
              playsInline
              className={cn(
                "absolute inset-0 h-full w-full object-contain",
                image_url ? "bg-black/20" : "bg-black"
              )}
            />
          ) : null}
        </div>
        {(title || hasBody) && (
          <div className="space-y-3">
            {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
            <SectionBody
              content={content}
              asHtml={asHtml}
              className="max-w-3xl"
            />
          </div>
        )}
      </section>
    );
  }

  if (section_type === "process") {
    return (
      <section className="space-y-8" data-section-type={section_type}>
        {(title || hasBody) && (
          <div className="space-y-4">
            {title ? (
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            ) : null}
            <SectionBody
              content={content}
              asHtml={asHtml}
              className="max-w-3xl"
            />
          </div>
        )}
        <div className="space-y-6">
          {listItems.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 border-t border-border pt-6 md:grid-cols-[88px_1fr]"
            >
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {item.label || "—"}
              </p>
              <div className="space-y-2">
                {item.title ? (
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                ) : null}
                {item.description ? (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section_type === "stats") {
    return (
      <section className="space-y-8" data-section-type={section_type}>
        {(title || hasBody) && (
          <div className="space-y-4">
            {title ? (
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            ) : null}
            <SectionBody
              content={content}
              asHtml={asHtml}
              className="max-w-3xl"
            />
          </div>
        )}
        <div className="space-y-8">
          {listItems.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 border-t border-border pt-6 md:grid-cols-[140px_1fr]"
            >
              <p className="text-4xl font-bold tracking-tight md:text-5xl">
                {item.label || "—"}
              </p>
              <div className="space-y-2">
                {item.title ? (
                  <h3 className="text-xl font-semibold leading-snug">
                    {item.title}
                  </h3>
                ) : null}
                {item.description ? (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section_type === "feature") {
    return (
      <section className="space-y-8" data-section-type={section_type}>
        {featureSplit ? (
          (featureEyebrow || featureHeading || hasBody) && (
            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:gap-14">
              <div className="space-y-2">
                {featureEyebrow ? (
                  <p className="text-sm font-semibold text-muted-foreground md:text-base">
                    {featureEyebrow}
                  </p>
                ) : null}
                {featureHeading ? (
                  <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                    {featureHeading}
                  </h2>
                ) : null}
              </div>
              {hasBody ? (
                <SectionBody content={content} asHtml={asHtml} />
              ) : null}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {featureEyebrow ? (
              <p className="text-sm font-semibold text-muted-foreground">
                {featureEyebrow}
              </p>
            ) : null}
            {featureHeading ? (
              <h2 className="text-2xl font-bold md:text-3xl">{featureHeading}</h2>
            ) : null}
            <SectionBody
              content={content}
              asHtml={asHtml}
              className="max-w-3xl"
            />
          </div>
        )}
        <FeatureMediaGrid
          urls={gallery}
          layout={featureImageGrid}
          title={featureHeading ?? title}
        />
      </section>
    );
  }

  if (section_type === "video") {
    if (!video_url && !image_url && !title && !hasBody) {
      return null;
    }

    return (
      <section className="space-y-6" data-section-type={section_type}>
        {(title || hasBody) && (
          <div className="space-y-4">
            {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
            <SectionBody
              content={content}
              asHtml={asHtml}
              className="max-w-3xl"
            />
          </div>
        )}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border",
            image_url ? "bg-muted" : "bg-black"
          )}
          style={
            image_url
              ? {
                  backgroundImage: `url(${image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {video_url ? (
            <div className="flex items-center justify-center bg-black/30 p-4 md:p-8">
              <video
                src={video_url}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="max-h-[32rem] w-full max-w-4xl rounded-lg object-contain"
              />
            </div>
          ) : image_url ? (
            <div className="relative aspect-[16/10]">
              <Image
                src={image_url}
                alt={title ?? "Video poster"}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (section_type === "html") {
    const html = sanitizeAdminHtml(content ?? "");
    if (!title && !html.trim()) {
      return null;
    }

    return (
      <section className="space-y-6" data-section-type={section_type}>
        {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
        {html.trim() ? (
          <div
            className="case-study-html"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </section>
    );
  }

  if (section_type === "canvas") {
    return (
      <CanvasSectionRenderer
        title={title}
        canvasData={section.canvas_data}
      />
    );
  }

  if (section_type === "blocks") {
    return (
      <BlocksSectionRenderer
        title={title}
        blocksData={section.blocks_data}
      />
    );
  }

  if (section_type === "content") {
    return (
      <ContentSectionRenderer title={title} html={content} />
    );
  }

  if (!title && !hasBody && !image_url) {
    return null;
  }

  return (
    <section className="space-y-6" data-section-type={section_type}>
      {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}

      <SectionBody content={content} asHtml={asHtml} />

      {image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border">
          <Image
            src={image_url}
            alt={title ?? "Case study image"}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      ) : null}
    </section>
  );
}
