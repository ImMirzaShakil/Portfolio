import type { NavItem } from "@/lib/types";

/** Reserved href for the navbar Resume link (opens uploaded PDF). */
export const RESUME_NAV_HREF = "__resume__";

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "work",
    label: "Work",
    href: "/work",
    is_visible: true,
    order_index: 0,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    is_visible: true,
    order_index: 1,
  },
  {
    id: "resume",
    label: "Resume",
    href: RESUME_NAV_HREF,
    is_visible: true,
    order_index: 2,
  },
];

export function isResumeNavItem(item: Pick<NavItem, "id" | "href">) {
  return item.id === "resume" || item.href === RESUME_NAV_HREF;
}

/** Ensure Resume exists in nav for older saved settings. */
export function ensureNavItems(navItems?: NavItem[] | null): NavItem[] {
  const items = navItems?.length
    ? navItems.map((item, index) => ({
        ...item,
        order_index: item.order_index ?? index,
      }))
    : DEFAULT_NAV_ITEMS.map((item) => ({ ...item }));

  if (!items.some(isResumeNavItem)) {
    items.push({
      id: "resume",
      label: "Resume",
      href: RESUME_NAV_HREF,
      is_visible: true,
      order_index: items.length,
    });
  }

  return items.map((item) =>
    isResumeNavItem(item)
      ? { ...item, id: "resume", href: RESUME_NAV_HREF }
      : item
  );
}

export function getNavItems(
  navItems?: NavItem[] | null,
  resumeUrl?: string | null
): NavItem[] {
  return ensureNavItems(navItems)
    .filter((item) => item.is_visible)
    .filter((item) => !isResumeNavItem(item) || Boolean(resumeUrl))
    .sort((a, b) => a.order_index - b.order_index);
}

export function isNavLinkActive(pathname: string, href: string) {
  if (href === RESUME_NAV_HREF) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
