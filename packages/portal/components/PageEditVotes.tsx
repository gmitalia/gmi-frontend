import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { getQuery, parseAuthors } from "../src/Utils"
import VoteForm from "./Forms/VoteForm";
import GMIApi from "../src/api/GMIApi";

import LoginRequiredPage from "./commons/LoginRequiredPage";
import Link from "next/link";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import { DownloadIcon, GridIcon } from "./commons/Icons";
import { Button } from "./commons/Button";
import { competitionsPath } from "../src/paths";
import { ContestStatusBadge } from "./Contest/ContestStatusBadge";
import { formatContestDateRange, getContestStatus } from "../src/contestStatus";

function gameImageUrl(game): string
{
  if(!game?.image_url)
    return GMIApi.getInstance().imageURL + "/thumbnail.png";

  if(game.image_url.indexOf("http") >= 0)
    return game.image_url;

  return GMIApi.getInstance().imageURL + game.image_url;
}

function hasVoteData(vote): boolean
{
  return !!vote?.saved ||
    vote?.score !== null && vote?.score !== undefined ||
    !!vote?.comment?.trim() ||
    (Array.isArray(vote?.pros) && vote.pros.length > 0) ||
    (Array.isArray(vote?.cons) && vote.cons.length > 0);
}

function getVoteLabel(vote, dirty: boolean): string
{
  if(vote?.confirmed)
    return dirty ? "Da riconfermare" : "Confermato";

  return dirty || hasVoteData(vote) ? "Bozza" : "Da votare";
}

type ContestInfoSectionProps = {
  contest: Contest | null;
  totalGames: number;
  confirmedCount?: number;
  draftCount?: number;
  showProgress?: boolean;
};

function ContestInfoSection({
  contest,
  totalGames,
  confirmedCount = 0,
  draftCount = 0,
  showProgress = false,
}: ContestInfoSectionProps)
{
  if(!contest)
    return null;

  const contestStatus = getContestStatus(contest);
  const contestDateRange = formatContestDateRange(contest);

  return (
    <section
      aria-label="Informazioni competizione"
      className="mb-6 flex flex-col gap-4 border border-default bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {contest.thumbnail_url && (
          <img
            src={contest.thumbnail_url}
            alt=""
            loading="lazy"
            className="hidden h-14 w-20 shrink-0 border border-default object-cover sm:block"
          />
        )}

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
            Competizione
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h2 className="text-lg font-bold leading-tight text-content sm:text-xl">
              {contest.name}
            </h2>
            <ContestStatusBadge variant={contestStatus} />
          </div>
          <p className="mt-1 text-xs text-content-muted">
            <span className="font-mono text-content">{contestDateRange}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6 border-t border-default pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
            Giochi
          </p>
          <p className="mt-1 font-mono text-xl font-bold tabular-nums text-content">
            {totalGames}
          </p>
        </div>
        {showProgress && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
              Confermati
            </p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-content">
              {confirmedCount}/{totalGames}
            </p>
            {draftCount > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-warm">
                {draftCount} {draftCount === 1 ? "bozza" : "bozze"}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function VoteStatus({ vote, dirty = false }: { vote: any; dirty?: boolean })
{
  const isConfirmed = !!vote?.confirmed;
  const label = getVoteLabel(vote, dirty);
  const accent = isConfirmed
    ? dirty ? "border-l-warning" : "border-l-success"
    : hasVoteData(vote) ? "border-l-warning" : "border-l-gray-300";
  const textColor = dirty ? "text-accent-warm" : "text-gray-800";

  return (
    <span
      className={`inline-flex shrink-0 items-center border border-l-[3px] border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] ${accent} ${textColor}`}
    >
      {label}
    </span>
  );
}

//@todo don't load if not judge
export default function PageEditVotes(props)
{
  let router = useRouter()
  let query = getQuery(router)

  let [loaded, setLoaded] = useState(false)
  /**@type {[Game[], (data: Game[])=> any]} */
  let [games, setGames] = useState<any[]>([])
  /**@type {[Vote[], (data: Vote[])=> any]} */
  let [votes, setVotes] = useState<any[]>([])
  let [contest, setContest] = useState<Contest | null>(null)
  let [gameIndex, setGameIndex] = useState(0)
  let [error, setError] = useState<string>()
  let [dirtyVotes, setDirtyVotes] = useState<Record<number, boolean>>({})

  useEffect(()=>
  {
    if(!router.isReady) return;
    if(!query.contest) return;

    let cancelled = false;
    GMIApi.getInstance().getContest(query.contest, data=>
    {
      if(!cancelled && data.success)
        setContest(data.contests?.[0] || null);
    });

    return () => { cancelled = true; };
  }, [router.isReady, query.contest])

  useEffect(()=>
  {
    if(!router.isReady) return; // Aspetta che router sia pronto
    if(!query.contest) return;
    GMIApi.getInstance().getGames(query.contest, data=> setGames(data.games || []))
  }, [router.isReady, query.contest])


  useEffect(()=>
  {
    if(!games?.length)
      return;

    setLoaded(false);
    setDirtyVotes({});

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
        const voteIdx = data.votes.findIndex(game => String(game.game_id) === String(gameId));
        if(voteIdx >= 0)
        {
          let vote = data.votes[voteIdx];
          //parse arrays
          try { vote.pros = JSON.parse(vote.pros); } catch { vote.pros = []; }
          try { vote.cons = JSON.parse(vote.cons); } catch { vote.cons = []; }
          if(!Array.isArray(vote.pros)) vote.pros = [];
          if(!Array.isArray(vote.cons)) vote.cons = [];

          const parsedScore = vote.score === null || vote.score === undefined || vote.score === ""
            ? null
            : Number(vote.score);

          votes[index] = {
            ...vote,
            score: Number.isFinite(parsedScore as number) ? parsedScore : null,
            comment: vote.comment || "",
            confirmed: !!vote.confirmed,
            saved: true,
          };
        }
        else
        {
          votes[index] = 
          {
            game_id:   games[index].id,
            score:     null,
            comment:   "",
            pros:     [],
            cons:     [],
            confirmed: false,
            saved:     false,
          };
        }
      }

      setVotes(votes)
      setLoaded(true)
    })
  }, [games, query.contest]); //triggered when "games" changes (received data from API)

  const contestHref = contest
    ? `${competitionsPath("/contest/")}?contest=${contest.id}`
    : null;

  const breadcrumbs = [
    homeBreadcrumb,
    competitionsBreadcrumb,
    ...(contest && contestHref
      ? [{ label: contest.name, href: contestHref }]
      : []),
    { label: "Area giudizi" },
  ];

  const shellProps = {
    title: "Area giudizi",
    description: "Valuta i giochi della competizione e registra i tuoi voti.",
    breadcrumbs,
  };

  if(error)
  {
    const isLoginError = typeof error === "string" &&
      (error.toLowerCase().includes("not logged") || error.toLowerCase().includes("access denied") || error.toLowerCase().includes("login as judge"));

    if (isLoginError) {
      return (
        <SectionLayout {...shellProps}>
          <ContestInfoSection contest={contest} totalGames={games.length} />
          <LoginRequiredPage
            title="Accesso come giudice richiesto"
            message="Per votare devi aver effettuato l'accesso come giudice con il tuo account Discord."
          />
        </SectionLayout>
      );
    }

    return (
      <SectionLayout {...shellProps}>
        <ContestInfoSection contest={contest} totalGames={games.length} />
        <div className="mx-auto max-w-2xl border border-error/20 bg-error/10 p-6 text-center text-error">
          <h2 className="text-lg font-bold">Impossibile caricare i voti</h2>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </SectionLayout>
    );
  }

  if(!loaded)
  {
    return (
      <SectionLayout {...shellProps}>
        <ContestInfoSection contest={contest} totalGames={games.length} />
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 border border-default bg-surface">
          <div className="h-8 w-8 animate-spin rounded-full border-thick border-secondary/30 border-t-secondary" />
          <span className="text-sm text-content-muted">Caricamento voti...</span>
        </div>
      </SectionLayout>
    );
  }

  function onVoteUpdate(newVote, index, callback)
  {
    GMIApi.getInstance().setVote(query.contest, newVote, data=>
    {
      callback(data);

      if(!data.success)
        return;

      const confirmed = typeof data.confirmed === "boolean"
        ? data.confirmed
        : !!newVote.confirmed;

      const newVotes = [...votes];
      newVotes[index] = {
        ...newVote,
        score: newVote.score ?? null,
        confirmed: confirmed,
        saved: true,
      };
      setVotes(newVotes);
    })
  }

  function setVoteDirty(index: number, dirty: boolean)
  {
    setDirtyVotes(current => current[index] === dirty
      ? current
      : { ...current, [index]: dirty });
  }

  function selectGame(index: number)
  {
    if(gameIndex > 0 && index !== gameIndex)
      setVoteDirty(gameIndex - 1, false);

    setGameIndex(index);
    if(typeof window !== "undefined" && window.scrollY > 0)
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Calculate stats
  const confirmedCount = votes.filter(v => v.confirmed).length;
  const draftCount = votes.filter(v => v.saved && !v.confirmed).length;
  const reconfirmCount = votes.filter((v, index) => v.confirmed && dirtyVotes[index]).length;
  const totalGames = games.length;
  const progressPercent = totalGames ? Math.round((confirmedCount / totalGames) * 100) : 0;
  const averageScore = confirmedCount
    ? Math.round(votes.filter(v => v.confirmed).reduce((sum, vote) => sum + Number(vote.score ?? 0), 0) / confirmedCount)
    : 0;
  const scoreOf = (vote) => vote?.score === null || vote?.score === undefined
    ? -1
    : Number(vote.score);

  // Sort leaderboard data
  const leaderboardData = votes.map((vote, index) => ({
    game: games[index],
    vote: votes[index],
    originalIndex: index
  })).sort((e1, e2) => scoreOf(e2.vote) - scoreOf(e1.vote));

  const selectedGame = gameIndex > 0 ? games[gameIndex - 1] : null;
  const selectedVote = gameIndex > 0 ? votes[gameIndex - 1] : null;
  const extendedDescription = selectedGame?.description?.trim();
  const hasExtendedDescription = !!extendedDescription;

  return (
    <SectionLayout {...shellProps}>
      <ContestInfoSection
        contest={contest}
        totalGames={totalGames}
        confirmedCount={confirmedCount}
        draftCount={draftCount}
        showProgress
      />

      <div className="grid items-start gap-6 pb-12 lg:grid-cols-[17rem_minmax(0,1fr)]">

        {/* Mobile navigation */}
        <div className="min-w-0 lg:hidden">
          <label
            htmlFor="contest-game-select"
            className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted"
          >
            Vai al gioco
          </label>
          <select
            id="contest-game-select"
            value={gameIndex}
            onChange={(event) => selectGame(Number(event.target.value))}
            aria-describedby="contest-game-select-hint"
            className="ds-select mt-2 w-full !text-base sm:!text-sm"
          >
            <option value={0}>
              Panoramica · {confirmedCount}/{totalGames} confermati
            </option>
            {games.map((game, index) => {
              const vote = votes[index];
              const dirty = !!dirtyVotes[index];
              const label = getVoteLabel(vote, dirty);
              const hasScore = vote?.score !== null && vote?.score !== undefined;

              return (
                <option key={game.id} value={index + 1}>
                  {game.name} · {label}
                  {hasScore ? ` · ${vote.score}/100` : ""}
                </option>
              );
            })}
          </select>
          <p id="contest-game-select-hint" className="mt-2 text-[11px] leading-relaxed text-content-muted">
            Scegli un gioco per votarlo o controllare lo stato del tuo voto.
          </p>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 border border-default bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                Giochi
              </span>
              <span className="font-mono text-xs tabular-nums text-content-muted">
                {confirmedCount}/{totalGames}
              </span>
            </div>

            <nav
              aria-label="Giochi della competizione"
              className="max-h-[calc(100vh-13rem)] overflow-y-auto ds-scrollbar-modern"
            >
              <button
                type="button"
                onClick={() => selectGame(0)}
                aria-current={gameIndex === 0 ? "true" : undefined}
                className={`flex w-full items-center gap-2.5 border-l-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  gameIndex === 0
                    ? "border-l-secondary bg-surface-muted font-semibold text-content"
                    : "border-l-transparent text-content-muted hover:bg-content/5 hover:text-content"
                }`}
              >
                <GridIcon size={14} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">Panoramica</span>
                <span className="font-mono text-xs tabular-nums">{totalGames}</span>
              </button>

              {games.map((game, index) => {
                const isActive = gameIndex === index + 1;
                const vote = votes[index];
                const dirty = !!dirtyVotes[index];
                const confirmed = !!vote?.confirmed;
                const label = getVoteLabel(vote, dirty);
                const dotColor = confirmed
                  ? dirty ? "bg-accent" : "bg-success"
                  : dirty || hasVoteData(vote) ? "bg-accent" : "bg-gray-300";

                return (
                  <button
                    type="button"
                    key={game.id}
                    onClick={() => selectGame(index + 1)}
                    aria-current={isActive ? "true" : undefined}
                    title={`${game.name} · ${label}`}
                    className={`flex w-full items-center gap-2.5 border-l-2 px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "border-l-secondary bg-surface-muted text-content"
                        : "border-l-transparent text-content-muted hover:bg-content/5 hover:text-content"
                    }`}
                  >
                    <img
                      src={gameImageUrl(game)}
                      alt=""
                      loading="lazy"
                      className="h-8 w-11 shrink-0 border border-default object-cover"
                    />
                    <span className={`min-w-0 flex-1 truncate text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {game.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
                        aria-label={label}
                      />
                      <span
                        className={`w-6 text-right font-mono text-xs tabular-nums ${
                          dirty || (!confirmed && vote?.score !== null)
                            ? "font-semibold text-accent-warm"
                            : ""
                        }`}
                      >
                        {vote?.score !== null && vote?.score !== undefined ? vote.score : "—"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-default px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                <span>Confermati</span>
                <span className="font-mono tabular-nums">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-1 w-full bg-surface-muted">
                <div
                  className="h-full bg-success transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          {!selectedGame || !selectedVote ? (
            <section className="border border-default bg-surface">
              <div className="flex flex-col gap-4 border-b border-default p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                    Panoramica
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-content">La tua classifica</h2>
                  <p className="mt-1 text-sm text-content-muted">
                    {confirmedCount === totalGames
                      ? "Hai confermato tutte le valutazioni."
                      : `Ti mancano ${totalGames - confirmedCount} valutazioni da confermare.`}
                  </p>
                  {draftCount > 0 && (
                    <p className="mt-1 text-xs font-medium text-accent-warm">
                      {draftCount} {draftCount === 1 ? "bozza" : "bozze"} da confermare.
                    </p>
                  )}
                  {reconfirmCount > 0 && (
                    <p className="mt-1 text-xs font-medium text-accent-warm">
                      {reconfirmCount} {reconfirmCount === 1 ? "voto modificato" : "voti modificati"} da riconfermare.
                    </p>
                  )}
                </div>

                <div className="w-full shrink-0 sm:w-56">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                      Progresso
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-content">
                      {confirmedCount}/{totalGames}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-surface-muted">
                    <div
                      className="h-full bg-success transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-content-muted">
                    <span>{progressPercent}% confermato</span>
                    {confirmedCount > 0 && <span>Media {averageScore}</span>}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-default text-[10px] uppercase tracking-widest text-content-muted">
                      <th className="w-12 py-2 pl-4 pr-2 text-left font-semibold sm:w-16">Pos</th>
                      <th className="py-2 pr-2 text-left font-semibold">Gioco</th>
                      <th className="w-16 py-2 pr-4 text-right font-semibold sm:w-20">Voto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((elem, rank) => {
                      const dirty = !!dirtyVotes[elem.originalIndex];
                      const confirmed = !!elem.vote.confirmed;
                      const label = getVoteLabel(elem.vote, dirty);
                      const hasScore = elem.vote.score !== null && elem.vote.score !== undefined;

                      return (
                        <tr
                          key={elem.game.id}
                          onClick={() => selectGame(elem.originalIndex + 1)}
                          className="group cursor-pointer border-b border-default transition-colors last:border-0 hover:bg-content/5"
                        >
                          <td className="py-2 pl-4 pr-2">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center text-xs font-bold ${
                                rank === 0
                                  ? "ds-trophy-gold"
                                  : rank === 1
                                    ? "ds-trophy-silver"
                                    : rank === 2
                                      ? "ds-trophy-bronze"
                                      : "text-content-muted"
                              }`}
                            >
                              {rank + 1}
                            </span>
                          </td>
                          <td className="py-2 pr-2">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <img
                                src={gameImageUrl(elem.game)}
                                alt=""
                                loading="lazy"
                                className="h-9 w-14 shrink-0 border border-default object-cover"
                              />
                              <span className="min-w-0">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    selectGame(elem.originalIndex + 1);
                                  }}
                                  className="block max-w-full truncate text-left text-sm font-semibold text-content transition-colors group-hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                  {elem.game.name}
                                </button>
                                <span className={`mt-0.5 block text-[10px] uppercase tracking-widest ${
                                  confirmed && !dirty
                                    ? "text-success"
                                    : hasVoteData(elem.vote) || dirty
                                      ? "text-accent-warm"
                                      : "text-content-muted"
                                }`}>
                                  {label}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="py-2 pr-4 text-right">
                            <span
                              className={`font-mono text-lg font-bold tabular-nums ${
                                hasScore
                                  ? confirmed && !dirty
                                    ? "text-content"
                                    : "text-accent-warm"
                                  : "text-content-muted"
                              }`}
                            >
                              {hasScore ? elem.vote.score : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-default px-4 py-3 text-[11px] text-content-muted sm:px-5">
                Seleziona un gioco per assegnare il punteggio, aggiungere pro e contro e lasciare un commento.
              </div>
            </section>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Game header */}
              <section className="border border-default bg-surface p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="h-16 w-24 shrink-0 overflow-hidden border border-default bg-surface-muted sm:h-28 sm:w-44">
                    <img
                      src={gameImageUrl(selectedGame)}
                      alt={selectedGame.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold leading-tight text-content sm:text-2xl">
                          {selectedGame.name}
                        </h2>
                        <p className="mt-1 text-xs text-content-muted sm:text-sm">
                          di{" "}
                          {parseAuthors(selectedGame.authors).map((author, index, authors) => (
                            <React.Fragment key={author.id}>
                              <Link
                                href={`/competizioni/user/?user=${author.id}`}
                                className="ds-link"
                              >
                                {author.name}
                              </Link>
                              {index < authors.length - 1 && (
                                <span>{index === authors.length - 2 ? " e " : ", "}</span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>

                      <VoteStatus
                        vote={selectedVote}
                        dirty={!!dirtyVotes[gameIndex - 1]}
                      />
                    </div>

                    {selectedGame.short_description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-content-muted sm:line-clamp-3">
                        {selectedGame.short_description}
                      </p>
                    )}
                  </div>
                </div>

                {hasExtendedDescription && (
                  <div className="mt-4 border-t border-default pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
                      Descrizione estesa
                    </p>
                    <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-content">
                      {extendedDescription}
                    </p>
                  </div>
                )}

                {selectedGame.download_url && (
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      href={selectedGame.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Scarica ${selectedGame.name}`}
                      icon={<DownloadIcon size={14} />}
                    >
                      Scarica
                    </Button>
                  </div>
                )}
              </section>

              {/* Vote form */}
              <section className="border border-default bg-surface p-4 sm:p-5">
                <VoteForm
                  key={selectedGame.id}
                  {...selectedVote}
                  onChange={onVoteUpdate}
                  onDirtyChange={setVoteDirty}
                  index={gameIndex - 1}
                />
              </section>
            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
