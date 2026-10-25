import React from "react";
import { basePath } from "../../src/paths";
import { CheckIcon, ClockIcon } from "../commons/Icons";

type ProgressStatus = "complete" | "progress" | "idle";

const statusMeta: Record<
  ProgressStatus,
  { label: string; badge: string; bar: string; ring: string }
> = {
  complete: {
    label: "Confermato",
    badge: "border-success/20 bg-success/10 text-success",
    bar: "bg-success",
    ring: "border-success",
  },
  progress: {
    label: "In corso",
    badge: "border-accent-warm/30 bg-accent-warm/5 text-accent-warm",
    bar: "bg-accent-warm",
    ring: "border-accent-warm",
  },
  idle: {
    label: "Da iniziare",
    badge: "border-default bg-surface-muted text-content-muted",
    bar: "bg-secondary/20",
    ring: "border-default",
  },
};

const getStatus = (votes: number, total: number): ProgressStatus => {
  if (total > 0 && votes >= total) return "complete";
  if (votes > 0) return "progress";
  return "idle";
};

const getPercent = (votes: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((votes / total) * 100)) : 0;

const JudgeProgressRow = ({ judge, total, judges }) => {
  const votes = Math.max(0, Number(judge.votes_count ?? 0));
  const pct = getPercent(votes, total);
  const statusKey = getStatus(votes, total);
  const status = statusMeta[statusKey];
  const judgeData = judges.find((j) => j.id == judge.id);
  const avatar =
    judgeData?.avatar ||
    judgeData?.user_avatar ||
    judge?.avatar ||
    judge?.user_avatar ||
    basePath + "/img/profile.png";

  return (
    <div className="border border-default p-4">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={avatar}
            className={`h-11 w-11 rounded-full object-cover border-thin ${status.ring}`}
            alt={judge.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                basePath + "/img/profile.png";
            }}
          />
          {statusKey === "complete" && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-on-primary">
              <CheckIcon size={10} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <span className="font-bold text-content truncate">
              {judge.name}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${status.badge}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono tabular-nums text-content-muted">
              {votes}/{total} giochi
            </span>
            <span className="font-mono font-bold tabular-nums text-content">
              {pct}%
            </span>
          </div>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 bg-surface-solid overflow-hidden border border-default"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Voti confermati da ${judge.name}`}
      >
        <div
          className={`h-full transition-all duration-1000 ${status.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ContestJudgingProgressSection = ({ judgingProgress, judges }) => {
  const confirmedVotes = Math.max(
    0,
    Number(judgingProgress?.votes_confirmed ?? 0)
  );
  const requiredVotes = Math.max(
    0,
    Number(judgingProgress?.votes_required ?? 0)
  );
  const missingVotes = Math.max(0, requiredVotes - confirmedVotes);
  const globalPct = getPercent(confirmedVotes, requiredVotes);
  const summaryStatus = statusMeta[getStatus(confirmedVotes, requiredVotes)];
  const allConfirmed = requiredVotes > 0 && missingVotes === 0;
  const judgeTotal = Math.max(0, Number(judgingProgress?.games_count ?? 0));

  return (
    <section className="ds-card-section">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold text-content">Progresso Giudizi</h2>
        {judgingProgress && requiredVotes > 0 && (
          <span
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${summaryStatus.badge}`}
          >
            {allConfirmed ? (
              <CheckIcon size={12} />
            ) : (
              <ClockIcon size={12} />
            )}
            {allConfirmed ? "Completato" : summaryStatus.label}
          </span>
        )}
      </div>

      {!judgingProgress ? (
        <div className="flex items-center justify-center py-8 text-content-muted">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-5 h-5 border-thin border-secondary/30 border-t-[var(--ds-color-secondary)] rounded-full animate-spin" />
            <span>Caricamento dati giudizi...</span>
          </div>
        </div>
      ) : (
        <>
          {requiredVotes > 0 && (
            <div className="mb-6 border border-default">
              <div className="grid grid-cols-3">
                <div className="border-r border-default px-3 py-3 sm:px-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-content-muted">
                    Confermati
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold leading-none tabular-nums text-success">
                    {confirmedVotes}
                  </p>
                </div>
                <div className="border-r border-default px-3 py-3 sm:px-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-content-muted">
                    Richiesti
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold leading-none tabular-nums text-content">
                    {requiredVotes}
                  </p>
                </div>
                <div className="px-3 py-3 sm:px-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-content-muted">
                    Mancanti
                  </p>
                  <p
                    className={`mt-1 font-mono text-xl font-bold leading-none tabular-nums ${
                      allConfirmed ? "text-success" : "text-accent-warm"
                    }`}
                  >
                    {missingVotes}
                  </p>
                </div>
              </div>

              <div className="border-t border-default px-3 py-3 sm:px-4">
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
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {(judgingProgress.judges_data || []).length === 0 ? (
              <div className="col-span-2 text-center text-content-muted py-4">
                Nessun dato disponibile sui giudici.
              </div>
            ) : (
              judgingProgress.judges_data.map((judge) => (
                <JudgeProgressRow
                  key={judge.id}
                  judge={judge}
                  total={judgeTotal}
                  judges={judges}
                />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ContestJudgingProgressSection;
