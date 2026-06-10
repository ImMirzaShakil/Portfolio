import Image from "next/image";

interface CaseStudySectionProps {
  title?: string | null;
  content?: string | null;
  image_url?: string | null;
  section_type: string;
}

export function CaseStudySection({
  title,
  content,
  image_url,
  section_type,
}: CaseStudySectionProps) {
  const paragraphs = content
    ? content.split("\n\n").filter((paragraph) => paragraph.trim().length > 0)
    : [];

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
