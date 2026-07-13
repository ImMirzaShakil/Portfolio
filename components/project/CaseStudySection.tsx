import Image from "next/image";
import {
  normalizeMediaUrls,
  normalizeSectionItems,
  sanitizeAdminHtml,
  type FeatureLayout,
} from "@/lib/project-sections";
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
  layout: FeatureLayout;
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
            className="aspect-[16/10]"
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
          className="aspect-[3/4] md:col-span-1"
        />
        <SectionMediaImage
          src={urls[1]}
          alt={`${title ?? "Feature"} image 2`}
          className="aspect-[16/10] md:col-span-2"
        />
        {urls.slice(2).map((url, index) => (
          <SectionMediaImage
            key={`${url}-${index}`}
            src={url}
            alt={`${title ?? "Feature"} image ${index + 3}`}
            className="aspect-[16/10] md:col-span-3"
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
          className="aspect-[4/5]"
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
    image_url,
    video_url,
    layout,
    media_urls,
    items,
  } = section;

  const paragraphs = splitParagraphs(content);
  const listItems = normalizeSectionItems(items);
  const gallery = normalizeMediaUrls(media_urls);
  const featureLayout = (layout as FeatureLayout) || "grid-2";

  if (section_type === "media-hero") {
    if (!image_url && !video_url) return null;

    return (
      <section
        className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
        data-section-type={section_type}
      >
        <div className="relative aspect-[16/9] w-full bg-muted md:aspect-[21/9]">
          {image_url ? (
            <Image
              src={image_url}
              alt={title ?? "Project media"}
              fill
              className="object-cover"
              sizes="100vw"
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
        {(title || paragraphs.length > 0) && (
          <div className="site-container space-y-3 py-8">
            {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-3xl text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (section_type === "process") {
    return (
      <section className="space-y-8" data-section-type={section_type}>
        {(title || paragraphs.length > 0) && (
          <div className="space-y-4">
            {title ? <h2 className="text-2xl font-bold md:text-3xl">{title}</h2> : null}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-3xl text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
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
        {(title || paragraphs.length > 0) && (
          <div className="space-y-4">
            {title ? <h2 className="text-2xl font-bold md:text-3xl">{title}</h2> : null}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-3xl text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
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
        <div className="space-y-4">
          {title ? <h2 className="text-2xl font-bold md:text-3xl">{title}</h2> : null}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-3xl text-base leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <FeatureMediaGrid
          urls={gallery}
          layout={featureLayout}
          title={title}
        />
      </section>
    );
  }

  if (section_type === "video") {
    if (!video_url && !image_url && !title && paragraphs.length === 0) {
      return null;
    }

    return (
      <section className="space-y-6" data-section-type={section_type}>
        {(title || paragraphs.length > 0) && (
          <div className="space-y-4">
            {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-3xl text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
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

  if (!title && paragraphs.length === 0 && !image_url) {
    return null;
  }

  return (
    <section className="space-y-6" data-section-type={section_type}>
      {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}

      {paragraphs.length > 0 ? (
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

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
