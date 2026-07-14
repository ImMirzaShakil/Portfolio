"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { savePageSeoAction } from "@/app/admin/seo/actions";
import { AdminCollapsibleSection } from "@/components/admin/AdminCollapsibleSection";
import { SeoFieldsEditor } from "@/components/admin/SeoFieldsEditor";
import { Button } from "@/components/ui/button";
import {
  STATIC_SEO_PAGES,
  normalizeSitePageSeo,
  sharedSeoHasContent,
  type SharedSeoFields,
  type SitePageSeo,
  type StaticSeoPageId,
} from "@/lib/seo";
import type { SiteSettings } from "@/lib/types";

interface PageSeoFormProps {
  settings?: SiteSettings | null;
  placeholders: Record<
    StaticSeoPageId,
    { title: string; description: string; image_url?: string }
  >;
}

export function PageSeoForm({ settings, placeholders }: PageSeoFormProps) {
  const [pageSeo, setPageSeo] = useState<SitePageSeo>(() =>
    normalizeSitePageSeo(settings?.page_seo)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePage = (pageId: StaticSeoPageId, value: SharedSeoFields) => {
    setPageSeo((current) => ({
      ...current,
      [pageId]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await savePageSeoAction({
      settings_id: settings?.id,
      page_seo: pageSeo,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success("SEO metadata saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SEO &amp; social metadata</h1>
        <p className="max-w-2xl text-muted-foreground">
          Set one meta title, description, image, and tags per page. The same
          values are used for Google and every social / chat link preview.
          Project metadata is edited on each project&apos;s form.
        </p>
        <p className="text-sm text-muted-foreground">
          Public discoverability also uses{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /sitemap.xml
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /robots.txt
          </code>
          , and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /llms.txt
          </code>
          .
        </p>
      </div>

      {STATIC_SEO_PAGES.map((page) => (
        <AdminCollapsibleSection
          key={page.id}
          title={page.label}
          description={`Path: ${page.path}${
            sharedSeoHasContent(pageSeo[page.id]) ? " · Customized" : ""
          }`}
          defaultOpen={
            page.id === "home" || sharedSeoHasContent(pageSeo[page.id])
          }
        >
          <SeoFieldsEditor
            value={pageSeo[page.id]}
            onChange={(value) => updatePage(page.id, value)}
            placeholders={placeholders[page.id]}
          />
        </AdminCollapsibleSection>
      ))}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save all page SEO"}
      </Button>
    </form>
  );
}
