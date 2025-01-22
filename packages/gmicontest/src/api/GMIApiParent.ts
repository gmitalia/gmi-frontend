import "../../types/type_ts"

/** Classe padre delle GMIApi, usata per definire i tipi dei parametri e dei callback */
export default class GMIApiParent
{
	apiURL = "";
	imageURL = "";
	forumProfileURL ="";

	/**
	 * Ottiene le informazioni dell'utente.
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
	 * Effettua il logout dell'utente reindirizzando alla pagina di autenticazione. 
	 */
	logout(): void
	{}

	/**
	 * Restituisce l'URL dell'avatar di un utente Discord.
	 */
	getAvatarUrl(discord_info: {id: string; avatar: string}): string
	{return ""}

	/**
	 * Ottiene la lista dei giochi per un contest.
	 * @param contest ID del contest
	 * @param callback Funzione di callback con i dati dei giochi
	 */
	getGames(contest: string, callback: (data: {success: boolean; games: Game[]; public_results: boolean})=> void): void
	{}

	/**
	 * Ottiene i dettagli di un contest.
	 * @param contestId ID del contest
	 * @param callback Funzione di callback con i dettagli del contest
	 */
	getContest(contestId: string, callback: (data: {success: boolean; contests: Contest[]})=> void): void
	{}

	/**
	 * Ottiene la lista dei contest.
	 * @param callback Funzione di callback con i dati dei contest
	 */
	getContests(callback: (data: {success: boolean; contests: Contest[]})=> void): void
	{}

	/**
	 * Ottiene la lista dei partecipanti di un contest.
	 * @param contest ID del contest
	 * @param onlyMe Specifica se ottenere solo i dati dell'utente corrente
	 * @param callback Funzione di callback con i dati dei partecipanti
	 */
	getParticipants(contest: string, onlyMe: boolean, callback: (data: {success: boolean; participants: Participant[]})=> void): void
	{}

	/**
	 * Ottiene i dati di partecipazione a un contest.
	 * @param contest ID del contest
	 * @param callback Funzione di callback con i dati di partecipazione
	 */
	getParticipation(contest: string, callback: (data: {participation: Partecipation})=> void): void
	{}

	/**
	 * Ottiene i voti relativi a un gioco in un contest.
	 * @param contest ID del contest
	 * @param game ID del gioco
	 * @param callback Funzione di callback con i dati dei voti
	 */
	getVotes(contest: string, game: string, callback: (data: {success: boolean; votes: Vote[]})=> void): void
	{}

	/**
	 * Ottiene i risultati di un contest.
	 * @param contest ID del contest
	 * @param callback Funzione di callback con i dati dei risultati
	 */
	getResults(contest: string, callback: (data: Results)=> void): void
	{}

	getUsers(callback: (data: {success: boolean; users: User[]})=> void)
	{}

	getUserInfo(userId: number, callback: (data: {success: boolean; users: UserInfo[]})=> void)
	{}

	/**
	 * Imposta un voto per un gioco in un contest.
	 * @param contest ID del contest
	 * @param voteObject Oggetto contenente i dettagli del voto
	 * @param callback Funzione di callback con la risposta del server
	 */
	setVote(contest: string, voteObject: Vote, callback: (data: {success: boolean, error: any})=> void): void
	{}

	/**
	 * Imposta i dati di partecipazione a un contest.
	 * @param contest ID del contest
	 * @param game Oggetto contenente i dati del gioco
	 * @param callback Funzione di callback con la risposta del server
	 */
	setParticipationData(contest: string, game: Game, callback: (data: {success: boolean, error: any})=> void): void
	{}

	/**
	 * Elimina i dati di partecipazione a un contest.
	 * @param contest ID del contest
	 * @param callback Funzione di callback con la risposta del server
	 */
	deleteParticipationData(contest: string, callback: (data: {success: boolean, error: any})=> void): void
	{}
}
