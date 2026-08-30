export const LUTHOR_DOC_VERSION = 1;

export interface LuthorDocument {
  version: number;
  markdown: string;
  json: string;
}

export function createEmptyLuthorDocument(): LuthorDocument {
  return {
    version: LUTHOR_DOC_VERSION,
    markdown: "",
    json: "",
  };
}

export function normalizeLuthorDocument(value: unknown): LuthorDocument {
  if (!value || typeof value !== "object") {
    return createEmptyLuthorDocument();
  }

  const record = value as Record<string, unknown>;

  return {
    version:
      typeof record.version === "number" && Number.isFinite(record.version)
        ? record.version
        : LUTHOR_DOC_VERSION,
    markdown: typeof record.markdown === "string" ? record.markdown : "",
    json: typeof record.json === "string" ? record.json : "",
  };
}

export function isLuthorDocumentEmpty(value: unknown): boolean {
  const doc = normalizeLuthorDocument(value);
  return !doc.markdown.trim() && !doc.json.trim();
}

/** Treat Luthor empty shells like `<p><br></p>` as no content. */
export function isEmptyLuthorHtml(html?: string | null): boolean {
  if (!html) return true;

  const stripped = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.length === 0;
}
