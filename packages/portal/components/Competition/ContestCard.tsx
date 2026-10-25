import Link from "next/link";
import GMIApi from "../../src/api/GMIApi";
import { basePath, competitionsPath } from "../../src/paths";
import {
  formatContestDate,
  formatContestDateRange,
  getContestStatus,
  getContestYear,
} from "../../src/contestStatus";
import { ContestStatusLabel } from "./ContestStatusLabel";

const FALLBACK_THUMBNAIL = `${basePath}/img/gmicomp.png`;

/** Risolve la miniatura della competizione anche quando l'API restituisce un path relativo. */
export function getContestThumbnailUrl(contest: Contest): string | null {
  const thumbnail = contest.thumbnail_url?.trim();
  if (!thumbnail) return null;

  if (
    thumbnail.startsWith("/") ||
    thumbnail.startsWith("//") ||
    thumbnail.startsWith("data:")
  ) {
    return thumbnail;
  }

  if (/^https?:\/\//i.test(thumbnail)) return thumbnail;

  return `${GMIApi.getInstance().imageURL}${thumbnail.replace(/^\/+/, "")}`;
}

type ContestCardProps = {
  contest: Contest;
  /** Mostra la CTA di iscrizione/avanzamento per le competizioni in corso. */
  showAction?: boolean;
};

/** Card di una competizione, usata nella galleria e nella home. */
export function ContestCard({ contest, showAction = false }: ContestCardProps) {
  const status = getContestStatus(contest);
  const year = getContestYear(contest);
  const thumbnail = getContestThumbnailUrl(contest);
  const contestHref = `${competitionsPath("/contest/")}?contest=${contest.id}`;

  const dateLabel =
    status === "complete"
      ? `Conclusa il ${formatContestDate(contest.completed_at)}`
      : formatContestDateRange(contest);

  const action =
    showAction && status === "open" && contest.can_submit ? (
      <Link
        href={`${competitionsPath("/participation/")}?contest=${contest.id}`}
        className="inline-flex items-center justify-center border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
      >
        Partecipa
      </Link>
    ) : null;

  return (
    <article className="group flex flex-col overflow-hidden border border-gray-200 bg-white transition-colors hover:border-gray-300">
      <Link href={contestHref} className="block">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={thumbnail || FALLBACK_THUMBNAIL}
            alt={contest.name}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.02] ${
              thumbnail ? "object-cover" : "object-contain p-10"
            }`}
            loading="lazy"
            onError={(event) => {
              const image = event.currentTarget;
              if (image.dataset.fallback) return;
              image.dataset.fallback = "true";
              image.src = FALLBACK_THUMBNAIL;
            }}
          />
          {status !== "complete" && (
            <div className="absolute left-3 top-3">
              <ContestStatusLabel status={status} />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-gray-400">
          <span>{year || "Senza data"}</span>
          <span className="text-right">{dateLabel}</span>
        </div>

        <h3 className="mt-2 text-lg font-medium text-gray-900">
          <Link
            href={contestHref}
            className="hover:underline hover:decoration-2 hover:underline-offset-4"
          >
            {contest.name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap justify-end items-center gap-x-4 gap-y-2 pt-4">
          {action}
          <Link
            href={contestHref}
            className="text-sm font-medium text-gray-900 hover:underline hover:decoration-2 hover:underline-offset-4"
          >
            Dettagli <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ContestCard;
