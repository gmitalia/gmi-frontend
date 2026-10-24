import React from "react";
import moment from "moment";
import "moment/locale/it";
import { ContestStatusBadge } from "./ContestStatusBadge";

const ContestHeroSection = ({
  contest,
  actions,
  isComplete,
  isJudging,
  canSubmitGames,
  timeLeft,
}) => {
  return (
    <section className="border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {actions}
          <div id="results-portal" className="contents" />
        </div>

        {!isComplete && timeLeft !== "Scaduto" && (
          <div className="border border-gray-200 px-4 py-3 md:min-w-[240px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {canSubmitGames ? "Scadenza consegna" : "Termine giudizi"}
            </p>
            <div className="font-mono text-xl font-medium text-gray-900">
              {timeLeft ?? (
                <span className="inline-block h-6 w-32 animate-pulse bg-gray-100 align-middle" />
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              {canSubmitGames
                ? "La vuoi la maglietta o no? Sbrigati a consegnare"
                : "La giuria sta valutando i giochi."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-gray-200 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Termine consegna
          </span>
          <span className="text-sm text-gray-700">
            {moment(contest.end_at).locale("it").format("D MMMM HH:mm")}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Termine giudizi
          </span>
          <span className="text-sm text-gray-700">
            {moment(contest.completed_at).locale("it").format("D MMMM HH:mm")}
          </span>
        </div>

        <div className="ml-auto flex items-center">
          <ContestStatusBadge
            variant={isComplete ? "complete" : isJudging ? "judging" : "open"}
          />
        </div>
      </div>
    </section>
  );
};

export default ContestHeroSection;
