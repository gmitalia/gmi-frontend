/**
 * Palette e stili delle categorie della pagina Risorse.
 * I colori vivono qui in un unico posto e non vengono più duplicati nella pagina.
 */
export const RESOURCE_PALETTE = {
  teal: "#0f766e",
  blue: "#2563eb",
  violet: "#7c3aed",
  pink: "#d6336c",
  cyan: "#0e7490",
  emerald: "#059669",
  indigo: "#4f46e5",
  fuchsia: "#c026d3",
  red: "#dc2626",
  rose: "#e11d48",
  orange: "#ea580c",
  purple: "#7e22ce",
  green: "#15803d",
  tealDark: "#0d9488",
  slate: "#475569",
  sky: "#0284c7",
  brand: "#3b3c5c",
} as const;

export type ResourceCategoryStyle = {
  icon: string;
  color: string;
};

/** Icone e colori Font Awesome per le categorie (chiave = titolo normalizzato). */
export const RESOURCE_CATEGORY_STYLES: Record<string, ResourceCategoryStyle> = {
  assets: { icon: "fa-boxes", color: RESOURCE_PALETTE.teal },
  tools: { icon: "fa-tools", color: RESOURCE_PALETTE.blue },
  tutorial: { icon: "fa-book", color: RESOURCE_PALETTE.violet },
  "2d": { icon: "fa-image", color: RESOURCE_PALETTE.pink },
  "3d": { icon: "fa-cube", color: RESOURCE_PALETTE.cyan },
  "a pagamento": { icon: "fa-euro-sign", color: RESOURCE_PALETTE.emerald },
  ai: { icon: "fa-robot", color: RESOURCE_PALETTE.indigo },
  animazione: { icon: "fa-film", color: RESOURCE_PALETTE.fuchsia },
  "game design": { icon: "fa-gamepad", color: RESOURCE_PALETTE.red },
  grafica: { icon: "fa-palette", color: RESOURCE_PALETTE.rose },
  marketing: { icon: "fa-bullhorn", color: RESOURCE_PALETTE.orange },
  musica: { icon: "fa-headphones", color: RESOURCE_PALETTE.purple },
  "pixel art": { icon: "fa-th", color: RESOURCE_PALETTE.green },
  programmazione: { icon: "fa-code", color: RESOURCE_PALETTE.tealDark },
  shaders: { icon: "fa-flask", color: RESOURCE_PALETTE.slate },
  suoni: { icon: "fa-volume-up", color: RESOURCE_PALETTE.sky },
};

export const FALLBACK_CATEGORY_STYLE: ResourceCategoryStyle = {
  icon: "fa-tag",
  color: RESOURCE_PALETTE.brand,
};

/** Normalizza il titolo di una categoria: solo lettere, numeri e spazi, in minuscolo. */
export function normalizeCategory(title: string) {
  return (title.match(/[A-Za-z0-9\s]+/g) || []).join("").trim().toLowerCase();
}

/** Rimuove l'eventuale emoji iniziale dal nome della categoria. "🎧 Musica" -> "Musica" */
export function categoryLabel(title: string) {
  const match = title.match(/^([^A-Za-z0-9\u00C0-\u024F]+)(.*)$/);
  return match && match[2].trim() ? match[2].trim() : title.trim();
}

/** Stile associato alla categoria (icona e colore di fallback). */
export function categoryStyle(title: string) {
  return RESOURCE_CATEGORY_STYLES[normalizeCategory(title)] || FALLBACK_CATEGORY_STYLE;
}

/** Colore della categoria: palette locale per categoria, con fallback su Sanity. */
export function categoryColor(title: string, color?: string) {
  const style = RESOURCE_CATEGORY_STYLES[normalizeCategory(title)];
  return style?.color || color || FALLBACK_CATEGORY_STYLE.color;
}
