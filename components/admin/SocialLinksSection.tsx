"use client";

import { AdminToggle } from "@/components/admin/AdminToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SOCIAL_LINK_CONFIG,
  type SocialLinkKey,
  type SocialLinkPlacement,
} from "@/lib/social-links";

type SocialUrlField = (typeof SOCIAL_LINK_CONFIG)[number]["field"];

interface SocialLinksSectionProps {
  urls: Record<SocialUrlField, string>;
  onUrlChange: (field: SocialUrlField, value: string) => void;
  heroVisibility: SocialLinkKey[];
  footerVisibility: SocialLinkKey[];
  onToggle: (placement: SocialLinkPlacement, key: SocialLinkKey, checked: boolean) => void;
}

export function SocialLinksSection({
  urls,
  onUrlChange,
  heroVisibility,
  footerVisibility,
  onToggle,
}: SocialLinksSectionProps) {
  return (
    <div className="space-y-4">
      {SOCIAL_LINK_CONFIG.map(({ key, field, label, placeholder }) => (
        <div
          key={key}
          className="space-y-3 rounded-xl border border-border p-4"
        >
          <div className="space-y-2">
            <Label htmlFor={`social-${key}`}>{label}</Label>
            <Input
              id={`social-${key}`}
              type={key === "email" ? "email" : "url"}
              value={urls[field]}
              onChange={(event) => onUrlChange(field, event.target.value)}
              placeholder={placeholder}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <AdminToggle
              checked={heroVisibility.includes(key)}
              onCheckedChange={(checked) => onToggle("hero", key, checked)}
              label="Homepage hero"
              activeLabel="Shown"
              inactiveLabel="Hidden"
            />
            <AdminToggle
              checked={footerVisibility.includes(key)}
              onCheckedChange={(checked) => onToggle("footer", key, checked)}
              label="Footer"
              activeLabel="Shown"
              inactiveLabel="Hidden"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
