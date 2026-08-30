import { isEmptyLuthorHtml } from "@/lib/luthor-document";
import { sanitizeAdminHtml } from "@/lib/project-sections";

interface ContentSectionRendererProps {
  title?: string | null;
  html?: string | null;
}

export function ContentSectionRenderer({
  title,
  html,
}: ContentSectionRendererProps) {
  const sanitized = sanitizeAdminHtml(html ?? "");
  const hasHtml = !isEmptyLuthorHtml(sanitized);

  if (!title?.trim() && !hasHtml) return null;

  return (
    <section className="min-w-0 space-y-6" data-section-type="content">
      {title?.trim() ? (
        <h2 className="text-2xl font-bold md:text-3xl">{title.trim()}</h2>
      ) : null}
      {hasHtml ? (
        <div
          className="case-study-html case-study-luthor"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      ) : null}
    </section>
  );
}
