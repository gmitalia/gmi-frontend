import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./WebsiteLayout/PageLayout"; 
import { VotesModal } from "./PopupVotes";
import { basePath, competitionsPath } from "../src/paths";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";

export default function PageResults(props)
{
  const router = useRouter();
  const query = getQuery(router);
  const [results, setResults] = useState<Results | null>(null);
  const [contest, setContest] = useState<Contest | null>(null);
  const [judges, setJudges] = useState([]);
  const [judgeAvatars, setJudgeAvatars] = useState({}); // Mappa ID -> avatar

  const [error, setError] = useState<string>();
  const [visibleGames, setVisibleGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(()=>
  {
    GMIApi.getInstance().getResults(query.contest, (data)=>
    {
      if(!data.success)
        setError(data.error || "invalid results");
      else
      {
        setResults(data);
        // Fetch avatar individuali per ogni giudice in un'unica chiamata
        if (data.judges_data && data.judges_data.length > 0) {
          GMIApi.getInstance().getUsers((userData) => {
            if (userData.success && userData.users?.length > 0) {
              const avatars = {};
              data.judges_data.forEach(judge => {
                const user = userData.users.find(u => u.id == judge.id);
                if (user) {
                  avatars[judge.id] = user.avatar || user.user_avatar;
                }
              });
              setJudgeAvatars(prev => ({ ...prev, ...avatars }));
            }
          });
        }
      }
    });

    GMIApi.getInstance().getContest(query.contest, (data) => {
      if (data.success) setContest(data.contests[0]);
    });

    // Fetch judges data with avatars for completed contests
    GMIApi.getInstance().getParticipants(query.contest, 0, (data) => {
      if (data.success) {
        const judgeParticipants = data.participants?.filter(p => p.kind === 1 || p.kind === '1') || [];
        setJudges(judgeParticipants);
      }
    });
  },
  [query.contest]);

  if(error)
    return (
      <PageLayout>
        <div className="bg-error/10 border border-error/20 p-6 md:p-12 text-center text-error">
          {error}
        </div>
      </PageLayout>
    );

  if(!results)
    return (
      <PageLayout>
        <div className="bg-surface border border-default p-6 md:p-12 text-center text-content-muted">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-thick border-secondary/30 border-t-secondary animate-spin" />
            <span>Caricamento risultati in corso...</span>
          </div>
        </div>
      </PageLayout>
    );

  const toggleGameVisibility = (index)=>
  {
    const updatedVisibleGames = [...visibleGames];
    updatedVisibleGames[index] = !updatedVisibleGames[index];
    setVisibleGames(updatedVisibleGames);
  };

  const handleGameClick = (game, index, isVisible) => {
    if (!isVisible) {
      toggleGameVisibility(index);
    } else if (results.public) {
      // Fetch dettagli completi del gioco (inclusi autori) da getGames
      GMIApi.getInstance().getGames(query.contest, (gamesData) => {
        if (gamesData.success) {
          const fullGame = gamesData.games.find(g => String(g.id) === String(game.id));
          if (fullGame) {
            setSelectedGame({ ...game, authors: fullGame.authors });
          } else {
            setSelectedGame(game);
          }
        } else {
          setSelectedGame(game);
        }
      });
    }
  };

  const games = (results.games_data || []).sort((a, b) => (parseFloat(b.avg_score) || 0) - (parseFloat(a.avg_score) || 0));
  const podium = games.filter((game)=> !!game.avg_score).slice(0, 3);
  
  const leaderboard = games.map((game, index)=>
  {
    const isVisible = visibleGames[index] || results.public;
    const isTop3 = index < 3 && game.avg_score;
    
    return (
      <tr
       key={game.id}
       className={`group border-b border-default hover:bg-content/5 transition-colors cursor-pointer ${isTop3 ? "bg-secondary/5" : ""}`}
       onClick={() => handleGameClick(game, index, isVisible)}
      >
        <td className="p-2 md:p-4 text-center">
          {game.avg_score && !(isComplete && !results.public) ? (
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${
              index === 0 ? "ds-trophy-gold" :
              index === 1 ? "ds-trophy-silver" :
              index === 2 ? "ds-trophy-bronze" :
              "text-content-muted"
            }`}>
              {index + 1}
            </span>
          ) : isComplete && !results.public ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-content-muted">?</span>
          ) : "-"}
        </td>
        <td className="p-2 md:p-4">
          <div className={`font-bold transition-colors ${isVisible ? "text-content group-hover:text-secondary" : "text-content-muted/60"}`}>
            {isVisible ? game.name : "**************"}
          </div>
          {!isVisible && <div className="text-[10px] text-content-muted uppercase mt-0.5">Clicca per rivelare</div>}
        </td>
        <td className="p-2 md:p-4 text-center">
          <span className="font-mono font-bold text-lg text-secondary">
            {game.avg_score ? parseFloat(game.avg_score).toFixed(1) : "N/A"}
          </span>
        </td>
      </tr>
    );
  });

  const judges_report = (results.judges_data || []).map((judge)=>
  {
    const total = results.games_count || 1;
    const pct = Math.round((Number(judge.votes_count || 0) / total) * 100);
    return (
      <div key={judge.id} className="border border-default p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-content">{judge.name}</span>
          <span className="text-xs font-mono text-content-muted">{judge.votes_count}/{total} ({pct}%)</span>
        </div>
        <div className="h-2 bg-surface overflow-hidden border border-default">
          <div 
            className="h-full bg-secondary transition-all duration-1000" 
            style={{width: `${pct}%`}} 
          />
        </div>
      </div>
    );
  });

  const isJudging = contest && !contest.is_completed && contest.is_ended;
  const isComplete = contest && contest.is_completed;

  return (
    <PageLayout
      breadcrumbs={
        contest
          ? [
              homeBreadcrumb,
              competitionsBreadcrumb,
              {
                label: contest.name,
                href: `${competitionsPath("/contest")}?contest=${contest.id}`,
              },
              { label: isJudging ? "Avanzamento giudizi" : "Risultati" },
            ]
          : undefined
      }
    >
      <div className="flex flex-col gap-8 pb-12 overflow-x-clip">
        <section className="relative bg-surface border border-default p-6 md:p-8 overflow-hidden">
          <div className="relative text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-normal text-content tracking-tight">
              {isJudging ? "Avanzamento Giudizi" : "Classifica"} <span className="text-secondary">{contest?.name || "Edizione"}</span>
            </h1>
            <p className="text-content-muted mt-2 text-lg">
              {isJudging 
                ? "I giudici stanno valutando i giochi. Ecco lo stato di avanzamento in tempo reale." 
                : "Esplora il verdetto finale e i punteggi medi dei giochi in gara."}
            </p>
          </div>
        </section>

        <div className="w-full max-w-5xl mx-auto">
          {/* Judging Phase: Show only progress bars */}
          {isJudging && (
            <section className="bg-surface border border-default p-5 md:p-8">
              <h2 className="text-xl font-bold text-content mb-4">
                Stato Giudizi
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {judges_report}
              </div>
            </section>
          )}

          {/* Complete Phase: Show ranking table and judges section */}
          {isComplete && (
            <>
              <section className="bg-surface border border-default overflow-hidden">
                <div className="p-6 border-b border-default flex items-center justify-between">
                  <h2 className="text-xl font-bold text-content">
                    Classifica Completa
                  </h2>
                  <span className="text-xs font-semibold text-content-muted uppercase tracking-widest border border-default px-3 py-1">
                    {games.length} Giochi
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-muted/50 text-[10px] uppercase tracking-widest text-content-muted font-semibold">
                        <th className="p-2 md:p-4 text-center w-12 md:w-16">Pos</th>
                        <th className="p-2 md:p-4 text-left">Gioco</th>
                        <th className="p-2 md:p-4 text-center w-20 md:w-24">Media Voti</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leaderboard}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Judges Section with avg_score */}
              <section className="bg-surface border border-default p-6 md:p-8 mt-8">
                <h2 className="text-xl font-bold text-content mb-8">
                  Giuria - Media Voti
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(results?.judges_data || []).length === 0 ? (
                    <div className="col-span-full text-center text-content-muted py-8">
                      Dati giudici non disponibili
                    </div>
                  ) : (
                    results.judges_data.map((judge) => {
                      const avgScore = judge.avg_score ? parseFloat(judge.avg_score).toFixed(1) : "N/A";
                      // Usa avatar da getUserInfo se disponibile
                      const avatar = judgeAvatars[judge.id] || (basePath + "/img/profile.png");
                      const name = judge.name;
                      return (
                        <Link key={judge.id} href={`/competizioni/user?user=${judge.id}`} className="border border-default p-4 flex items-center gap-4 hover:border-content/30 transition-colors cursor-pointer group">
                          
                            <img
                              src={avatar}
                              className="w-14 h-14 rounded-full object-cover border-thin border-surface group-hover:border-secondary/50 transition-colors"
                              alt={name}
                              onError={(e) => { (e.target as HTMLImageElement).src = basePath + "/img/profile.png"; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-content truncate group-hover:text-secondary transition-colors">{name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-mono font-bold text-secondary">{avgScore}</div>
                              <div className="text-[10px] text-content-muted uppercase">Media</div>
                            </div>
                          </Link>
                      );
                    })
                  )}
                </div>
              </section>
            </>
          )}

          {!isJudging && !isComplete && (
            <div className="bg-surface border border-default p-12 text-center text-content-muted">
              Nessun dato disponibile per questa fase della competizione.
            </div>
          )}
        </div>
      </div>

      <VotesModal 
        contest={query.contest}
        gameId={selectedGame?.id}
        gameName={selectedGame?.name}
        authors={selectedGame?.authors}
        resultsPublic={results?.public}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </PageLayout>
  );
}
