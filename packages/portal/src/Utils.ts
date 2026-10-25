import type { NextRouter } from "next/router";

export function getQuery(router: Pick<NextRouter, "asPath">): Record<string, string> {
  const path = router.asPath.split("#")[0];
  const idx = path.lastIndexOf("?");
  const paramsString = idx >= 0 ? path.substring(idx + 1) : "";
  return Object.fromEntries(new URLSearchParams(paramsString));
}

const months = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export function getItalianDate(date: Date) {
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export type Author = {
  id: string | number;
  name: string;
};

/**
 * Autori possono essere JSON array nativi (dopo refactor) o base64-encoded JSON (legacy).
 * Gestisce entrambi i formati per backward compat.
 */
export function parseAuthors(authors: unknown): Author[] {
  if (!authors) return [];
  if (Array.isArray(authors)) return authors as Author[];

  try {
    const parsed = JSON.parse(String(authors));
    if (Array.isArray(parsed)) return parsed as Author[];
  } catch {
    // fallback legacy
  }

  try {
    const decoded =
      typeof Buffer !== "undefined"
        ? Buffer.from(String(authors), "base64").toString("ascii")
        : atob(String(authors));
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed) ? (parsed as Author[]) : [];
  } catch {
    return [];
  }
}
