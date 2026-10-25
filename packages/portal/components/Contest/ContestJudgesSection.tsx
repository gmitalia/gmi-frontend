import React from "react";
import Link from "next/link";
import { basePath } from "../../src/paths";
import { EmptyState } from "../commons/EmptyState";

const roleLabelClasses =
  "mt-1 inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.18em]";

const getPercent = (votes: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((votes / total) * 100)) : 0;

const JudgeCard = ({ judge, isHost, progress, total }) => {
  const votes = Math.max(0, Number(progress?.votes_count ?? 0));
  const pct = getPercent(votes, total);
  const complete = total > 0 && votes >= total;

  return (
    <div className="group flex flex-col items-center text-center">
      <Link
        href={`/competizioni/user/?user=${judge.id}`}
        className="relative mb-2 block cursor-pointer"
      >
        <img
          src={judge.avatar || judge.user_avatar || basePath + "/img/profile.png"}
          className={`h-20 w-20 object-cover md:h-24 md:w-24 ${
            isHost ? "border-4 border-accent" : "border-4 border-default"
          }`}
          alt={judge.user_name}
          onError={(e) => { (e.target as HTMLImageElement).src = basePath + "/img/profile.png"; }}
        />
      </Link>
      <Link
        href={`/competizioni/user/?user=${judge.id}`}
        className="text-lg font-bold text-content transition-colors hover:text-secondary"
      >
        {judge.user_name}
      </Link>
      {isHost ? (
        <span className={`${roleLabelClasses} text-accent`}>
          Organizzatore
        </span>
      ) : (
        <span className={`${roleLabelClasses} text-content-muted`}>
          Giudice
        </span>
      )}

      {progress && total > 0 && (
        <div className="mt-3 w-full max-w-[10rem]">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-mono tabular-nums text-content-muted">
              {votes}/{total} giochi
            </span>
            <span className="font-mono font-bold tabular-nums text-content">
              {pct}%
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 bg-surface-solid overflow-hidden border border-default"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Voti confermati da ${judge.user_name}`}
          >
            <div
              className={`h-full transition-all duration-1000 ${
                complete ? "bg-success" : "bg-accent-warm"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ContestJudgesSection = ({ judges = [], judgingProgress = null }) => {
  const total = Math.max(0, Number(judgingProgress?.games_count ?? 0));
  const confirmed = Math.max(0, Number(judgingProgress?.votes_confirmed ?? 0));
  const required = Math.max(0, Number(judgingProgress?.votes_required ?? 0));
  const globalPct = getPercent(confirmed, required);
  const allConfirmed = required > 0 && confirmed >= required;

  const progressById = new Map(
    (judgingProgress?.judges_data || []).map((judge) => [
      String(judge.id),
      judge,
    ])
  );

  const renderJudge = (judge, isHost) => (
    <JudgeCard
      key={judge.id}
      judge={judge}
      isHost={isHost}
      progress={progressById.get(String(judge.id))}
      total={total}
    />
  );

  return (
    <section className="ds-card-section">
      <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-3">
        Giuria
      </h2>

      {judgingProgress && required > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-content-muted">
              Avanzamento globale
            </span>
            <span
              className={`font-mono text-sm font-bold tabular-nums ${
                allConfirmed ? "text-success" : "text-content"
              }`}
            >
              {globalPct}%
            </span>
          </div>
          <div
            className="mt-2 h-2 bg-surface-solid overflow-hidden border border-default"
            role="progressbar"
            aria-valuenow={globalPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Voti confermati totali"
          >
            <div
              className={`h-full transition-all duration-1000 ${
                allConfirmed ? "bg-success" : "bg-accent-warm"
              }`}
              style={{ width: `${globalPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {judges.filter(j => j.host == "1" || j.host === true).map(judge => renderJudge(judge, true))}

        {judges.filter(j => j.host != "1" && j.host !== true).map(judge => renderJudge(judge, false))}
      </div>

      {judges.length === 0 && (
        <EmptyState>
          Ancora nessun giudice per questa competizione.
        </EmptyState>
      )}
    </section>
  );
};

export default ContestJudgesSection;
