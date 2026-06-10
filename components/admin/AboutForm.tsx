"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { saveAboutAction } from "@/app/admin/about/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutContent, SiteSettings } from "@/lib/types";

interface AboutFormProps {
  about?: AboutContent | null;
  settings?: SiteSettings | null;
}

export function AboutForm({ about, settings }: AboutFormProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    about?.profile_image_url ?? null
  );
  const [introText, setIntroText] = useState(about?.intro_text ?? "");
  const [greetingText, setGreetingText] = useState(
    about?.greeting_text ?? "Nice to meet you!"
  );
  const [funFacts, setFunFacts] = useState<string[]>(
    about?.fun_facts?.length ? about.fun_facts : [""]
  );
  const [currentlyRole, setCurrentlyRole] = useState(about?.currently_role ?? "");
  const [currentlyCompany, setCurrentlyCompany] = useState(
    about?.currently_company ?? ""
  );
  const [previouslyCompanies, setPreviouslyCompanies] = useState(
    about?.previously_companies ?? ""
  );
  const [superpower1, setSuperpower1] = useState(about?.superpower_1 ?? "");
  const [superpower2, setSuperpower2] = useState(about?.superpower_2 ?? "");
  const [superpower3, setSuperpower3] = useState(about?.superpower_3 ?? "");
  const [twitterUrl, setTwitterUrl] = useState(about?.twitter_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(about?.linkedin_url ?? "");
  const [githubUrl, setGithubUrl] = useState(about?.github_url ?? "");
  const [email, setEmail] = useState(about?.email ?? "");
  const [footerTagline, setFooterTagline] = useState(
    settings?.footer_tagline ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFunFact = (index: number, value: string) => {
    setFunFacts((current) =>
      current.map((fact, factIndex) => (factIndex === index ? value : fact))
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
      intro_text: introText,
      greeting_text: greetingText,
      fun_facts: funFacts,
      currently_role: currentlyRole,
      currently_company: currentlyCompany,
      previously_companies: previouslyCompanies,
      superpower_1: superpower1,
      superpower_2: superpower2,
      superpower_3: superpower3,
      twitter_url: twitterUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      email,
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
          Update homepage hero, about page, and footer content.
        </p>
      </div>

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
        <div className="flex items-center justify-between">
          <Label>Fun facts</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFunFacts((current) => [...current, ""])}
          >
            Add fact
          </Button>
        </div>
        {funFacts.map((fact, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={fact}
              onChange={(event) => updateFunFact(index, event.target.value)}
              placeholder="A short rotating personal fact"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setFunFacts((current) =>
                  current.filter((_, factIndex) => factIndex !== index)
                )
              }
              disabled={funFacts.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
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
