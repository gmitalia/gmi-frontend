import { competitionsPath } from "./paths";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/** Radice comune a tutte le breadcrumb del sito. */
export const homeBreadcrumb: BreadcrumbItem = { label: "Home", href: "/" };

export const competitionsBreadcrumb: BreadcrumbItem = {
  label: "Competizioni",
  href: competitionsPath("/"),
};

export const blogBreadcrumb: BreadcrumbItem = {
  label: "Blog",
  href: "/blog/",
};

const SECTION_LABELS: Record<string, string> = {
  "/blog": "Blog",
  "/showcase": "Showcase",
  "/resources": "Risorse",
};

const COMPETITION_LABELS: Record<string, string> = {
  [competitionsPath("/search")]: "Cerca",
  [competitionsPath("/users")]: "Partecipanti",
  [competitionsPath("/user")]: "Profilo",
  [competitionsPath("/premi")]: "Hall of Fame",
  [competitionsPath("/rules")]: "Regolamento",
  [competitionsPath("/contest")]: "Competizione",
  [competitionsPath("/results")]: "Risultati",
  [competitionsPath("/editvotes")]: "Area giudizi",
  [competitionsPath("/participation")]: "Partecipa",
};

/** Normalizza un percorso rimuovendo gli slash finali. */
export const normalizeBreadcrumbPath = (path: string) =>
  path.replace(/\/+$/, "") || "/";

/** Breadcrumb di default dell'area competizioni (le pagine possono sovrascriverle). */
export function getCompetitionBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const normalized = normalizeBreadcrumbPath(pathname);

  if (normalized === normalizeBreadcrumbPath(competitionsPath("/"))) {
    return [homeBreadcrumb, { label: "Competizioni" }];
  }

  const label = COMPETITION_LABELS[normalized];

  if (!label) {
    return [homeBreadcrumb, { label: "Competizioni" }];
  }

  return [homeBreadcrumb, competitionsBreadcrumb, { label }];
}

/** Breadcrumb globali per le sezioni editoriali e per gli articoli del blog. */
export function getGlobalBreadcrumbs(
  pathname: string,
  postTitle?: string,
  postCategories?: string[]
): BreadcrumbItem[] {
  const normalized = normalizeBreadcrumbPath(pathname);

  if (normalized === "/") return [];

  if (normalized === "/posts/[slug]") {
    const isTutorial = postCategories?.includes("Tutorial");

    return [
      homeBreadcrumb,
      blogBreadcrumb,
      ...(isTutorial ? [{ label: "Tutorial", href: "/tutorial/" }] : []),
      { label: postTitle || "Articolo" },
    ];
  }

  if (normalized === "/blog/articoli") {
    return [homeBreadcrumb, blogBreadcrumb, { label: "Articoli" }];
  }

  if (normalized === "/tutorial") {
    return [homeBreadcrumb, blogBreadcrumb, { label: "Tutorial" }];
  }

  if (normalized.startsWith("/competizioni")) {
    const competitionsRoot = normalizeBreadcrumbPath(competitionsPath("/"));
    const authRoot = competitionsPath("/auth");

    // La pagina di callback OAuth non deve mostrare breadcrumb.
    if (normalized === authRoot || normalized.startsWith(`${authRoot}/`)) {
      return [];
    }

    if (
      normalized === competitionsRoot ||
      normalized.startsWith(`${competitionsRoot}/`)
    ) {
      return getCompetitionBreadcrumbs(normalized);
    }
  }

  const sectionLabel = SECTION_LABELS[normalized];

  if (!sectionLabel) return [];

  return [homeBreadcrumb, { label: sectionLabel }];
}
