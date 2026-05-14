import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { basePath } from "../next.config";
import GMIApi from "../src/api/GMIApi";
import { ParticipantType } from "../src/Constants";
import { getQuery } from "../src/Utils";
import ContestGamesSection from "./Contest/ContestGamesSection";
import ContestHeroSection from "./Contest/ContestHeroSection";
import ContestJudgesSection from "./Contest/ContestJudgesSection";
import ContestJudgingProgressSection from "./Contest/ContestJudgingProgressSection";
import { Button } from "./commons/Button";
import { BookIcon, UploadIcon, EyeIcon, TrophyIcon, EditIcon } from "./commons/Icons";
import { PageLayout } from "./WebsiteLayout/PageLayout";
import ContestPrizesSection from "./Contest/ContestPrizesSection";

export default function PageContest(props) {
	let router = useRouter();
	let query = getQuery(router);
	let userInfo = useSelector(root => root.auth.userInfo);
	const myUserId = userInfo?.user?.user_id;

	/**@type {[Participant, (obj: Participant)=> any]} */
	let [participant, setParticipant] = useState(false);
	/**@type {[Contest, (obj: Contest)=> any]} */
	let [contest, setContest] = useState();
	let [judges, setJudges] = useState([]);
	let [error, setError] = useState();
	let [timeLeft, setTimeLeft] = useState(null);
	let [judgingProgress, setJudgingProgress] = useState(null);
	let [resultsPublic, setResultsPublic] = useState(null);

	useEffect(() => {
		setParticipant(false);

		//fetch contest
		GMIApi.getInstance().getContest(query.contest, (data) => {
			if (data.success)
				setContest(data.contests[0]);
			else
				setError(data.error || "invalid contest");
		});

		//fetch all participants to find judges and merge with user info for avatars
		GMIApi.getInstance().getParticipants(query.contest, false, (partData) => {
			if (partData.success) {
				const judgeParticipants = partData.participants.filter(p => p.kind == ParticipantType.judge);

				if (myUserId) {
					const me = partData.participants.find(p => p.id == myUserId);
					if (me) setParticipant(me);
				}

				// To get avatars, we fetch all users and match them
				GMIApi.getInstance().getUsers((userData) => {
					if (userData.success) {
						const enrichedJudges = judgeParticipants.map(judge => {
							const user = userData.users.find(u => u.id == judge.id);
							return {
								...judge,
								avatar: user?.avatar || user?.user_avatar || judge.avatar || judge.user_avatar
							};
						});
						setJudges(enrichedJudges);
					} else {
						setJudges(judgeParticipants);
					}
				});
			}
		});
	},
		[query.contest, myUserId]);

	useEffect(() => {
		if (!contest) return;

		const timer = setInterval(() => {
			const targetDate = contest.can_submit ? new Date(contest.end_at) : new Date(contest.completed_at);
			const now = new Date();
			const diff = targetDate.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("Scaduto");
				clearInterval(timer);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft(`${days}g ${hours}h ${minutes}m ${seconds}s`);
		}, 1000);

		return () => clearInterval(timer);
	}, [contest]);

	// Fetch judging progress when contest is in judging phase
	useEffect(() => {
		if (!contest) return;

		const isComplete = Date.now() > new Date(Date.parse(contest.completed_at));
		const canSubmitGames = !!contest.can_submit;
		const isJudging = !isComplete && !canSubmitGames;

		if (!isJudging) return;

		console.log("[PageContest] Fetching judging progress for contest:", query.contest);
		GMIApi.getInstance().getResults(query.contest, (data) => {
			console.log("[PageContest] getResults response:", data);
			if (data.success) {
				setJudgingProgress(data);
			} else {
				console.error("[PageContest] getResults failed:", data.error);
			}
		});
	}, [contest, query.contest]);

	if (query.contest == 0) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<img className="max-w-md w-full animate-pulse" src={basePath + "/img/gmicomp.png"} />
			</div>
		)
	}


	if (error)
		return (
			<PageLayout>
				<div className="bg-error/10 border border-error/20 rounded-xl p-8 text-center">
					<h2 className="text-xl font-bold text-error">Errore</h2>
					<p className="text-content-muted mt-2">{error}</p>
					<Button variant="ghost" onClick={() => router.push("/")} className="mt-4">Torna alla Home</Button>
				</div>
			</PageLayout>
		);

	if (!contest)
		return (
			<PageLayout>
				<div className="w-full flex flex-col gap-8 pb-12 animate-pulse">
					{/* Hero skeleton */}
					<section className="relative rounded-xl overflow-hidden">
						<div className="absolute inset-0  from-primary via-primary-light to-primary" />
						<div className="relative p-6 md:p-10">
							<div className="flex flex-col md:flex-row justify-between gap-6 items-start">
								<div className="flex-1 space-y-4">
									<div className="flex items-center gap-4">
										<div className="h-10 w-10 bg-surface-solid rounded-lg" />
										<div className="h-10 w-64 bg-surface-solid rounded-lg" />
									</div>
									<div className="h-5 w-96 bg-surface-solid rounded" />
								</div>
								<div className="w-full md:w-56 space-y-3">
									<div className="h-3 w-24 bg-surface-solid rounded" />
									<div className="h-8 w-36 bg-surface-solid rounded" />
									<div className="h-3 w-40 bg-surface-solid rounded" />
								</div>
							</div>
						</div>
					</section>

					{/* Games skeleton */}
					<section className="ds-card-section">
						<div className="h-8 w-24 bg-surface-solid rounded mb-4" />
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
							{[1, 2, 3].map(i => (
								<div key={i} className="h-72 bg-surface-solid rounded-xl" />
							))}
						</div>
					</section>

					{/* Judges skeleton */}
					<section className="ds-card-section">
						<div className="h-8 w-20 bg-surface-solid rounded mb-4" />
						<div className="flex gap-6">
							{[1, 2, 3, 4].map(i => (
								<div key={i} className="flex flex-col items-center gap-3">
									<div className="w-24 h-24 bg-surface-solid rounded-full" />
									<div className="h-4 w-20 bg-surface-solid rounded" />
								</div>
							))}
						</div>
					</section>
				</div>
			</PageLayout>
		);

	const complete_date = new Date(Date.parse(contest.completed_at));
	const end_date = new Date(Date.parse(contest.end_at));

	const isComplete = Date.now() > complete_date;
	const canSubmitGames = !!contest.can_submit;
	const isJudging = !isComplete && !canSubmitGames;

	const isJudge = participant && participant?.kind == ParticipantType.judge;
	const isCompetitor = participant && participant?.kind == ParticipantType.competitor;

	const actions = [];
	const canVote = isJudge && !isComplete && !canSubmitGames;

	const canNew = canSubmitGames && !canVote && !isCompetitor && !isJudge;
	const canEdit = canSubmitGames && !canVote && isCompetitor;

	actions.push(
		<Button
			key="regolamento"
			variant="secondary"
			onClick={() => router.push(`/rules?contest=${contest.id}`)}
			className="text-content hover:border-secondary/30"
			icon={<BookIcon size={16} />}
		>
			Regolamento
		</Button>
	);

	if (canVote) {
		actions.push(
			<Button
				key="vota"
				onClick={() => router.push("/editvotes?contest=" + contest.id)}
				variant="primary"
				icon={<TrophyIcon size={20} />}
			>
				Vota
			</Button>
		);
	}
	if (canNew) {
		actions.push(
			<Button
				key="invia"
				onClick={() => router.push("/participation?contest=" + contest.id)}
				variant="primary"
				icon={<UploadIcon size={16} />}
			>
				Partecipa
			</Button>
		);
	}
	if (canEdit) {
		actions.push(
			<Button
				key="modifica"
				onClick={() => router.push("/participation?contest=" + contest.id)}
				variant="primary"
				icon={<EditIcon size={16} />}
			>
				Aggiorna Gioco
			</Button>
		);
	}

	// Host preview button when complete but not published
	const isHost = participant?.kind == ParticipantType.judge && (participant?.host == "1" || participant?.host === true);
	if (isComplete && isHost && resultsPublic === false) {
		actions.push(
			<Button
				key="anteprima"
				onClick={() => router.push("/results?contest=" + contest.id)}
				variant="primary"
				icon={<EyeIcon size={16} />}
			>
				Anteprima Risultati
			</Button>
		);
	}

	return (
		<PageLayout>
			<div className="w-full flex flex-col gap-8 pb-12">
				<ContestHeroSection
					contest={contest}
					actions={actions}
					isComplete={isComplete}
					isJudging={isJudging}
					canSubmitGames={canSubmitGames}
					timeLeft={timeLeft}
				/>

				<ContestGamesSection
					contest={contest.id}
					contestEnded={isComplete}
					onPublicResults={setResultsPublic}
				/>

				<ContestJudgesSection judges={judges} />

				{isJudging && <ContestJudgingProgressSection judgingProgress={judgingProgress} judges={judges} />}

				<ContestPrizesSection contestId={contest.id} />
			</div>
		</PageLayout>
	);
}