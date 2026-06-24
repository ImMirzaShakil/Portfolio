import { SocialLinks } from "@/components/social/SocialLinks";
import type { AboutContent, SiteSettings } from "@/lib/types";

interface FooterProps {
  settings?: SiteSettings | null;
  about?: AboutContent | null;
}

export function Footer({ settings, about }: FooterProps) {
  const year = new Date().getFullYear();
  const tagline = settings?.footer_tagline ?? "Building thoughtful digital experiences";

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="site-container flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-footer-foreground">
          © {year} · {tagline}
        </p>

        <SocialLinks
          about={about}
          placement="footer"
          className="flex items-center gap-4"
          linkClassName="text-footer-foreground transition-opacity hover:opacity-80"
        />
      </div>
    </footer>
  );
}
