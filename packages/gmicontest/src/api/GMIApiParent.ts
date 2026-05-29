import "../../types/type_ts"

/** Classe padre delle GMIApi, usata per definire i tipi dei parametri e dei callback */
export default class GMIApiParent
{
	apiURL = "";
	imageURL = "";
	awardsURL = "";
	prizesURL = "";
	forumProfileURL ="";

	/**
	 * Ottiene le informazioni dell'utente via JWT Bearer.
	 */
	getMe(): Promise<any>
	{
		return new Promise(()=>{})
	}

	/**
	 * Apre un URL con i parametri specificati.
	 */
	openURL(url: string, params: Record<string, string>): void
	{}

	/**
	 * Effettua il login dell'utente reindirizzando alla pagina di autenticazione.
	 */
	login(): void
	{}

	/**
	 * Effettua il logout — revoca refresh token e pulisce storage.
	 */
	logout(): Promise<any>
	{
		return Promise.resolve()
	}

	/**
	 * Scambia un codice breve OAuth per un JWT pair (usato in AuthCallback).
	 */
	exchangeCode(code: string): Promise<any>
	{
		return Promise.resolve()
	}

	/**
	 * Rinnova il token pair via refresh_token.
	 */
	refreshToken(refreshToken: string): Promise<any>
	{
		return Promise.resolve()
	}

	/**
	 * Revoca un refresh token.
	 */
	revokeToken(refreshToken?: string): Promise<any>
	{
		return Promise.resolve()
	}

	/**
	 * Restituisce l'URL dell'avatar di un utente Discord.
	 */
	getAvatarUrl(discord_info: {avatar?: string}): string
	{return ""}

	getGames(contest: string, callback: (data: {success: boolean; games: Game[]; public_results: boolean})=> void): void
	{}

	getContest(contestId: string, callback: (data: {success: boolean; contests: Contest[]})=> void): void
	{}

	getContests(callback: (data: {success: boolean; contests: Contest[]})=> void): void
	{}

	getParticipants(contest: string, onlyMe: boolean, callback: (data: {success: boolean; participants: Participant[]})=> void): void
	{}

	getParticipation(contest: string, callback: (data: {participation: Partecipation})=> void): void
	{}

	getVotes(contest: string, game: string, callback: (data: VotesResponse)=> void): void
	{}

	getResults(contest: string, callback: (data: Results)=> void): void
	{}

	getUsers(callback: (data: {success: boolean; users: User[]})=> void)
	{}

	getStats(callback: (data: {success: boolean; stats: {games_count: number; participants: number; competitions: number}})=> void): void
	{}

	getSearchResults(q: string, callback: (data: {success: boolean; games: any[]; users: any[]; error?: string})=> void): void
	{}

	getUserInfo(userId: number, callback: (data: {success: boolean; users: UserInfo[]})=> void)
	{}

	getUserMedals(userId: number, callback: (data: {success: boolean; medals: UserMedals[]})=> void)
	{}

	setVote(contest: string, voteObject: Vote, callback: (data: {success: boolean, error: any})=> void): void
	{}

	setUserValues(user_id: number, user_name: string, callback: (data: {success: boolean, error: any})=> void): void
	{}

	setParticipationData(contest: string, game: Game, callback: (data: {success: boolean, error: any})=> void): void
	{}

	deleteParticipationData(contest: string, callback: (data: {success: boolean, error: any})=> void): void
	{}

	getPrizes(contestId: number | undefined, callback: (data: {success: boolean; prizes: Prize[]})=> void): void
	{}

	getVideos(contestId: number | undefined, callback: (data: {success: boolean; videos: ContestVideo[]})=> void): void
	{}

	publishResults(contestId: string, callback: (data: {success: boolean; message?: string; error?: string})=> void): void
	{}
}
