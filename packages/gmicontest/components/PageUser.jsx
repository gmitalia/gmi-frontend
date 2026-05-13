import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import { Button } from "./commons/Button";
import { ChevronLeftIcon, UsersIcon, StarIcon, EditIcon, CloseIcon, CheckIcon } from "./commons/Icons";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./WebsiteLayout/PageLayout";
import { basePath } from "../next.config";
import UserInventory from "./User/UserInventory";
import UserStats from "./User/UserStats";
import UserGames from "./User/UserGames";
import moment from "moment";
import UserVotes from "./User/UserVotes";

export default function PageUser(props) {
	let router = useRouter();
	let query = getQuery(router);

	let userInfo = useSelector(root => root.auth.userInfo);

	/**@type {[UserInfo, (obj: UserInfo)=> any]} */
	let [user, setUser] = useState();
	let [error, setError] = useState();
	let [isHistorical, setIsHistorical] = useState(false);
	let [contests, setContests] = useState([]);

	let [editName, setEditName] = useState(false);
	let [name, setName] = useState("");

	const isOwnProfile = userInfo?.user?.user_id == user?.user_id;

	const handleSaveName = () => {
		if (name.trim() === "") return;
		if (name !== user.user_name) {
			GMIApi.getInstance().setUserValues(user.user_id, name, data => {
				if (data.success) {
					setUser({ ...user, user_name: name });
					setEditName(false);
				}
			});
		} else {
			setEditName(false);
		}
	}

	const handleCancelEdit = () => {
		setName(user.user_name);
		setEditName(false);
	}

	useEffect(() => {
		// 1. Fetch User Info
		GMIApi.getInstance().getUserInfo(query.user, (data) => {
			if (data.success) {
				let rawUser = data.users[0];
				let user = { ...rawUser };
				if (rawUser.games) {
					user.games = JSON.parse(rawUser.games).filter(o => o.contest_id != null)
				}
				if (rawUser.votes)
					user.votes = JSON.parse(rawUser.votes)
				setUser(user);
				setName(user.user_name);

				// 2. Fetch All Contests (Centralized)
				GMIApi.getInstance().getContests(contestData => {
					if (contestData.success && contestData.contests) {
						setContests(contestData.contests);

						// Seniority check using the centralized contests
						const contestDates = {};
						contestData.contests.forEach(c => {
							contestDates[c.id] = c.completed_at;
						});

						const hasOldGame = (user.games || []).some(game => {
							const date = contestDates[game.contest_id];
							return date && moment().diff(moment(date), 'years') >= 10;
						});

						const hasOldJudgeVote = (user.votes || []).some(vote => {
							const contestId = vote.contest_id;
							if (!contestId) return false;
							const date = contestDates[contestId];
							return date && moment().diff(moment(date), 'years') >= 10;
						});

						if (hasOldGame || hasOldJudgeVote) {
							setIsHistorical(true);
						} else {
							// Fallback: check medals if no old games found
							GMIApi.getInstance().getUserMedals(user.user_id, medalData => {
								if (medalData.success && medalData.medals) {
									const allMedals = [
										...(medalData.medals.gold_trophy || []),
										...(medalData.medals.silver_trophy || []),
										...(medalData.medals.bronze_trophy || [])
									];
									const hasOldMedal = allMedals.some(medal => {
										if (!medal.completed_at) return false;
										return moment().diff(moment(medal.completed_at), 'years') >= 10;
									});
									if (hasOldMedal) setIsHistorical(true);
								}
							});
						}
					}
				});
			} else {
				setError(data.error || "Utente non trovato");
			}
		});
	}, [query.user]);

	if (error) {
		return (
			<PageLayout>
				<div className="bg-error/10 border border-error/20 rounded-xl p-8 text-center text-error">
					<p className="text-xl font-bold mb-2">Ops!</p>
					<p>{error}</p>
				</div>
			</PageLayout>
		);
	}

	if (!user) {
		return (
			<PageLayout>
				<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
					<div className="w-12 h-12 border-thick border-secondary/30 border-t-secondary rounded-full animate-spin" />
					<p className="text-content-muted animate-pulse font-medium">Caricamento profilo...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<div className="w-full space-y-6">
				{/* Back Button */}
				<Button variant="ghost" onClick={() => router.back()} icon={<ChevronLeftIcon size={20} strokeWidth="2.5" />}>Torna indietro</Button>

				{/* Profile Card */}
				<div className="bg-surface-muted backdrop-blur-sm border border-default ds-card">
					{/* Profile Header Background */}
					<div className="ds-profile-banner" />

					<div className="px-6 md:px-12 pb-8 md:pb-12 -mt-16 md:-mt-24 relative">
						<div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-10">
							{/* Avatar */}
							<div className="relative group">
								<div className="absolute -inset-1.5 rounded-[40px] border-2 border-secondary/30 bg-secondary/10" />
								<img
									className="relative w-32 h-32 md:w-48 md:h-48 rounded-[36px] object-cover border-thick border-primary shadow-2xl"
									src={user.user_avatar ?? basePath + "/img/profile.png"}
									alt={user.user_name}
								/>
							</div>

							{/* Name & Info */}
							<div className="flex-1 text-center lg:text-left mb-2 space-y-4">
								<div className="flex flex-col items-center lg:items-start gap-2">
									{editName ? (
										<div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
											<input
												type="text"
												autoFocus
												value={name}
												onChange={e => setName(e.target.value)}
												onKeyDown={e => {
													if (e.key === 'Enter') handleSaveName();
													if (e.key === 'Escape') handleCancelEdit();
												}}
												className="ds-input flex-1 text-xl font-bold w-full"
											/>
											<div className="flex gap-2">
												<Button variant="success" size="icon" onClick={handleSaveName} title="Salva" icon={<CheckIcon size={24} strokeWidth="2.5" />}/>
												<Button variant="danger" size="icon" onClick={handleCancelEdit} title="Annulla" icon={<CloseIcon size={24} strokeWidth="2.5" />}/>
											</div>
										</div>
									) : (
										<div className="flex items-center gap-3">
											<h1 className="text-3xl md:text-5xl font-black text-content tracking-tight leading-tight">
												{user.user_name}
											</h1>
											{isOwnProfile && (
												<Button variant="ghost" size="icon" onClick={() => setEditName(true)} title="Modifica nome" icon={<EditIcon size={20} />}/>
											)}
										</div>
									)}
									<div className="flex flex-wrap justify-center lg:justify-start gap-4 text-content-muted font-medium">
										<div className="flex items-center gap-1.5">
											<UsersIcon size={16} />
											<span>Utente GMI</span>
										</div>
										{isHistorical && (
											<div className="flex items-center gap-1.5">
												<StarIcon size={16} />
												<span>Membro storico</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="px-6 md:px-12 pb-12 space-y-12">
						{/* Inventory Section - Wide */}
						<div className="w-full">
							<UserInventory user={query.user} />
						</div>

						{/* Stats, Games & Votes */}
						<div className="grid grid-cols-1 gap-12">
							<UserStats userInfo={user} />
							<UserGames userInfo={user} contests={contests} />
							<UserVotes userInfo={user} contests={contests} />
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
}
