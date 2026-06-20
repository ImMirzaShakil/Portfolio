"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveSiteSettingsAction } from "@/app/admin/settings/actions";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_NAV_ITEMS } from "@/lib/navigation";
import type { NavItem, SiteSettings } from "@/lib/types";

interface SiteSettingsFormProps {
  settings?: SiteSettings | null;
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

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
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
  const [heroHeading, setHeroHeading] = useState(
    settings?.hero_heading ?? ""
  );
  const [navItems, setNavItems] = useState<NavItem[]>(
    settings?.nav_items?.length ? settings.nav_items : DEFAULT_NAV_ITEMS
  );
  const [footerTagline, setFooterTagline] = useState(
    settings?.footer_tagline ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNavItem = (
    index: number,
    field: keyof Pick<NavItem, "label" | "href" | "is_visible">,
    value: string | boolean
  ) => {
    setNavItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveSiteSettingsAction({
      settings_id: settings?.id,
      site_title: siteTitle,
      profile_image_url: homeProfileImageUrl,
      logo_url: logoUrl,
      logo_url_dark: logoUrlDark,
      hero_heading: heroHeading,
      nav_items: navItems.filter(
        (item) => item.label.trim() && item.href.trim()
      ),
      footer_tagline: footerTagline,
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
          Control your site identity, navigation, homepage hero, and footer.
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
          The circular profile photo shown in the homepage hero. Separate from
          the About page photo.
        </p>

        <ImageUpload
          label="Logo (light mode)"
          value={logoUrl}
          onChange={setLogoUrl}
          previewClassName="size-20 rounded-full"
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
        />
        <p className="text-sm text-muted-foreground">
          Optional white/light logo for dark mode. Falls back to the light logo
          if removed.
        </p>
      </section>

      {/* Homepage hero */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Homepage hero heading</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The large greeting on the homepage hero.
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

      {/* Navigation */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Navigation menu</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rename, hide, or add pages. Resume stays separate when uploaded.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setNavItems((current) => [...current, createNavItem()])
            }
          >
            Add item
          </Button>
        </div>

        {navItems.map((item, index) => (
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
                  value={item.href}
                  onChange={(e) =>
                    updateNavItem(index, "href", e.target.value)
                  }
                  placeholder="/work"
                />
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
                  setNavItems((current) =>
                    current.filter((_, i) => i !== index)
                  )
                }
                disabled={navItems.length === 1}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
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
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
