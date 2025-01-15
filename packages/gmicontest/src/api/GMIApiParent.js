
export default class GMIApiParent
{
	apiURL = "";
	imageURL = "";
	forumProfileURL ="";

	getMe()
	{
		return fetch(this.apiURL + "me.php", {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.catch((error) => console.error("GMIApi Error:", error));
	}

	openURL(url, params)
	{
		const urlParams = new URLSearchParams(params);
		if(typeof window !== "undefined")
			window.location.href = url + "?" + urlParams.toString();
		else console.error("window is undefined");
	}

	login()
	{
		this.openURL(this.apiURL + "auth.php", {
			action: "login",
			redirect: Config.getServerUrl(),
		});
	}

	logout()
	{
		this.openURL(this.apiURL + "auth.php", {
			action: "logout",
			redirect: Config.getServerUrl(),
		});
	}

	getAvatarUrl(discord_info)
	{
		return (
			"https://cdn.discordapp.com/avatars/" +
			discord_info.id +
			"/" +
			discord_info.avatar +
			".png"
		);
	}

	getGames(contest, callback)
	{
		callback({
			success: true,
			games: [
				{
					id: "200",
					name: "Supergame",
					contest_id: "1000",
					image_url: "19_168740067156688896.png",
					short_description:
						"Al mondo tutto il filo è stato usato dagli umani per costruire vestiti, e ai gatti non è rimasto più niente, se non l'ultimo gomitolo esistente. L'unico modo per impossessarsene è battere tutti in un epica battaglia a ping pong.",
					description: "Readme incluso nella cartella di gioco.",
					authors: "W3siaWQiOiIxNCIsIm5hbWUiOiJDbGEifV0=",
					download_url:
						"https://mega.nz/file/Wdx1DKrJ#rjk_uqEgPzRP80guDNJx7dUlivU5slR7pmQSI5OCh_o",
					placement: "1",
				},
			],
			public_results: true,
		});
	}

	getContest(contestId, callback)
	{
		callback({
			success: true,
			contests: [
				{
					id: 1000,
					name: "Competizione GMI_mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
			],
		});
	}

	getContests(callback)
	{
		callback({
			success: true,
			contests: [
				{
					id: 1000,
					name: "Competizione GMI mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
				{
					id: 1001,
					name: "Competizione GMI mock_2020",
					end_at: "2020-04-20 08:00:00",
					can_submit: false,
					completed_at: "2020-04-20 08:00:00",
					public: "1",
					is_ended: true,
					is_completed: true,
				},
			],
		});
	}

	getParticipants(contest, onlyMe, callback)
	{
		callback({
			success: true,
			participants: [
				{
					id: "71",
					user_name: "AlexoFalco",
					user_discord_id: "190723513911345154",
					contest_id: "1000",
					kind: "1",
				},
			],
		});
	}

	getParticipation(contest, callback)
	{
		const params = new URLSearchParams({
			contest: contest,
		});
		fetch(this.apiURL + "get_participation_data.php?" + params.toString(), {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	getVotes(contest, game, callback)
	{
		callback({
			success: true,
			votes: [
				{
					user_id: "16",
					game_id: "1000",
					created_at: "2023-04-24 12:40:31",
					updated_at: "2023-04-24 12:40:31",
					score: "40",
					comment:
						"Chiaramente un progetto in stato prototipale (come preannunciato). Ci\u00f2 non significa che non si possano comunque apprezzare certi dettagli, premonitori di quello che sar\u00e0 o sarebbe potuto essere.\nImmersivit\u00e0 alle stelle con una variet\u00e0 di suoni per l'ambiente desktop \"simulato\" (i tuoi switch suonano meglio dei miei), con menzione d'onore ai suoni ad hoc per la barra spaziatrice ed il tasto invio.\nHo sempre apprezzato la narrazione attraverso mail, specialmente per la possibilit\u00e0 di scoprire la storia \"a ritroso\". Chiaramente quest'ultima \u00e8 a malapena abbozzata e quindi c'\u00e8 poco da dire, anche se quella che sembrerebbe una bella storia su sacrifici umani non mi dispiacerebbe affatto.\n\nSo che \u00e8 solo una bozza al momento, ma devo dirlo: trovo la musica troppo mielosa. Dopo trenta secondi \u00e8 subito spot antipovert\u00e0 nel terzo mondo.",
					pros: '["8"]',
					cons: '["4"]',
					judge_name: "BallMan",
				},
			],
		});
	}

	getResults(contest, callback)
	{
		const params = new URLSearchParams({
			contest: contest || 0,
		});
		fetch(this.apiURL + "get_results.php?" + params.toString(), {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	setVote(contest, voteObject, callback)
	{
		const params = new URLSearchParams({
			contest: contest,
			game: voteObject.game_id,
		});
		const url = this.apiURL + "set_vote.php?" + params.toString();
		fetch(url, {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "include", // include, *same-origin, omit
			headers: { "Content-Type": "application/json" },
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify({
				vote: {
					score: voteObject.score,
					comment: voteObject.comment,
					pros: JSON.stringify(voteObject.pros),
					cons: JSON.stringify(voteObject.cons),
					voted: voteObject.voted,
				},
			}),
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	setParticipationData(contest, game, callback)
	{
		const formData = new FormData();
		formData.append("thumbnail", game.thumbnailFile);

		const params = new URLSearchParams({
			contest: contest,
			name: game.name,
			url: game.downloadUrl,
			description: game.description,
			short_description: game.shortDescription,
		});
		fetch(this.apiURL + "set_participation_data.php?" + params.toString(), {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "include", // include, *same-origin, omit
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	deleteParticipationData(contest, callback)
	{
		const params = new URLSearchParams({
			contest: contest,
		});
		fetch(this.apiURL + "delete_participation_data.php?" + params.toString(), {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}
}


/**
 * @class
 */
class GMIApi {
	/**
	 * Ottiene informazioni sull'utente loggato
	 * @returns {Promise<Object>} Una promessa con i dati dell'utente
	 */
	getMe() {
		return fetch(this.apiURL + "me.php", {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.catch((error) => console.error("GMIApi Error:", error));
	}

	/**
	 * Apre un URL con i parametri specificati
	 * @param {string} url L'URL da aprire
	 * @param {Object} params Parametri da aggiungere all'URL
	 */
	openURL(url, params) {
		const urlParams = new URLSearchParams(params);
		if (typeof window !== "undefined")
			window.location.href = url + "?" + urlParams.toString();
		else console.error("window is undefined");
	}

	/**
	 * Esegue il login
	 */
	login() {
		this.openURL(this.apiURL + "auth.php", {
			action: "login",
			redirect: Config.getServerUrl(),
		});
	}

	/**
	 * Esegue il logout
	 */
	logout() {
		this.openURL(this.apiURL + "auth.php", {
			action: "logout",
			redirect: Config.getServerUrl(),
		});
	}

	/**
	 * Ottiene l'URL dell'avatar di Discord
	 * @param {Object} discord_info Informazioni su Discord
	 * @param {string} discord_info.id L'ID di Discord
	 * @param {string} discord_info.avatar L'avatar di Discord
	 * @returns {string} L'URL dell'avatar
	 */
	getAvatarUrl(discord_info) {

		this.getGames("{},", (obj)=>
		{
			obj.
		});
		
		return (
			"https://cdn.discordapp.com/avatars/" +
			discord_info.id +
			"/" +
			discord_info.avatar +
			".png"
		);
	}

	/**
	 * Ottiene i giochi per una competizione
	 * @param {string} contest L'ID della competizione
	 * @param {CallbackWithGames} callback Funzione callback che gestisce la risposta
	 */
	getGames(contest, callback) {
		callback({
			success: true,
			games: [
				{
					id: "200",
					name: "Supergame",
					contest_id: "1000",
					image_url: "19_168740067156688896.png",
					short_description:
						"Al mondo tutto il filo è stato usato dagli umani per costruire vestiti, e ai gatti non è rimasto più niente, se non l'ultimo gomitolo esistente. L'unico modo per impossessarsene è battere tutti in un epica battaglia a ping pong.",
					description: "Readme incluso nella cartella di gioco.",
					authors: "W3siaWQiOiIxNCIsIm5hbWUiOiJDbGEifV0=",
					download_url:
						"https://mega.nz/file/Wdx1DKrJ#rjk_uqEgPzRP80guDNJx7dUlivU5slR7pmQSI5OCh_o",
					placement: "1",
				},
			],
			public_results: true,
		});
	}

	/**
	 * Ottiene una competizione specifica
	 * @param {string} contestId L'ID della competizione
	 * @param {CallbackWithContests} callback Funzione callback che gestisce la risposta
	 */
	getContest(contestId, callback) {
		callback({
			success: true,
			contests: [
				{
					id: 1000,
					name: "Competizione GMI_mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
			],
		});
	}

	/**
	 * Ottiene tutte le competizioni
	 * @param {CallbackWithContests} callback Funzione callback che gestisce la risposta
	 */
	getContests(callback) {
		callback({
			success: true,
			contests: [
				{
					id: 1000,
					name: "Competizione GMI mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
				{
					id: 1001,
					name: "Competizione GMI mock_2020",
					end_at: "2020-04-20 08:00:00",
					can_submit: false,
					completed_at: "2020-04-20 08:00:00",
					public: "1",
					is_ended: true,
					is_completed: true,
				},
			],
		});
	}

	/**
	 * Ottiene i partecipanti di una competizione
	 * @param {string} contest L'ID della competizione
	 * @param {boolean} onlyMe Se filtrare solo il partecipante corrente
	 * @param {CallbackWithParticipants} callback Funzione callback che gestisce la risposta
	 */
	getParticipants(contest, onlyMe, callback) {
		callback({
			success: true,
			participants: [
				{
					id: "71",
					user_name: "AlexoFalco",
					user_discord_id: "190723513911345154",
					contest_id: "1000",
					kind: "1",
				},
			],
		});
	}

	/**
	 * Ottiene i dati di partecipazione per una competizione
	 * @param {string} contest L'ID della competizione
	 * @param {CallbackSuccess} callback Funzione callback che gestisce la risposta
	 */
	getParticipation(contest, callback) {
		const params = new URLSearchParams({
			contest: contest,
		});
		fetch(this.apiURL + "get_participation_data.php?" + params.toString(), {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	/**
	 * Ottiene i voti per un gioco
	 * @param {string} contest L'ID della competizione
	 * @param {string} game L'ID del gioco
	 * @param {CallbackWithVotes} callback Funzione callback che gestisce la risposta
	 */
	getVotes(contest, game, callback) {
		callback({
			success: true,
			votes: [
				{
					user_id: "16",
					game_id: "1000",
					created_at: "2023-04-24 12:40:31",
					updated_at: "2023-04-24 12:40:31",
					score: "40",
					comment:
						"Chiaramente un progetto in stato prototipale (come preannunciato). Ci\u00f2 non significa che non si possano comunque apprezzare certi dettagli, premonitori di quello che sar\u00e0 o sarebbe potuto essere.\nImmersivit\u00e0 alle stelle con una variet\u00e0 di suoni per l'ambiente desktop \"simulato\" (i tuoi switch suonano meglio dei miei), con menzione d'onore ai suoni ad hoc per la barra spaziatrice ed il tasto invio.\nHo sempre apprezzato la narrazione attraverso mail, specialmente per la possibilit\u00e0 di scoprire la storia \"a ritroso\". Chiaramente quest'ultima \u00e8 a malapena abbozzata e quindi c'\u00e8 poco da dire, anche se quella che sembrerebbe una bella storia su sacrifici umani non mi dispiacerebbe affatto.\n\nSo che \u00e8 solo una bozza al momento, ma devo dirlo: trovo la musica troppo mielosa. Dopo trenta secondi \u00e8 subito spot antipovert\u00e0 nel terzo mondo.",
					pros: '["8"]',
					cons: '["4"]',
					judge_name: "BallMan",
				},
			],
		});
	}

	/**
	 * Ottiene i risultati di una competizione
	 * @param {string} contest L'ID della competizione
	 * @param {CallbackSuccess} callback Funzione callback che gestisce la risposta
	 */
	getResults(contest, callback) {
		const params = new URLSearchParams({
			contest: contest || 0,
		});
		fetch(this.apiURL + "get_results.php?" + params.toString(), {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	/**
	 * Imposta un voto per un gioco
	 * @param {string} contest L'ID della competizione
	 * @param {Object} voteObject L'oggetto del voto
	 * @param {string} voteObject.game_id L'ID del gioco
	 * @param {string} voteObject.score Il punteggio
	 * @param {string} voteObject.comment Il commento
	 * @param {Array} voteObject.pros I punti positivi
	 * @param {Array} voteObject.cons I punti negativi
	 * @param {boolean} voteObject.voted Se il voto è stato dato
	 * @param {CallbackSuccess} callback Funzione callback che gestisce la risposta
	 */
	setVote(contest, voteObject, callback) {
		const params = new URLSearchParams({
			contest: contest,
			game: voteObject.game_id,
		});
		const url = this.apiURL + "set_vote.php?" + params.toString();
		fetch(url, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			referrerPolicy: "no-referrer",
			body: JSON.stringify({
				vote: {
					score: voteObject.score,
					comment: voteObject.comment,
					pros: JSON.stringify(voteObject.pros),
					cons: JSON.stringify(voteObject.cons),
					voted: voteObject.voted,
				},
			}),
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	/**
	 * Imposta i dati di partecipazione per un gioco
	 * @param {string} contest L'ID della competizione
	 * @param {Object} game Dati del gioco
	 * @param {string} game.name Il nome del gioco
	 * @param {string} game.downloadUrl L'URL del gioco
	 * @param {string} game.description La descrizione del gioco
	 * @param {string} game.shortDescription La descrizione breve del gioco
	 * @param {File} game.thumbnailFile Il file immagine per la miniatura
	 * @param {CallbackSuccess} callback Funzione callback che gestisce la risposta
	 */
	setParticipationData(contest, game, callback) {
		const formData = new FormData();
		formData.append("thumbnail", game.thumbnailFile);

		const params = new URLSearchParams({
			contest: contest,
			name: game.name,
			url: game.downloadUrl,
			description: game.description,
			short_description: game.shortDescription,
		});
		fetch(this.apiURL + "set_participation_data.php?" + params.toString(), {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "include",
			headers: { "Accept": "application/json" },
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}
}