"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  saveAboutAction,
  saveAboutSectionAction,
  type AboutSectionId,
} from "@/app/admin/about/actions";
import { AdminCollapsibleSection } from "@/components/admin/AdminCollapsibleSection";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { ExperiencesManager } from "@/components/admin/ExperiencesManager";
import { FeaturedInManager } from "@/components/admin/FeaturedInManager";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { WritingsManager } from "@/components/admin/WritingsManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_VISIBLE_SOCIAL_LINKS,
  SOCIAL_LINK_CONFIG,
  type SocialLinkKey,
} from "@/lib/social-links";
import type { AboutContent, Experience, FeaturedIn, Writing } from "@/lib/types";

const SECTION_LABELS: Record<AboutSectionId, string> = {
  profile: "Profile photo",
  intro: "Intro",
  "day-job": "Day job & out of office",
  "currently-previously": "Currently & Previously",
  superpowers: "My super powers",
  gallery: "Photo gallery",
  experience: "Experience, Internships & Education",
  "internships-note": "Internships section note",
  writing: "Writing",
  "featured-in": "Featured in",
  social: "Social links",
};

interface AboutFormProps {
  about?: AboutContent | null;
  featuredIn?: FeaturedIn[];
  experiences?: Experience[];
  writings?: Writing[];
}

export function AboutForm({
  about,
  featuredIn: initialFeaturedIn = [],
  experiences: initialExperiences = [],
  writings: initialWritings = [],
}: AboutFormProps) {
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
  const [experiences, setExperiences] = useState<Experience[]>(
    initialExperiences
  );
  const [writings, setWritings] = useState<Writing[]>(initialWritings);
  const [featuredIn, setFeaturedIn] = useState<FeaturedIn[]>(initialFeaturedIn);
  const [showWriting, setShowWriting] = useState(about?.show_writing !== false);
  const [showFeaturedIn, setShowFeaturedIn] = useState(
    about?.show_featured_in !== false
  );
  const [experienceSectionVisibility, setExperienceSectionVisibility] = useState({
    job: about?.show_experience !== false,
    internship: about?.show_internships !== false,
    education: about?.show_education !== false,
  });
  const [aboutId, setAboutId] = useState(about?.id);
  const [savingSection, setSavingSection] = useState<AboutSectionId | "all" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const buildPayload = useCallback(
    () => ({
      id: aboutId,
      profile_image_url: profileImageUrl,
      gallery_images: galleryImages,
      pronunciation,
      intro_text: introText,
      day_job_description: dayJobDescription,
      currently_role: currentlyRole,
      currently_company: currentlyCompany,
      out_of_office_text: outOfOfficeText,
      previously_companies: previouslyCompanies,
      internships_description: internshipsDescription,
      show_currently: showCurrently,
      show_previously: showPreviously,
      currently_label: currentlyLabel,
      previously_label: previouslyLabel,
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
      show_experience: experienceSectionVisibility.job,
      show_internships: experienceSectionVisibility.internship,
      show_education: experienceSectionVisibility.education,
      show_writing: showWriting,
      show_featured_in: showFeaturedIn,
      featured_in: featuredIn,
      experiences,
      writings,
    }),
    [
      aboutId,
      profileImageUrl,
      galleryImages,
      pronunciation,
      introText,
      dayJobDescription,
      currentlyRole,
      currentlyCompany,
      outOfOfficeText,
      previouslyCompanies,
      internshipsDescription,
      showCurrently,
      showPreviously,
      currentlyLabel,
      previouslyLabel,
      superpower1,
      superpower1Desc,
      superpower2,
      superpower2Desc,
      superpower3,
      superpower3Desc,
      superpower4,
      superpower4Desc,
      twitterUrl,
      linkedinUrl,
      githubUrl,
      email,
      visibleSocialLinks,
      experienceSectionVisibility,
      showWriting,
      showFeaturedIn,
      featuredIn,
      experiences,
      writings,
    ]
  );

  const saveSection = async (section: AboutSectionId) => {
    setSavingSection(section);
    setError(null);

    const result = await saveAboutSectionAction(section, buildPayload());

    setSavingSection(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.aboutId) {
      setAboutId(result.aboutId);
    }

    toast.success(`${SECTION_LABELS[section]} saved.`);
  };

  const handleSaveAll = async () => {
    setSavingSection("all");
    setError(null);

    const result = await saveAboutAction(buildPayload());

    setSavingSection(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.aboutId) {
      setAboutId(result.aboutId);
    }

    toast.success("About page saved.");
  };

  const toggleSocialLink = (key: SocialLinkKey, checked: boolean) => {
    setVisibleSocialLinks((current) =>
      checked
        ? current.includes(key) ? current : [...current, key]
        : current.filter((item) => item !== key)
    );
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="pb-2">
        <h1 className="text-3xl font-bold">Edit About</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your About page — expand a section to edit it.
        </p>
      </div>

      <AdminCollapsibleSection
        title="Profile photo"
        description="Large portrait photo shown at the top of your About page. Separate from the homepage profile photo (managed in Site Settings)."
        defaultOpen
        onSave={() => saveSection("profile")}
        saving={savingSection === "profile"}
      >
        <ImageUpload
          label="About page profile photo"
          value={profileImageUrl}
          onChange={setProfileImageUrl}
          previewClassName="w-48 aspect-[3/4]"
        />
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Intro"
        description="Shown beside your photo at the top of the About page."
        onSave={() => saveSection("intro")}
        saving={savingSection === "intro"}
      >
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
            placeholder="I&apos;m a software engineer who…"
          />
        </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Day job & out of office"
        description="Shown in two columns beside your intro."
        onSave={() => saveSection("day-job")}
        saving={savingSection === "day-job"}
      >
        <div className="space-y-2">
          <Label htmlFor="day-job-description">Day job paragraph</Label>
          <Textarea
            id="day-job-description"
            value={dayJobDescription}
            onChange={(e) => setDayJobDescription(e.target.value)}
            rows={3}
            placeholder="Currently, I am a Software Engineer at XYZ. Before that…"
          />
          <p className="text-xs text-muted-foreground">
            Full paragraph shown under &quot;Day job&quot; on the About page. If left
            blank, falls back to the role + company from the &quot;Currently &amp;
            Previously&quot; section.
          </p>
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
          <p className="text-xs text-muted-foreground">
            Shown under &quot;Out of office&quot; on the About page.
          </p>
        </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Currently & Previously"
        description="Shown in the homepage hero below your heading. Also used as a fallback for the About page Day job section."
        onSave={() => saveSection("currently-previously")}
        saving={savingSection === "currently-previously"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hp-currently-role">Current role</Label>
            <Input
              id="hp-currently-role"
              value={currentlyRole}
              onChange={(e) => setCurrentlyRole(e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hp-currently-company">Current company</Label>
            <Input
              id="hp-currently-company"
              value={currentlyCompany}
              onChange={(e) => setCurrentlyCompany(e.target.value)}
              placeholder="Tech Company"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hp-previously">Previously at</Label>
          <Input
            id="hp-previously"
            value={previouslyCompanies}
            onChange={(e) => setPreviouslyCompanies(e.target.value)}
            placeholder="Startup Inc, Design Agency, Freelance"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated list of past companies or a short phrase.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hp-currently-label">Currently label</Label>
            <Input
              id="hp-currently-label"
              value={currentlyLabel}
              onChange={(e) => setCurrentlyLabel(e.target.value)}
              placeholder="Currently"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hp-previously-label">Previously label</Label>
            <Input
              id="hp-previously-label"
              value={previouslyLabel}
              onChange={(e) => setPreviouslyLabel(e.target.value)}
              placeholder="Previously at"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <AdminToggle
            checked={showCurrently}
            onCheckedChange={setShowCurrently}
            label="Show Currently section"
          />
          <AdminToggle
            checked={showPreviously}
            onCheckedChange={setShowPreviously}
            label="Show Previously section"
          />
        </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="My super powers"
        description="Up to 4 skills shown in a 2×2 grid on the About page."
        onSave={() => saveSection("superpowers")}
        saving={savingSection === "superpowers"}
      >
        {[
          { n: 1, title: superpower1, desc: superpower1Desc, setTitle: setSuperpower1, setDesc: setSuperpower1Desc },
          { n: 2, title: superpower2, desc: superpower2Desc, setTitle: setSuperpower2, setDesc: setSuperpower2Desc },
          { n: 3, title: superpower3, desc: superpower3Desc, setTitle: setSuperpower3, setDesc: setSuperpower3Desc },
          { n: 4, title: superpower4, desc: superpower4Desc, setTitle: setSuperpower4, setDesc: setSuperpower4Desc },
        ].map(({ n, title, desc, setTitle, setDesc }) => (
          <div key={n} className="space-y-3 rounded-xl border border-border p-4">
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
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Photo gallery"
        description="Auto-scrolling horizontal photo strip shown after your superpowers."
        onSave={() => saveSection("gallery")}
        saving={savingSection === "gallery"}
      >
        <GalleryUpload
          value={galleryImages}
          onChange={setGalleryImages}
          label="Gallery photos"
        />
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Experience, Internships & Education"
        description="Manage all timeline entries shown on your About page."
        onSave={() => saveSection("experience")}
        saving={savingSection === "experience"}
      >
        <ExperiencesManager
          value={experiences}
          onChange={setExperiences}
          sectionVisibility={experienceSectionVisibility}
          onSectionVisibilityChange={(type, visible) => {
            setExperienceSectionVisibility((current) => ({
              ...current,
              [type]: visible,
            }));
          }}
        />
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Internships section note"
        description="Optional sub-text shown next to the Internships heading."
        onSave={() => saveSection("internships-note")}
        saving={savingSection === "internships-note"}
      >
        <div className="space-y-2">
          <Label htmlFor="internships-desc">Note</Label>
          <Textarea
            id="internships-desc"
            value={internshipsDescription}
            onChange={(e) => setInternshipsDescription(e.target.value)}
            rows={2}
            placeholder="I completed these internships as part of…"
          />
        </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Writing"
        description="Articles, blog posts, and other writing you've published."
        onSave={() => saveSection("writing")}
        saving={savingSection === "writing"}
        headerExtra={
          <AdminToggle
            checked={showWriting}
            onCheckedChange={setShowWriting}
            label="Section"
          />
        }
      >
        <WritingsManager value={writings} onChange={setWritings} />
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Featured in"
        description="Talks, podcasts, and articles that have featured you."
        onSave={() => saveSection("featured-in")}
        saving={savingSection === "featured-in"}
        headerExtra={
          <AdminToggle
            checked={showFeaturedIn}
            onCheckedChange={setShowFeaturedIn}
            label="Section"
          />
        }
      >
        <FeaturedInManager value={featuredIn} onChange={setFeaturedIn} />
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        title="Social links"
        description="Add URLs and choose which icons appear on the About page."
        onSave={() => saveSection("social")}
        saving={savingSection === "social"}
      >
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
      </AdminCollapsibleSection>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleSaveAll}
        disabled={savingSection !== null}
      >
        {savingSection === "all" ? "Saving…" : "Save entire About page"}
      </Button>
    </div>
  );
}
