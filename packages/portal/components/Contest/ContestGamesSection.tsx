import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createPortal } from "react-dom";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "./GameTile";
import { Button } from "../commons/Button";

const ContestGamesSection = ({ contest, contestEnded, onPublicResults }) => {
  const router = useRouter();
  const [games, setGames] = useState<any>();
  const [judges, setJudges] = useState<any[] | undefined>(undefined);
  const [error, setError] = useState<string>();
  const [showVotes, setShowVotes] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    GMIApi.getInstance().getGames(contest, (data) => {
      setGames(data.games);
      setShowVotes(data.public_results);
      if (onPublicResults) {
        onPublicResults(data.public_results);
      }
    });

    return () => {
      setGames(null);
      setShowVotes(false);
      setJudges(undefined);
    };
  }, [contest]);

  useEffect(() => {
    GMIApi.getInstance().getParticipants(contest, false, (data) => {
      if (!data.success)
        setError(data.error || "invalid participants");
      else
        setJudges(data?.participants
          .filter(part => part.kind == "1")
          .map(part => ({ id: part.id, name: part.user_name, votes_count: 0 })));
    });
  }, [contest]);

  useEffect(() => setMounted(true), []);

  const isLoading = games == undefined;
  const showTrophy = contestEnded;

  const elements = games?.map((game, i) => (
    <GameTile
      key={game.id}
      contest={contest}
      position={i + 1}
      game={game}
      showVotes={showVotes}
      showTrophy={showTrophy}
      resultsPublic={showVotes}
    />
  ));

  const actions = (mounted && showVotes && games && document.querySelector("#results-portal")) ? (
    createPortal(
      <Button variant="primary" size="md" onClick={() => router.push("/competizioni/results?contest=" + contest)}>
        Dettaglio Risultati
      </Button>,
      document.querySelector("#results-portal")
    )
  ) : null;

  return (
    <section className="ds-card-section">
      <h2 className="text-2xl font-bold text-content flex items-center gap-3 mb-4">
        Giochi 
        {games && <span className="text-content-muted text-lg">({games.length})</span>}
      </h2>
      <div className="w-full flex flex-col gap-4">
        {actions}
        <div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
            {isLoading ? (
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 bg-surface-muted rounded animate-pulse" />
                ))}
              </>
            ) : elements}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContestGamesSection;
