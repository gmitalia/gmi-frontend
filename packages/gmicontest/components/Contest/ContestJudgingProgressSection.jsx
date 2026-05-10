import React from "react";
import { PenIcon } from "../commons/Icons";
import { basePath } from "../../next.config";

const JudgeProgressRow = ({ judge, total, judges }) => {
  const pct = Math.round(((judge.votes_count || 0) / total) * 100);
  const judgeData = judges.find(j => j.id == judge.id);
  const avatar = judgeData?.avatar || judgeData?.user_avatar || judge?.avatar || judge?.user_avatar || (basePath + "/img/profile.png");

  return (
    <div className="rounded-md bg-surface-muted border border-default p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar}
          className="w-10 h-10 rounded-full object-cover border-thin border-surface-solid"
          alt={judge.name}
          onError={(e) => { e.target.src = basePath + "/img/profile.png"; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className="font-bold text-content truncate">{judge.name}</span>
            <span className="text-xs font-mono text-content-muted ml-2">{judge.votes_count}/{total} ({pct}%)</span>
          </div>
        </div>
      </div>
      <div className="h-2 rounded-full bg-surface-solid overflow-hidden border border-default">
        <div
          className="h-full bg-gradient-to-r from-secondary to-accent shadow-[0_0_8px_rgba(var(--ds-rgb-secondary),0.4)] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ContestJudgingProgressSection = ({ judgingProgress, judges }) => {
  return (
    <section className="ds-card-section">
      <h2 className="text-2xl font-bold text-content mb-8 flex items-center gap-3">
        <span className="p-2 rounded-lg bg-secondary/10 text-secondary">
          <PenIcon size={20} />
        </span>
        Progresso Giudizi
      </h2>

      {!judgingProgress ? (
        <div className="flex items-center justify-center py-8 text-content-muted">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-5 h-5 border-thin border-secondary/30 border-t-[var(--ds-color-secondary)] rounded-full animate-spin" />
            <span>Caricamento dati giudizi...</span>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {(judgingProgress.judges_data || []).length === 0 ? (
            <div className="col-span-2 text-center text-content-muted py-4">
              Nessun dato disponibile sui giudici.
            </div>
          ) : (
            judgingProgress.judges_data.map((judge) => (
              <JudgeProgressRow key={judge.id} judge={judge} total={judgingProgress.games_count || 1} judges={judges} />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ContestJudgingProgressSection;
