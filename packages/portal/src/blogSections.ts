import type { SectionTab } from "../components/WebsiteLayout/SectionTabs";
import { normalizeBreadcrumbPath } from "./breadcrumbs";

export const blogTabs: SectionTab[] = [
  {
    href: "/blog/",
    label: "Tutti",
    isActive: (pathname) =>
      normalizeBreadcrumbPath(pathname) === "/blog",
  },
  {
    href: "/blog/articoli/",
    label: "Articoli",
    isActive: (pathname) =>
      normalizeBreadcrumbPath(pathname) === "/blog/articoli",
  },
  {
    href: "/tutorial/",
    label: "Tutorial",
    isActive: (pathname) =>
      normalizeBreadcrumbPath(pathname) === "/tutorial",
  },
];
