import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { getQuery, parseAuthors } from "../src/Utils"
import VoteForm from "./Forms/VoteForm";
import GMIApi from "../src/api/GMIApi";

import { Button } from "./commons/Button";
import LoginRequiredPage from "./commons/LoginRequiredPage";
import Link from "next/link";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import EditionSwitcher from "./Competition/EditionSwitcher";

//@todo don't load if not judge
export default function PageEditVotes(props)
{
  let router = useRouter()
  let query = getQuery(router)

  const breadcrumbs = [
    homeBreadcrumb,
    competitionsBreadcrumb,
    { label: "Area giudizi" },
  ];

  const shellProps = {
    title: "Area giudizi",
    description: "Valuta i giochi della competizione e registra i tuoi voti.",
    action: <EditionSwitcher contestId={query.contest} />,
    breadcrumbs,
  };

  let [loaded, setLoaded] = useState(false)
  /**@type {[Game[], (data: Game[])=> any]} */
  let [games, setGames] = useState<any[]>([])
  /**@type {[Vote[], (data: Vote[])=> any]} */
  let [votes, setVotes] = useState<any[]>([])
  let [gameIndex, setGameIndex] = useState(0)
  let [error, setError] = useState<string>()

  useEffect(()=>
  {
    if(!router.isReady) return; // Aspetta che router sia pronto
    if(!query.contest) return;
    GMIApi.getInstance().getGames(query.contest, data=> setGames(data.games))
  }, [router.isReady, query.contest])


  useEffect(()=>
  {
    if(!games)
      return;

    GMIApi.getInstance().getVotes(query.contest, null, data=>
    {
      if(!data.success)
      {
        setError(data.error);
        console.error(data.error);
        return;
      }

      let votes = new Array(games.length);
      for(let index = 0; index < votes.length; index++)
      {
        const gameId = games[index].id;
        const voteIdx = data.votes.findIndex(game => game.game_id === gameId);
        if(voteIdx >= 0)
        {
          let vote = data.votes[voteIdx];
          //parse arrays
          try { vote.pros = JSON.parse(vote.pros); } catch { vote.pros = []; }
          try { vote.cons = JSON.parse(vote.cons); } catch { vote.cons = []; }
          if(!Array.isArray(vote.pros)) vote.pros = [];
          if(!Array.isArray(vote.cons)) vote.cons = [];

          vote.voted = parseInt(vote.score) > 0 || vote.pros.length > 0 || vote.cons.length > 0 || (vote.comment && vote.comment.trim().length > 0);

          votes[index] = vote;
        }
        else
        {
          votes[index] = 
          {
            game_id:   games[index].id,
            score:     0,
            comment:   "",
            pros:     [],
            cons:     [],
            voted:     false,
          };
        }
      }

      setVotes(votes)
      setLoaded(true)
      console.debug("received games and votes", games, votes);
    })
  }, [games, query.contest]); //triggered when "games" changes (received data from API)

  if(!games || !votes)
  {
    return (
      <SectionLayout {...shellProps}>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-thick border-secondary/30 border-t-secondary rounded-full animate-spin" />
            <span className="ds-text-muted text-sm">Caricamento voti...</span>
          </div>
        </div>
      </SectionLayout>
    );
  }

  function onVoteUpdate(newVote, index, callback)
  {
    const newVotes = [...votes];
    newVotes[index] = newVote;
    setVotes(newVotes);

    //todo check if the vote is valid
    sendVote(newVote, callback);
  }

  function sendVote(vote, callback)
  {
    GMIApi.getInstance().setVote(query.contest, vote, data=>
    {
      callback(data.success);
      if(!data.success)
        setError(data.error);
    })
  }


  let yourLeaderboard = [];
  let gamePages = [];

  if(error)
  {
    const isLoginError = typeof error === "string" &&
      (error.toLowerCase().includes("not logged") || error.toLowerCase().includes("access denied") || error.toLowerCase().includes("login as judge"));

    if (isLoginError) {
      return (
        <SectionLayout {...shellProps}>
          <LoginRequiredPage
            title="Accesso come giudice richiesto"
            message="Per votare devi aver effettuato l'accesso come giudice con il tuo account Discord."
          />
        </SectionLayout>
      );
    }

    return (
      <SectionLayout {...shellProps}>
        <div className="ds-card max-w-2xl mx-auto p-8 text-center">
          <h2 className="text-xl font-bold ds-text-content mb-2">Errore</h2>
          <p className="ds-text-muted">{error}</p>
        </div>
      </SectionLayout>
    );
  }
  else if(loaded)
  {
    // Calculate stats
    const votedCount = votes.filter(v => v.voted).length;
    const totalGames = games.length;
    const progressPercent = Math.round((votedCount / totalGames) * 100);

    // Sort leaderboard data
    const leaderboardData = votes.map((vote, index) => ({
      game: games[index],
      vote: votes[index],
      originalIndex: index
    })).sort((e1, e2) => parseInt(e2.vote.score) - parseInt(e1.vote.score));

    yourLeaderboard = leaderboardData.map((elem, rank) => {
      const isVoted = elem.vote.voted;
      return (
        <div
          key={elem.game.id}
          className={`p-3 flex items-center gap-3 transition-all ${!isVoted ? 'border-l-4 border-l-error/60' : 'border-l-4 border-l-success/60'}`}
        >
          <div className="font-bold text-lg w-8 text-center ds-text-muted">
            {rank + 1}
          </div>
          <div className="w-12 h-12 overflow-hidden ds-surface flex-shrink-0">
            <img 
              src={elem.game.image_url ? GMIApi.getInstance().imageURL + elem.game.image_url : GMIApi.getInstance().imageURL + "/thumbnail.png"} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold ds-text-content truncate">{elem.game.name}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-bold ${isVoted ? 'text-success' : 'text-error'}`}>
                {elem.vote.score}
              </span>
              {!isVoted && (
                <span className="text-xs px-2 py-0.5 bg-error/10 text-error font-medium">
                  Da votare
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });

    // General / Overview tab
    gamePages.push(
      <div className="p-6 md:p-8 space-y-6">
        {/* Header and stats */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold ds-text-content">I tuoi voti</h2>
            <p className="ds-text-muted text-sm mt-1">Vota i giochi e crea la tua classifica</p>
          </div>

          {/* Progress stats */}
          <div className="px-4 py-2 flex flex-col gap-2 min-w-[160px]">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="ds-text-muted uppercase tracking-wider">Progresso</span>
              <span className="font-semibold ds-text-content">{votedCount}/{totalGames} giochi</span>
            </div>
            <div className="h-1.5 w-full bg-surface border border-default overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs ds-text-muted text-right">{progressPercent}%</span>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="ds-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold ds-text-content">
              La tua classifica
            </h2>
            <span className="text-xs ds-text-muted">{totalGames} giochi totali</span>
          </div>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto ds-scrollbar-modern pr-2">
            {yourLeaderboard}
          </div>
        </div>

        {/* Quick tips */}
        <div className="ds-surface p-4 border border-default">
          <div>
            <h3 className="font-semibold ds-text-content text-sm">Suggerimenti per la valutazione</h3>
            <p className="text-sm ds-text-muted mt-1">
              Clicca su un gioco nelle tab in alto per iniziare a votare. Assegna un punteggio da 0 a 100, 
              aggiungi pro e contro, e lascia un commento dettagliato.
            </p>
          </div>
        </div>
      </div>
    );

    // Game voting pages
    gamePages = gamePages.concat(games.map((game, index) => {
      const vote = votes[index];

      const parsedAuthors = parseAuthors(game.authors);
      const authorLinks = parsedAuthors.map((author) => (
        <Link key={author.id} href={`/competizioni/user/?user=${author.id}`} className="ds-link text-sm">
          {author.name}</Link>
      ));

      let img_url = GMIApi.getInstance().imageURL + "/thumbnail.png";
      if(game.image_url) {
        if(game.image_url.indexOf("http") >= 0)
          img_url = game.image_url;
        else
          img_url = GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString();
      }

      return (
        <div key={game.id} className="p-6 h-full overflow-y-auto ds-scrollbar-modern">
          {/* Game Header Card */}
          <div className="ds-card-glass p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Game Thumbnail */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="ds-surface overflow-hidden aspect-video lg:aspect-square">
                  <img 
                    className="w-full h-full object-cover" 
                    alt={game.name} 
                    src={img_url}
                  />
                </div>
              </div>

              {/* Game Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-bold ds-text-content mb-2">{game.name}</h2>
                    <div className="flex items-center gap-2 text-sm ds-text-muted mb-4">
                      <span>di {authorLinks}</span>
                    </div>
                  </div>
                  
                  {/* Vote Status Badge */}
                  <div className={`ds-chip ${vote.voted ? 'ds-chip-complete' : 'ds-chip-open'}`}>
                    {vote.voted ? "VOTATO" : "DA VOTARE"}
                  </div>
                </div>

                {/* Description */}
                {game.short_description && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold ds-text-content mb-2">
                      Descrizione
                    </h3>
                    <p className="ds-text-muted text-sm leading-relaxed">{game.short_description}</p>
                  </div>
                )}

                {/* Download Link */}
                {game.download_url && (
                  <div className="mt-4 flex items-center gap-2">
                    <a 
                      href={game.download_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ds-link text-sm truncate"
                    >
                      {game.download_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vote Form Section */}
          <div className="ds-card p-6">
            <VoteForm {...vote} onChange={onVoteUpdate} index={index} />
          </div>
        </div>
      );
    }));
  }

  return (
    <SectionLayout {...shellProps}>
    <div className="ds-app-shell">
      <div>
        {/* Tabs Navigation */}
        <div className="ds-header p-2 mb-0 border border-default">
          <div className="flex flex-row flex-wrap gap-1">
            {/* General Tab */}
            <Button
              variant={gameIndex === 0 ? "ghost" : "secondary"}
              onClick={() => setGameIndex(0)}
            >
              <span>Panoramica</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-surface border border-default ds-text-content">
                {games.length}
              </span>
            </Button>

            {/* Divider */}
            <div className="w-px h-8 bg-border mx-1 self-center" />

            {/* Game Tabs */}
            {games.map((game, index) => {
              const vote = votes[index];
              const isActive = gameIndex === index + 1;
              const isVoted = vote?.voted;
              
              return (
                <Button
                  variant={isActive ? "ghost" : "secondary"}
                  key={game.id}
                  onClick={() => setGameIndex(index + 1)}
                  title={game.name}
                >
                  <span className="truncate">{game.name}</span>
                  {!isVoted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="ds-surface-muted min-h-[calc(100vh-200px)]">
          {gamePages[gameIndex]}
        </div>
      </div>
    </div>
    </SectionLayout>
  );
}
