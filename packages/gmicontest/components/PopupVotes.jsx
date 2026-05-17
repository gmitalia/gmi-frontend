import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { prosList, consList } from "../src/Constants";
import GMIApi from "../src/api/GMIApi";
import { marked } from "../src/marked"
import { Button } from "./commons/Button";
import { CloseIcon, CheckIcon, InfoIcon, ChatIcon, EllipsisIcon, TrophyIcon } from "./commons/Icons";
import { AwardBadge } from "./Contest/AwardsBadge";

/**
 * VotesModal - The core modal component for displaying game evaluations.
 */
export function VotesModal({ contest, gameId, gameName, authors, resultsPublic, isOpen, onClose }) {
	const [votes, setVotes] = useState(null);
	const [awards, setAwards] = useState([]);
	const [error, setError] = useState(null);
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
							const isOldContest = contest < 19;
							let comment = vote.comment;
							comment = comment.replace(/^[-=_]{3,}$/gm, '<hr class="my-8 border-default" />');
							if (!isOldContest) comment = comment.replaceAll("\n", "⠀⠀\n");

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

	if (!isOpen || !mounted) return null;
	if (error) return createPortal(
		<div className="fixed inset-0 z-[2000] bg-surface-muted backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
			<div className="bg-surface-solid border border-error/30 p-8 ds-rounded-lg text-center max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
				<div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
					<InfoIcon size={32} />
				</div>
				<h3 className="text-content font-bold text-lg mb-2">Errore caricamento</h3>
				<p className="text-content-muted text-sm mb-6">{error}</p>
				<Button variant="ghost" onClick={onClose} className="w-full">Chiudi</Button>
			</div>
		</div>,
		document.body
	);

	if (!votes) return createPortal(
		<div className="fixed inset-0 z-[2000] bg-surface-muted backdrop-blur-md flex items-center justify-center animate-in fade-in">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 rounded-xl border-thick border-secondary/20 border-t-[var(--ds-color-secondary)] animate-spin" />
				<span className="text-secondary font-bold tracking-widest text-xs uppercase">Caricamento Valutazioni...</span>
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
			<div className={`${size} rounded-full  from-surface-elevated to-surface-solid flex items-center justify-center border border-default text-[10px] font-black text-content-muted uppercase ${className}`}>
				{vote.judge_name?.substring(0, 2)}
			</div>
		);
	};

	// Parse authors if they are base64 encoded JSON
	let displayAuthors = authors;
	try {
		if (typeof authors === "string" && authors.length > 0 && (authors.startsWith("W3") || authors.includes("["))) {
			const decoded = atob(authors);
			const authorsArray = JSON.parse(decoded);
			if (Array.isArray(authorsArray)) {
				displayAuthors = authorsArray.map(a => a.name).join(", ");
			}
		}
	} catch (e) {
		displayAuthors = authors;
	}

	return createPortal(
		<div className="fixed inset-0 z-[2000] bg-surface-muted backdrop-blur-md flex items-center justify-center md:p-8 animate-in fade-in duration-300" onClick={onClose}>
			<div className="bg-surface-solid border-x border-default md:border md:border-default w-full max-w-6xl h-full md:h-[90vh] md:rounded-md ds-shadow-lg flex flex-col overflow-y-auto md:overflow-hidden animate-in zoom-in-95 duration-500 custom-scrollbar" onClick={(e) => e.stopPropagation()}>
				
				{/* Header */}
				<div className="sticky top-0 z-[60] p-6 md:p-10 border-b border-default flex items-center justify-between bg-surface-muted backdrop-blur-xl">
					<div className="flex-1 min-w-0">
						<h2 className="text-3xl md:text-4xl font-black text-content tracking-tighter truncate">
							{gameName}
						</h2>
						<div className="flex items-center gap-2 mt-1">
							{displayAuthors && (
								<p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] truncate">di {displayAuthors}</p>
							)}
						</div>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose} className="ml-6 hover:bg-error/20 hover:text-error" icon={<CloseIcon size={24} strokeWidth="2.5" />}/>
				</div>

				<div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
					{/* Sidebar / Tabs */}
					<div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-default bg-surface-muted md:overflow-y-auto p-4 md:p-6 custom-scrollbar">
						<div className="space-y-2">
							<button
								className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center justify-between group ${voteIndex === 0 ? 'bg-secondary/10 border border-secondary/30 text-secondary' : 'hover:bg-content/5 text-content-muted border border-transparent'}`}
								onClick={() => setVoteIndex(0)}
							>
								<span className="font-bold tracking-tight">Panoramica</span>
								<span className={`text-sm font-black px-2 py-0.5 rounded ${voteIndex === 0 ? 'bg-secondary text-on-secondary' : 'bg-surface-solid text-content-muted group-hover:text-content'}`}>{avgScore}</span>
							</button>

							<div className="sticky top-[-1rem] md:top-[-1.5rem] z-10 pt-8 pb-3 text-[10px] font-black text-content-muted uppercase tracking-widest bg-surface-muted backdrop-blur-md -mx-4 md:-mx-6 px-9 md:px-11 mb-2">
								Giuria
							</div>
							
							{votes.map((v, idx) => (
								<button
									key={idx}
									className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group ${voteIndex === idx + 1 ? 'bg-accent/10 border border-accent/30 text-accent shadow-accent' : 'hover:bg-content/5 text-content-muted border border-transparent'}`}
									onClick={() => setVoteIndex(idx + 1)}
								>
									<JudgeAvatar vote={v} />
									<span className="font-bold tracking-tight truncate flex-1">{v.judge_name}</span>
									<span className={`text-sm font-mono px-2 py-0.5 rounded ${voteIndex === idx + 1 ? 'bg-accent text-white' : 'bg-surface-solid text-content-muted group-hover:text-content'}`}>{v.score}</span>
								</button>
							))}
						</div>
					</div>

					{/* Content Area */}
					<div className="flex-1 md:overflow-y-auto p-6 md:p-12 custom-scrollbar bg-content/5">
						{voteIndex === 0 ? (
							<div className="max-w-4xl space-y-12 animate-in slide-in-from-bottom-4 duration-500">
								{/* Top Stats Row */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{resultsPublic === false ? (
										<div className="bg-content/5 border border-default p-10 flex flex-col items-center text-center relative overflow-hidden group" style={{borderRadius: 'var(--ds-radius-xl)'}}>
											<div className="text-sm font-black text-content-muted uppercase tracking-[0.3em] mb-4">Media Totale</div>
											<div className="text-6xl font-black text-content drop-shadow-[0_0_20px_rgba(var(--ds-rgb-content),0.2)] leading-none mb-2">?</div>
											<div className="w-12 h-1.5 bg-secondary rounded-full mt-4" />
										</div>
									) : (
										<div className="bg-content/5 border border-default p-10 flex flex-col items-center text-center relative overflow-hidden group" style={{borderRadius: 'var(--ds-radius-xl)'}}>
											<div className="text-sm font-black text-content-muted uppercase tracking-[0.3em] mb-4">Media Totale</div>
											<div className="text-6xl font-black text-content drop-shadow-[0_0_20px_rgba(var(--ds-rgb-content),0.2)] leading-none mb-2">{avgScore}</div>
											<div className="w-12 h-1.5 bg-secondary rounded-full mt-4" />
										</div>
									)}
									
									<div className="bg-content/5 border border-default p-10 flex flex-col items-center justify-center relative overflow-hidden group" style={{borderRadius: 'var(--ds-radius-xl)'}}>
										<div className="text-sm font-black text-content-muted uppercase tracking-[0.3em] mb-6">Premi & Riconoscimenti</div>
										<div className="flex flex-wrap justify-center gap-4">
											{resultsPublic === false ? (
												<div className="flex flex-col items-center gap-3 opacity-40">
													<EllipsisIcon size={32} className="text-content-muted" />
													<span className="text-xs font-bold uppercase tracking-widest text-content-muted">Risultati in attesa</span>
												</div>
											) : (awards ?? []).length > 0 ? (
												awards.map((award, index) => (
													<AwardBadge key={index} award={award} gameId={gameId} contestId={contest}/>
												))
											) : (
												<div className="flex flex-col items-center gap-3 opacity-40">
													<TrophyIcon size={32} strokeWidth={1.5} className="text-content-muted" />
													<span className="text-xs font-bold uppercase tracking-widest text-content-muted">Nessun premio</span>
												</div>
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
												<div className="h-px flex-1 bg-content/5" />
												<h3 className="text-xs md:text-sm font-black text-content-muted uppercase tracking-[0.2em] md:tracking-[0.4em] text-center px-4">Cosa dicono i giudici</h3>
												<div className="h-px flex-1 bg-content/5" />
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
												{/* Common Pros */}
												{hasPros && (
													<div className="space-y-6">
														<div className="flex items-center gap-3 text-success">
															<div className="p-2 rounded-md bg-success/10 border border-success/20">
																<CheckIcon size={18} />
															</div>
															<span className="text-xs font-black uppercase tracking-widest">Pro</span>
														</div>
														<div className="flex flex-wrap gap-2">
															{(() => {
																const counts = allPros.reduce((acc, p) => { acc[p] = (acc[p] || 0) + 1; return acc; }, {});
																const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
																
																return sorted.map(([pro, count]) => (
																	<div key={pro} className="flex items-center gap-2 px-4 py-2 bg-success/5 border border-success/10 hover:border-success/30 rounded-xl transition-colors group">
																		<span className="text-xs font-bold text-success/80 group-hover:text-success">{prosList[pro]}</span>
																		{count > 1 && <span className="bg-success/20 text-success text-[10px] font-black px-1.5 py-0.5 rounded-lg">{count}</span>}
																	</div>
																));
															})()}
														</div>
													</div>
												)}

												{/* Common Cons */}
												{hasCons && (
													<div className="space-y-6">
														<div className="flex items-center gap-3 text-error">
															<div className="p-2 rounded-md bg-error/10 border border-error/20">
																<CloseIcon size={18} />
															</div>
															<span className="text-xs font-black uppercase tracking-widest">Contro</span>
														</div>
														<div className="flex flex-wrap gap-2">
															{(() => {
																const counts = allCons.reduce((acc, c) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
																const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
																
																return sorted.map(([con, count]) => (
																	<div key={con} className="flex items-center gap-2 px-4 py-2 bg-error/5 border border-error/10 hover:border-error/30 rounded-xl transition-colors group">
																		<span className="text-xs font-bold text-error/80 group-hover:text-error">{consList[con]}</span>
																		{count > 1 && <span className="bg-error/20 text-error text-[10px] font-black px-1.5 py-0.5 rounded-lg">{count}</span>}
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
							<div className="max-w-3xl animate-in slide-in-from-right-4 duration-500">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
									<div className="flex items-center gap-5">
										<div className="relative">
											<div className="absolute -inset-1  from-accent to-accent/80 rounded-[24px] opacity-75 blur-sm" />
											<div className="relative">
												<JudgeAvatar vote={activeVote} size="w-16 h-16" className="rounded-[20px]" />
											</div>
										</div>
										<div>
											<h3 className="text-2xl font-black text-content">{activeVote.judge_name}</h3>
											<p className="text-content-muted text-[10px] font-black uppercase tracking-widest mt-1">Giudizio Individuale</p>
										</div>
									</div>
									<div className="flex flex-col items-center md:items-end">
										<div className="text-[10px] font-black text-content-muted uppercase tracking-widest mb-1">Punteggio</div>
										<div className="text-5xl font-black text-accent drop-shadow-[0_0_15px_rgba(var(--ds-rgb-accent),0.3)]">{activeVote.score}</div>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
									{activeVote.pros.length > 0 && (
										<div className="bg-success/5 border border-success/20 ds-rounded-lg p-6">
											<h4 className="text-[10px] font-black text-success uppercase tracking-widest mb-4 flex items-center gap-2">
												<CheckIcon size={14} strokeWidth="3" />
												Pro
											</h4>
											<div className="flex flex-wrap gap-2">
												{activeVote.pros.map((pro) => (
													<span key={pro} className="px-3 py-1 bg-success/10 border border-success/20 text-success rounded-lg text-xs font-bold">{prosList[pro]}</span>
												))}
											</div>
										</div>
									)}
									{activeVote.cons.length > 0 && (
										<div className="bg-error/5 border border-error/20 ds-rounded-lg p-6">
											<h4 className="text-[10px] font-black text-error uppercase tracking-widest mb-4 flex items-center gap-2">
												<CloseIcon size={14} strokeWidth="3" />
												Contro
											</h4>
											<div className="flex flex-wrap gap-2">
												{activeVote.cons.map((con) => (
													<span key={con} className="px-3 py-1 bg-error/10 border border-error/20 text-error rounded-lg text-xs font-bold">{consList[con]}</span>
												))}
											</div>
										</div>
									)}
								</div>

								<div className="space-y-4">
									<h4 className="text-[10px] font-black text-content-muted uppercase tracking-widest flex items-center gap-2">
										<ChatIcon size={14} />
										Commento del Giudice
									</h4>
									<div className="bg-content/5 border border-default rounded-md p-6 md:p-8 leading-relaxed text-content">
										<div className="content vote-tables prose max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(activeVote.comment, { breaks: true }) }}></div>
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
export default function PopupVotes({ contest, game, gamename, authors }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button variant="ghost" onClick={() => setIsOpen(true)}>
				Votazioni
			</Button>
			<VotesModal 
				contest={contest} 
				gameId={game} 
				gameName={gamename} 
				authors={authors}
				isOpen={isOpen} 
				onClose={() => setIsOpen(false)} 
			/>
		</>
	);
}