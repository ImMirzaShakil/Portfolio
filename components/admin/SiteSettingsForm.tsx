"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveSiteSettingsAction } from "@/app/admin/settings/actions";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFunFacts, MAX_HERO_LINE_LENGTH } from "@/lib/homepage";
import {
  DEFAULT_GRAIN_OPACITY,
  MAX_GRAIN_OPACITY,
  MIN_GRAIN_OPACITY,
} from "@/lib/grain-texture";
import { DEFAULT_NAV_ITEMS, ensureNavItems, isResumeNavItem } from "@/lib/navigation";
import type { AboutContent, CustomScript, NavItem, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SiteSettingsFormProps {
  settings?: SiteSettings | null;
  about?: Pick<AboutContent, "id" | "greeting_text" | "fun_facts"> | null;
}

function createNavItem(label = "", href = "/"): NavItem {
  return {
    id: crypto.randomUUID(),
    label,
    href,
    is_visible: true,
    order_index: 0,
  };
}

export function SiteSettingsForm({ settings, about }: SiteSettingsFormProps) {
  const [siteTitle, setSiteTitle] = useState(
    settings?.site_title ?? "Mirza Md Shakil"
  );
  const [homeProfileImageUrl, setHomeProfileImageUrl] = useState<string | null>(
    settings?.profile_image_url ?? null
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(
    settings?.logo_url ?? null
  );
  const [logoUrlDark, setLogoUrlDark] = useState<string | null>(
    settings?.logo_url_dark ?? null
  );
  const [heroHeading, setHeroHeading] = useState(settings?.hero_heading ?? "");
  const [navItems, setNavItems] = useState<NavItem[]>(() =>
    ensureNavItems(
      settings?.nav_items?.length ? settings.nav_items : DEFAULT_NAV_ITEMS
    )
  );
  const [footerTagline, setFooterTagline] = useState(
    settings?.footer_tagline ?? ""
  );
  const [grainOpacity, setGrainOpacity] = useState(
    settings?.grain_opacity ?? DEFAULT_GRAIN_OPACITY
  );
  const [googleAnalyticsSnippet, setGoogleAnalyticsSnippet] = useState(
    settings?.google_analytics_snippet ?? ""
  );
  const [metaPixelSnippet, setMetaPixelSnippet] = useState(
    settings?.meta_pixel_snippet ?? ""
  );
  const [hotjarSnippet, setHotjarSnippet] = useState(
    settings?.hotjar_snippet ?? ""
  );
  const [customScripts, setCustomScripts] = useState<CustomScript[]>(
    settings?.custom_scripts ?? []
  );
  const [greetingText, setGreetingText] = useState(
    about?.greeting_text ?? "Nice to meet you!"
  );
  const [funFacts, setFunFacts] = useState<string[]>(() => {
    if (about?.fun_facts && about.fun_facts.length > 0) return about.fun_facts;
    const displayed = getFunFacts(about as AboutContent | null);
    return displayed.length > 0 ? displayed : [""];
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNavItem = (
    index: number,
    field: keyof Pick<NavItem, "label" | "href" | "is_visible">,
    value: string | boolean
  ) => {
    setNavItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const updateFunFact = (index: number, value: string) => {
    const trimmed = value.slice(0, MAX_HERO_LINE_LENGTH);
    setFunFacts((current) =>
      current.map((fact, i) => (i === index ? trimmed : fact))
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveSiteSettingsAction({
      settings_id: settings?.id,
      about_id: about?.id,
      site_title: siteTitle,
      profile_image_url: homeProfileImageUrl,
      logo_url: logoUrl,
      logo_url_dark: logoUrlDark,
      hero_heading: heroHeading,
      nav_items: ensureNavItems(
        navItems.filter((item) => item.label.trim() && item.href.trim())
      ),
      footer_tagline: footerTagline,
      grain_opacity: grainOpacity,
      google_analytics_snippet: googleAnalyticsSnippet,
      meta_pixel_snippet: metaPixelSnippet,
      hotjar_snippet: hotjarSnippet,
      custom_scripts: customScripts,
      greeting_text: greetingText,
      fun_facts: funFacts,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success("Site settings saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Control your site identity, navigation, homepage hero, rotating lines,
          and footer.
        </p>
      </div>

      {/* Identity */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Identity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your name and logos used across the site.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-title">Your name / site title</Label>
          <Input
            id="site-title"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="Mirza Md Shakil"
          />
        </div>

        <ImageUpload
          label="Homepage profile photo"
          value={homeProfileImageUrl}
          onChange={setHomeProfileImageUrl}
          previewClassName="size-40 rounded-full"
        />
        <p className="text-sm text-muted-foreground">
          Circular photo shown in the homepage hero. Separate from the About
          page portrait (managed in Edit About).
        </p>

        <ImageUpload
          label="Logo (light mode)"
          value={logoUrl}
          onChange={setLogoUrl}
          previewClassName="size-20 rounded-full"
          requirementsKind="logo"
        />
        <p className="text-sm text-muted-foreground">
          Shown in the navbar on light backgrounds. Use a transparent PNG. Falls
          back to initials if removed.
        </p>

        <ImageUpload
          label="Logo (dark mode)"
          value={logoUrlDark}
          onChange={setLogoUrlDark}
          previewClassName="size-20 rounded-full bg-[#1a1a1a]"
          requirementsKind="logo"
        />
        <p className="text-sm text-muted-foreground">
          Optional white/light logo for dark mode. Falls back to the light logo
          if removed.
        </p>
      </section>

      {/* Homepage hero heading */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Homepage hero heading</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The large cursive greeting displayed at the top of your homepage.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-heading">Hero heading</Label>
          <Input
            id="hero-heading"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            placeholder={`Hello, I'm ${siteTitle.split(" ")[0] ?? "there"}`}
          />
          <p className="text-sm text-muted-foreground">
            Leave blank to auto-generate from your first name.
          </p>
        </div>
      </section>

      {/* Rotating hero lines */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Homepage rotating lines</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Short phrases that rotate in the subtitle below the hero heading.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="greeting-text">Greeting text</Label>
          <Input
            id="greeting-text"
            value={greetingText}
            onChange={(e) => setGreetingText(e.target.value)}
            placeholder="Nice to meet you!"
          />
          <p className="text-xs text-muted-foreground">
            Shown in the sidebar / intro on the homepage.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Rotating lines</p>
              <p className="text-xs text-muted-foreground">
                Keep each under {MAX_HERO_LINE_LENGTH} characters for mobile.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFunFacts((c) => [...c, ""])}
            >
              Add line
            </Button>
          </div>

          {funFacts.map((fact, index) => (
            <div key={index} className="space-y-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={fact}
                  onChange={(e) => updateFunFact(index, e.target.value)}
                  placeholder="I value empathy &amp; user-centered design"
                  className="flex-1"
                  maxLength={MAX_HERO_LINE_LENGTH}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() =>
                    setFunFacts((c) =>
                      c.length === 1 ? [""] : c.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
              <p
                className={cn(
                  "text-xs text-muted-foreground",
                  fact.length >= MAX_HERO_LINE_LENGTH - 8 &&
                    "text-amber-600 dark:text-amber-400"
                )}
              >
                {fact.length}/{MAX_HERO_LINE_LENGTH} characters
              </p>
            </div>
          ))}

          {funFacts.every((f) => !f.trim()) ? (
            <p className="text-sm text-muted-foreground">
              No rotating lines set. A default will show until you add one.
            </p>
          ) : null}
        </div>
      </section>

      {/* Navigation */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Navigation menu</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rename, hide, or add pages. Resume uses the PDF from the Resume
              admin page — toggle visibility here like Work and About.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setNavItems((c) => [...c, createNavItem()])}
          >
            Add item
          </Button>
        </div>

        {navItems.map((item, index) => {
          const isResume = isResumeNavItem(item);

          return (
            <div
              key={item.id}
              className="space-y-4 rounded-xl border border-border p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`nav-label-${item.id}`}>Label</Label>
                  <Input
                    id={`nav-label-${item.id}`}
                    value={item.label}
                    onChange={(e) =>
                      updateNavItem(index, "label", e.target.value)
                    }
                    placeholder="Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`nav-href-${item.id}`}>Page path</Label>
                  <Input
                    id={`nav-href-${item.id}`}
                    value={isResume ? "Uploaded PDF (Resume)" : item.href}
                    onChange={(e) =>
                      updateNavItem(index, "href", e.target.value)
                    }
                    placeholder="/work"
                    disabled={isResume}
                  />
                  {isResume ? (
                    <p className="text-xs text-muted-foreground">
                      Opens the PDF from Admin → Resume. Upload a file there
                      first if the link is missing.
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <AdminToggle
                  checked={item.is_visible}
                  onCheckedChange={(checked) =>
                    updateNavItem(index, "is_visible", checked)
                  }
                  label="Visible in menu"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setNavItems((c) => c.filter((_, i) => i !== index))
                  }
                  disabled={navItems.length === 1 || isResume}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Grain texture */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Grain texture</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Controls how visible the film-grain speckles are (not page brightness or
            color). Save, then refresh the public site to preview.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="grain-opacity">Grain intensity</Label>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {grainOpacity}%
            </span>
          </div>
          <input
            id="grain-opacity"
            type="range"
            min={MIN_GRAIN_OPACITY}
            max={MAX_GRAIN_OPACITY}
            step={1}
            value={grainOpacity}
            onChange={(event) => setGrainOpacity(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Off</span>
            <span>Subtle</span>
            <span>Strong</span>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-xl border border-border p-6"
          style={{ background: "var(--background)" }}
        >
          {grainOpacity > 0 && (
            <svg
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                opacity: grainOpacity / 100,
              }}
            >
              <filter id="grain-preview">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-preview)" />
            </svg>
          )}
          <p className="relative text-sm text-muted-foreground">
            Preview at {grainOpacity}% — matches the live site after you save.
          </p>
        </div>
      </section>

      {/* Analytics & tracking */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Analytics &amp; tracking</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste tracking snippets from Google Analytics, Meta Pixel, Hotjar, or
            other tools. These run on every public page to measure traffic and
            behavior — they do not directly affect SEO, but help you understand
            visitors.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="google-analytics-snippet">Google Analytics snippet</Label>
          <Textarea
            id="google-analytics-snippet"
            value={googleAnalyticsSnippet}
            onChange={(e) => setGoogleAnalyticsSnippet(e.target.value)}
            rows={5}
            placeholder="Paste your Google Analytics / gtag.js code here…"
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-pixel-snippet">Meta Pixel snippet</Label>
          <Textarea
            id="meta-pixel-snippet"
            value={metaPixelSnippet}
            onChange={(e) => setMetaPixelSnippet(e.target.value)}
            rows={5}
            placeholder="Paste your Meta (Facebook) Pixel code here…"
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotjar-snippet">Hotjar snippet</Label>
          <Textarea
            id="hotjar-snippet"
            value={hotjarSnippet}
            onChange={(e) => setHotjarSnippet(e.target.value)}
            rows={5}
            placeholder="Paste your Hotjar tracking code here…"
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label>Custom scripts</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCustomScripts((current) => [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    label: `Snippet #${current.length + 1}`,
                    code: "",
                  },
                ])
              }
            >
              + Add snippet
            </Button>
          </div>

          {customScripts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No custom scripts yet. Use the button above to add more tracking
              or embed codes.
            </p>
          ) : (
            customScripts.map((script, index) => (
              <div
                key={script.id}
                className="space-y-2 rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <Input
                    value={script.label}
                    onChange={(e) =>
                      setCustomScripts((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, label: e.target.value } : item
                        )
                      )
                    }
                    placeholder={`Snippet #${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      setCustomScripts((current) =>
                        current.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
                <Textarea
                  value={script.code}
                  onChange={(e) =>
                    setCustomScripts((current) =>
                      current.map((item, i) =>
                        i === index ? { ...item, code: e.target.value } : item
                      )
                    )
                  }
                  rows={5}
                  placeholder="Paste your code here…"
                  className="font-mono text-xs"
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Footer</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="footer-tagline">Footer tagline</Label>
          <Input
            id="footer-tagline"
            value={footerTagline}
            onChange={(e) => setFooterTagline(e.target.value)}
            placeholder="Coded in the twilight of endless refactors"
          />
        </div>
      </section>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
