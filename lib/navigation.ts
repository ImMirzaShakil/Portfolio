import type { NavItem } from "@/lib/types";

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
];

export function getNavItems(navItems?: NavItem[] | null): NavItem[] {
  const items = navItems?.length ? navItems : DEFAULT_NAV_ITEMS;

  return [...items]
    .filter((item) => item.is_visible)
    .sort((a, b) => a.order_index - b.order_index);
}

export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
