"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveAboutAction } from "@/app/admin/about/actions";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { FeaturedInManager } from "@/components/admin/FeaturedInManager";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFunFacts, MAX_HERO_LINE_LENGTH } from "@/lib/homepage";
import {
  DEFAULT_VISIBLE_SOCIAL_LINKS,
  SOCIAL_LINK_CONFIG,
  type SocialLinkKey,
} from "@/lib/social-links";
import type { AboutContent, FeaturedIn } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AboutFormProps {
  about?: AboutContent | null;
  featuredIn?: FeaturedIn[];
}

export function AboutForm({ about, featuredIn: initialFeaturedIn = [] }: AboutFormProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    about?.profile_image_url ?? null
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    about?.gallery_images ?? []
  );
  const [pronunciation, setPronunciation] = useState(
    about?.pronunciation ?? ""
  );
  const [introText, setIntroText] = useState(about?.intro_text ?? "");
  const [dayJobDescription, setDayJobDescription] = useState(
    about?.day_job_description ?? ""
  );
  const [currentlyRole, setCurrentlyRole] = useState(
    about?.currently_role ?? ""
  );
  const [currentlyCompany, setCurrentlyCompany] = useState(
    about?.currently_company ?? ""
  );
  const [outOfOfficeText, setOutOfOfficeText] = useState(
    about?.out_of_office_text ?? about?.previously_companies ?? ""
  );
  const [internshipsDescription, setInternshipsDescription] = useState(
    about?.internships_description ?? ""
  );
  const [superpower1, setSuperpower1] = useState(about?.superpower_1 ?? "");
  const [superpower1Desc, setSuperpower1Desc] = useState(
    about?.superpower_1_desc ?? ""
  );
  const [superpower2, setSuperpower2] = useState(about?.superpower_2 ?? "");
  const [superpower2Desc, setSuperpower2Desc] = useState(
    about?.superpower_2_desc ?? ""
  );
  const [superpower3, setSuperpower3] = useState(about?.superpower_3 ?? "");
  const [superpower3Desc, setSuperpower3Desc] = useState(
    about?.superpower_3_desc ?? ""
  );
  const [superpower4, setSuperpower4] = useState(about?.superpower_4 ?? "");
  const [superpower4Desc, setSuperpower4Desc] = useState(
    about?.superpower_4_desc ?? ""
  );
  const [twitterUrl, setTwitterUrl] = useState(about?.twitter_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(about?.linkedin_url ?? "");
  const [githubUrl, setGithubUrl] = useState(about?.github_url ?? "");
  const [email, setEmail] = useState(about?.email ?? "");
  const [visibleSocialLinks, setVisibleSocialLinks] = useState<SocialLinkKey[]>(
    (about?.visible_social_links as SocialLinkKey[] | null) ??
      DEFAULT_VISIBLE_SOCIAL_LINKS
  );
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
  const [featuredIn, setFeaturedIn] = useState<FeaturedIn[]>(
    initialFeaturedIn
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFunFact = (index: number, value: string) => {
    const trimmed = value.slice(0, MAX_HERO_LINE_LENGTH);
    setFunFacts((current) =>
      current.map((fact, i) => (i === index ? trimmed : fact))
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
      profile_image_url: profileImageUrl,
      gallery_images: galleryImages,
      pronunciation,
      intro_text: introText,
      greeting_text: greetingText,
      fun_facts: funFacts,
      day_job_description: dayJobDescription,
      currently_role: currentlyRole,
      currently_company: currentlyCompany,
      out_of_office_text: outOfOfficeText,
      previously_companies: outOfOfficeText,
      internships_description: internshipsDescription,
      show_currently: true,
      show_previously: true,
      currently_label: "Currently",
      previously_label: "Previously at",
      superpower_1: superpower1,
      superpower_1_desc: superpower1Desc,
      superpower_2: superpower2,
      superpower_2_desc: superpower2Desc,
      superpower_3: superpower3,
      superpower_3_desc: superpower3Desc,
      superpower_4: superpower4,
      superpower_4_desc: superpower4Desc,
      twitter_url: twitterUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      email,
      visible_social_links: visibleSocialLinks,
      featured_in: featuredIn,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success("About page saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit About</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your About page content — profile, intro, superpowers, gallery, and more.
        </p>
      </div>

      {/* Profile image */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Profile photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Large portrait photo shown at the top of your About page.
          </p>
        </div>
        <ImageUpload
          label="Profile photo"
          value={profileImageUrl}
          onChange={setProfileImageUrl}
          previewClassName="w-48 aspect-[3/4]"
        />
      </section>

      {/* Intro */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Intro</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The hero text shown beside your photo.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pronunciation">Pronunciation guide</Label>
          <Input
            id="pronunciation"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="/mur·zah sha·keel/"
          />
          <p className="text-xs text-muted-foreground">
            Shown below your name. E.g. /tah·maan·nuh/
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro-text">Intro paragraph</Label>
          <Textarea
            id="intro-text"
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            rows={4}
            placeholder="I'm a software engineer who…"
          />
        </div>
      </section>

      {/* Day job & out of office */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Day job & out of office</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shown in two columns beside your intro on the About page.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="day-job-description">Day job description</Label>
          <Textarea
            id="day-job-description"
            value={dayJobDescription}
            onChange={(e) => setDayJobDescription(e.target.value)}
            rows={3}
            placeholder="Currently, I am a Software Engineer at XYZ. Before that…"
          />
          <p className="text-xs text-muted-foreground">
            Full paragraph. Falls back to role + company below if left blank.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currently-role">Current role (fallback)</Label>
            <Input
              id="currently-role"
              value={currentlyRole}
              onChange={(e) => setCurrentlyRole(e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currently-company">Current company (fallback)</Label>
            <Input
              id="currently-company"
              value={currentlyCompany}
              onChange={(e) => setCurrentlyCompany(e.target.value)}
              placeholder="Tech Company"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="out-of-office">Out of office</Label>
          <Textarea
            id="out-of-office"
            value={outOfOfficeText}
            onChange={(e) => setOutOfOfficeText(e.target.value)}
            rows={3}
            placeholder="When I'm not building things, I love…"
          />
        </div>
      </section>

      {/* Superpowers */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">My super powers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Up to 4 skills shown in a 2×2 grid on the About page.
          </p>
        </div>

        {[
          { n: 1, title: superpower1, desc: superpower1Desc, setTitle: setSuperpower1, setDesc: setSuperpower1Desc },
          { n: 2, title: superpower2, desc: superpower2Desc, setTitle: setSuperpower2, setDesc: setSuperpower2Desc },
          { n: 3, title: superpower3, desc: superpower3Desc, setTitle: setSuperpower3, setDesc: setSuperpower3Desc },
          { n: 4, title: superpower4, desc: superpower4Desc, setTitle: setSuperpower4, setDesc: setSuperpower4Desc },
        ].map(({ n, title, desc, setTitle, setDesc }) => (
          <div key={n} className="rounded-xl border border-border p-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">
              Superpower {n}
            </p>
            <div className="space-y-2">
              <Label htmlFor={`sp-title-${n}`}>Title</Label>
              <Input
                id={`sp-title-${n}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Structure in ambiguity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`sp-desc-${n}`}>Description</Label>
              <Textarea
                id={`sp-desc-${n}`}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                placeholder="I have a knack for adding clarity…"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Gallery */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Photo gallery</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A horizontal photo strip shown after your superpowers.
          </p>
        </div>
        <GalleryUpload
          value={galleryImages}
          onChange={setGalleryImages}
          label="Gallery photos"
        />
      </section>

      {/* Featured In */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Featured in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Articles, talks, and podcasts you've been featured in.
          </p>
        </div>
        <FeaturedInManager value={featuredIn} onChange={setFeaturedIn} />
      </section>

      {/* Internships description */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Internships description</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional sub-text shown next to the Internships section heading.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="internships-desc">Description</Label>
          <Textarea
            id="internships-desc"
            value={internshipsDescription}
            onChange={(e) => setInternshipsDescription(e.target.value)}
            rows={2}
            placeholder="I completed these internships as part of…"
          />
        </div>
      </section>

      {/* Social links */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Social links</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add URLs and choose which icons appear on the About page.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="twitter-url">Twitter / X URL</Label>
            <Input
              id="twitter-url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/you"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <Input
              id="linkedin-url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/you"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub URL</Label>
            <Input
              id="github-url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/you"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
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

      {/* Homepage rotating lines */}
      <section className="space-y-4 rounded-2xl border border-border p-6">
        <div>
          <h2 className="text-xl font-bold">Homepage rotating lines</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Short phrases that rotate in the homepage hero subtitle.
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
        </div>

        <div className="space-y-2">
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
                  placeholder="I value empathy & user-centered design"
                  className="flex-1"
                  maxLength={MAX_HERO_LINE_LENGTH}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() =>
                    setFunFacts((c) =>
                      c.length === 1
                        ? [""]
                        : c.filter((_, i) => i !== index)
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
        </div>
      </section>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save About page"}
      </Button>
    </form>
  );
}
