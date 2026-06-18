"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveAboutAction } from "@/app/admin/about/actions";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFunFacts, MAX_HERO_LINE_LENGTH } from "@/lib/homepage";
import { DEFAULT_NAV_ITEMS } from "@/lib/navigation";
import {
  DEFAULT_VISIBLE_SOCIAL_LINKS,
  SOCIAL_LINK_CONFIG,
  type SocialLinkKey,
} from "@/lib/social-links";
import type { AboutContent, NavItem, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AboutFormProps {
  about?: AboutContent | null;
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

export function AboutForm({ about, settings }: AboutFormProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    about?.profile_image_url ?? null
  );
  const [siteTitle, setSiteTitle] = useState(
    settings?.site_title ?? "Mirza Md Shakil"
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(settings?.logo_url ?? null);
  const [logoUrlDark, setLogoUrlDark] = useState<string | null>(
    settings?.logo_url_dark ?? null
  );
  const [heroHeading, setHeroHeading] = useState(settings?.hero_heading ?? "");
  const [introText, setIntroText] = useState(about?.intro_text ?? "");
  const [greetingText, setGreetingText] = useState(
    about?.greeting_text ?? "Nice to meet you!"
  );
  const [funFacts, setFunFacts] = useState<string[]>(() => {
    if (about?.fun_facts && about.fun_facts.length > 0) {
      return about.fun_facts;
    }

    const displayed = getFunFacts(about);
    return displayed.length > 0 ? displayed : [""];
  });
  const [currentlyRole, setCurrentlyRole] = useState(about?.currently_role ?? "");
  const [currentlyCompany, setCurrentlyCompany] = useState(
    about?.currently_company ?? ""
  );
  const [previouslyCompanies, setPreviouslyCompanies] = useState(
    about?.previously_companies ?? ""
  );
  const [showCurrently, setShowCurrently] = useState(
    about?.show_currently !== false
  );
  const [showPreviously, setShowPreviously] = useState(
    about?.show_previously !== false
  );
  const [currentlyLabel, setCurrentlyLabel] = useState(
    about?.currently_label ?? "Currently"
  );
  const [previouslyLabel, setPreviouslyLabel] = useState(
    about?.previously_label ?? "Previously at"
  );
  const [superpower1, setSuperpower1] = useState(about?.superpower_1 ?? "");
  const [superpower2, setSuperpower2] = useState(about?.superpower_2 ?? "");
  const [superpower3, setSuperpower3] = useState(about?.superpower_3 ?? "");
  const [twitterUrl, setTwitterUrl] = useState(about?.twitter_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(about?.linkedin_url ?? "");
  const [githubUrl, setGithubUrl] = useState(about?.github_url ?? "");
  const [email, setEmail] = useState(about?.email ?? "");
  const [visibleSocialLinks, setVisibleSocialLinks] = useState<SocialLinkKey[]>(
    (about?.visible_social_links as SocialLinkKey[] | null) ??
      DEFAULT_VISIBLE_SOCIAL_LINKS
  );
  const [navItems, setNavItems] = useState<NavItem[]>(
    settings?.nav_items?.length ? settings.nav_items : DEFAULT_NAV_ITEMS
  );
  const [footerTagline, setFooterTagline] = useState(
    settings?.footer_tagline ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFunFact = (index: number, value: string) => {
    const trimmed = value.slice(0, MAX_HERO_LINE_LENGTH);
    setFunFacts((current) =>
      current.map((fact, factIndex) => (factIndex === index ? trimmed : fact))
    );
  };

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

  const toggleSocialLink = (key: SocialLinkKey, checked: boolean) => {
    setVisibleSocialLinks((current) =>
      checked
        ? current.includes(key)
          ? current
          : [...current, key]
        : current.filter((item) => item !== key)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveAboutAction({
      id: about?.id,
      settings_id: settings?.id,
      profile_image_url: profileImageUrl,
      site_title: siteTitle,
      logo_url: logoUrl,
      logo_url_dark: logoUrlDark,
      hero_heading: heroHeading,
      intro_text: introText,
      greeting_text: greetingText,
      fun_facts: funFacts,
      currently_role: currentlyRole,
      currently_company: currentlyCompany,
      previously_companies: previouslyCompanies,
      show_currently: showCurrently,
      show_previously: showPreviously,
      currently_label: currentlyLabel,
      previously_label: previouslyLabel,
      superpower_1: superpower1,
      superpower_2: superpower2,
      superpower_3: superpower3,
      twitter_url: twitterUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      email,
      visible_social_links: visibleSocialLinks,
      nav_items: navItems.filter((item) => item.label.trim() && item.href.trim()),
      footer_tagline: footerTagline,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success("About content saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit About</h1>
        <p className="mt-2 text-muted-foreground">
          Update homepage hero, navigation, about page, and footer content.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Hero & site identity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the main heading and rotating subtitle on the homepage.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-title">Site title / your name</Label>
          <Input
            id="site-title"
            value={siteTitle}
            onChange={(event) => setSiteTitle(event.target.value)}
            placeholder="Mirza Md Shakil"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-heading">Hero heading</Label>
          <Input
            id="hero-heading"
            value={heroHeading}
            onChange={(event) => setHeroHeading(event.target.value)}
            placeholder={`Hello, I'm ${siteTitle.split(" ")[0] ?? "Mirza"}`}
          />
          <p className="text-sm text-muted-foreground">
            Leave blank to auto-generate from your first name.
          </p>
        </div>

        <ImageUpload
          label="Site logo (light mode)"
          value={logoUrl}
          onChange={setLogoUrl}
          previewClassName="size-20 rounded-full"
        />
        <p className="text-sm text-muted-foreground">
          Shown in the navbar on light backgrounds. Use a transparent PNG. Falls back to
          initials if removed.
        </p>

        <ImageUpload
          label="Site logo (dark mode)"
          value={logoUrlDark}
          onChange={setLogoUrlDark}
          previewClassName="size-20 rounded-full bg-[#1a1a1a]"
        />
        <p className="text-sm text-muted-foreground">
          Optional white or light logo for dark mode. Falls back to the light logo if
          removed.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Navigation menu</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rename, hide, or add pages to the top navigation. Resume stays separate when uploaded.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setNavItems((current) => [...current, createNavItem()])}
          >
            Add menu item
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
                  onChange={(event) => updateNavItem(index, "label", event.target.value)}
                  placeholder="Work"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`nav-href-${item.id}`}>Page path</Label>
                <Input
                  id={`nav-href-${item.id}`}
                  value={item.href}
                  onChange={(event) => updateNavItem(index, "href", event.target.value)}
                  placeholder="/work"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AdminToggle
                checked={item.is_visible}
                onCheckedChange={(checked) => updateNavItem(index, "is_visible", checked)}
                label="Menu visibility"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setNavItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                disabled={navItems.length === 1}
              >
                Remove menu item
              </Button>
            </div>
          </div>
        ))}
      </section>

      <ImageUpload
        label="Profile image"
        value={profileImageUrl}
        onChange={setProfileImageUrl}
      />

      <div className="space-y-2">
        <Label htmlFor="intro-text">Intro text</Label>
        <Textarea
          id="intro-text"
          value={introText}
          onChange={(event) => setIntroText(event.target.value)}
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="greeting-text">Greeting text</Label>
        <Input
          id="greeting-text"
          value={greetingText}
          onChange={(event) => setGreetingText(event.target.value)}
          placeholder="Nice to meet you!"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>Rotating hero lines</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep each line under {MAX_HERO_LINE_LENGTH} characters so it fits on
              mobile in two lines without clipping.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFunFacts((current) => [...current, ""])}
          >
            Add line
          </Button>
        </div>
        {funFacts.map((fact, index) => (
          <div key={index} className="space-y-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={fact}
                onChange={(event) => updateFunFact(index, event.target.value)}
                placeholder="I value empathy & user-centered design"
                className="flex-1"
                maxLength={MAX_HERO_LINE_LENGTH}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() =>
                  setFunFacts((current) =>
                    current.length === 1
                      ? [""]
                      : current.filter((_, factIndex) => factIndex !== index)
                  )
                }
              >
                Remove line
              </Button>
            </div>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                fact.length >= MAX_HERO_LINE_LENGTH - 8 && "text-amber-600 dark:text-amber-400"
              )}
            >
              {fact.length}/{MAX_HERO_LINE_LENGTH} characters
            </p>
          </div>
        ))}
        {funFacts.length === 0 || funFacts.every((fact) => !fact.trim()) ? (
          <p className="text-sm text-muted-foreground">
            No rotating lines set. The homepage will use a default fallback until you add one.
          </p>
        ) : null}
      </div>

      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Currently & previously</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shown below the hero text on the homepage.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currently-role">Currently role</Label>
            <Input
              id="currently-role"
              value={currentlyRole}
              onChange={(event) => setCurrentlyRole(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currently-company">Currently company</Label>
            <Input
              id="currently-company"
              value={currentlyCompany}
              onChange={(event) => setCurrentlyCompany(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previously-companies">Previously companies</Label>
          <Input
            id="previously-companies"
            value={previouslyCompanies}
            onChange={(event) => setPreviouslyCompanies(event.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currently-label">Currently label</Label>
            <Input
              id="currently-label"
              value={currentlyLabel}
              onChange={(event) => setCurrentlyLabel(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previously-label">Previously label</Label>
            <Input
              id="previously-label"
              value={previouslyLabel}
              onChange={(event) => setPreviouslyLabel(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <AdminToggle
            checked={showCurrently}
            onCheckedChange={setShowCurrently}
            label="Currently section"
          />
          <AdminToggle
            checked={showPreviously}
            onCheckedChange={setShowPreviously}
            label="Previously section"
          />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="superpower-1">Superpower 1</Label>
          <Input
            id="superpower-1"
            value={superpower1}
            onChange={(event) => setSuperpower1(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="superpower-2">Superpower 2</Label>
          <Input
            id="superpower-2"
            value={superpower2}
            onChange={(event) => setSuperpower2(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="superpower-3">Superpower 3</Label>
          <Input
            id="superpower-3"
            value={superpower3}
            onChange={(event) => setSuperpower3(event.target.value)}
          />
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Social links</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add URLs and choose which icons appear on the homepage and footer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="twitter-url">Twitter URL</Label>
            <Input
              id="twitter-url"
              value={twitterUrl}
              onChange={(event) => setTwitterUrl(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <Input
              id="linkedin-url"
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub URL</Label>
            <Input
              id="github-url"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINK_CONFIG.map(({ key, label }) => (
            <AdminToggle
              key={key}
              checked={visibleSocialLinks.includes(key)}
              onCheckedChange={(checked) => toggleSocialLink(key, checked)}
              label={label}
              activeLabel="Shown"
              inactiveLabel="Hidden"
            />
          ))}
        </div>
      </section>

      <div className="space-y-2">
        <Label htmlFor="footer-tagline">Footer tagline</Label>
        <Input
          id="footer-tagline"
          value={footerTagline}
          onChange={(event) => setFooterTagline(event.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
