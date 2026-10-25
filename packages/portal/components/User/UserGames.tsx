import React from "react";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";
import Link from "next/link";
import { EmptyState } from "../commons/EmptyState";

export default function UserGames(props) {
  /**@type {UserInfo} */
  const userInfo = props.userInfo;
  const contests = props.contests || [];

  // Map contest ID to contest object for quick lookup
  const contestMap = {};
  contests.forEach((c) => {
    contestMap[c.id] = c;
  });

  // Sort games by contest_id descending (newest first)
  const sortedGames = [...(userInfo.games ?? [])].sort(
    (a, b) => b.contest_id - a.contest_id
  );

  const isLoading = contests.length === 0 && sortedGames.length > 0;

  return (
    <section className="ds-card-section">
      <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-content">
        Giochi
        {sortedGames.length > 0 && (
          <span className="text-lg text-content-muted">({sortedGames.length})</span>
        )}
      </h2>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded bg-surface-muted"
            />
          ))}
        </div>
      ) : sortedGames.length === 0 ? (
        <EmptyState>Non ci sono giochi.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {sortedGames.map((game, i) => {
            const contest = contestMap[game.contest_id];
            return (
              <div key={i} className="flex h-full flex-col gap-4">
                <Link
                  href={`/competizioni/contest/?contest=${contest?.id ?? game.contest_id}`}
                  className="group"
                >
                  <div className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-content-muted">
                    {contest?.name ?? "..."}
                  </div>
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
      )}
    </section>
  );
}
