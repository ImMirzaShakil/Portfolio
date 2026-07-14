"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  getNavItems,
  isNavLinkActive,
  isResumeNavItem,
} from "@/lib/navigation";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  siteTitle?: string | null;
  logoUrl?: string | null;
  logoUrlDark?: string | null;
  resumeUrl?: string | null;
  navItems?: NavItem[] | null;
}

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

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar({
  siteTitle,
  logoUrl,
  logoUrlDark,
  resumeUrl,
  navItems,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = getInitials(siteTitle);
  const links = getNavItems(navItems, resumeUrl);
  const hasLogo = Boolean(logoUrl || logoUrlDark);

  const linkClass = (href: string) =>
    cn(
      "min-h-11 rounded-full px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      isNavLinkActive(pathname, href)
        ? "bg-nav-active text-nav-active-foreground"
        : "text-nav-inactive hover:text-foreground"
    );

  const renderNavLink = (link: NavItem, onNavigate?: () => void) => {
    if (isResumeNavItem(link)) {
      if (!resumeUrl) return null;

      return (
        <a
          key={link.id}
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className={cn(linkClass(link.href), onNavigate && "w-fit")}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.id}
        href={link.href}
        onClick={onNavigate}
        className={cn(linkClass(link.href), onNavigate && "w-fit")}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header className="nav-glass sticky top-0 z-50 w-full">
      <div className="site-container flex items-center justify-between py-4 sm:py-5">
        <Link
          href="/"
          className={cn(
            "relative flex size-14 shrink-0 items-center justify-center transition-opacity hover:opacity-80",
            hasLogo
              ? "overflow-hidden rounded-full"
              : "overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          )}
          aria-label="Home"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteTitle ?? "Site logo"}
              fill
              className={cn(
                "object-contain p-1.5",
                logoUrlDark && "dark:hidden"
              )}
              sizes="56px"
              priority
            />
          ) : null}
          {logoUrlDark ? (
            <Image
              src={logoUrlDark}
              alt={siteTitle ?? "Site logo"}
              fill
              className="hidden object-contain p-1.5 dark:block"
              sizes="56px"
              priority
            />
          ) : null}
          {!hasLogo ? initials : null}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => renderNavLink(link))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-6" /> : <HamburgerIcon className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-border/50 px-4 py-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) =>
              renderNavLink(link, () => setMobileOpen(false))
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
