import type { SectionTab } from "../components/WebsiteLayout/SectionTabs";
import { normalizeBreadcrumbPath } from "./breadcrumbs";
import { competitionsPath } from "./paths";

const isWithin = (pathname: string, base: string) => {
  const current = normalizeBreadcrumbPath(pathname);
  const target = normalizeBreadcrumbPath(base);
  return current === target || current.startsWith(`${target}/`);
};

const participantsRoutes = [
  competitionsPath("/users/"),
  competitionsPath("/user/"),
];

const searchRoutes = [competitionsPath("/search/")];
const hallOfFameRoutes = [competitionsPath("/premi/")];
const rulesRoutes = [competitionsPath("/rules/")];

export const competitionTabs: SectionTab[] = [
  {
    href: competitionsPath("/"),
    label: "Competizioni",
    // La galleria resta attiva anche sulle pagine di dettaglio dell'edizione,
    // ma non sulle sezioni che hanno una propria tab.
    isActive: (pathname) =>
      isWithin(pathname, competitionsPath("/")) &&
      !participantsRoutes.some((route) => isWithin(pathname, route)) &&
      !searchRoutes.some((route) => isWithin(pathname, route)) &&
      !hallOfFameRoutes.some((route) => isWithin(pathname, route)) &&
      !rulesRoutes.some((route) => isWithin(pathname, route)),
  },
  {
    href: competitionsPath("/users/"),
    label: "Partecipanti",
    isActive: (pathname) =>
      participantsRoutes.some((route) => isWithin(pathname, route)),
  },
  {
    href: competitionsPath("/premi/"),
    label: "Hall of Fame",
    isActive: (pathname) => isWithin(pathname, competitionsPath("/premi/")),
  },
  {
    href: competitionsPath("/rules/"),
    label: "Regolamento",
    isActive: (pathname) => isWithin(pathname, competitionsPath("/rules/")),
  },
  {
    href: competitionsPath("/search/"),
    label: "Cerca",
    isActive: (pathname) => isWithin(pathname, competitionsPath("/search/")),
  },
];
