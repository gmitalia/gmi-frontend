import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { prosList, consList } from "../src/Constants";
import GMIApi from "../src/api/GMIApi";
import { renderMarkdown } from "../src/markdown"
import { parseAuthors } from "../src/Utils"
import { Button } from "./commons/Button";
import { AwardBadge } from "./Contest/AwardsBadge";

/**
 * VotesModal - The core modal component for displaying game evaluations.
 */
export function VotesModal({ contest, gameId, gameName, authors, resultsPublic, isOpen, onClose }: any) {
  const [votes, setVotes] = useState<any[] | null>(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [voteIndex, setVoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isOpen) {
      setVotes(null);
      setVoteIndex(0);
      return;
    }

    GMIApi.getInstance().getVotes(contest, gameId, data => {
      if (data.success) {
        // Salva awards dalla risposta API
        const gameAwards = data.awards?.[gameId] || [];
        setAwards(gameAwards);

        // Fetch all users to enrich judges with avatars (matching logic from PageContest)
        GMIApi.getInstance().getUsers(userData => {
          const processedVotes = data.votes.map(vote => {
            try {
              let comment = vote.comment;
              comment = comment.replace(/^[-=_]{3,}$/gm, '<hr class="my-8 border-default" />');

              // Enrich with avatar from global user list if possible
              let finalAvatar = vote.judge_avatar || vote.avatar;
              if (userData.success) {
                const user = userData.users.find(u => u.name === vote.judge_name || u.user_name === vote.judge_name);
                if (user) {
                  finalAvatar = user.avatar || user.user_avatar || finalAvatar;
                }
              }

              return {
                ...vote,
                comment: comment,
                avatar: finalAvatar,
                pros: JSON.parse(vote.pros) || [],
                cons: JSON.parse(vote.cons) || []
              };
            } catch (e) {
              return { ...vote, pros: [], cons: [] };
            }
          });
          setVotes(processedVotes);
        });
      } else {
        setError(data.error);
      }
    });
  }, [isOpen, contest, gameId]);

  useEffect(() => {
    const handleKeyDown = (ev) => {
      if (isOpen && ev.code === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = originalOverflow; };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;
  if (error) return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border border-error/30 p-8 text-center max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-content font-bold text-lg mb-2">Errore caricamento</h3>
        <p className="text-content-muted text-sm mb-6">{error}</p>
        <Button variant="ghost" onClick={onClose} className="w-full">Chiudi</Button>
      </div>
    </div>,
    document.body
  );

  if (!votes) return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-secondary rounded-full animate-spin" />
        <span className="text-gray-300 font-medium tracking-wider text-xs uppercase">Caricamento Valutazioni...</span>
      </div>
    </div>,
    document.body
  );

  const activeVote = voteIndex === 0 ? null : votes[voteIndex - 1];
  const avgScore = votes.length > 0 ? (votes.reduce((a, b) => a + parseFloat(b.score), 0) / votes.length).toFixed(1) : "-";

  // Component to handle avatar loading and fallback
  const JudgeAvatar = ({ vote, size = "w-8 h-8", className = "" }) => {
    const [imgError, setImgError] = useState(false);
    const avatarUrl = vote.judge_avatar || vote.avatar;

    if (avatarUrl && !imgError) {
      return (
        <img 
          src={avatarUrl} 
          className={`${size} rounded-full object-cover border border-default ${className}`} 
          alt={vote.judge_name} 
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div className={`${size} rounded-full bg-surface flex items-center justify-center border border-default text-[10px] font-semibold text-content-muted uppercase ${className}`}>
        {vote.judge_name?.substring(0, 2)}
      </div>
    );
  };

  const displayAuthors = (() => {
    const parsed = parseAuthors(authors);
    return parsed.length > 0 ? parsed.map(a => a.name).join(", ") : authors;
  })();

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center md:p-8" onClick={onClose}>
      <div className="bg-surface border border-default w-full max-w-6xl h-full md:h-[90vh] flex flex-col overflow-y-auto md:overflow-hidden custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 z-[60] p-6 md:p-10 border-b border-default flex items-center justify-between bg-surface">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl md:text-4xl font-bold text-content tracking-tight break-words">
              {gameName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {displayAuthors && (
                <p className="text-content-muted text-xs uppercase tracking-wider break-words">di {displayAuthors}</p>
              )}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} className="ml-6">Chiudi</Button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-default bg-surface md:overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="space-y-2">
              <button
                className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${voteIndex === 0 ? 'bg-content/5 border-l-2 border-secondary text-content' : 'hover:bg-content/5 text-content-muted border border-transparent'}`}
                onClick={() => setVoteIndex(0)}
              >
                <span className="font-semibold tracking-tight">Panoramica</span>
                <span className={`text-sm font-semibold px-2 py-0.5 ${voteIndex === 0 ? 'bg-secondary text-on-secondary' : 'bg-surface border border-default text-content-muted'}`}>{avgScore}</span>
              </button>

              <div className="pt-8 pb-3 text-[10px] font-semibold text-content-muted uppercase tracking-wider">
                Giuria
              </div>
              
              {votes.map((v, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${voteIndex === idx + 1 ? 'bg-content/5 border-l-2 border-secondary text-content' : 'hover:bg-content/5 text-content-muted border border-transparent'}`}
                  onClick={() => setVoteIndex(idx + 1)}
                >
                  <JudgeAvatar vote={v} />
                  <span className="font-semibold tracking-tight truncate flex-1">{v.judge_name}</span>
                  <span className={`text-sm font-mono px-2 py-0.5 ${voteIndex === idx + 1 ? 'bg-secondary text-on-secondary' : 'bg-surface border border-default text-content-muted'}`}>{v.score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 md:overflow-y-auto p-6 md:p-12 custom-scrollbar bg-surface">
            {voteIndex === 0 ? (
              <div className="max-w-4xl space-y-12">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {resultsPublic === false ? (
                    <div className="border border-default p-10 flex flex-col items-center text-center">
                      <div className="text-sm font-semibold text-content-muted uppercase tracking-wider mb-4">Media Totale</div>
                      <div className="text-6xl font-bold text-content leading-none mb-2">?</div>
                    </div>
                  ) : (
                    <div className="border border-default p-10 flex flex-col items-center text-center">
                      <div className="text-sm font-semibold text-content-muted uppercase tracking-wider mb-4">Media Totale</div>
                      <div className="text-6xl font-bold text-content leading-none mb-2">{avgScore}</div>
                    </div>
                  )}
                  
                  <div className="border border-default p-10 flex flex-col items-center justify-center">
                    <div className="text-sm font-semibold text-content-muted uppercase tracking-wider mb-6">Premi & Riconoscimenti</div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {resultsPublic === false ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">Risultati in attesa</span>
                      ) : (awards ?? []).length > 0 ? (
                        awards.map((award, index) => (
                          <AwardBadge key={index} award={award} contestId={contest}/>
                        ))
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">Nessun premio</span>
                      )}
                    </div>
                  </div>
                </div>

                {(() => {
                  // Calcola se ci sono pro o cons
                  const allPros = votes.flatMap(v => v.pros);
                  const allCons = votes.flatMap(v => v.cons);
                  const hasPros = allPros.length > 0;
                  const hasCons = allCons.length > 0;

                  // Se entrambi sono vuoti, non mostrare nulla
                  if (!hasPros && !hasCons) return null;

                  return (
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-default" />
                        <h3 className="text-xs md:text-sm font-semibold text-content-muted uppercase tracking-wider text-center px-4">Cosa dicono i giudici</h3>
                        <div className="h-px flex-1 bg-default" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Common Pros */}
                        {hasPros && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="inline-flex h-5 w-5 items-center justify-center border border-content bg-content text-xs font-semibold leading-none text-on-secondary"
                              >
                                +
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wider text-content">Pro</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const counts = allPros.reduce((acc: Record<string, number>, p: string) => { acc[p] = (acc[p] || 0) + 1; return acc; }, {});
                                const sorted = (Object.entries(counts) as [string, number][]).sort((a, b) => b[1] - a[1]);
                                
                                return sorted.map(([pro, count]) => (
                                  <div key={pro} className="flex items-center gap-2 border border-default bg-surface px-3 py-1.5">
                                    <span className="text-xs font-medium text-content">{prosList[pro]}</span>
                                    {count > 1 && (
                                      <span className="border-l border-default pl-2 text-[10px] font-semibold leading-none tabular-nums text-content-muted">&times;{count}</span>
                                    )}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Common Cons */}
                        {hasCons && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="inline-flex h-5 w-5 items-center justify-center border border-default bg-surface-muted text-xs font-semibold leading-none text-content-muted"
                              >
                                &minus;
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wider text-content">Contro</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const counts = allCons.reduce((acc: Record<string, number>, c: string) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
                                const sorted = (Object.entries(counts) as [string, number][]).sort((a, b) => b[1] - a[1]);
                                
                                return sorted.map(([con, count]) => (
                                  <div key={con} className="flex items-center gap-2 border border-default bg-surface px-3 py-1.5">
                                    <span className="text-xs font-medium text-content">{consList[con]}</span>
                                    {count > 1 && (
                                      <span className="border-l border-default pl-2 text-[10px] font-semibold leading-none tabular-nums text-content-muted">&times;{count}</span>
                                    )}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="max-w-3xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-5">
                    <JudgeAvatar vote={activeVote} size="w-16 h-16" />
                    <div>
                      <h3 className="text-2xl font-bold text-content">{activeVote.judge_name}</h3>
                      <p className="text-content-muted text-[10px] font-semibold uppercase tracking-wider mt-1">Giudice</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <div className="text-[10px] font-semibold text-content-muted uppercase tracking-wider mb-1">Punteggio</div>
                    <div className="text-5xl font-bold text-content">{activeVote.score}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {activeVote.pros.length > 0 && (
                    <div className="border border-default p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-content">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-4 w-4 items-center justify-center border border-content bg-content text-[10px] font-semibold leading-none text-on-secondary"
                        >
                          +
                        </span>
                        Pro
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeVote.pros.map((pro) => (
                          <span key={pro} className="border border-default bg-surface px-3 py-1 text-xs font-medium text-content">{prosList[pro]}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeVote.cons.length > 0 && (
                    <div className="border border-default p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-content">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-4 w-4 items-center justify-center border border-default bg-surface-muted text-[10px] font-semibold leading-none text-content-muted"
                        >
                          &minus;
                        </span>
                        Contro
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeVote.cons.map((con) => (
                          <span key={con} className="border border-default bg-surface px-3 py-1 text-xs font-medium text-content">{consList[con]}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">
                    Commento del Giudice
                  </h4>
                  <div className="border border-default p-6 md:p-8 leading-relaxed text-content">
                    <div className="content vote-tables prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeVote.comment) }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * PopupVotes - Standard button-based wrapper for VotesModal.
 */
export default function PopupVotes({ contest, game, gamename, authors, className = "" }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        title={`Votazioni di ${gamename}`}
        className={className}
      >
        Votazioni
      </Button>
      <VotesModal 
        contest={contest} 
        gameId={game} 
        gameName={gamename} 
        authors={authors}
        resultsPublic={true}
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}