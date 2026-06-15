"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  siteTitle?: string | null;
  resumeUrl?: string | null;
}

const navLinks = [
  { href: "/", label: "Work" },
  { href: "/fun", label: "Fun" },
  { href: "/about", label: "About" },
] as const;

function getInitials(name?: string | null) {
  if (!name) return "MS";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Navbar({ siteTitle, resumeUrl }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = getInitials(siteTitle);

  const linkClass = (href: string) =>
    cn(
      "min-h-11 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      isActivePath(pathname, href)
        ? "bg-nav-active text-nav-active-foreground"
        : "text-nav-inactive hover:text-foreground"
    );

  const inactiveLinkClass =
    "min-h-11 rounded-full px-4 py-2.5 text-sm font-medium text-nav-inactive transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-8 py-8">
        <Link
          href="/"
          className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          {initials}
        </Link>

        <nav className="hidden items-center gap-1 rounded-[64px] p-2 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={inactiveLinkClass}
            >
              Resume
            </a>
          ) : null}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-border bg-background px-8 py-4 md:hidden">
          <div className="flex flex-col gap-2 rounded-[32px] p-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(linkClass(link.href), "w-fit")}
              >
                {link.label}
              </Link>
            ))}
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={cn(inactiveLinkClass, "w-fit")}
              >
                Resume
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
