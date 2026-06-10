"use client";

import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  siteTitle?: string | null;
}

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/admin/about", label: "About", icon: UserRound, exact: false },
  { href: "/admin/resume", label: "Resume", icon: FileText, exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function AdminSidebar({ siteTitle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
    setLoggingOut(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link href="/admin" className="text-lg font-bold">
          {siteTitle ?? "Portfolio"}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, link.href, link.exact)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="size-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <p className="font-semibold">{siteTitle ?? "Portfolio"}</p>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border"
          aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-b border-border bg-card md:hidden">{sidebarContent}</div>
      ) : null}

      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-card md:block">
        {sidebarContent}
      </aside>
    </>
  );
}
