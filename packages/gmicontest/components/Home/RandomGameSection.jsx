import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UsersIcon, RefreshIcon, SpinnerIcon } from "../commons/Icons";
import { Button } from "../commons/Button";
import GMIApi from "../../src/api/GMIApi";
import RandomGameThumbnail from "./RandomGameThumbnail";

export default function RandomGameSection({ contests }) {
	const [randomGame, setRandomGame] = useState(null);
	const [randomGameContest, setRandomGameContest] = useState(null);

	const loadRandomGame = async () => {
		const publicContests = contests.filter(c => c.public);
		if (publicContests.length === 0) return;
		setRandomGame(null);

		const randomContest = publicContests[Math.floor(Math.random() * publicContests.length)];

		await new Promise((resolve) => {
			GMIApi.getInstance().getGames(randomContest.id, (data) => {
				if (data?.games?.length > 0) {
					const randomIndex = Math.floor(Math.random() * data.games.length);
					const selected = data.games[randomIndex];
					
					setRandomGame({ 
						...selected, 
						contestId: randomContest.id, 
						contestName: randomContest.name 
					});
					setRandomGameContest({ 
						id: randomContest.id, 
						name: randomContest.name 
					});
				}
				resolve();
			});
		});
	};

	useEffect(() => {
		loadRandomGame();
	}, [contests]);

	return (
		<section className="group relative bg-surface-elevated backdrop-blur-md border-default rounded-xl p-6 overflow-hidden transition-all duration-500 hover:border-secondary/20">
			<div className="flex items-center justify-between gap-4 mb-4">
				<h2 className="text-2xl font-bold text-content">Gioco casuale</h2>
				{randomGame && (
					<span className="text-xs font-bold px-2 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/10 uppercase tracking-wider">
						{randomGameContest?.name}
					</span>
				)}
			</div>

			{randomGame ? (
				<div className="relative grid gap-6 md:grid-cols-[300px_1fr] items-center">
					{/* Game Image */}
					<div className="relative">
						<RandomGameThumbnail game={randomGame} className="rounded-md aspect-video shadow-lg border-default" />
					</div>

					{/* Game Info */}
					<div className="flex flex-col justify-center">
						<h3 className="text-xl font-bold text-content leading-tight mb-2 group-hover:text-secondary transition-colors">
							{randomGame.name}
						</h3>

						<div className="flex items-center gap-2 text-content-muted text-xs mb-3">
							<UsersIcon size={12} strokeWidth="2.5" />
							<span className="font-medium">
								di {(() => {
									try {
										const authors = JSON.parse(atob(randomGame.authors));
										return authors.map((a, i) => (
											<React.Fragment key={a.id}>
												<Link href={`/user?user=${a.id}`}>
													<a className="text-secondary/80 hover:text-secondary hover:underline">
														{a.name}
													</a>
												</Link>
												{i < authors.length - 1 && <span>, </span>}
											</React.Fragment>
										));
									} catch (e) {
										return "Autore sconosciuto";
									}
								})()}
							</span>
						</div>

						{randomGame.short_description && (
							<p className="text-content-muted text-sm line-clamp-2 italic mb-4">
								{`"${randomGame.short_description}"`}
							</p>
						)}
						<div className="flex items-center gap-3">
							<Button variant="primary" size="sm" href={`/contest/?contest=${randomGameContest?.id}#game-${randomGame.id}`}>Dettagli</Button>
							<button
								onClick={loadRandomGame}
								className="flex items-center gap-2 text-content-muted hover:text-content transition-colors text-xs font-bold group/btn"
							>
								<RefreshIcon size={16} />
								<span>Estraine un altro</span>
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center gap-3 py-8 text-content-muted min-h-[170px]">
					<SpinnerIcon size={20} className="animate-spin text-secondary" />
					<span className="text-sm font-medium">Pescando...</span>
				</div>
			)}
		</section>
	);
}
