/** Extract Google site verification content token from a token or full meta tag. */
export function parseGoogleSiteVerification(
  value?: string | null
): string | null {
  if (!value?.trim()) return null;

  const trimmed = value.trim();

  const contentMatch = trimmed.match(
    /name\s*=\s*["']google-site-verification["'][^>]*content\s*=\s*["']([^"']+)["']/i
  );
  if (contentMatch?.[1]) {
    return contentMatch[1].trim();
  }

  const contentFirstMatch = trimmed.match(
    /content\s*=\s*["']([^"']+)["'][^>]*name\s*=\s*["']google-site-verification["']/i
  );
  if (contentFirstMatch?.[1]) {
    return contentFirstMatch[1].trim();
  }

  // Bare token (no HTML)
  if (!trimmed.includes("<") && !/\s/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/** True if snippet is only a google-site-verification meta tag (not analytics). */
export function isGoogleVerificationOnlySnippet(snippet?: string | null) {
  if (!snippet?.trim()) return false;
  const withoutComments = snippet
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return Boolean(
    parseGoogleSiteVerification(withoutComments) &&
      /^<meta\b[^>]*google-site-verification[^>]*>$/i.test(
        withoutComments.replace(/\s+/g, " ").trim()
      )
  );
}
