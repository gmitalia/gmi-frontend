import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";
import Link from "next/link";

export default function UserGames(props) {
  /**@type {UserInfo} */
  const userInfo = props.userInfo;
  const contests = props.contests || [];

  // Map contest ID to contest object for quick lookup
  const contestMap = {};
  contests.forEach(c => {
    contestMap[c.id] = c;
  });

  if (contests.length === 0 && userInfo.games?.length > 0)
    return <div>Loading</div>;

  // Sort games by contest_id descending (newest first)
  const sortedGames = [...userInfo.games].sort((a, b) => b.contest_id - a.contest_id);

  if (sortedGames.length === 0) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-content uppercase tracking-wider">Giochi</h2>
        </div>
        <div className="bg-surface-muted border border-default ds-rounded-card p-6">
          <div className="flex flex-col items-center justify-center py-12 text-content-muted">
            <p className="text-sm font-medium">Non ci sono giochi</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">Giochi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {sortedGames.map((game, i) => {
          let contest = contestMap[game.contest_id];
          return (
            <div key={i} className="flex flex-col gap-4 h-full">
              <Link href={`/contest?contest=${contest?.id}`}>
                <a className="group">
                  <div className="text-sm font-black text-content-muted uppercase tracking-[0.15em] group-hover:text-secondary transition-colors text-center">
                    {contest?.name ?? "..."}
                  </div>
                </a>
              </Link>

              <div className="flex-1">
                <GameTile
                  contest={game.contest_id}
                  position={game.placement}
                  game={game}
                  showVotes={true}
                  showTrophy={true}
                  resultsPublic={game.placement > 0}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
