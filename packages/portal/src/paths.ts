/**
 * Le competizioni vivono sotto /competizioni nella stessa app del blog.
 * Qui concentriamo il prefisso e i helper per costruire link interni.
 */
export const COMPETITIONS_BASE_PATH = "/competizioni";

/** Prefisso usato per asset e URL legacy della sezione competizioni. */
export const basePath = COMPETITIONS_BASE_PATH;

/** Costruisce un percorso interno alle competizioni. */
export function competitionsPath(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${COMPETITIONS_BASE_PATH}${normalized}`;
}
