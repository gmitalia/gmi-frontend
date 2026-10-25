import React from "react";
import moment from "moment";
import "moment/locale/it";
import { ContestStatusBadge } from "./ContestStatusBadge";
import { getContestYear } from "../../src/contestStatus";
import { ClockIcon } from "../commons/Icons";
import ContestHeroBackground from "./ContestHeroBackground";

const COUNTDOWN_UNITS = {
  g: "giorni",
  h: "ore",
  m: "min",
  s: "sec",
} as const;

type CountdownPart = {
  value: string;
  label: string;
};

function parseCountdown(timeLeft?: string | null): CountdownPart[] | null {
  if (!timeLeft || timeLeft === "Scaduto") return null;

  const parts = timeLeft.split(" ").map((chunk) => {
    const match = chunk.match(/^(\d+)([ghms])$/);
    if (!match) return null;

    return {
      value: match[1].padStart(2, "0"),
      label: COUNTDOWN_UNITS[match[2] as keyof typeof COUNTDOWN_UNITS],
    };
  });

  return parts.length === 4 && parts.every(Boolean)
    ? (parts as CountdownPart[])
    : null;
}

function formatDeadline(value?: string | null) {
  return value
    ? moment(value).locale("it").format("D MMMM YYYY · HH:mm")
    : "Da definire";
}

const Deadline = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2.5">
    <ClockIcon size={14} className="mt-0.5 shrink-0 text-accent-cool" />
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm text-gray-200">{value}</p>
    </div>
  </div>
);

const ContestHeroSection = ({
  contest,
  actions,
  isComplete,
  isJudging,
  canSubmitGames,
  timeLeft,
}) => {
  const year = getContestYear(contest);
  const countdown = parseCountdown(timeLeft);

  return (
    <section className="contest-hero relative overflow-hidden text-gray-100 mb-8">
      <ContestHeroBackground />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <ContestStatusBadge
                variant={isComplete ? "complete" : isJudging ? "judging" : "open"}
              />
            </div>

            <h1 className="mt-2 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
              {contest.name}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Deadline
                label="Consegna giochi"
                value={formatDeadline(contest.end_at)}
              />
              <span
                aria-hidden="true"
                className="hidden h-9 w-px bg-white/10 sm:block"
              />
              <Deadline
                label="Termine giudizi"
                value={formatDeadline(contest.completed_at)}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {actions}
              <div id="results-portal" className="contents" />
            </div>
          </div>

          {!isComplete && (
            <div className="w-full shrink-0 lg:w-[22rem]">
              <div className="border border-white/10 bg-night-800/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                    <ClockIcon size={12} className="text-accent-cool" />
                    {canSubmitGames
                      ? "Tempo per consegnare"
                      : "Tempo per i giudizi"}
                  </p>
                 
                </div>

                {countdown ? (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {countdown.map((part) => (
                      <div
                        key={part.label}
                        className="flex flex-col items-center border border-white/10 bg-white/[0.04] px-1 py-2.5"
                      >
                        <span className="font-mono text-xl font-semibold tabular-nums text-white md:text-2xl">
                          {part.value}
                        </span>
                        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                          {part.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : timeLeft === "Scaduto" ? (
                  <p className="mt-4 font-mono text-lg text-gray-300">
                    Tempo scaduto
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-[3.75rem] animate-pulse border border-white/10 bg-white/[0.04]"
                      />
                    ))}
                  </div>
                )}

                <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-5 text-gray-400">
                  {timeLeft === "Scaduto"
                    ? "Sbrigati, prima che il capo giuria blocchi le consegne!"
                    : canSubmitGames
                      ? "Smettila di guardare il contatore e torna a sviluppare"
                      : "La giuria sta valutando i giochi."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContestHeroSection;
