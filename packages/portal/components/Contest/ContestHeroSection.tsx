import React from "react";
import moment from "moment";
import { ContestStatusBadge } from "./ContestStatusBadge"

const ContestHeroSection = ({ contest, actions, isComplete, isJudging, canSubmitGames, timeLeft }) => {
  return (
    <section className="ds-card-section">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-normal text-content tracking-tight">{contest.name}</h1>
          <p className="text-content-muted mt-3 md:mt-4 text-lg max-w-2xl leading-relaxed">Tutti i giochi, i giudici e i risultati dell&apos;edizione.</p>
        </div>

        {!isComplete && timeLeft !== "Scaduto" && (
          <div className="w-full md:w-auto bg-surface border border-default p-6">
            <p className="text-xs font-semibold text-content-muted uppercase tracking-widest mb-2">
              {canSubmitGames ? "Scadenza Consegna" : "Termine Giudizi"}
            </p>
            <div className="text-2xl font-mono font-bold text-content">
              {timeLeft ?? <span className="inline-block h-8 w-40 bg-surface-solid animate-pulse align-middle" />}
            </div>
            <p className="text-[10px] text-content-muted mt-2">
              {canSubmitGames ? "Invia il gioco prima che scada il tempo!" : "La giuria sta valutando i giochi"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-1 flex-wrap gap-x-8 gap-y-4">
        <div className="flex flex-wrap gap-3">
          {actions}
          <div id="results-portal" className="contents" />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-content-muted font-semibold">Termine Consegna</span>
            <span className="text-sm text-content">
              {moment(contest.end_at).format("D MMMM HH:mm")}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-content-muted font-semibold">Termine Giudizi</span>
            <span className="text-sm text-content">
              {moment(contest.completed_at).format("D MMMM HH:mm")}
            </span>
          </div>
        </div>

        <div className="flex items-center ml-auto">
          <ContestStatusBadge variant={isComplete ? "complete" : isJudging ? "judging" : "open"} />
        </div>
      </div>
    </section>
  );
};

export default ContestHeroSection;
