import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import { Button } from "./commons/Button";
import ConfirmationModal from "./commons/ConfirmationModal";
import { VotesModal } from "./PopupVotes";
import { basePath, competitionsPath } from "../src/paths";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";
import type { RootState } from "../src/store";

export default function PageResults(props)
{
  const router = useRouter();
  const query = getQuery(router);
  const userInfo = useSelector((root: RootState) => root.auth.userInfo);
  const myUserId = userInfo?.user?.user_id;
  const [results, setResults] = useState<Results | null>(null);
  const [contest, setContest] = useState<Contest | null>(null);
  const [judges, setJudges] = useState([]);
  const [judgeAvatars, setJudgeAvatars] = useState({}); // Mappa ID -> avatar

  const [error, setError] = useState<string>();
  const [visibleGames, setVisibleGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishError, setPublishError] = useState<{
    message: string;
    votes_confirmed?: number;
    votes_required?: number;
  } | null>(null);

  useEffect(()=>
  {
    setJudges([]);

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
  [query.contest, myUserId]);

  if(error)
    return (
      <SectionLayout
        title="Risultati"
        description="Classifiche, voti e giudizi delle competizioni."
      >
        <div className="bg-error/10 border border-error/20 p-6 md:p-12 text-center text-error">
          {error}
        </div>
      </SectionLayout>
    );

  if(!results)
    return (
      <SectionLayout
        title="Risultati"
        description="Classifiche, voti e giudizi delle competizioni."
      >
        <div className="bg-surface border border-default p-6 md:p-12 text-center text-content-muted">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-thick border-secondary/30 border-t-secondary animate-spin" />
            <span>Caricamento risultati in corso...</span>
          </div>
        </div>
      </SectionLayout>
    );

  const isJudging = !!contest && !contest.is_completed && contest.is_ended;
  const isComplete = !!contest && contest.is_completed;

  const confirmedVotes = Number(results.votes_confirmed ?? 0);
  const requiredVotes = Number(results.votes_required ?? 0);
  const missingVotes = Math.max(0, requiredVotes - confirmedVotes);
  const globalPct = requiredVotes ? Math.round((confirmedVotes / requiredVotes) * 100) : 0;

  const isHost =
    !!myUserId &&
    judges.some(
      (judge) =>
        judge.id == myUserId &&
        (judge.host === 1 || judge.host === "1" || judge.host === true)
    );
  const votesComplete =
    requiredVotes > 0 &&
    (results.all_votes_confirmed === true || confirmedVotes >= requiredVotes);
  const resultsArePublic = results.public === true || String(results.public) === "1";
  const isHostPreview = isHost && votesComplete && !resultsArePublic;
  const showResults = isComplete || isHostPreview;
  const showJudgingProgress = isJudging && !isHostPreview;

  const toggleGameVisibility = (index)=>
  {
    const updatedVisibleGames = [...visibleGames];
    updatedVisibleGames[index] = !updatedVisibleGames[index];
    setVisibleGames(updatedVisibleGames);
  };

  const handleGameClick = (game, index, isVisible) => {
    if (!isVisible) {
      toggleGameVisibility(index);
    } else if (resultsArePublic) {
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

  const handlePublish = () => {
    setShowPublishModal(false);
    setPublishError(null);
    GMIApi.getInstance().publishResults(query.contest, (data) => {
      if (data.success) {
        // La pubblicazione rende subito visibili i risultati e rimuove lo
        // spoiler senza attendere un nuovo caricamento della pagina.
        setResults(current => current ? { ...current, public: true } : current);
        setContest(current => current ? { ...current, is_completed: true } : current);
        alert("Risultati pubblicati con successo!");
        return;
      }

      if (data.code === "VOTES_NOT_CONFIRMED" && data.votes_required !== undefined) {
        setResults(current => current
          ? {
              ...current,
              votes_confirmed: data.votes_confirmed ?? current.votes_confirmed,
              votes_required: data.votes_required,
              all_votes_confirmed: false,
            }
          : current);
      }

      setPublishError({
        message: data.error || "Errore sconosciuto durante la pubblicazione.",
        votes_confirmed: data.votes_confirmed,
        votes_required: data.votes_required,
      });
    });
  };

  const games = (results.games_data || []).sort((a, b) => (parseFloat(b.avg_score) || 0) - (parseFloat(a.avg_score) || 0));
  const podium = games.filter((game)=> !!game.avg_score).slice(0, 3);

  const leaderboard = games.map((game, index)=>
  {
    const isVisible = visibleGames[index] || resultsArePublic;
    const isTop3 = index < 3 && game.avg_score;
    
    return (
      <tr
       key={game.id}
       className={`group border-b border-default hover:bg-content/5 transition-colors cursor-pointer ${isTop3 ? "bg-secondary/5" : ""}`}
       onClick={() => handleGameClick(game, index, isVisible)}
      >
        <td className="p-2 md:p-4 text-center">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${
            game.avg_score
              ? index === 0 ? "ds-trophy-gold" :
                index === 1 ? "ds-trophy-silver" :
                index === 2 ? "ds-trophy-bronze" :
                "text-content-muted"
              : "text-content-muted"
          }`}>
            {index + 1}
          </span>
        </td>
        <td className="p-2 md:p-4">
          <div className={`font-bold transition-colors ${isVisible ? "text-content group-hover:text-secondary" : "text-content-muted/60"}`}>
            {isVisible ? game.name : "**************"}
          </div>
          {!isVisible && <div className="text-[10px] text-content-muted uppercase mt-0.5">Clicca per rivelare</div>}
        </td>
        <td className="p-2 md:p-4 text-center">
          <span className={`font-mono font-bold text-lg ${isVisible ? "text-secondary" : "text-content-muted/60"}`}>
            {isVisible
              ? game.avg_score ? parseFloat(game.avg_score).toFixed(1) : "N/A"
              : "***"}
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

  return (
    <SectionLayout
      title={
        isHostPreview
          ? "Anteprima Risultati"
          : isJudging
            ? "Avanzamento giudizi"
            : "Classifica"
      }
      description={
        isHostPreview
          ? `${contest?.name || "Competizione"} · Anteprima riservata al capo giuria. I risultati non sono ancora pubblici.`
          : isJudging
            ? `${contest?.name || "Competizione"} · I giudici stanno valutando i giochi. Ecco lo stato di avanzamento in tempo reale.`
            : `${contest?.name || "Competizione"} · Esplora il verdetto finale e i punteggi medi dei giochi in gara.`
      }
      action={
        isHostPreview ? (
          <Button onClick={() => setShowPublishModal(true)}>
            Pubblica Risultati
          </Button>
        ) : undefined
      }
      breadcrumbs={
        contest
          ? [
              homeBreadcrumb,
              competitionsBreadcrumb,
              {
                label: contest.name,
                href: `${competitionsPath("/contest/")}?contest=${contest.id}`,
              },
              { label: isHostPreview ? "Anteprima Risultati" : isJudging ? "Avanzamento giudizi" : "Risultati" },
            ]
          : undefined
      }
    >
      <div className="flex flex-col gap-8 pb-12 overflow-x-clip">
        {publishError && (
          <div role="alert" className="w-full max-w-5xl mx-auto border border-error/20 bg-error/10 p-4 text-sm text-error">
            <p className="font-bold">Impossibile pubblicare i risultati</p>
            <p className="mt-1">{publishError.message}</p>
            {publishError.votes_required !== undefined && (
              <p className="mt-1 font-mono text-xs">
                Voti confermati: {publishError.votes_confirmed ?? 0}/{publishError.votes_required}
                {" · "}
                mancano {Math.max(0, publishError.votes_required - (publishError.votes_confirmed ?? 0))}
              </p>
            )}
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto">
          {/* Judging Phase: Show only progress bars */}
          {showJudgingProgress && (
            <section className="bg-surface border border-default p-5 md:p-8">
              <h2 className="text-xl font-bold text-content mb-4">
                Stato Giudizi
              </h2>
              {requiredVotes > 0 && (
                <div className="mb-6 border border-default p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                      Voti confermati
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums text-content">
                      {confirmedVotes}/{requiredVotes}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-surface overflow-hidden border border-default">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        missingVotes === 0 ? "bg-success" : "bg-secondary"
                      }`}
                      style={{ width: `${globalPct}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                {judges_report}
              </div>
            </section>
          )}

          {/* Complete Phase (o anteprima del capo giuria): classifica e giuria */}
          {showResults && (
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
                        <Link key={judge.id} href={`/competizioni/user/?user=${judge.id}`} className="border border-default p-4 flex items-center gap-4 hover:border-content/30 transition-colors cursor-pointer group">
                          
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

          {!showJudgingProgress && !showResults && (
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
        resultsPublic={resultsArePublic}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />

      <ConfirmationModal
        isOpen={showPublishModal}
        title="Pubblica Risultati"
        message="Verranno resi i risultati e le votazioni visibili al pubblico. Vuoi continuare?"
        confirmText="Pubblica"
        cancelText="Annulla"
        variant="primary"
        onConfirm={handlePublish}
        onCancel={() => setShowPublishModal(false)}
      />
    </SectionLayout>
  );
}
