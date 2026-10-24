export type ContestStatus = "open" | "judging" | "complete";

/** Converte le date dell'API (YYYY-MM-DD HH:mm:ss) in un Date affidabile. */
export function parseContestDate(value?: string | null): Date | null {
  if (!value) return null;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Stato pubblico di una competizione, con fallback sulle date. */
export function getContestStatus(contest: Contest, now = Date.now()): ContestStatus {
  if (contest.is_completed) return "complete";
  if (contest.is_ended) return "judging";

  const completedAt = parseContestDate(contest.completed_at);
  if (completedAt && now > completedAt.getTime()) return "complete";

  const endAt = parseContestDate(contest.end_at);
  if (endAt && now > endAt.getTime()) return "judging";

  return "open";
}

export function isContestActive(contest: Contest, now = Date.now()): boolean {
  return getContestStatus(contest, now) !== "complete";
}

/**
 * L'edizione da mettere in evidenza: la più recente ancora aperta/in giudizio,
 * altrimenti l'ultima conclusa.
 */
export function getFeaturedContest(contests: Contest[], now = Date.now()): Contest | null {
  if (!contests.length) return null;

  const sorted = [...contests].sort((a, b) => Number(b.id) - Number(a.id));
  return sorted.find((contest) => getContestStatus(contest, now) !== "complete") ?? sorted[0];
}

export function formatContestDate(value?: string | null): string {
  const date = parseContestDate(value);
  if (!date) return "—";

  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Intervallo leggibile: consegna → fine giudizi. */
export function formatContestDateRange(contest: Contest): string {
  const start = formatContestDate(contest.end_at);
  const end = formatContestDate(contest.completed_at);

  if (start === "—" && end === "—") return "Date da definire";
  if (end === "—" || end === start) return start;
  return `${start} – ${end}`;
}

export function getContestYear(contest: Contest): number | null {
  const date =
    parseContestDate(contest.end_at) ?? parseContestDate(contest.completed_at);
  return date ? date.getFullYear() : null;
}


