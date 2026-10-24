import React from "react";
import "moment/locale/it";
import { parseAuthors } from "../../src/Utils";

export default function UserStats(props) {
  const userInfo = props.userInfo;
  const isHero = props.variant === "hero";

  if (!userInfo) return null;

  const statistics = [
    {
      name: "Partecipazioni",
      value: userInfo.games.length,
    },
    {
      name: "Vittorie",
      value: userInfo.games.filter((o) => o.placement == 1).length,
    },
    {
      name: "Podi",
      value: userInfo.games.filter(
        (o) => o.placement < 4 && o.placement != 0
      ).length,
    },
    {
      name: "Collab",
      value: userInfo.games.filter(
        (o) => parseAuthors(o.authors).length > 1
      ).length,
    },
    {
      name: "Giudizi",
      value: userInfo.votes?.length ?? 0,
    },
  ];

  if (isHero) {
    return (
      <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:gap-x-6">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="flex items-baseline gap-1.5 whitespace-nowrap"
          >
            <span className="text-sm font-bold leading-none text-white sm:text-base">
              {stat.value}
            </span>
            <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-gray-400 sm:text-[10px]">
              {stat.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">
          Statistiche
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="border border-default p-4 flex flex-col items-center justify-center gap-2 bg-surface"
          >
            <span className="text-[10px] font-semibold text-content-muted uppercase tracking-widest mt-1">
              {stat.name}
            </span>
            <span className="text-2xl font-bold text-content">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
