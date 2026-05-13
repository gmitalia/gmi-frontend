import React from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { Button } from "../commons/Button";
import { ContestStatusBadge } from "./ContestStatusBadge"
import { ChevronLeftIcon, BookIcon, SendIcon } from "../commons/Icons";

const ContestHeroSection = ({ contest, actions, isComplete, isJudging, canSubmitGames, timeLeft }) => {
  const router = useRouter();

  return (
    <section className="ds-card-section">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.push("/")}
              icon={<ChevronLeftIcon size={24} strokeWidth="2.5" />}
            />
            <h1 className="text-3xl md:text-5xl font-extrabold text-content tracking-tight">{contest.name}</h1>
          </div>
          <p className="text-content-muted mt-3 md:mt-4 text-lg max-w-2xl leading-relaxed">Scopri i giochi in gara, i giudici e i risultati dell&apos;edizione.</p>
        </div>

        {!isComplete && timeLeft !== "Scaduto" && (
          <div className="w-full md:w-auto bg-surface-muted border-default rounded-xl p-6 shadow-md border">
            <p className="text-xs font-bold text-content-muted uppercase tracking-widest mb-2">
              {canSubmitGames ? "Scadenza Consegna" : "Termine Giudizi"}
            </p>
            <div className="text-2xl font-mono font-bold text-secondary">
              {timeLeft ?? <span className="inline-block h-8 w-40 bg-surface-solid rounded animate-pulse align-middle" />}
            </div>
            <p className="text-[10px] text-content-muted mt-2 italic">
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <SendIcon size={16} strokeWidth="2.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-tighter text-content-muted font-bold">Termine Consegna</span>
              <span className="text-sm text-content font-medium">
                {moment(contest.end_at).format("D MMMM HH:mm")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <BookIcon size={16} strokeWidth="2.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-tighter text-content-muted font-bold">Termine Giudizi</span>
              <span className="text-sm text-content font-medium">
                {moment(contest.completed_at).format("D MMMM HH:mm")}
              </span>
            </div>
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
