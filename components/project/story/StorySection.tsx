import type { CSSProperties, ReactNode } from "react";
import { StoryZoomImage } from "@/components/project/story/StoryZoomImage";
import { sanitizeAdminHtml } from "@/lib/project-sections";
import {
  isStorySplitBody,
  isStoryVideoUrl,
  toEmbedUrl,
  type StoryDocument,
  type StoryMedia,
} from "@/lib/story-section";
import { cn } from "@/lib/utils";

interface StorySectionProps {
  id: string;
  doc: StoryDocument;
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Section paragraph: plain text split on blank lines, or sanitized HTML. */
function StoryText({ doc }: { doc: StoryDocument }) {
  if (doc.textFormat === "html") {
    const html = sanitizeAdminHtml(doc.text).trim();
    if (!html) return null;
    return (
      <div className="story-html" dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return <Paragraphs text={doc.text} />;
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {paragraphs(text).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}

function isVideo(media: StoryMedia) {
  return media.kind === "video" || isStoryVideoUrl(media.url);
}

function MediaItem({ media, alt }: { media: StoryMedia; alt: string }) {
  if (!media.url) return null;
  if (isVideo(media)) {
    return (
      <video
        className="story-media-video"
        src={media.url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return <StoryZoomImage src={media.url} alt={media.title || media.caption || alt} />;
}

function StoryHeading({ doc }: { doc: StoryDocument }) {
  const hasHeading = Boolean(doc.top || doc.bottom);
  if (!hasHeading && !doc.text) return null;

  if (doc.header === "statement") {
    return (
      <div className="story-container story-statement">
        {doc.top ? <h3>{doc.top}</h3> : null}
        {doc.textFormat === "html" && doc.text ? (
          <div
            className="story-statement-text story-html"
            dangerouslySetInnerHTML={{ __html: sanitizeAdminHtml(doc.text) }}
          />
        ) : doc.text || doc.bottom ? (
          <h2 className="story-statement-text">{doc.text || doc.bottom}</h2>
        ) : null}
      </div>
    );
  }

  if (doc.header === "quote") {
    return (
      <figure className="story-quote">
        <p className="story-quote-mark" aria-hidden="true">
          &ldquo;
        </p>
        <blockquote>
          {doc.textFormat === "html" ? (
            <div
              className="story-quote-text story-html"
              dangerouslySetInnerHTML={{ __html: sanitizeAdminHtml(doc.text) }}
            />
          ) : (
            <p className="story-quote-text">{doc.text}</p>
          )}
        </blockquote>
        <figcaption>
          {doc.top ? <h3>{doc.top}</h3> : null}
          {doc.bottom ? <p>{doc.bottom}</p> : null}
        </figcaption>
      </figure>
    );
  }

  const heading = hasHeading ? (
    <>
      {doc.top ? <h2 className="story-heading">{doc.top}</h2> : null}
      {doc.bottom ? (
        <h2 className="story-heading story-heading--muted">{doc.bottom}</h2>
      ) : null}
    </>
  ) : null;

  if (doc.header === "vertical") {
    return (
      <div className="story-container">
        <div className="story-ver">
          <div className="story-ver-title">
            {heading}
            <StoryText doc={doc} />
          </div>
          {doc.items.length > 0 ? (
            <div className="story-ver-list">
              {doc.items.map((item) => (
                <div key={item.id} className="contents">
                  <div className="story-ver-label">
                    <h3>{item.label}</h3>
                  </div>
                  <div className="story-ver-item">
                    {item.title ? <h3>{item.title}</h3> : null}
                    {item.description ? <p>{item.description}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="story-container">
      <div className="story-hor">
        <div>{heading}</div>
        <div>
          <StoryText doc={doc} />
        </div>
      </div>
    </div>
  );
}

function StoryBodyMedia({ doc, alt }: { doc: StoryDocument; alt: string }) {
  const media = doc.media.filter((item) => item.url);

  switch (doc.body) {
    case "none":
      return null;

    case "embed": {
      const src = toEmbedUrl(doc.embedUrl);
      if (!src) return null;
      return (
        <div className="story-container">
          <div className="story-embed">
            <iframe
              src={src}
              title={alt}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    case "backdrop-video": {
      if (media.length === 0 && !doc.backdropUrl) return null;
      return (
        <div
          className="story-backdrop story-flush"
          style={
            doc.backdropUrl
              ? { backgroundImage: `url('${doc.backdropUrl}')` }
              : undefined
          }
        >
          {media[0] ? <MediaItem media={media[0]} alt={alt} /> : null}
        </div>
      );
    }

    case "full-bleed":
    case "video":
      if (media.length === 0) return null;
      return (
        <div className="story-stack story-flush">
          {media.map((item) => (
            <MediaItem key={item.id} media={item} alt={alt} />
          ))}
        </div>
      );

    case "showcase":
      if (media.length === 0) return null;
      return (
        <div className="story-showcase">
          {media.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "story-showcase-row",
                index % 2 === 1 && "story-showcase-row--reverse"
              )}
            >
              <div className="story-showcase-media">
                <MediaItem media={item} alt={alt} />
              </div>
              <div className="story-showcase-text">
                {item.title ? <h2>{item.title}</h2> : null}
                {item.caption ? <Paragraphs text={item.caption} /> : null}
              </div>
            </div>
          ))}
        </div>
      );

    case "marquee": {
      const images = media.filter((item) => !isVideo(item));
      if (images.length === 0) return null;
      const style = {
        "--story-marquee-duration": `${Math.max(20, images.length * 6)}s`,
      } as CSSProperties;
      const strip = (hidden: boolean) =>
        images.map((item) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${item.id}-${hidden ? "b" : "a"}`}
            src={item.url}
            alt={hidden ? "" : item.title || alt}
            aria-hidden={hidden || undefined}
            loading="lazy"
          />
        ));
      return (
        <div className="story-marquee">
          <div className="story-marquee-track" style={style}>
            {strip(false)}
            {strip(true)}
          </div>
        </div>
      );
    }

    case "before-after":
      if (media.length === 0) return null;
      return (
        <div className="story-container">
          <div className="story-grid story-before-after">
            {media.map((item, index) => (
              <div key={item.id}>
                <MediaItem media={item} alt={alt} />
                <h4>{item.title || (index % 2 === 0 ? "Before" : "After")}</h4>
                {item.caption ? <p>{item.caption}</p> : null}
              </div>
            ))}
          </div>
        </div>
      );

    case "compare":
      if (media.length === 0) return null;
      return (
        <div className="story-container">
          <div className="story-grid">
            {media.map((item) => (
              <div key={item.id}>
                <MediaItem media={item} alt={alt} />
                {item.title || item.caption ? (
                  <p className="story-caption">
                    {item.title ? <b>{item.title} </b> : null}
                    {item.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );

    case "grid-2":
    case "grid-1-2":
    case "grid-2-wide":
    case "grid-3":
      if (media.length === 0) return null;
      return (
        <div className="story-container">
          <div className={cn("story-grid", `story-grid--${doc.body.slice(5)}`)}>
            {media.map((item) => (
              <div key={item.id}>
                <MediaItem media={item} alt={alt} />
              </div>
            ))}
          </div>
        </div>
      );

    case "single":
    default:
      if (media.length === 0) return null;
      return (
        <div className="story-container">
          <div className="story-stack">
            {media.map((item) => (
              <MediaItem key={item.id} media={item} alt={alt} />
            ))}
          </div>
        </div>
      );
  }
}

/** Narrow (1/3) or half (1/2) media beside the heading + paragraph. */
function StorySplit({ doc, alt }: { doc: StoryDocument; alt: string }) {
  const media = doc.media.filter((item) => item.url);
  const showText = doc.header !== "none";
  return (
    <div className="story-container">
      <div
        className={cn(
          "story-split",
          doc.body === "split-half" ? "story-split--half" : "story-split--narrow",
          doc.mediaSide === "right" && "story-split--media-right"
        )}
      >
        <div className="story-split-media">
          {media.map((item) => (
            <MediaItem key={item.id} media={item} alt={alt} />
          ))}
        </div>
        {showText ? (
          <div className="story-split-text">
            {doc.top ? <h2 className="story-heading">{doc.top}</h2> : null}
            {doc.bottom ? (
              <h2 className="story-heading story-heading--muted">{doc.bottom}</h2>
            ) : null}
            {doc.top || doc.bottom ? <div className="story-split-gap" /> : null}
            <StoryText doc={doc} />
            {doc.items.length > 0 ? (
              <div className="story-split-list">
                {doc.items.map((item) => (
                  <div key={item.id} className="story-split-row">
                    {item.label ? <h3>{item.label}</h3> : <span />}
                    <div>
                      {item.title ? <h3>{item.title}</h3> : null}
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function StorySection({ id, doc }: StorySectionProps) {
  const alt = [doc.top, doc.bottom].filter(Boolean).join(" ") || "Case study media";

  if (isStorySplitBody(doc.body)) {
    return (
      <section
        id={id}
        className={cn("story-band", `story-band--${doc.band}`)}
        data-section-type="story"
      >
        <StorySplit doc={doc} alt={alt} />
      </section>
    );
  }

  const heading: ReactNode =
    doc.header === "none" ? null : <StoryHeading doc={doc} />;
  const body = <StoryBodyMedia doc={doc} alt={alt} />;

  return (
    <section
      id={id}
      className={cn("story-band", `story-band--${doc.band}`)}
      data-section-type="story"
    >
      {heading}
      {body}
    </section>
  );
}
